import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MarkdownEditorComponent } from '../../../shared/components/markdown-editor.component';

// Enums matching Backend
enum ReportType {
  ACHIEVEMENT = 'ACHIEVEMENT',
  PHASE = 'PHASE',
  UPDATE = 'UPDATE',
  ANALYSIS = 'ANALYSIS',
  SUMMARY = 'SUMMARY',
  TECHNICAL = 'TECHNICAL',
  DOCUMENTATION = 'DOCUMENTATION',
  USER_GUIDE = 'USER_GUIDE',
  DEVELOPER_GUIDE = 'DEVELOPER_GUIDE',
  ARCHITECTURE = 'ARCHITECTURE',
  SYSTEM_GUIDE = 'SYSTEM_GUIDE',
  COMPREHENSIVE = 'COMPREHENSIVE'
}

enum ReportStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

enum ReportFormat {
  MARKDOWN = 'MARKDOWN',
  PDF = 'PDF',
  HTML = 'HTML',
  JSON = 'JSON',
  TEXT = 'TEXT'
}

interface Report {
  id: string;
  title: string;
  content: string;
  summary?: string;
  type: ReportType;
  status: ReportStatus;
  format: ReportFormat;
  category?: string;
  tags: string[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-reports-library',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownEditorComponent],
  template: `
    <div class="reports-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>📊 مكتبة التقارير</h1>
          <p class="subtitle">مركز إدارة وأرشفة التقارير والتوثيق</p>
        </div>
        <button class="btn-primary" (click)="openCreateDialog()">
          ➕ تقرير جديد
        </button>
      </div>

      <!-- Statistics -->
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

      <!-- Filters -->
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
            <option *ngFor="let type of reportTypes" [value]="type.value">
              {{ type.icon }} {{ type.label }}
            </option>
          </select>
          <select [(ngModel)]="filterFormat" (change)="applyFilters()" class="filter-select">
            <option value="">كل الصيغ</option>
            <option value="MARKDOWN">Markdown</option>
            <option value="PDF">PDF</option>
            <option value="HTML">HTML</option>
            <option value="JSON">JSON</option>
            <option value="TEXT">Text</option>
          </select>
          <select [(ngModel)]="filterStatus" (change)="applyFilters()" class="filter-select">
            <option value="">كل الحالات</option>
            <option value="DRAFT">📝 مسودة</option>
            <option value="PUBLISHED">✅ منشور</option>
            <option value="ARCHIVED">📁 مؤرشف</option>
          </select>
        </div>
      </div>

      <!-- Reports Grid -->
      <div class="reports-grid" *ngIf="!loading && filteredReports.length > 0">
        <div 
          *ngFor="let report of filteredReports" 
          class="report-card"
          [class.published]="report.status === 'PUBLISHED'"
        >
          <div class="report-header">
            <div class="report-type-icon">
              {{ getTypeIcon(report.type) }}
            </div>
            <div class="report-status">
              <span class="status-badge" [ngClass]="'status-' + report.status.toLowerCase()">
                {{ getStatusLabel(report.status) }}
              </span>
            </div>
          </div>

          <h3 class="report-title">{{ report.title }}</h3>
          <p class="report-description" *ngIf="report.summary">
            {{ report.summary }}
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

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading && filteredReports.length === 0">
        <div class="empty-icon">📊</div>
        <h3>لا توجد تقارير</h3>
        <p>ابدأ بإنشاء تقرير جديد</p>
        <button class="btn-primary" (click)="openCreateDialog()">➕ إضافة تقرير</button>
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
                placeholder="أدخل عنوان التقرير"
              />
            </div>

            <div class="form-group">
              <label>الملخص</label>
              <textarea 
                [(ngModel)]="formData.summary" 
                name="summary"
                rows="2"
                class="form-textarea"
                placeholder="ملخص مختصر عن التقرير"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>النوع *</label>
                <select [(ngModel)]="formData.type" name="type" required class="form-select">
                  <option *ngFor="let type of reportTypes" [value]="type.value">
                    {{ type.icon }} {{ type.label }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>الصيغة *</label>
                <select [(ngModel)]="formData.format" name="format" required class="form-select">
                  <option value="MARKDOWN">Markdown</option>
                  <option value="PDF">PDF</option>
                  <option value="HTML">HTML</option>
                  <option value="JSON">JSON</option>
                  <option value="TEXT">Text</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>الحالة *</label>
                <select [(ngModel)]="formData.status" name="status" required class="form-select">
                  <option value="DRAFT">📝 مسودة</option>
                  <option value="PUBLISHED">✅ منشور</option>
                  <option value="ARCHIVED">📁 مؤرشف</option>
                </select>
              </div>

              <div class="form-group">
                <label>التصنيف</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.category" 
                  name="category"
                  class="form-input"
                  placeholder="مثال: تقني، إداري، مالي"
                />
              </div>
            </div>

            <div class="form-group">
              <label>المحتوى * <span class="label-hint">(يدعم Markdown)</span></label>
              <app-markdown-editor
                [(ngModel)]="formData.content"
                name="content"
                [height]="400"
              ></app-markdown-editor>
            </div>

            <div class="dialog-actions">
              <button type="button" class="btn-secondary" (click)="closeDialog()">إلغاء</button>
              <button type="submit" class="btn-primary" [disabled]="!formData.title || !formData.content">
                {{ editingReport ? '💾 حفظ' : '➕ إضافة' }}
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
    .reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
    .report-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.2s; border-top: 4px solid #e5e7eb; }
    .report-card.published { border-top-color: #10b981; }
    .report-card:hover { box-shadow: 0 4px 6px rgba(0,0,0,0.1); transform: translateY(-2px); }
    .report-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .report-type-icon { font-size: 2rem; }
    .status-badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
    .status-badge.status-draft { background: #fef3c7; color: #92400e; }
    .status-badge.status-published { background: #d1fae5; color: #065f46; }
    .status-badge.status-archived { background: #f3f4f6; color: #6b7280; }
    .report-title { font-size: 1.25rem; font-weight: 600; color: #1f2937; margin: 0 0 0.5rem 0; }
    .report-description { color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem; line-height: 1.5; }
    .report-badges { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .badge { padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
    .badge-type { background: #dbeafe; color: #1e40af; }
    .badge-format { background: #f3f4f6; color: #4b5563; }
    .report-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #e5e7eb; }
    .report-meta { font-size: 0.875rem; color: #6b7280; }
    .report-actions { display: flex; gap: 0.5rem; }
    .btn-icon { padding: 0.5rem; border: none; background: #f3f4f6; border-radius: 8px; cursor: pointer; font-size: 1.25rem; transition: all 0.2s; }
    .btn-icon:hover { background: #e5e7eb; transform: scale(1.1); }
    .btn-delete { background: #fee2e2; }
    .btn-delete:hover { background: #fecaca; }
    .empty-state { text-align: center; padding: 4rem 2rem; background: white; border-radius: 12px; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; opacity: 0.5; }
    .empty-state h3 { color: #1f2937; margin-bottom: 0.5rem; }
    .empty-state p { color: #6b7280; margin-bottom: 1.5rem; }
    .loading-state { text-align: center; padding: 4rem 2rem; }
    .spinner { width: 50px; height: 50px; border: 4px solid #e5e7eb; border-top-color: #10b981; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .btn-primary { padding: 0.75rem 1.5rem; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-primary:hover { background: #059669; transform: translateY(-1px); }
    .btn-primary:disabled { background: #9ca3af; cursor: not-allowed; transform: none; }
    .btn-secondary { padding: 0.75rem 1.5rem; background: #f3f4f6; color: #374151; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-secondary:hover { background: #e5e7eb; }
    .dialog-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog-content { background: white; border-radius: 12px; width: 90%; max-width: 900px; max-height: 90vh; overflow-y: auto; }
    .dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #e5e7eb; }
    .dialog-header h2 { margin: 0; color: #1f2937; }
    .btn-close { padding: 0.5rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280; }
    .btn-close:hover { color: #1f2937; }
    .dialog-form { padding: 1.5rem; }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151; }
    .label-hint { font-weight: 400; color: #6b7280; font-size: 0.875rem; }
    .form-input, .form-textarea, .form-select { width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; }
    .form-input:focus, .form-textarea:focus, .form-select:focus { outline: none; border-color: #10b981; }
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
  filterStatus = '';

  reportTypes = [
    { value: 'ACHIEVEMENT', label: 'إنجاز', icon: '🎯' },
    { value: 'PHASE', label: 'مرحلة', icon: '📊' },
    { value: 'UPDATE', label: 'تحديث', icon: '🔄' },
    { value: 'ANALYSIS', label: 'تحليل', icon: '📈' },
    { value: 'SUMMARY', label: 'ملخص', icon: '📋' },
    { value: 'TECHNICAL', label: 'تقني', icon: '🔧' },
    { value: 'DOCUMENTATION', label: 'توثيق', icon: '📚' },
    { value: 'USER_GUIDE', label: 'دليل المستخدم', icon: '📖' },
    { value: 'DEVELOPER_GUIDE', label: 'دليل المطور', icon: '💻' },
    { value: 'ARCHITECTURE', label: 'معمارية', icon: '🏗️' },
    { value: 'SYSTEM_GUIDE', label: 'دليل النظام', icon: '⚙️' },
    { value: 'COMPREHENSIVE', label: 'شامل', icon: '📋' }
  ];

  formData: Partial<Report> = this.getEmptyFormData();

  private apiUrl = `${environment.apiUrl}/api/reports`;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadReports();
  }

  getEmptyFormData(): Partial<Report> {
    return {
      title: '',
      summary: '',
      type: ReportType.DOCUMENTATION,
      format: ReportFormat.MARKDOWN,
      status: ReportStatus.DRAFT,
      content: '',
      category: '',
      tags: []
    };
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
        console.error('Error loading reports:', error);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredReports = this.reports.filter(report => {
      const matchesSearch = !this.searchQuery || 
        report.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (report.summary && report.summary.toLowerCase().includes(this.searchQuery.toLowerCase()));
      const matchesType = !this.filterType || report.type === this.filterType;
      const matchesFormat = !this.filterFormat || report.format === this.filterFormat;
      const matchesStatus = !this.filterStatus || report.status === this.filterStatus;
      return matchesSearch && matchesType && matchesFormat && matchesStatus;
    });
  }

  getPublishedReports() {
    return this.reports.filter(r => r.status === ReportStatus.PUBLISHED);
  }

  getDraftReports() {
    return this.reports.filter(r => r.status === ReportStatus.DRAFT);
  }

  getTodayReports() {
    const today = new Date().toDateString();
    return this.reports.filter(r => new Date(r.createdAt).toDateString() === today);
  }

  openCreateDialog() {
    this.editingReport = null;
    this.formData = this.getEmptyFormData();
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
        },
        error: (error) => console.error('Error updating report:', error)
      });
    } else {
      this.http.post(this.apiUrl, this.formData).subscribe({
        next: () => {
          this.loadReports();
          this.closeDialog();
        },
        error: (error) => console.error('Error creating report:', error)
      });
    }
  }

  viewReport(report: Report) {
    // TODO: Navigate to report view page
    console.log('View report:', report);
  }

  deleteReport(report: Report) {
    if (confirm(`هل أنت متأكد من حذف التقرير "${report.title}"؟`)) {
      this.http.delete(`${this.apiUrl}/${report.id}`).subscribe({
        next: () => this.loadReports(),
        error: (error) => console.error('Error deleting report:', error)
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
    window.URL.revokeObjectURL(url);
  }

  getTypeIcon(type: ReportType): string {
    const typeConfig = this.reportTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : '📄';
  }

  getTypeLabel(type: ReportType): string {
    const typeConfig = this.reportTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.label : type;
  }

  getStatusLabel(status: ReportStatus): string {
    const labels: Record<ReportStatus, string> = {
      [ReportStatus.DRAFT]: '📝 مسودة',
      [ReportStatus.PUBLISHED]: '✅ منشور',
      [ReportStatus.ARCHIVED]: '📁 مؤرشف'
    };
    return labels[status] || status;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
