import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Report {
  id: string;
  title: string;
  description?: string;
  type: 'TECHNICAL' | 'BUSINESS' | 'ANALYSIS' | 'DOCUMENTATION';
  format: 'PDF' | 'MARKDOWN' | 'HTML' | 'JSON';
  content: string;
  fileUrl?: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-reports-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reports-container">
      <div class="page-header">
        <div class="header-content">
          <h1>📊 مكتبة التقارير</h1>
          <p class="subtitle">مركز إدارة وأرشفة التقارير</p>
        </div>
        <button class="btn-primary" (click)="openCreateDialog()">
          ➕ تقرير جديد
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📄</div>
          <div class="stat-content">
            <div class="stat-value">{{ reports.length }}</div>
            <div class="stat-label">إجمالي التقارير</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ getPublishedReports().length }}</div>
            <div class="stat-label">منشورة</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <div class="stat-value">{{ getDraftReports().length }}</div>
            <div class="stat-label">مسودات</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <div class="stat-value">{{ getTodayReports().length }}</div>
            <div class="stat-label">اليوم</div>
          </div>
        </div>
      </div>

      <div class="filters-section">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (input)="applyFilters()"
            placeholder="🔍 ابحث في التقارير..."
            class="search-input"
          />
        </div>
        <div class="filter-controls">
          <select [(ngModel)]="filterType" (change)="applyFilters()" class="filter-select">
            <option value="">كل الأنواع</option>
            <option value="TECHNICAL">تقني</option>
            <option value="BUSINESS">أعمال</option>
            <option value="ANALYSIS">تحليلي</option>
            <option value="DOCUMENTATION">توثيق</option>
          </select>
          <select [(ngModel)]="filterFormat" (change)="applyFilters()" class="filter-select">
            <option value="">كل الصيغ</option>
            <option value="PDF">PDF</option>
            <option value="MARKDOWN">Markdown</option>
            <option value="HTML">HTML</option>
            <option value="JSON">JSON</option>
          </select>
          <button 
            class="filter-btn" 
            [class.active]="filterPublished === 'published'"
            (click)="setPublishedFilter('published')"
          >
            ✅ منشورة
          </button>
          <button 
            class="filter-btn" 
            [class.active]="filterPublished === 'draft'"
            (click)="setPublishedFilter('draft')"
          >
            📝 مسودات
          </button>
        </div>
      </div>

      <div class="reports-grid" *ngIf="!loading && filteredReports.length > 0">
        <div 
          *ngFor="let report of filteredReports" 
          class="report-card"
          [class.published]="report.isPublished"
        >
          <div class="report-header">
            <div class="report-type-icon">
              {{ getTypeIcon(report.type) }}
            </div>
            <div class="report-status">
              <span class="status-badge" [class.published]="report.isPublished">
                {{ report.isPublished ? '✅ منشور' : '📝 مسودة' }}
              </span>
            </div>
          </div>

          <h3 class="report-title">{{ report.title }}</h3>
          <p class="report-description" *ngIf="report.description">
            {{ report.description }}
          </p>

          <div class="report-badges">
            <span class="badge badge-type">{{ getTypeLabel(report.type) }}</span>
            <span class="badge badge-format">{{ report.format }}</span>
          </div>

          <div class="report-footer">
            <div class="report-meta">
              <span>📅 {{ formatDate(report.createdAt) }}</span>
            </div>
            <div class="report-actions">
              <button class="btn-icon" (click)="viewReport(report)" title="عرض">👁️</button>
              <button class="btn-icon" (click)="editReport(report)" title="تعديل">✏️</button>
              <button class="btn-icon" (click)="downloadReport(report)" title="تحميل">📥</button>
              <button class="btn-icon btn-delete" (click)="deleteReport(report)" title="حذف">🗑️</button>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredReports.length === 0">
        <div class="empty-icon">📊</div>
        <h3>لا توجد تقارير</h3>
        <button class="btn-primary" (click)="openCreateDialog()">➕ إضافة تقرير</button>
      </div>

      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>جاري التحميل...</p>
      </div>

      <!-- Dialog -->
      <div class="dialog-overlay" *ngIf="showDialog" (click)="closeDialog()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingReport ? 'تعديل التقرير' : 'تقرير جديد' }}</h2>
            <button class="btn-close" (click)="closeDialog()">✕</button>
          </div>
          
          <form (ngSubmit)="saveReport()" class="dialog-form">
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
                rows="3"
                class="form-textarea"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>النوع *</label>
                <select [(ngModel)]="formData.type" name="type" required class="form-select">
                  <option value="TECHNICAL">تقني</option>
                  <option value="BUSINESS">أعمال</option>
                  <option value="ANALYSIS">تحليلي</option>
                  <option value="DOCUMENTATION">توثيق</option>
                </select>
              </div>

              <div class="form-group">
                <label>الصيغة *</label>
                <select [(ngModel)]="formData.format" name="format" required class="form-select">
                  <option value="PDF">PDF</option>
                  <option value="MARKDOWN">Markdown</option>
                  <option value="HTML">HTML</option>
                  <option value="JSON">JSON</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>المحتوى *</label>
              <textarea 
                [(ngModel)]="formData.content" 
                name="content"
                rows="8"
                required
                class="form-textarea"
              ></textarea>
            </div>

            <div class="form-group">
              <label>
                <input 
                  type="checkbox" 
                  [(ngModel)]="formData.isPublished" 
                  name="isPublished"
                />
                نشر التقرير
              </label>
            </div>

            <div class="dialog-actions">
              <button type="button" class="btn-secondary" (click)="closeDialog()">إلغاء</button>
              <button type="submit" class="btn-primary" [disabled]="!formData.title || !formData.content">
                {{ editingReport ? 'حفظ' : 'إضافة' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-container { padding: 2rem; max-width: 1400px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb; }
    .header-content h1 { font-size: 2rem; font-weight: 700; color: #1f2937; margin: 0 0 0.5rem 0; }
    .subtitle { color: #6b7280; margin: 0; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .stat-card { background: white; border-radius: 12px; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-left: 4px solid #10b981; }
    .stat-icon { font-size: 2.5rem; }
    .stat-value { font-size: 2rem; font-weight: 700; color: #1f2937; }
    .stat-label { color: #6b7280; font-size: 0.875rem; }
    .filters-section { background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .search-input { width: 100%; padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; margin-bottom: 1rem; }
    .filter-controls { display: flex; gap: 1rem; flex-wrap: wrap; }
    .filter-select { flex: 1; min-width: 150px; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; }
    .filter-btn { padding: 0.75rem 1.5rem; border: 2px solid #e5e7eb; background: white; border-radius: 8px; cursor: pointer; }
    .filter-btn.active { background: #10b981; color: white; border-color: #10b981; }
    .reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
    .report-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.2s; }
    .report-card:hover { box-shadow: 0 4px 6px rgba(0,0,0,0.1); transform: translateY(-2px); }
    .report-card.published { border-top: 4px solid #10b981; }
    .report-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .report-type-icon { font-size: 2rem; }
    .status-badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; background: #fef3c7; color: #92400e; }
    .status-badge.published { background: #d1fae5; color: #065f46; }
    .report-title { font-size: 1.25rem; font-weight: 600; color: #1f2937; margin: 0 0 0.5rem 0; }
    .report-description { color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem; }
    .report-badges { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
    .badge-type { background: #dbeafe; color: #1e40af; }
    .badge-format { background: #f3f4f6; color: #4b5563; }
    .report-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #e5e7eb; }
    .report-meta { font-size: 0.875rem; color: #6b7280; }
    .report-actions { display: flex; gap: 0.5rem; }
    .btn-icon { padding: 0.5rem; border: none; background: #f3f4f6; border-radius: 8px; cursor: pointer; font-size: 1.25rem; }
    .btn-icon:hover { background: #e5e7eb; }
    .btn-delete { background: #fee2e2; }
    .btn-delete:hover { background: #fecaca; }
    .empty-state { text-align: center; padding: 4rem 2rem; background: white; border-radius: 12px; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .loading-state { text-align: center; padding: 4rem 2rem; }
    .spinner { width: 50px; height: 50px; border: 4px solid #e5e7eb; border-top-color: #10b981; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .btn-primary { padding: 0.75rem 1.5rem; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-primary:hover { background: #059669; }
    .btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }
    .btn-secondary { padding: 0.75rem 1.5rem; background: #f3f4f6; color: #374151; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .dialog-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog-content { background: white; border-radius: 12px; width: 90%; max-width: 700px; max-height: 90vh; overflow-y: auto; }
    .dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #e5e7eb; }
    .btn-close { padding: 0.5rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; }
    .dialog-form { padding: 1.5rem; }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; }
    .form-input, .form-textarea, .form-select { width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; }
    .form-textarea { resize: vertical; font-family: inherit; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .dialog-actions { display: flex; gap: 1rem; justify-content: flex-end; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }
  `]
})
export class ReportsLibraryComponent implements OnInit {
  reports: Report[] = [];
  filteredReports: Report[] = [];
  loading = false;
  showDialog = false;
  editingReport: Report | null = null;

  searchQuery = '';
  filterType = '';
  filterFormat = '';
  filterPublished: 'all' | 'published' | 'draft' = 'all';

  formData: Partial<Report> = {
    title: '',
    description: '',
    type: 'TECHNICAL',
    format: 'MARKDOWN',
    content: '',
    isPublished: false,
    tags: []
  };

  private apiUrl = `${environment.apiUrl}/api/smart-notebook/reports`;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.loading = true;
    this.http.get<Report[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.reports = data;
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
    this.filteredReports = this.reports.filter(report => {
      const matchesSearch = !this.searchQuery || 
        report.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = !this.filterType || report.type === this.filterType;
      const matchesFormat = !this.filterFormat || report.format === this.filterFormat;
      const matchesPublished = this.filterPublished === 'all' || 
        (this.filterPublished === 'published' && report.isPublished) ||
        (this.filterPublished === 'draft' && !report.isPublished);
      return matchesSearch && matchesType && matchesFormat && matchesPublished;
    });
  }

  setPublishedFilter(filter: 'all' | 'published' | 'draft') {
    this.filterPublished = filter;
    this.applyFilters();
  }

  getPublishedReports() {
    return this.reports.filter(r => r.isPublished);
  }

  getDraftReports() {
    return this.reports.filter(r => !r.isPublished);
  }

  getTodayReports() {
    const today = new Date().toDateString();
    return this.reports.filter(r => new Date(r.createdAt).toDateString() === today);
  }

  openCreateDialog() {
    this.editingReport = null;
    this.formData = {
      title: '',
      description: '',
      type: 'TECHNICAL',
      format: 'MARKDOWN',
      content: '',
      isPublished: false,
      tags: []
    };
    this.showDialog = true;
  }

  editReport(report: Report) {
    this.editingReport = report;
    this.formData = { ...report };
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

  saveReport() {
    if (this.editingReport) {
      this.http.patch(`${this.apiUrl}/${this.editingReport.id}`, this.formData).subscribe({
        next: () => {
          this.loadReports();
          this.closeDialog();
        }
      });
    } else {
      this.http.post(this.apiUrl, this.formData).subscribe({
        next: () => {
          this.loadReports();
          this.closeDialog();
        }
      });
    }
  }

  viewReport(report: Report) {
    console.log('View:', report);
  }

  deleteReport(report: Report) {
    if (confirm('حذف؟')) {
      this.http.delete(`${this.apiUrl}/${report.id}`).subscribe({
        next: () => this.loadReports()
      });
    }
  }

  downloadReport(report: Report) {
    const blob = new Blob([report.content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title}.${report.format.toLowerCase()}`;
    a.click();
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'TECHNICAL': '⚙️',
      'BUSINESS': '💼',
      'ANALYSIS': '📈',
      'DOCUMENTATION': '📚'
    };
    return icons[type] || '📄';
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'TECHNICAL': 'تقني',
      'BUSINESS': 'أعمال',
      'ANALYSIS': 'تحليلي',
      'DOCUMENTATION': 'توثيق'
    };
    return labels[type] || type;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('ar-SA');
  }
}
