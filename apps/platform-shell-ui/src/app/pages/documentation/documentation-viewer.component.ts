import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { TreeModule } from 'primeng/tree';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MessageService, TreeNode } from 'primeng/api';

// Markdown
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-documentation-viewer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardModule,
    TabViewModule,
    TreeModule,
    InputTextModule,
    ButtonModule,
    ChipModule,
    BadgeModule,
    DividerModule,
    ProgressBarModule,
    RatingModule,
    InputTextareaModule,
    ToastModule,
    MarkdownModule,
  ],
  providers: [MessageService],
  template: `
    <div class="documentation-container">
      <p-toast></p-toast>

      <!-- Header -->
      <div class="doc-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="pi pi-book"></i>
          </div>
          <div class="header-text">
            <h1>مركز التوثيق</h1>
            <p>دليلك الشامل لاستخدام وتطوير SEMOP</p>
          </div>
        </div>
        
        <!-- Search -->
        <div class="header-search">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input
              pInputText
              type="text"
              [(ngModel)]="searchQuery"
              (keyup.enter)="search()"
              placeholder="ابحث في التوثيق..."
              class="search-input"
            />
          </span>
          <button
            pButton
            icon="pi pi-search"
            (click)="search()"
            class="p-button-rounded"
          ></button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="doc-content">
        <!-- Sidebar -->
        <div class="doc-sidebar">
          <p-tabView>
            <!-- الأدلة -->
            <p-tabPanel header="الأدلة" leftIcon="pi pi-book">
              <div class="category-section">
                <h3>دليل المستخدم النهائي</h3>
                <p-tree
                  [value]="userGuideTree"
                  selectionMode="single"
                  [(selection)]="selectedNode"
                  (onNodeSelect)="onNodeSelect($event)"
                ></p-tree>
              </div>

              <p-divider></p-divider>

              <div class="category-section">
                <h3>دليل بناء النظام</h3>
                <p-tree
                  [value]="architectureTree"
                  selectionMode="single"
                  [(selection)]="selectedNode"
                  (onNodeSelect)="onNodeSelect($event)"
                ></p-tree>
              </div>

              <p-divider></p-divider>

              <div class="category-section">
                <h3>دليل المطور</h3>
                <p-tree
                  [value]="developerTree"
                  selectionMode="single"
                  [(selection)]="selectedNode"
                  (onNodeSelect)="onNodeSelect($event)"
                ></p-tree>
              </div>
            </p-tabPanel>

            <!-- سجل التحديثات -->
            <p-tabPanel header="التحديثات" leftIcon="pi pi-history">
              <div class="changelog-list">
                <div
                  *ngFor="let entry of changelogEntries"
                  class="changelog-item"
                  (click)="loadChangelog(entry.id)"
                >
                  <div class="changelog-version">
                    <p-chip
                      [label]="entry.version"
                      [styleClass]="getVersionClass(entry.type)"
                    ></p-chip>
                    <span class="changelog-date">{{
                      entry.releaseDate | date : 'short'
                    }}</span>
                  </div>
                  <h4>{{ entry.title }}</h4>
                  <p class="changelog-summary">{{ entry.summary }}</p>
                </div>
              </div>
            </p-tabPanel>

            <!-- تقدم المهام -->
            <p-tabPanel header="التقدم" leftIcon="pi pi-chart-line">
              <div class="progress-summary">
                <h3>ملخص التقدم</h3>
                <div class="progress-stats">
                  <div class="stat-item">
                    <span class="stat-label">الإجمالي</span>
                    <span class="stat-value">{{ progressSummary.total }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">مكتمل</span>
                    <span class="stat-value success">{{
                      progressSummary.completed
                    }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">قيد التنفيذ</span>
                    <span class="stat-value warning">{{
                      progressSummary.inProgress
                    }}</span>
                  </div>
                </div>
                <p-progressBar
                  [value]="progressSummary.completionRate"
                  [showValue]="true"
                ></p-progressBar>
              </div>

              <p-divider></p-divider>

              <div class="module-progress">
                <h3>التقدم حسب النظام</h3>
                <div
                  *ngFor="let module of taskProgress"
                  class="module-item"
                >
                  <div class="module-header">
                    <span class="module-name">{{ module.module }}</span>
                    <p-chip
                      [label]="module.status"
                      [styleClass]="getStatusClass(module.status)"
                    ></p-chip>
                  </div>
                  <p class="module-feature">{{ module.feature }}</p>
                  <p-progressBar
                    [value]="module.progress"
                    [showValue]="true"
                  ></p-progressBar>
                  <small>{{
                    module.completedTasks
                  }}/{{ module.totalTasks }} مهمة</small>
                </div>
              </div>
            </p-tabPanel>
          </p-tabView>
        </div>

        <!-- Document Viewer -->
        <div class="doc-viewer">
          <div *ngIf="!currentDocument" class="doc-empty">
            <i class="pi pi-book"></i>
            <h2>مرحباً بك في مركز التوثيق</h2>
            <p>اختر دليلاً من القائمة الجانبية للبدء</p>
            
            <div class="quick-links">
              <h3>روابط سريعة</h3>
              <div class="link-grid">
                <div class="link-card" (click)="loadQuickDoc('user-guide')">
                  <i class="pi pi-users"></i>
                  <h4>دليل المستخدم</h4>
                  <p>تعلم كيفية استخدام النظام</p>
                </div>
                <div class="link-card" (click)="loadQuickDoc('architecture')">
                  <i class="pi pi-sitemap"></i>
                  <h4>البنية المعمارية</h4>
                  <p>فهم تصميم النظام</p>
                </div>
                <div class="link-card" (click)="loadQuickDoc('developer')">
                  <i class="pi pi-code"></i>
                  <h4>دليل المطور</h4>
                  <p>ابدأ التطوير</p>
                </div>
                <div class="link-card" (click)="loadQuickDoc('changelog')">
                  <i class="pi pi-history"></i>
                  <h4>سجل التحديثات</h4>
                  <p>آخر التحديثات</p>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="currentDocument" class="doc-article">
            <!-- Document Header -->
            <div class="article-header">
              <div class="breadcrumb">
                <span class="breadcrumb-item">{{ currentDocument.category }}</span>
                <i class="pi pi-angle-left"></i>
                <span class="breadcrumb-item">{{ currentDocument.type }}</span>
              </div>
              
              <h1>{{ currentDocument.title }}</h1>
              
              <div class="article-meta">
                <p-chip
                  [label]="currentDocument.category"
                  icon="pi pi-tag"
                ></p-chip>
                <span class="meta-item">
                  <i class="pi pi-eye"></i>
                  {{ currentDocument.viewCount }} مشاهدة
                </span>
                <span class="meta-item">
                  <i class="pi pi-calendar"></i>
                  {{ currentDocument.updatedAt | date : 'short' }}
                </span>
                <span class="meta-item">
                  <i class="pi pi-bookmark"></i>
                  {{ currentDocument.version }}
                </span>
              </div>

              <div class="article-actions">
                <button
                  pButton
                  icon="pi pi-heart"
                  label="أعجبني"
                  class="p-button-text"
                  (click)="likeDocument()"
                ></button>
                <button
                  pButton
                  icon="pi pi-share-alt"
                  label="مشاركة"
                  class="p-button-text"
                ></button>
                <button
                  pButton
                  icon="pi pi-print"
                  label="طباعة"
                  class="p-button-text"
                  (click)="printDocument()"
                ></button>
              </div>
            </div>

            <p-divider></p-divider>

            <!-- Document Content -->
            <div class="article-content">
              <markdown [data]="currentDocument.content"></markdown>
            </div>

            <p-divider></p-divider>

            <!-- Feedback Section -->
            <div class="article-feedback">
              <h3>هل كان هذا المحتوى مفيداً؟</h3>
              <div class="feedback-actions">
                <p-rating
                  [(ngModel)]="feedbackRating"
                  [cancel]="false"
                ></p-rating>
                <button
                  pButton
                  label="إرسال تعليق"
                  icon="pi pi-comment"
                  (click)="showFeedbackDialog = true"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Feedback Dialog -->
      <p-dialog
        [(visible)]="showFeedbackDialog"
        header="إرسال تعليق"
        [modal]="true"
        [style]="{ width: '500px' }"
      >
        <div class="feedback-form">
          <label>تقييمك</label>
          <p-rating [(ngModel)]="feedbackRating" [cancel]="false"></p-rating>

          <label>تعليقك</label>
          <textarea
            pInputTextarea
            [(ngModel)]="feedbackComment"
            rows="5"
            placeholder="شاركنا رأيك..."
          ></textarea>

          <div class="feedback-buttons">
            <button
              pButton
              label="إرسال"
              icon="pi pi-send"
              (click)="submitFeedback()"
            ></button>
            <button
              pButton
              label="إلغاء"
              icon="pi pi-times"
              class="p-button-secondary"
              (click)="showFeedbackDialog = false"
            ></button>
          </div>
        </div>
      </p-dialog>
    </div>
  `,
  styles: [`
    .documentation-container {
      height: calc(100vh - 100px);
      display: flex;
      flex-direction: column;
      background: #f5f7fa;
    }

    /* Header */
    .doc-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
    }

    .header-text h1 {
      margin: 0;
      font-size: 2rem;
    }

    .header-text p {
      margin: 0;
      opacity: 0.9;
    }

    .header-search {
      display: flex;
      gap: 0.5rem;
    }

    .search-input {
      width: 400px;
    }

    /* Main Content */
    .doc-content {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    /* Sidebar */
    .doc-sidebar {
      width: 350px;
      background: white;
      border-left: 1px solid #e9ecef;
      overflow-y: auto;
    }

    .category-section {
      padding: 1rem;
    }

    .category-section h3 {
      margin: 0 0 1rem 0;
      color: #667eea;
      font-size: 1rem;
    }

    .changelog-list {
      padding: 1rem;
    }

    .changelog-item {
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .changelog-item:hover {
      background: #f5f7fa;
    }

    .changelog-version {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .changelog-date {
      font-size: 0.875rem;
      color: #6c757d;
    }

    .changelog-item h4 {
      margin: 0 0 0.5rem 0;
    }

    .changelog-summary {
      margin: 0;
      color: #6c757d;
      font-size: 0.875rem;
    }

    .progress-summary,
    .module-progress {
      padding: 1rem;
    }

    .progress-stats {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .stat-item {
      flex: 1;
      text-align: center;
    }

    .stat-label {
      display: block;
      font-size: 0.875rem;
      color: #6c757d;
    }

    .stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .stat-value.success {
      color: #28a745;
    }

    .stat-value.warning {
      color: #ffc107;
    }

    .module-item {
      padding: 1rem;
      border-radius: 8px;
      background: #f5f7fa;
      margin-bottom: 1rem;
    }

    .module-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .module-name {
      font-weight: 600;
    }

    .module-feature {
      margin: 0 0 0.5rem 0;
      color: #6c757d;
      font-size: 0.875rem;
    }

    /* Document Viewer */
    .doc-viewer {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
    }

    .doc-empty {
      text-align: center;
      padding: 3rem;
    }

    .doc-empty i {
      font-size: 4rem;
      color: #667eea;
      margin-bottom: 1rem;
    }

    .doc-empty h2 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
    }

    .doc-empty p {
      margin: 0 0 2rem 0;
      color: #6c757d;
    }

    .quick-links h3 {
      margin: 0 0 1rem 0;
    }

    .link-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .link-card {
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .link-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }

    .link-card i {
      font-size: 2rem;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .link-card h4 {
      margin: 0 0 0.5rem 0;
    }

    .link-card p {
      margin: 0;
      color: #6c757d;
      font-size: 0.875rem;
    }

    .doc-article {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .article-header {
      margin-bottom: 2rem;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      color: #6c757d;
      font-size: 0.875rem;
    }

    .article-header h1 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }

    .article-meta {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #6c757d;
      font-size: 0.875rem;
    }

    .article-actions {
      display: flex;
      gap: 0.5rem;
    }

    .article-content {
      line-height: 1.8;
      color: #2c3e50;
    }

    .article-content :host ::ng-deep h2 {
      margin-top: 2rem;
      color: #667eea;
    }

    .article-content :host ::ng-deep code {
      background: #f5f7fa;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: monospace;
    }

    .article-content :host ::ng-deep pre {
      background: #2c3e50;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
    }

    .article-feedback {
      text-align: center;
      padding: 2rem;
      background: #f5f7fa;
      border-radius: 8px;
    }

    .article-feedback h3 {
      margin: 0 0 1rem 0;
    }

    .feedback-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      align-items: center;
    }

    .feedback-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .feedback-form label {
      font-weight: 600;
    }

    .feedback-buttons {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }
  `],
})
export class DocumentationViewerComponent implements OnInit {
  searchQuery: string = '';
  selectedNode: TreeNode | null = null;
  currentDocument: any = null;
  changelogEntries: any[] = [];
  taskProgress: any[] = [];
  progressSummary: any = {
    total: 0,
    completed: 0,
    inProgress: 0,
    completionRate: 0,
  };

