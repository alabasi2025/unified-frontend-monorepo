import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';

interface Notebook {
  id: string;
  title: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-notebooks-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    FormsModule,
    TooltipModule
  ],
  template: `
    <div class="notebooks-container">
      <div class="header">
        <h1>📚 دفاتر الملاحظات الذكية</h1>
        <p-button 
          label="إنشاء دفتر جديد" 
          icon="pi pi-plus" 
          (onClick)="openCreateDialog()"
          styleClass="p-button-success">
        </p-button>
      </div>

      <div class="notebooks-grid" *ngIf="!loading && notebooks.length > 0">
        <p-card 
          *ngFor="let notebook of notebooks" 
          class="notebook-card"
          (click)="openNotebook(notebook)">
          <ng-template pTemplate="header">
            <div class="card-header">
              <i class="pi pi-book" style="font-size: 2rem; color: #3b82f6;"></i>
            </div>
          </ng-template>
          
          <ng-template pTemplate="title">
            <h3>{{ notebook.title }}</h3>
          </ng-template>
          
          <ng-template pTemplate="subtitle">
            <small>{{ notebook.createdAt | date: 'dd/MM/yyyy' }}</small>
          </ng-template>
          
          <ng-template pTemplate="content">
            <p *ngIf="notebook.description">{{ notebook.description }}</p>
            <p *ngIf="!notebook.description" class="no-description">لا يوجد وصف</p>
          </ng-template>
          
          <ng-template pTemplate="footer">
            <div class="card-actions">
              <p-button 
                icon="pi pi-trash" 
                styleClass="p-button-danger p-button-text p-button-sm"
                (onClick)="deleteNotebook(notebook, $event)"
                pTooltip="حذف">
              </p-button>
            </div>
          </ng-template>
        </p-card>
      </div>

      <div class="empty-state" *ngIf="!loading && notebooks.length === 0">
        <i class="pi pi-book" style="font-size: 4rem; color: #cbd5e1;"></i>
        <h2>لا توجد دفاتر بعد</h2>
        <p>ابدأ بإنشاء دفتر ملاحظات جديد</p>
        <p-button 
          label="إنشاء دفتر" 
          icon="pi pi-plus" 
          (onClick)="openCreateDialog()">
        </p-button>
      </div>

      <div class="loading-state" *ngIf="loading">
        <i class="pi pi-spin pi-spinner" style="font-size: 3rem;"></i>
        <p>جاري التحميل...</p>
      </div>
    </div>

    <!-- Create Notebook Dialog -->
    <p-dialog 
      [(visible)]="showCreateDialog" 
      header="إنشاء دفتر جديد"
      [modal]="true"
      [style]="{width: '500px'}"
      [draggable]="false"
      [resizable]="false">
      
      <div class="dialog-content">
        <div class="field">
          <label for="title">عنوان الدفتر *</label>
          <input 
            id="title"
            type="text" 
            pInputText 
            [(ngModel)]="newNotebook.title"
            placeholder="مثال: دفتر المشاريع"
            class="w-full">
        </div>

        <div class="field">
          <label for="description">الوصف</label>
          <textarea 
            id="description"
            pInputTextarea 
            [(ngModel)]="newNotebook.description"
            placeholder="وصف مختصر للدفتر..."
            rows="3"
            class="w-full">
          </textarea>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button 
          label="إلغاء" 
          icon="pi pi-times" 
          (onClick)="showCreateDialog = false"
          styleClass="p-button-text">
        </p-button>
        <p-button 
          label="إنشاء" 
          icon="pi pi-check" 
          (onClick)="createNotebook()"
          [disabled]="!newNotebook.title.trim()">
        </p-button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .notebooks-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      font-size: 2rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .notebooks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .notebook-card {
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid #e2e8f0;
    }

    .notebook-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      padding: 1.5rem;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .no-description {
      color: #94a3b8;
      font-style: italic;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-state h2 {
      color: #64748b;
      margin: 1rem 0;
    }

    .empty-state p {
      color: #94a3b8;
      margin-bottom: 2rem;
    }

    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #64748b;
    }

    .dialog-content {
      padding: 1rem 0;
    }

    .field {
      margin-bottom: 1.5rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #334155;
    }

    .w-full {
      width: 100%;
    }
  `]
})
export class NotebooksListComponent implements OnInit {
  notebooks: Notebook[] = [];
  loading = false;
  showCreateDialog = false;
  newNotebook = {
    title: '',
    description: ''
  };
  private apiUrl = 'http://72.61.111.217:3000/api/smart-notebook';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadNotebooks();
  }

  loadNotebooks() {
    this.loading = true;
    this.http.get<Notebook[]>(`${this.apiUrl}/notebooks`).subscribe({
      next: (notebooks) => {
        this.notebooks = notebooks;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notebooks:', error);
        this.loading = false;
      }
    });
  }

  openCreateDialog() {
    this.showCreateDialog = true;
    this.newNotebook = { title: '', description: '' };
  }

  createNotebook() {
    if (!this.newNotebook.title.trim()) {
      return;
    }

    this.http.post<Notebook>(`${this.apiUrl}/notebooks`, this.newNotebook).subscribe({
      next: (notebook) => {
        this.notebooks.push(notebook);
        this.showCreateDialog = false;
        this.newNotebook = { title: '', description: '' };
      },
      error: (error) => {
        console.error('Error creating notebook:', error);
      }
    });
  }

  openNotebook(notebook: Notebook) {
    // TODO: Navigate to notebook detail
    console.log('Opening notebook:', notebook);
  }

  deleteNotebook(notebook: Notebook, event: Event) {
    event.stopPropagation();
    
    if (confirm(`هل تريد حذف الدفتر "${notebook.title}"؟`)) {
      this.http.delete<void>(`${this.apiUrl}/notebooks/${notebook.id}`).subscribe({
        next: () => {
          this.notebooks = this.notebooks.filter(n => n.id !== notebook.id);
        },
        error: (error) => {
          console.error('Error deleting notebook:', error);
        }
      });
    }
  }
}
