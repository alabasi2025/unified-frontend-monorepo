import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { NotebookPagesService, NotebookPage } from '../../../services/notebook-pages.service';

@Component({
  selector: 'app-notebook-pages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    TagModule,
    ChipModule,
    DialogModule,
    ProgressSpinnerModule,
    MessageModule
  ],
  template: `
    <div class="notebook-pages-container">
      <div class="header">
        <div class="title-section">
          <h1><i class="pi pi-book"></i> صفحات الدفتر</h1>
          <p>نظّم أفكارك ومعلوماتك في صفحات منظمة</p>
        </div>
        <button pButton label="صفحة جديدة" icon="pi pi-plus" (click)="openCreateDialog()"></button>
      </div>

      <p-message *ngIf="errorMessage" severity="error" [text]="errorMessage"></p-message>

      <div class="filters">
        <div class="search-box">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input type="text" pInputText placeholder="ابحث في الصفحات..." 
                   [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange()" />
          </span>
        </div>
        <div class="filter-chips">
          <p-chip label="الكل" [styleClass]="selectedFilter === 'all' ? 'active' : ''" 
                  (click)="setFilter('all')"></p-chip>
          <p-chip label="مثبتة" icon="pi pi-bookmark" 
                  [styleClass]="selectedFilter === 'pinned' ? 'active' : ''" 
                  (click)="setFilter('pinned')"></p-chip>
          <p-chip label="مؤرشفة" icon="pi pi-inbox" 
                  [styleClass]="selectedFilter === 'archived' ? 'active' : ''" 
                  (click)="setFilter('archived')"></p-chip>
        </div>
      </div>

      <div *ngIf="loading" class="loading-container">
        <p-progressSpinner></p-progressSpinner>
      </div>

      <div class="pages-grid" *ngIf="!loading">
        <p-card *ngFor="let page of pages" styleClass="page-card">
          <ng-template pTemplate="header">
            <div class="card-header">
              <div class="page-icon">
                <i class="pi pi-file"></i>
              </div>
              <div class="actions">
                <button pButton [icon]="page.isPinned ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'" 
                        class="p-button-text p-button-sm" 
                        [class.pinned]="page.isPinned" 
                        (click)="togglePin(page)"></button>
                <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm" 
                        (click)="openEditDialog(page)"></button>
                <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" 
                        (click)="deletePage(page)"></button>
              </div>
            </div>
          </ng-template>
          
          <h3>{{ page.title }}</h3>
          <p class="content-preview">{{ page.content?.substring(0, 150) }}...</p>
          
          <div class="tags" *ngIf="page.tags && page.tags.length > 0">
            <p-tag *ngFor="let tag of page.tags" [value]="tag" severity="info"></p-tag>
          </div>
          
          <ng-template pTemplate="footer">
            <div class="card-footer">
              <small>{{ page.updatedAt | date:'short' }}</small>
              <button pButton label="فتح" icon="pi pi-arrow-left" class="p-button-sm" 
                      (click)="openEditDialog(page)"></button>
            </div>
          </ng-template>
        </p-card>

        <div *ngIf="pages.length === 0 && !loading" class="empty-state">
          <i class="pi pi-book" style="font-size: 4rem; color: #ccc;"></i>
          <p>لا توجد صفحات بعد</p>
          <button pButton label="إنشاء صفحة جديدة" icon="pi pi-plus" (click)="openCreateDialog()"></button>
        </div>
      </div>

      <p-dialog [header]="editingPage ? 'تعديل الصفحة' : 'صفحة جديدة'" 
                [(visible)]="showDialog" [modal]="true" [style]="{width: '50vw'}">
        <div class="dialog-content">
          <div class="field">
            <label>العنوان</label>
            <input type="text" pInputText [(ngModel)]="currentPage.title" 
                   placeholder="عنوان الصفحة" class="w-full" />
          </div>
          <div class="field">
            <label>المحتوى</label>
            <textarea pInputText [(ngModel)]="currentPage.content" 
                      placeholder="اكتب محتوى الصفحة هنا..." 
                      rows="10" class="w-full"></textarea>
          </div>
          <div class="field">
            <label>الوسوم (افصل بفاصلة)</label>
            <input type="text" pInputText [(ngModel)]="tagsInput" 
                   placeholder="مثال: عمل, مهم, مشروع" class="w-full" />
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="إلغاء" icon="pi pi-times" class="p-button-text" 
                  (click)="closeDialog()"></button>
          <button pButton [label]="editingPage ? 'حفظ التعديلات' : 'إنشاء'" 
                  icon="pi pi-check" (click)="savePage()" 
                  [loading]="saving"></button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .notebook-pages-container {
      padding: 2rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .title-section h1 {
      margin: 0;
      font-size: 2rem;
      color: #2c3e50;
    }
    .title-section p {
      margin: 0.5rem 0 0 0;
      color: #7f8c8d;
    }
    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .search-box {
      flex: 1;
      min-width: 300px;
    }
    .filter-chips {
      display: flex;
      gap: 0.5rem;
    }
    .filter-chips ::ng-deep .p-chip.active {
      background: #3b82f6;
      color: white;
    }
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }
    .pages-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }
    .page-card {
      transition: transform 0.2s;
    }
    .page-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .page-icon {
      font-size: 2rem;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    .actions button {
      color: white !important;
    }
    .actions button.pinned {
      color: #ffd700 !important;
    }
    .content-preview {
      color: #7f8c8d;
      line-height: 1.6;
      margin: 1rem 0;
    }
    .tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .empty-state {
      text-align: center;
      padding: 4rem;
      color: #7f8c8d;
    }
    .empty-state p {
      margin: 1rem 0;
      font-size: 1.2rem;
    }
    .dialog-content .field {
      margin-bottom: 1.5rem;
    }
    .dialog-content label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #2c3e50;
    }
    .w-full {
      width: 100%;
    }
    textarea {
      resize: vertical;
      font-family: inherit;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  `]
})
export class NotebookPagesComponent implements OnInit {
  pages: NotebookPage[] = [];
  searchTerm = '';
  selectedFilter: 'all' | 'pinned' | 'archived' = 'all';
  showDialog = false;
  loading = false;
  saving = false;
  errorMessage = '';
  
