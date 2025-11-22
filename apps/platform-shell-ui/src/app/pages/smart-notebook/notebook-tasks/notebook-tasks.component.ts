import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  tags: string[];
  relatedIdea?: string;
  relatedReport?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-notebook-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tasks-container">
      <div class="page-header">
        <div class="header-content">
          <h1>✅ إدارة المهام</h1>
          <p class="subtitle">تتبع وإدارة المهام المرتبطة بـ Smart Notebook</p>
        </div>
        <button class="btn-primary" (click)="openCreateDialog()">
          ➕ مهمة جديدة
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card pending">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <div class="stat-value">{{ getTasksByStatus('PENDING').length }}</div>
            <div class="stat-label">قيد الانتظار</div>
          </div>
        </div>
        <div class="stat-card progress">
          <div class="stat-icon">🔄</div>
          <div class="stat-content">
            <div class="stat-value">{{ getTasksByStatus('IN_PROGRESS').length }}</div>
            <div class="stat-label">قيد التنفيذ</div>
          </div>
        </div>
        <div class="stat-card completed">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ getTasksByStatus('COMPLETED').length }}</div>
            <div class="stat-label">مكتملة</div>
          </div>
        </div>
        <div class="stat-card high-priority">
          <div class="stat-icon">🔥</div>
          <div class="stat-content">
            <div class="stat-value">{{ getHighPriorityTasks().length }}</div>
            <div class="stat-label">أولوية عالية</div>
          </div>
        </div>
      </div>

      <div class="filters-section">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (input)="applyFilters()"
            placeholder="🔍 ابحث في المهام..."
            class="search-input"
          />
        </div>
        <div class="filter-controls">
          <select [(ngModel)]="filterStatus" (change)="applyFilters()" class="filter-select">
            <option value="">كل الحالات</option>
            <option value="PENDING">قيد الانتظار</option>
            <option value="IN_PROGRESS">قيد التنفيذ</option>
            <option value="COMPLETED">مكتملة</option>
            <option value="CANCELLED">ملغاة</option>
          </select>
          <select [(ngModel)]="filterPriority" (change)="applyFilters()" class="filter-select">
            <option value="">كل الأولويات</option>
            <option value="HIGH">عالية</option>
            <option value="MEDIUM">متوسطة</option>
            <option value="LOW">منخفضة</option>
          </select>
          <button class="filter-btn" [class.active]="viewMode === 'list'" (click)="viewMode = 'list'">
            📋 قائمة
          </button>
          <button class="filter-btn" [class.active]="viewMode === 'kanban'" (click)="viewMode = 'kanban'">
            📊 كانبان
          </button>
        </div>
      </div>

      <!-- List View -->
      <div class="tasks-list" *ngIf="viewMode === 'list' && !loading && filteredTasks.length > 0">
        <div 
          *ngFor="let task of filteredTasks" 
          class="task-card"
          [class.priority-high]="task.priority === 'HIGH'"
          [class.priority-medium]="task.priority === 'MEDIUM'"
          [class.priority-low]="task.priority === 'LOW'"
        >
          <div class="task-header">
            <div class="task-title-section">
              <h3 class="task-title">{{ task.title }}</h3>
              <div class="task-badges">
                <span class="badge badge-status" [class]="'status-' + task.status.toLowerCase()">
                  {{ getStatusLabel(task.status) }}
                </span>
                <span class="badge badge-priority" [class]="'priority-' + task.priority.toLowerCase()">
                  {{ getPriorityLabel(task.priority) }}
                </span>
              </div>
            </div>
            <div class="task-actions">
              <button class="btn-icon" (click)="viewTask(task)" title="عرض">👁️</button>
              <button class="btn-icon" (click)="editTask(task)" title="تعديل">✏️</button>
              <button class="btn-icon" (click)="changeStatus(task)" title="تغيير الحالة">🔄</button>
              <button class="btn-icon btn-delete" (click)="deleteTask(task)" title="حذف">🗑️</button>
            </div>
          </div>
          
          <p class="task-description" *ngIf="task.description">{{ task.description }}</p>
          
          <div class="task-footer">
            <div class="task-meta">
              <span *ngIf="task.dueDate">⏰ {{ formatDate(task.dueDate) }}</span>
              <span>📅 {{ formatDate(task.createdAt) }}</span>
            </div>
            <div class="task-tags" *ngIf="task.tags && task.tags.length > 0">
              <span *ngFor="let tag of task.tags" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Kanban View -->
      <div class="kanban-board" *ngIf="viewMode === 'kanban' && !loading">
        <div class="kanban-column" *ngFor="let status of ['PENDING', 'IN_PROGRESS', 'COMPLETED']">
          <div class="column-header">
            <h3>{{ getStatusLabel(status) }}</h3>
            <span class="count">{{ getTasksByStatus(status).length }}</span>
          </div>
          <div class="column-tasks">
            <div 
              *ngFor="let task of getTasksByStatus(status)" 
              class="kanban-task"
              [class.priority-high]="task.priority === 'HIGH'"
            >
              <h4>{{ task.title }}</h4>
              <p *ngIf="task.description">{{ task.description }}</p>
              <div class="kanban-task-footer">
                <span class="badge badge-priority" [class]="'priority-' + task.priority.toLowerCase()">
                  {{ getPriorityLabel(task.priority) }}
                </span>
                <div class="kanban-actions">
                  <button class="btn-icon-sm" (click)="editTask(task)">✏️</button>
                  <button class="btn-icon-sm" (click)="changeStatus(task)">🔄</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredTasks.length === 0">
        <div class="empty-icon">✅</div>
        <h3>لا توجد مهام</h3>
        <button class="btn-primary" (click)="openCreateDialog()">➕ إضافة مهمة</button>
      </div>

      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>جاري التحميل...</p>
      </div>

      <!-- Dialog -->
      <div class="dialog-overlay" *ngIf="showDialog" (click)="closeDialog()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingTask ? 'تعديل المهمة' : 'مهمة جديدة' }}</h2>
            <button class="btn-close" (click)="closeDialog()">✕</button>
          </div>
          
          <form (ngSubmit)="saveTask()" class="dialog-form">
            <div class="form-group">
              <label>العنوان *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.title" 
                name="title"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>الوصف</label>
              <textarea 
                [(ngModel)]="formData.description" 
                name="description"
                rows="4"
                class="form-textarea"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>الحالة *</label>
                <select [(ngModel)]="formData.status" name="status" required class="form-select">
                  <option value="PENDING">قيد الانتظار</option>
                  <option value="IN_PROGRESS">قيد التنفيذ</option>
                  <option value="COMPLETED">مكتملة</option>
                  <option value="CANCELLED">ملغاة</option>
                </select>
              </div>

              <div class="form-group">
                <label>الأولوية *</label>
                <select [(ngModel)]="formData.priority" name="priority" required class="form-select">
                  <option value="LOW">منخفضة</option>
                  <option value="MEDIUM">متوسطة</option>
                  <option value="HIGH">عالية</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>تاريخ الاستحقاق</label>
              <input 
                type="date" 
                [(ngModel)]="formData.dueDate" 
                name="dueDate"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>الوسوم (Tags)</label>
              <input 
                type="text" 
                [(ngModel)]="tagsInput" 
                name="tags"
                placeholder="أدخل الوسوم مفصولة بفاصلة"
                class="form-input"
              />
            </div>

            <div class="dialog-actions">
              <button type="button" class="btn-secondary" (click)="closeDialog()">إلغاء</button>
              <button type="submit" class="btn-primary" [disabled]="!formData.title">
                {{ editingTask ? 'حفظ' : 'إضافة' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tasks-container { padding: 2rem; max-width: 1400px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb; }
    .header-content h1 { font-size: 2rem; font-weight: 700; color: #1f2937; margin: 0 0 0.5rem 0; }
    .subtitle { color: #6b7280; margin: 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .stat-card { background: white; border-radius: 12px; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .stat-card.pending { border-left: 4px solid #f59e0b; }
    .stat-card.progress { border-left: 4px solid #3b82f6; }
    .stat-card.completed { border-left: 4px solid #10b981; }
    .stat-card.high-priority { border-left: 4px solid #ef4444; }
    .stat-icon { font-size: 2.5rem; }
    .stat-value { font-size: 2rem; font-weight: 700; color: #1f2937; }
    .stat-label { color: #6b7280; font-size: 0.875rem; }
    .filters-section { background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .search-input { width: 100%; padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; margin-bottom: 1rem; }
    .filter-controls { display: flex; gap: 1rem; flex-wrap: wrap; }
    .filter-select { flex: 1; min-width: 150px; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; }
    .filter-btn { padding: 0.75rem 1.5rem; border: 2px solid #e5e7eb; background: white; border-radius: 8px; cursor: pointer; }
    .filter-btn.active { background: #3b82f6; color: white; border-color: #3b82f6; }
    .tasks-list { display: grid; gap: 1.5rem; }
    .task-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-right: 4px solid; transition: all 0.2s; }
    .task-card.priority-high { border-right-color: #ef4444; }
    .task-card.priority-medium { border-right-color: #f59e0b; }
    .task-card.priority-low { border-right-color: #10b981; }
    .task-card:hover { box-shadow: 0 4px 6px rgba(0,0,0,0.1); transform: translateY(-2px); }
    .task-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
    .task-title { font-size: 1.25rem; font-weight: 600; color: #1f2937; margin: 0 0 0.5rem 0; }
    .task-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
    .badge-status { background: #e5e7eb; color: #374151; }
    .status-pending { background: #fef3c7; color: #92400e; }
    .status-in_progress { background: #dbeafe; color: #1e40af; }
    .status-completed { background: #d1fae5; color: #065f46; }
    .status-cancelled { background: #fee2e2; color: #991b1b; }
    .badge-priority { background: #e5e7eb; color: #374151; }
    .priority-high { background: #fee2e2; color: #991b1b; }
    .priority-medium { background: #fef3c7; color: #92400e; }
    .priority-low { background: #d1fae5; color: #065f46; }
    .task-actions { display: flex; gap: 0.5rem; }
    .btn-icon { padding: 0.5rem; border: none; background: #f3f4f6; border-radius: 8px; cursor: pointer; font-size: 1.25rem; }
    .btn-icon:hover { background: #e5e7eb; }
    .btn-delete { background: #fee2e2; }
    .task-description { color: #6b7280; margin-bottom: 1rem; }
    .task-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #e5e7eb; }
    .task-meta { display: flex; gap: 1rem; font-size: 0.875rem; color: #6b7280; }
    .task-tags { display: flex; gap: 0.5rem; }
    .tag { padding: 0.25rem 0.75rem; background: #f3f4f6; border-radius: 9999px; font-size: 0.75rem; }
    .kanban-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .kanban-column { background: #f9fafb; border-radius: 12px; padding: 1rem; }
    .column-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e5e7eb; }
    .column-header h3 { margin: 0; font-size: 1rem; font-weight: 600; }
    .count { background: #3b82f6; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; }
    .column-tasks { display: grid; gap: 1rem; }
    .kanban-task { background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .kanban-task.priority-high { border-left: 4px solid #ef4444; }
    .kanban-task h4 { margin: 0 0 0.5rem 0; font-size: 1rem; }
    .kanban-task p { font-size: 0.875rem; color: #6b7280; margin: 0 0 0.5rem 0; }
    .kanban-task-footer { display: flex; justify-content: space-between; align-items: center; }
    .kanban-actions { display: flex; gap: 0.25rem; }
    .btn-icon-sm { padding: 0.25rem; border: none; background: #f3f4f6; border-radius: 4px; cursor: pointer; font-size: 1rem; }
    .empty-state { text-align: center; padding: 4rem 2rem; background: white; border-radius: 12px; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .loading-state { text-align: center; padding: 4rem 2rem; }
    .spinner { width: 50px; height: 50px; border: 4px solid #e5e7eb; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .btn-primary { padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-primary:hover { background: #2563eb; }
    .btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }
    .btn-secondary { padding: 0.75rem 1.5rem; background: #f3f4f6; color: #374151; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .dialog-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog-content { background: white; border-radius: 12px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
    .dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #e5e7eb; }
    .btn-close { padding: 0.5rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; }
    .dialog-form { padding: 1.5rem; }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; }
    .form-input, .form-textarea, .form-select { width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; }
    .form-textarea { resize: vertical; font-family: inherit; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .dialog-actions { display: flex; gap: 1rem; justify-content: flex-end; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }
  `]
})
export class NotebookTasksComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = false;
  showDialog = false;
  editingTask: Task | null = null;
  viewMode: 'list' | 'kanban' = 'list';

  searchQuery = '';
  filterStatus = '';
  filterPriority = '';

  formData: Partial<Task> = {
    title: '',
    description: '',
    status: 'PENDING',
    priority: 'MEDIUM',
    tags: []
  };
  tagsInput = '';

  private apiUrl = `${environment.apiUrl}/api/smart-notebook/tasks`;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading = true;
    this.http.get<Task[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.tasks = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = !this.searchQuery || 
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = !this.filterStatus || task.status === this.filterStatus;
      const matchesPriority = !this.filterPriority || task.priority === this.filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  getTasksByStatus(status: string): Task[] {
    return this.filteredTasks.filter(task => task.status === status);
  }

  getHighPriorityTasks(): Task[] {
    return this.tasks.filter(task => task.priority === 'HIGH');
  }

  openCreateDialog() {
    this.editingTask = null;
    this.formData = {
      title: '',
      description: '',
      status: 'PENDING',
      priority: 'MEDIUM',
      tags: []
    };
    this.tagsInput = '';
    this.showDialog = true;
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.formData = { ...task };
    this.tagsInput = task.tags.join(', ');
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

  saveTask() {
    if (this.tagsInput) {
      this.formData.tags = this.tagsInput.split(',').map(t => t.trim()).filter(t => t);
    }

    if (this.editingTask) {
      this.http.patch(`${this.apiUrl}/${this.editingTask.id}`, this.formData).subscribe({
        next: () => {
          this.loadTasks();
          this.closeDialog();
        }
      });
    } else {
      this.http.post(this.apiUrl, this.formData).subscribe({
        next: () => {
          this.loadTasks();
          this.closeDialog();
        }
      });
    }
  }

  viewTask(task: Task) {
    console.log('View:', task);
  }

  deleteTask(task: Task) {
    if (confirm('حذف؟')) {
      this.http.delete(`${this.apiUrl}/${task.id}`).subscribe({
        next: () => this.loadTasks()
      });
    }
  }

  changeStatus(task: Task) {
    const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    const currentIndex = statuses.indexOf(task.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    this.http.patch(`${this.apiUrl}/${task.id}`, { status: nextStatus }).subscribe({
      next: () => this.loadTasks()
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING': 'قيد الانتظار',
      'IN_PROGRESS': 'قيد التنفيذ',
      'COMPLETED': 'مكتملة',
      'CANCELLED': 'ملغاة'
    };
    return labels[status] || status;
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      'LOW': 'منخفضة',
      'MEDIUM': 'متوسطة',
      'HIGH': 'عالية'
    };
    return labels[priority] || priority;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('ar-SA');
  }
}
