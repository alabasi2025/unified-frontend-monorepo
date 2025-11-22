import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Idea {
  id: string;
  title: string;
  description?: string;
  status: 'NEW' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'CONVERTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category: string;
  tags: string[];
  relatedSystem?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

@Component({
  selector: 'app-ideas-bank',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ideas-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>💡 بنك الأفكار</h1>
          <p class="subtitle">مركز إدارة وتتبع الأفكار والمقترحات</p>
        </div>
        <button class="btn-primary" (click)="openCreateDialog()">
          ➕ إضافة فكرة جديدة
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card new">
          <div class="stat-icon">🔥</div>
          <div class="stat-content">
            <div class="stat-value">{{ getIdeasByStatus('NEW').length }}</div>
            <div class="stat-label">أفكار جديدة</div>
          </div>
        </div>
        <div class="stat-card review">
          <div class="stat-icon">🔍</div>
          <div class="stat-content">
            <div class="stat-value">{{ getIdeasByStatus('UNDER_REVIEW').length }}</div>
            <div class="stat-label">قيد الدراسة</div>
          </div>
        </div>
        <div class="stat-card converted">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <div class="stat-value">{{ getIdeasByStatus('CONVERTED').length }}</div>
            <div class="stat-label">محولة لمهام</div>
          </div>
        </div>
        <div class="stat-card archived">
          <div class="stat-icon">📁</div>
          <div class="stat-content">
            <div class="stat-value">{{ getIdeasByStatus('ACCEPTED').length + getIdeasByStatus('REJECTED').length }}</div>
            <div class="stat-label">مؤرشفة</div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (input)="applyFilters()"
            placeholder="🔍 ابحث في الأفكار..."
            class="search-input"
          />
        </div>
        <div class="filter-controls">
          <select [(ngModel)]="filterStatus" (change)="applyFilters()" class="filter-select">
            <option value="">كل الحالات</option>
            <option value="NEW">جديدة</option>
            <option value="UNDER_REVIEW">قيد الدراسة</option>
            <option value="ACCEPTED">مقبولة</option>
            <option value="REJECTED">مرفوضة</option>
            <option value="CONVERTED">محولة لمهمة</option>
          </select>
          <select [(ngModel)]="filterPriority" (change)="applyFilters()" class="filter-select">
            <option value="">كل الأولويات</option>
            <option value="HIGH">عالية</option>
            <option value="MEDIUM">متوسطة</option>
            <option value="LOW">منخفضة</option>
          </select>
          <select [(ngModel)]="filterCategory" (change)="applyFilters()" class="filter-select">
            <option value="">كل الفئات</option>
            <option value="FEATURE">ميزة جديدة</option>
            <option value="IMPROVEMENT">تحسين</option>
            <option value="BUG_FIX">إصلاح خطأ</option>
            <option value="RESEARCH">بحث</option>
          </select>
        </div>
      </div>

      <!-- Ideas List -->
      <div class="ideas-list" *ngIf="!loading && filteredIdeas.length > 0">
        <div 
          *ngFor="let idea of filteredIdeas" 
          class="idea-card"
          [class.priority-high]="idea.priority === 'HIGH'"
          [class.priority-medium]="idea.priority === 'MEDIUM'"
          [class.priority-low]="idea.priority === 'LOW'"
        >
          <div class="idea-header">
            <div class="idea-title-section">
              <h3 class="idea-title">{{ idea.title }}</h3>
              <div class="idea-badges">
                <span class="badge badge-status" [class]="'status-' + idea.status.toLowerCase()">
                  {{ getStatusLabel(idea.status) }}
                </span>
                <span class="badge badge-priority" [class]="'priority-' + idea.priority.toLowerCase()">
                  {{ getPriorityLabel(idea.priority) }}
                </span>
                <span class="badge badge-category">{{ getCategoryLabel(idea.category) }}</span>
              </div>
            </div>
            <div class="idea-actions">
              <button class="btn-icon" (click)="viewIdea(idea)" title="عرض">
                👁️
              </button>
              <button class="btn-icon" (click)="editIdea(idea)" title="تعديل">
                ✏️
              </button>
              <button 
                class="btn-icon btn-convert" 
                (click)="convertToTask(idea)" 
                *ngIf="idea.status !== 'CONVERTED'"
                title="تحويل لمهمة"
              >
                🔄
              </button>
              <button class="btn-icon btn-delete" (click)="deleteIdea(idea)" title="حذف">
                🗑️
              </button>
            </div>
          </div>
          
          <p class="idea-description" *ngIf="idea.description">
            {{ idea.description }}
          </p>
          
          <div class="idea-footer">
            <div class="idea-meta">
              <span class="meta-item">
                📅 {{ formatDate(idea.createdAt) }}
              </span>
              <span class="meta-item" *ngIf="idea.relatedSystem">
                🏷️ {{ idea.relatedSystem }}
              </span>
            </div>
            <div class="idea-tags" *ngIf="idea.tags && idea.tags.length > 0">
              <span *ngFor="let tag of idea.tags" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading && filteredIdeas.length === 0">
        <div class="empty-icon">💡</div>
        <h3>لا توجد أفكار</h3>
        <p>ابدأ بإضافة فكرة جديدة</p>
        <button class="btn-primary" (click)="openCreateDialog()">
          ➕ إضافة فكرة
        </button>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>جاري التحميل...</p>
      </div>

      <!-- Create/Edit Dialog -->
      <div class="dialog-overlay" *ngIf="showDialog" (click)="closeDialog()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingIdea ? 'تعديل الفكرة' : 'إضافة فكرة جديدة' }}</h2>
            <button class="btn-close" (click)="closeDialog()">✕</button>
          </div>
          
          <form (ngSubmit)="saveIdea()" class="dialog-form">
            <div class="form-group">
              <label>العنوان *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.title" 
                name="title"
                placeholder="عنوان الفكرة"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>الوصف</label>
              <textarea 
                [(ngModel)]="formData.description" 
                name="description"
                placeholder="وصف تفصيلي للفكرة..."
                rows="4"
                class="form-textarea"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>الحالة *</label>
                <select [(ngModel)]="formData.status" name="status" required class="form-select">
                  <option value="NEW">جديدة</option>
                  <option value="UNDER_REVIEW">قيد الدراسة</option>
                  <option value="ACCEPTED">مقبولة</option>
                  <option value="REJECTED">مرفوضة</option>
                  <option value="CONVERTED">محولة لمهمة</option>
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

            <div class="form-row">
              <div class="form-group">
                <label>الفئة *</label>
                <select [(ngModel)]="formData.category" name="category" required class="form-select">
                  <option value="FEATURE">ميزة جديدة</option>
                  <option value="IMPROVEMENT">تحسين</option>
                  <option value="BUG_FIX">إصلاح خطأ</option>
                  <option value="RESEARCH">بحث</option>
                </select>
              </div>

              <div class="form-group">
                <label>النظام المرتبط</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.relatedSystem" 
                  name="relatedSystem"
                  placeholder="مثال: نظام الخرائط"
                  class="form-input"
                />
              </div>
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
              <small class="form-hint">مثال: تطوير، تحسين، أداء</small>
            </div>

            <div class="dialog-actions">
              <button type="button" class="btn-secondary" (click)="closeDialog()">
                إلغاء
              </button>
              <button type="submit" class="btn-primary" [disabled]="!formData.title">
                {{ editingIdea ? 'حفظ التعديلات' : 'إضافة الفكرة' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ideas-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .header-content h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      color: #6b7280;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-left: 4px solid;
    }

    .stat-card.new { border-left-color: #ef4444; }
    .stat-card.review { border-left-color: #f59e0b; }
    .stat-card.converted { border-left-color: #10b981; }
    .stat-card.archived { border-left-color: #6b7280; }

    .stat-icon {
      font-size: 2.5rem;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
    }

    .stat-label {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .filters-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .search-box {
      margin-bottom: 1rem;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .filter-controls {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .filter-select {
      flex: 1;
      min-width: 200px;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.875rem;
      background: white;
      cursor: pointer;
    }

    .ideas-list {
      display: grid;
      gap: 1.5rem;
    }

    .idea-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-right: 4px solid #e5e7eb;
      transition: all 0.2s;
    }

    .idea-card:hover {
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .idea-card.priority-high { border-right-color: #ef4444; }
    .idea-card.priority-medium { border-right-color: #f59e0b; }
    .idea-card.priority-low { border-right-color: #10b981; }

    .idea-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .idea-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .idea-badges {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .badge-status {
      background: #e5e7eb;
      color: #374151;
    }

    .status-new { background: #fee2e2; color: #991b1b; }
    .status-under_review { background: #fef3c7; color: #92400e; }
    .status-accepted { background: #d1fae5; color: #065f46; }
    .status-rejected { background: #fee2e2; color: #991b1b; }
    .status-converted { background: #dbeafe; color: #1e40af; }

    .badge-priority {
      background: #e5e7eb;
      color: #374151;
    }

    .priority-high { background: #fee2e2; color: #991b1b; }
    .priority-medium { background: #fef3c7; color: #92400e; }
    .priority-low { background: #d1fae5; color: #065f46; }

    .badge-category {
      background: #dbeafe;
      color: #1e40af;
    }

    .idea-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      padding: 0.5rem;
      border: none;
      background: #f3f4f6;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1.25rem;
      transition: all 0.2s;
    }

    .btn-icon:hover {
      background: #e5e7eb;
      transform: scale(1.1);
    }

    .btn-convert {
      background: #dbeafe;
    }

    .btn-convert:hover {
      background: #bfdbfe;
    }

    .btn-delete {
      background: #fee2e2;
    }

    .btn-delete:hover {
      background: #fecaca;
    }

    .idea-description {
      color: #6b7280;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .idea-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .idea-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .idea-tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .tag {
      padding: 0.25rem 0.75rem;
      background: #f3f4f6;
      border-radius: 9999px;
      font-size: 0.75rem;
      color: #4b5563;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: #6b7280;
      margin-bottom: 1.5rem;
    }

    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #e5e7eb;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .btn-primary {
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-primary:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .btn-secondary {
      padding: 0.75rem 1.5rem;
      background: #f3f4f6;
      color: #374151;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #1f2937;
    }

    .btn-close {
      padding: 0.5rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6b7280;
    }

    .btn-close:hover {
      color: #1f2937;
    }

    .dialog-form {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
    }

    .form-input,
    .form-textarea,
    .form-select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-input:focus,
    .form-textarea:focus,
    .form-select:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .form-textarea {
      resize: vertical;
      font-family: inherit;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-hint {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .dialog-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    @media (max-width: 768px) {
      .ideas-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .filter-controls {
        flex-direction: column;
      }

      .filter-select {
        width: 100%;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .idea-header {
        flex-direction: column;
        gap: 1rem;
      }

      .idea-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class IdeasBankComponent implements OnInit {
  ideas: Idea[] = [];
  filteredIdeas: Idea[] = [];
  loading = false;
  showDialog = false;
  editingIdea: Idea | null = null;

  // Filters
  searchQuery = '';
  filterStatus = '';
  filterPriority = '';
  filterCategory = '';

  // Form
  formData: Partial<Idea> = {
    title: '',
    description: '',
    status: 'NEW',
    priority: 'MEDIUM',
    category: 'FEATURE',
    tags: [],
    relatedSystem: ''
  };
  tagsInput = '';

  private apiUrl = `${environment.apiUrl}/api/smart-notebook/ideas`;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadIdeas();
  }

  loadIdeas() {
    this.loading = true;
    this.http.get<Idea[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.ideas = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading ideas:', error);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredIdeas = this.ideas.filter(idea => {
      const matchesSearch = !this.searchQuery || 
        idea.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (idea.description && idea.description.toLowerCase().includes(this.searchQuery.toLowerCase()));
      
      const matchesStatus = !this.filterStatus || idea.status === this.filterStatus;
      const matchesPriority = !this.filterPriority || idea.priority === this.filterPriority;
      const matchesCategory = !this.filterCategory || idea.category === this.filterCategory;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }

  getIdeasByStatus(status: string): Idea[] {
    return this.ideas.filter(idea => idea.status === status);
  }

  openCreateDialog() {
    this.editingIdea = null;
    this.formData = {
      title: '',
      description: '',
      status: 'NEW',
      priority: 'MEDIUM',
      category: 'FEATURE',
      tags: [],
      relatedSystem: ''
    };
    this.tagsInput = '';
    this.showDialog = true;
  }

  editIdea(idea: Idea) {
    this.editingIdea = idea;
    this.formData = { ...idea };
    this.tagsInput = idea.tags.join(', ');
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.editingIdea = null;
  }

  saveIdea() {
    // Parse tags
    if (this.tagsInput) {
      this.formData.tags = this.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    if (this.editingIdea) {
      // Update
      this.http.patch(`${this.apiUrl}/${this.editingIdea.id}`, this.formData).subscribe({
        next: () => {
          this.loadIdeas();
          this.closeDialog();
        },
        error: (error) => console.error('Error updating idea:', error)
      });
    } else {
      // Create
      this.http.post(this.apiUrl, this.formData).subscribe({
        next: () => {
          this.loadIdeas();
          this.closeDialog();
        },
        error: (error) => console.error('Error creating idea:', error)
      });
    }
  }

  viewIdea(idea: Idea) {
    // TODO: Navigate to detail page or open detail dialog
    console.log('View idea:', idea);
  }

  deleteIdea(idea: Idea) {
    if (confirm('هل أنت متأكد من حذف هذه الفكرة؟')) {
      this.http.delete(`${this.apiUrl}/${idea.id}`).subscribe({
        next: () => this.loadIdeas(),
        error: (error) => console.error('Error deleting idea:', error)
      });
    }
  }

  convertToTask(idea: Idea) {
    if (confirm('هل تريد تحويل هذه الفكرة إلى مهمة؟')) {
      this.http.post(`${this.apiUrl}/${idea.id}/convert-to-task`, {}).subscribe({
        next: () => {
          alert('تم تحويل الفكرة إلى مهمة بنجاح');
          this.loadIdeas();
        },
        error: (error) => console.error('Error converting idea:', error)
      });
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'NEW': 'جديدة',
      'UNDER_REVIEW': 'قيد الدراسة',
      'ACCEPTED': 'مقبولة',
      'REJECTED': 'مرفوضة',
      'CONVERTED': 'محولة لمهمة'
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

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'FEATURE': 'ميزة جديدة',
      'IMPROVEMENT': 'تحسين',
      'BUG_FIX': 'إصلاح خطأ',
      'RESEARCH': 'بحث'
    };
    return labels[category] || category;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