  feedbackRating: number = 5;
  feedbackComment: string = '';
  showFeedbackDialog: boolean = false;

  userGuideTree: TreeNode[] = [];
  architectureTree: TreeNode[] = [];
  developerTree: TreeNode[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadDocumentationTree();
    this.loadChangelogEntries();
    this.loadTaskProgress();
    this.loadProgressSummary();

    // Check for slug in route
    this.route.params.subscribe((params) => {
      if (params['slug']) {
        this.loadDocumentBySlug(params['slug']);
      }
    });
  }

  loadDocumentationTree() {
    // TODO: Load from API
    this.userGuideTree = [
      { label: 'نظرة عامة', data: 'user-guide-overview', icon: 'pi pi-home' },
      { label: 'البدء السريع', data: 'user-guide-quickstart', icon: 'pi pi-bolt' },
      // ... more items
    ];

    this.architectureTree = [
      { label: 'الفكرة الأساسية', data: 'architecture-concept', icon: 'pi pi-lightbulb' },
      { label: 'البنية المعمارية', data: 'architecture-structure', icon: 'pi pi-sitemap' },
      // ... more items
    ];

    this.developerTree = [
      { label: 'البدء السريع', data: 'developer-quickstart', icon: 'pi pi-bolt' },
      { label: 'خطوات التطوير', data: 'developer-steps', icon: 'pi pi-list' },
      // ... more items
    ];
  }

