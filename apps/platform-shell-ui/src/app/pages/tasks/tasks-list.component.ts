import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { ChipModule } from 'primeng/chip';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  assigneeAvatar?: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  project?: string;
  estimatedHours?: number;
  actualHours?: number;
  progress: number;
}

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    InputTextareaModule,
    CalendarModule,
    ChipModule,
    ProgressBarModule,
    ToastModule,
    AvatarModule,
    BadgeModule,
  ],
  providers: [MessageService],
  template: `
    <div class="tasks-container">
      <p-toast></p-toast>

      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="pi pi-check-square"></i>
          </div>
          <div class="header-text">
            <h1>إدارة المهام</h1>
            <p>تتبع وإدارة مهام المشروع</p>
          </div>
        </div>
        <div class="header-actions">
          <button
            pButton
            label="لوحة كانبان"
            icon="pi pi-th-large"
            class="p-button-outlined"
            routerLink="/tasks/kanban"
          ></button>
          <button
            pButton
            label="مهمة جديدة"
            icon="pi pi-plus"
            (click)="showCreateDialog = true"
          ></button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon">
            <i class="pi pi-list"></i>
          </div>
          <div class="stat-content">
            <h3>{{ statistics.total }}</h3>
            <p>إجمالي المهام</p>
          </div>
        </div>

        <div class="stat-card todo">
          <div class="stat-icon">
            <i class="pi pi-circle"></i>
          </div>
          <div class="stat-content">
            <h3>{{ statistics.byStatus.todo }}</h3>
            <p>قيد الانتظار</p>
          </div>
        </div>

        <div class="stat-card progress">
          <div class="stat-icon">
            <i class="pi pi-play"></i>
          </div>
          <div class="stat-content">
            <h3>{{ statistics.byStatus.inProgress }}</h3>
            <p>قيد التنفيذ</p>
          </div>
        </div>

        <div class="stat-card done">
          <div class="stat-icon">
            <i class="pi pi-check"></i>
          </div>
          <div class="stat-content">
            <h3>{{ statistics.byStatus.done }}</h3>
            <p>مكتملة</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <p-card>
        <div class="filters">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input
              pInputText
              type="text"
              [(ngModel)]="searchQuery"
              (input)="filterTasks()"
              placeholder="ابحث عن مهمة..."
            />
          </span>

          <p-dropdown
            [(ngModel)]="filterStatus"
            [options]="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="الحالة"
            (onChange)="filterTasks()"
            [showClear]="true"
          ></p-dropdown>

          <p-dropdown
            [(ngModel)]="filterPriority"
            [options]="priorityOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="الأولوية"
            (onChange)="filterTasks()"
            [showClear]="true"
          ></p-dropdown>
        </div>
      </p-card>

      <!-- Tasks Table -->
      <p-card>
        <p-table
          [value]="filteredTasks"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[10, 25, 50]"
          [tableStyle]="{ 'min-width': '50rem' }"
          styleClass="p-datatable-striped"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>المهمة</th>
              <th>المسؤول</th>
              <th>الحالة</th>
              <th>الأولوية</th>
              <th>التقدم</th>
              <th>تاريخ الاستحقاق</th>
              <th>الإجراءات</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-task>
            <tr>
              <td>
                <div class="task-info">
                  <h4>{{ task.title }}</h4>
                  <p>{{ task.description }}</p>
                  <div class="task-tags">
                    <p-chip
                      *ngFor="let tag of task.tags"
                      [label]="tag"
                      styleClass="tag-chip"
                    ></p-chip>
                  </div>
                </div>
              </td>
              <td>
                <div class="assignee-info">
                  <p-avatar
                    [label]="task.assigneeAvatar"
                    shape="circle"
                    [style]="{ 'background-color': '#667eea', color: '#fff' }"
                  ></p-avatar>
                  <span>{{ task.assignee }}</span>
                </div>
              </td>
              <td>
                <p-tag
                  [value]="getStatusLabel(task.status)"
                  [severity]="getStatusSeverity(task.status)"
                ></p-tag>
              </td>
              <td>
                <p-tag
                  [value]="getPriorityLabel(task.priority)"
                  [severity]="getPrioritySeverity(task.priority)"
                ></p-tag>
              </td>
              <td>
                <div class="progress-cell">
                  <p-progressBar
                    [value]="task.progress"
                    [showValue]="true"
                  ></p-progressBar>
                </div>
              </td>
              <td>
                <span [class.overdue]="isOverdue(task.dueDate)">
                  {{ task.dueDate | date : 'short' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button
                    pButton
                    icon="pi pi-eye"
                    class="p-button-rounded p-button-text"
                    (click)="viewTask(task)"
                    pTooltip="عرض"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text"
                    (click)="editTask(task)"
                    pTooltip="تعديل"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-danger"
                    (click)="deleteTask(task.id)"
                    pTooltip="حذف"
                  ></button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center">
                <div class="empty-state">
                  <i class="pi pi-inbox"></i>
                  <p>لا توجد مهام</p>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>

      <!-- Create/Edit Dialog -->
      <p-dialog
        [(visible)]="showCreateDialog"
        [header]="selectedTask ? 'تعديل مهمة' : 'مهمة جديدة'"
        [modal]="true"
        [style]="{ width: '600px' }"
      >
        <div class="task-form">
          <div class="form-field">
            <label>عنوان المهمة *</label>
            <input
              pInputText
              type="text"
              [(ngModel)]="taskForm.title"
              placeholder="أدخل عنوان المهمة"
            />
          </div>

          <div class="form-field">
            <label>الوصف</label>
            <textarea
              pInputTextarea
              [(ngModel)]="taskForm.description"
              rows="4"
              placeholder="وصف تفصيلي للمهمة"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label>الحالة</label>
              <p-dropdown
                [(ngModel)]="taskForm.status"
                [options]="statusOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="اختر الحالة"
              ></p-dropdown>
            </div>

            <div class="form-field">
              <label>الأولوية</label>
              <p-dropdown
                [(ngModel)]="taskForm.priority"
                [options]="priorityOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="اختر الأولوية"
              ></p-dropdown>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label>المسؤول</label>
              <input
                pInputText
                type="text"
                [(ngModel)]="taskForm.assignee"
                placeholder="اسم المسؤول"
              />
            </div>

            <div class="form-field">
              <label>تاريخ الاستحقاق</label>
              <p-calendar
                [(ngModel)]="taskForm.dueDate"
                [showIcon]="true"
                dateFormat="yy-mm-dd"
              ></p-calendar>
            </div>
          </div>

          <div class="form-field">
            <label>الساعات المقدرة</label>
            <input
              pInputText
              type="number"
              [(ngModel)]="taskForm.estimatedHours"
              placeholder="0"
            />
          </div>
        </div>

        <ng-template pTemplate="footer">
          <button
            pButton
            label="إلغاء"
            icon="pi pi-times"
            class="p-button-text"
            (click)="showCreateDialog = false"
          ></button>
          <button
            pButton
            [label]="selectedTask ? 'حفظ' : 'إضافة'"
            icon="pi pi-check"
            (click)="saveTask()"
          ></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [
    `
      .tasks-container {
        padding: 2rem;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .header-content {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .header-icon {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
      }

      .header-text h1 {
        margin: 0;
        font-size: 1.75rem;
        color: #333;
      }

      .header-text p {
        margin: 0.25rem 0 0 0;
        color: #666;
      }

      .header-actions {
        display: flex;
        gap: 1rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: transform 0.2s;
      }

      .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .stat-icon {
        width: 50px;
        height: 50px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: white;
      }

      .stat-card.total .stat-icon {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .stat-card.todo .stat-icon {
        background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
      }

      .stat-card.progress .stat-icon {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      .stat-card.done .stat-icon {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }

      .stat-content h3 {
        margin: 0;
        font-size: 2rem;
        color: #333;
      }

      .stat-content p {
        margin: 0.25rem 0 0 0;
        color: #666;
        font-size: 0.9rem;
      }

      .filters {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .filters > * {
        flex: 1;
        min-width: 200px;
      }

      .task-info h4 {
        margin: 0 0 0.5rem 0;
        color: #333;
        font-size: 1rem;
      }

      .task-info p {
        margin: 0 0 0.5rem 0;
        color: #666;
        font-size: 0.875rem;
      }

      .task-tags {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .tag-chip {
        font-size: 0.75rem;
      }

      .assignee-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .progress-cell {
        min-width: 150px;
      }

      .overdue {
        color: #f44336;
        font-weight: 600;
      }

      .action-buttons {
        display: flex;
        gap: 0.5rem;
      }

      .empty-state {
        padding: 3rem;
        text-align: center;
        color: #999;
      }

      .empty-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .task-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-field label {
        font-weight: 600;
        color: #333;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      :host ::ng-deep .p-card {
        margin-bottom: 1.5rem;
      }

      :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
        padding: 1rem;
      }
    `,
  ],
})
export class TasksListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  statistics: any = {
    total: 0,
    byStatus: { todo: 0, inProgress: 0, review: 0, done: 0 },
  };

  searchQuery = '';
  filterStatus: string | null = null;
  filterPriority: string | null = null;

  showCreateDialog = false;
  selectedTask: Task | null = null;
  taskForm: any = {};

  statusOptions = [
    { label: 'قيد الانتظار', value: 'todo' },
    { label: 'قيد التنفيذ', value: 'in-progress' },
    { label: 'قيد المراجعة', value: 'review' },
    { label: 'مكتملة', value: 'done' },
  ];

  priorityOptions = [
    { label: 'منخفضة', value: 'low' },
    { label: 'متوسطة', value: 'medium' },
    { label: 'عالية', value: 'high' },
    { label: 'عاجلة', value: 'urgent' },
  ];

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTasks();
    this.loadStatistics();
  }

  loadTasks() {
    this.http.get<Task[]>('/api/tasks').subscribe({
      next: (data) => {
        this.tasks = data;
        this.filteredTasks = data;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تحميل المهام',
        });
      },
    });
  }

  loadStatistics() {
    this.http.get<any>('/api/tasks/statistics').subscribe({
      next: (data) => {
        this.statistics = data;
      },
    });
  }

  filterTasks() {
    this.filteredTasks = this.tasks.filter((task) => {
      const matchesSearch =
        !this.searchQuery ||
        task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus =
        !this.filterStatus || task.status === this.filterStatus;

      const matchesPriority =
        !this.filterPriority || task.priority === this.filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  viewTask(task: Task) {
    // Navigate to task details
    this.router.navigate(['/tasks', task.id]);
  }

  editTask(task: Task) {
    this.selectedTask = task;
    this.taskForm = { ...task };
    this.showCreateDialog = true;
  }

  deleteTask(id: string) {
    if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
      this.http.delete(`/api/tasks/${id}`).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجح',
            detail: 'تم حذف المهمة بنجاح',
          });
          this.loadTasks();
          this.loadStatistics();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل حذف المهمة',
          });
        },
      });
    }
  }

  saveTask() {
    if (!this.taskForm.title) {
      this.messageService.add({
        severity: 'warn',
        summary: 'تنبيه',
        detail: 'يرجى إدخال عنوان المهمة',
      });
      return;
    }

    const request = this.selectedTask
      ? this.http.patch(`/api/tasks/${this.selectedTask.id}`, this.taskForm)
      : this.http.post('/api/tasks', this.taskForm);

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'نجح',
          detail: this.selectedTask
            ? 'تم تحديث المهمة بنجاح'
            : 'تم إضافة المهمة بنجاح',
        });
        this.showCreateDialog = false;
        this.selectedTask = null;
        this.taskForm = {};
        this.loadTasks();
        this.loadStatistics();
      },
      error: (error) => {
        console.error('Error saving task:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل حفظ المهمة',
        });
      },
    });
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      todo: 'قيد الانتظار',
      'in-progress': 'قيد التنفيذ',
      review: 'قيد المراجعة',
      done: 'مكتملة',
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: string): string {
    const severities: any = {
      todo: 'warning',
      'in-progress': 'info',
      review: 'secondary',
      done: 'success',
    };
    return severities[status] || 'info';
  }

  getPriorityLabel(priority: string): string {
    const labels: any = {
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية',
      urgent: 'عاجلة',
    };
    return labels[priority] || priority;
  }

  getPrioritySeverity(priority: string): string {
    const severities: any = {
      low: 'success',
      medium: 'info',
      high: 'warning',
      urgent: 'danger',
    };
    return severities[priority] || 'info';
  }

  isOverdue(dueDate: Date): boolean {
    return new Date(dueDate) < new Date();
  }
}
