import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';

interface NotebookPage {
  id: string;
  title: string;
  content: string;
  section?: string;
  tags: string[];
  color?: string;
  icon?: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
    DialogModule
  ],
  template: `
    <div class="notebook-pages-container">
      <div class="header">
        <div class="title-section">
          <h1><i class="pi pi-book"></i> صفحات الدفتر</h1>
          <p>نظّم أفكارك ومعلوماتك في صفحات منظمة</p>
        </div>
        <button pButton label="صفحة جديدة" icon="pi pi-plus" (click)="showDialog = true"></button>
      </div>

      <div class="filters">
        <div class="search-box">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input type="text" pInputText placeholder="ابحث في الصفحات..." [(ngModel)]="searchTerm" />
          </span>
        </div>
        <div class="filter-chips">
          <p-chip label="الكل" [styleClass]="selectedFilter === 'all' ? 'active' : ''" (click)="selectedFilter = 'all'"></p-chip>
          <p-chip label="مثبتة" icon="pi pi-bookmark" [styleClass]="selectedFilter === 'pinned' ? 'active' : ''" (click)="selectedFilter = 'pinned'"></p-chip>
          <p-chip label="مؤرشفة" icon="pi pi-inbox" [styleClass]="selectedFilter === 'archived' ? 'active' : ''" (click)="selectedFilter = 'archived'"></p-chip>
        </div>
      </div>

      <div class="pages-grid">
        <p-card *ngFor="let page of filteredPages" [styleClass]="'page-card ' + (page.color || 'default')">
          <ng-template pTemplate="header">
            <div class="card-header">
              <div class="page-icon">
                <i [class]="page.icon || 'pi pi-file'"></i>
              </div>
              <div class="actions">
                <button pButton icon="pi pi-bookmark" class="p-button-text p-button-sm" 
                        [class.pinned]="page.isPinned" (click)="togglePin(page)"></button>
                <button pButton icon="pi pi-ellipsis-v" class="p-button-text p-button-sm"></button>
              </div>
            </div>
          </ng-template>
          
          <h3>{{ page.title }}</h3>
          <p class="content-preview">{{ page.content.substring(0, 150) }}...</p>
          
          <div class="tags" *ngIf="page.tags.length > 0">
            <p-tag *ngFor="let tag of page.tags" [value]="tag" severity="info"></p-tag>
          </div>
          
          <ng-template pTemplate="footer">
            <div class="card-footer">
              <small>{{ page.updatedAt | date:'short' }}</small>
              <button pButton label="فتح" icon="pi pi-arrow-left" class="p-button-sm"></button>
            </div>
          </ng-template>
        </p-card>
      </div>

      <p-dialog header="صفحة جديدة" [(visible)]="showDialog" [modal]="true" [style]="{width: '50vw'}">
        <div class="dialog-content">
          <div class="field">
            <label>العنوان</label>
            <input type="text" pInputText [(ngModel)]="newPage.title" placeholder="عنوان الصفحة" />
          </div>
          <div class="field">
            <label>المحتوى</label>
            <textarea [(ngModel)]="newPage.content" rows="10" placeholder="اكتب محتوى الصفحة هنا..." style="width: 100%"></textarea>
          </div>
          <div class="field">
            <label>الوسوم</label>
            <input type="text" pInputText [(ngModel)]="newPage.tags" placeholder="أضف وسوم مفصولة بفواصل" />
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton label="إلغاء" icon="pi pi-times" class="p-button-text" (click)="showDialog = false"></button>
          <button pButton label="حفظ" icon="pi pi-check" (click)="savePage()"></button>
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
      color: #2c3e50;
      display: flex;
      align-items: center;
      gap: 0.5rem;
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
      background: #667eea;
      color: white;
    }

    .pages-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .page-card {
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .page-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
    }

    .page-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.2rem;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .actions button.pinned {
      color: #f39c12;
    }

    h3 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }

    .content-preview {
      color: #7f8c8d;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #ecf0f1;
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

    .dialog-content input,
    .dialog-content textarea {
      width: 100%;
    }
  `]
})
export class NotebookPagesComponent implements OnInit {
  pages: NotebookPage[] = [];
  filteredPages: NotebookPage[] = [];
  searchTerm: string = '';
  selectedFilter: string = 'all';
  showDialog: boolean = false;
  newPage: any = {
    title: '',
    content: '',
    tags: ''
  };

  ngOnInit() {
    this.loadPages();
  }

  loadPages() {
    // TODO: استدعاء API للحصول على الصفحات
    this.pages = [
      {
        id: '1',
        title: 'خطة تطوير نظام الخرائط',
        content: 'هذه الصفحة تحتوي على خطة تطوير نظام الخرائط الجغرافية...',
        section: 'مشاريع',
        tags: ['خرائط', 'تطوير', 'خطة'],
        color: 'blue',
        icon: 'pi pi-map',
        isPinned: true,
        isArchived: false,
        createdAt: new Date('2025-11-20'),
        updatedAt: new Date('2025-11-23')
      },
      {
        id: '2',
        title: 'ملاحظات اجتماع الفريق',
        content: 'تم مناقشة التالي في اجتماع اليوم...',
        section: 'اجتماعات',
        tags: ['اجتماع', 'فريق'],
        color: 'green',
        icon: 'pi pi-users',
        isPinned: false,
        isArchived: false,
        createdAt: new Date('2025-11-22'),
        updatedAt: new Date('2025-11-22')
      }
    ];
    this.filterPages();
  }

  filterPages() {
    let filtered = this.pages;

    if (this.selectedFilter === 'pinned') {
      filtered = filtered.filter(p => p.isPinned);
    } else if (this.selectedFilter === 'archived') {
      filtered = filtered.filter(p => p.isArchived);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(p => 
        p.title.includes(this.searchTerm) || 
        p.content.includes(this.searchTerm)
      );
    }

    this.filteredPages = filtered;
  }

  togglePin(page: NotebookPage) {
    page.isPinned = !page.isPinned;
    // TODO: استدعاء API لتحديث الحالة
  }

  savePage() {
    // TODO: استدعاء API لحفظ الصفحة
    this.showDialog = false;
    this.newPage = { title: '', content: '', tags: '' };
  }
}