  loadChangelogEntries() {
    this.http
      .get<any[]>('/api/documentation/changelog/all?isPublished=true')
      .subscribe({
        next: (data) => {
          this.changelogEntries = data;
        },
        error: (error) => {
          console.error('Error loading changelog:', error);
        },
      });
  }

  loadTaskProgress() {
    this.http.get<any[]>('/api/documentation/task-progress/all').subscribe({
      next: (data) => {
        this.taskProgress = data;
      },
      error: (error) => {
        console.error('Error loading task progress:', error);
      },
    });
  }

  loadProgressSummary() {
    this.http.get<any>('/api/documentation/task-progress/summary').subscribe({
      next: (data) => {
        this.progressSummary = data;
      },
      error: (error) => {
        console.error('Error loading progress summary:', error);
      },
    });
  }

  onNodeSelect(event: any) {
    const slug = event.node.data;
    this.loadDocumentBySlug(slug);
  }

  loadDocumentBySlug(slug: string) {
    this.http.get<any>(`/api/documentation/slug/${slug}`).subscribe({
      next: (data) => {
        this.currentDocument = data;
      },
      error: (error) => {
        console.error('Error loading document:', error);
      },
    });
  }

  loadChangelog(id: string) {
    this.http.get<any>(`/api/documentation/changelog/${id}`).subscribe({
      next: (data) => {
        // Display changelog
        this.currentDocument = {
          title: data.title,
          content: this.formatChangelog(data),
          category: 'CHANGELOG',
          type: 'RELEASE_NOTES',
          viewCount: 0,
          updatedAt: data.releaseDate,
          version: data.version,
        };
      },
      error: (error) => {
        console.error('Error loading changelog:', error);
      },
    });
  }