  currentPage: Partial<NotebookPage> = {};
  editingPage: NotebookPage | null = null;
  tagsInput = '';

  constructor(private pagesService: NotebookPagesService) {}

  ngOnInit() {
    this.loadPages();
  }

  loadPages() {
    this.loading = true;
    this.errorMessage = '';
    
    const filters: any = {};
    if (this.searchTerm) filters.search = this.searchTerm;
    if (this.selectedFilter === 'pinned') filters.isPinned = true;
    if (this.selectedFilter === 'archived') filters.isArchived = true;

    this.pagesService.getPages(filters).subscribe({
      next: (response) => {
        this.pages = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pages:', error);
        this.errorMessage = 'فشل تحميل الصفحات. يرجى المحاولة مرة أخرى.';
        this.loading = false;
        // Fallback to mock data for development
        this.loadMockData();
      }
    });
  }

  loadMockData() {
    this.pages = [
      {
        id: '1',
        title: 'خطة تطوير نظام الخرائط',
        content: 'هذه الصفحة تحتوي على خطة تطوير نظام الخرائط الجديد...',
        tags: ['عمل', 'مشروع', 'خرائط'],
        isPinned: true,
        isArchived: false,
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'ملاحظات اجتماع الفريق',
        content: 'ملاحظات من اجتماع الفريق بتاريخ...',
        tags: ['اجتماع', 'فريق'],
        isPinned: false,
        isArchived: false,
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  onSearchChange() {
    this.loadPages();
  }

  setFilter(filter: 'all' | 'pinned' | 'archived') {
    this.selectedFilter = filter;
    this.loadPages();
  }

  openCreateDialog() {
    this.editingPage = null;
    this.currentPage = {
      title: '',
      content: '',
      tags: [],
      isPinned: false,
      isArchived: false
    };
    this.tagsInput = '';
    this.showDialog = true;
  }

  openEditDialog(page: NotebookPage) {
    this.editingPage = page;
    this.currentPage = { ...page };
    this.tagsInput = page.tags?.join(', ') || '';
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.editingPage = null;
    this.currentPage = {};
    this.tagsInput = '';
  }

  savePage() {
    if (!this.currentPage.title || !this.currentPage.content) {
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة';
      return;
    }

    this.saving = true;
    this.currentPage.tags = this.tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const operation = this.editingPage
      ? this.pagesService.updatePage(this.editingPage.id, this.currentPage)
      : this.pagesService.createPage(this.currentPage);

    operation.subscribe({
      next: () => {
        this.saving = false;
        this.closeDialog();
        this.loadPages();
      },
      error: (error) => {
        console.error('Error saving page:', error);
        this.errorMessage = 'فشل حفظ الصفحة. يرجى المحاولة مرة أخرى.';
        this.saving = false;
      }
    });
  }

  togglePin(page: NotebookPage) {
    const operation = page.isPinned
      ? this.pagesService.unpinPage(page.id)
      : this.pagesService.pinPage(page.id);

    operation.subscribe({
      next: () => {
        this.loadPages();
      },
      error: (error) => {
        console.error('Error toggling pin:', error);
        this.errorMessage = 'فشل تثبيت/إلغاء تثبيت الصفحة';
      }
    });
  }

  deletePage(page: NotebookPage) {
    if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟')) {
      return;
    }

    this.pagesService.deletePage(page.id).subscribe({
      next: () => {
        this.loadPages();
      },
      error: (error) => {
        console.error('Error deleting page:', error);
        this.errorMessage = 'فشل حذف الصفحة';
      }
    });
  }
}