  formatChangelog(data: any): string {
    let content = `# ${data.title}\n\n`;
    content += `**الإصدار:** ${data.version}\n`;
    content += `**التاريخ:** ${new Date(data.releaseDate).toLocaleDateString('ar-EG')}\n\n`;
    content += `## الملخص\n\n${data.summary}\n\n`;

    if (data.features && data.features.length > 0) {
      content += `## ✨ ميزات جديدة\n\n`;
      data.features.forEach((f: string) => {
        content += `- ${f}\n`;
      });
      content += '\n';
    }

    if (data.improvements && data.improvements.length > 0) {
      content += `## 🔧 تحسينات\n\n`;
      data.improvements.forEach((i: string) => {
        content += `- ${i}\n`;
      });
      content += '\n';
    }

    if (data.bugFixes && data.bugFixes.length > 0) {
      content += `## 🐛 إصلاحات\n\n`;
      data.bugFixes.forEach((b: string) => {
        content += `- ${b}\n`;
      });
      content += '\n';
    }

    return content;
  }

  search() {
    if (!this.searchQuery.trim()) return;

    this.http
      .get<any[]>(`/api/documentation/search/query?q=${this.searchQuery}`)
      .subscribe({
        next: (results) => {
          // Display search results
          console.log('Search results:', results);
        },
        error: (error) => {
          console.error('Error searching:', error);
        },
      });
  }

  loadQuickDoc(type: string) {
    const slugMap: any = {
      'user-guide': 'user-guide-overview',
      architecture: 'system-architecture',
      developer: 'developer-guide',
      changelog: 'changelog',
    };

    this.loadDocumentBySlug(slugMap[type]);
  }

  likeDocument() {
    if (!this.currentDocument) return;

    this.http
      .post(`/api/documentation/${this.currentDocument.id}/like`, {})
      .subscribe({
        next: () => {
          this.currentDocument.likeCount++;
          this.messageService.add({
            severity: 'success',
            summary: 'شكراً',
            detail: 'تم تسجيل إعجابك',
          });
        },
      });
  }

  printDocument() {
    window.print();
  }

  submitFeedback() {
    if (!this.currentDocument) return;

    this.http
      .post('/api/documentation/feedback', {
        documentId: this.currentDocument.id,
        userId: 'current-user-id', // TODO: Get from auth
        userName: 'Current User',
        rating: this.feedbackRating,
        comment: this.feedbackComment,
        type: 'SUGGESTION',
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'شكراً',
            detail: 'تم إرسال تعليقك بنجاح',
          });
          this.showFeedbackDialog = false;
          this.feedbackComment = '';
        },
        error: (error) => {
          console.error('Error submitting feedback:', error);
        },
      });
  }

  getVersionClass(type: string): string {
    const classes: any = {
      MAJOR: 'p-chip-danger',
      MINOR: 'p-chip-warning',
      PATCH: 'p-chip-info',
      HOTFIX: 'p-chip-success',
    };
    return classes[type] || '';
  }

  getStatusClass(status: string): string {
    const classes: any = {
      COMPLETED: 'p-chip-success',
      IN_PROGRESS: 'p-chip-warning',
      NOT_STARTED: 'p-chip-secondary',
      ON_HOLD: 'p-chip-info',
      CANCELLED: 'p-chip-danger',
    };
    return classes[status] || '';
  }
}
