import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface ChatLog {
  id: string;
  title: string;
  summary?: string;
  content: string;
  messageCount: number;
  topic: string;
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-chat-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chats-container">
      <div class="page-header">
        <div class="header-content">
          <h1>💬 سجل المحادثات مع Manus</h1>
          <p class="subtitle">أرشيف كامل لجميع المحادثات والحوارات</p>
        </div>
        <button class="btn-primary" (click)="openCreateDialog()">
          ➕ حفظ محادثة جديدة
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">💬</div>
          <div class="stat-content">
            <div class="stat-value">{{ chats.length }}</div>
            <div class="stat-label">إجمالي المحادثات</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-content">
            <div class="stat-value">{{ getFavoriteChats().length }}</div>
            <div class="stat-label">محادثات مميزة</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <div class="stat-value">{{ getTodayChats().length }}</div>
            <div class="stat-label">اليوم</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-value">{{ getTotalMessages() }}</div>
            <div class="stat-label">إجمالي الرسائل</div>
          </div>
        </div>
      </div>

      <div class="filters-section">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (input)="applyFilters()"
            placeholder="🔍 ابحث في المحادثات..."
            class="search-input"
          />
        </div>
        <div class="filter-controls">
          <button 
            class="filter-btn" 
            [class.active]="filterView === 'all'"
            (click)="setFilterView('all')"
          >
            📁 الكل ({{ chats.length }})
          </button>
          <button 
            class="filter-btn" 
            [class.active]="filterView === 'favorite'"
            (click)="setFilterView('favorite')"
          >
            ⭐ مميزة ({{ getFavoriteChats().length }})
          </button>
          <select [(ngModel)]="filterTopic" (change)="applyFilters()" class="filter-select">
            <option value="">كل المواضيع</option>
            <option value="DEVELOPMENT">تطوير</option>
            <option value="BUG_FIX">إصلاحات</option>
            <option value="PLANNING">تخطيط</option>
            <option value="DISCUSSION">نقاش</option>
          </select>
        </div>
      </div>

      <div class="chats-list" *ngIf="!loading && filteredChats.length > 0">
        <div 
          *ngFor="let chat of filteredChats" 
          class="chat-card"
          [class.favorite]="chat.isFavorite"
        >
          <div class="chat-header">
            <div class="chat-title-section">
              <div class="title-row">
                <span class="favorite-icon" (click)="toggleFavorite(chat)">
                  {{ chat.isFavorite ? '⭐' : '☆' }}
                </span>
                <h3 class="chat-title">{{ chat.title }}</h3>
              </div>
              <p class="chat-summary" *ngIf="chat.summary">{{ chat.summary }}</p>
              <div class="chat-badges">
                <span class="badge badge-topic">{{ getTopicLabel(chat.topic) }}</span>
                <span class="badge badge-messages">💬 {{ chat.messageCount }} رسالة</span>
              </div>
            </div>
            <div class="chat-actions">
              <button class="btn-icon" (click)="viewChat(chat)" title="عرض">
                👁️
              </button>
              <button class="btn-icon" (click)="editChat(chat)" title="تعديل">
                ✏️
              </button>
              <button class="btn-icon" (click)="exportChat(chat)" title="تصدير">
                📥
              </button>
              <button class="btn-icon" (click)="linkToTask(chat)" title="ربط بمهمة">
                🔗
              </button>
              <button class="btn-icon btn-delete" (click)="deleteChat(chat)" title="حذف">
                🗑️
              </button>
            </div>
          </div>
          
          <div class="chat-footer">
            <div class="chat-meta">
              <span class="meta-item">📅 {{ formatDate(chat.createdAt) }}</span>
              <span class="meta-item">🕐 {{ formatTime(chat.createdAt) }}</span>
            </div>
            <div class="chat-tags" *ngIf="chat.tags && chat.tags.length > 0">
              <span *ngFor="let tag of chat.tags" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredChats.length === 0">
        <div class="empty-icon">💬</div>
        <h3>لا توجد محادثات</h3>
        <p>ابدأ بحفظ محادثة جديدة</p>
        <button class="btn-primary" (click)="openCreateDialog()">
          ➕ حفظ محادثة
        </button>
      </div>

      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>جاري التحميل...</p>
      </div>

      <!-- Dialog -->
      <div class="dialog-overlay" *ngIf="showDialog" (click)="closeDialog()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>{{ editingChat ? 'تعديل المحادثة' : 'حفظ محادثة جديدة' }}</h2>
            <button class="btn-close" (click)="closeDialog()">✕</button>
          </div>
          
          <form (ngSubmit)="saveChat()" class="dialog-form">
            <div class="form-group">
              <label>العنوان *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.title" 
                name="title"
                placeholder="عنوان المحادثة"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>ملخص</label>
              <textarea 
                [(ngModel)]="formData.summary" 
                name="summary"
                placeholder="ملخص قصير للمحادثة..."
                rows="2"
                class="form-textarea"
              ></textarea>
            </div>

            <div class="form-group">
              <label>المحتوى الكامل *</label>
              <textarea 
                [(ngModel)]="formData.content" 
                name="content"
                placeholder="المحادثة الكاملة..."
                rows="8"
                required
                class="form-textarea"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>الموضوع *</label>
                <select [(ngModel)]="formData.topic" name="topic" required class="form-select">
                  <option value="DEVELOPMENT">تطوير</option>
                  <option value="BUG_FIX">إصلاحات</option>
                  <option value="PLANNING">تخطيط</option>
                  <option value="DISCUSSION">نقاش</option>
                </select>
              </div>

              <div class="form-group">
                <label>عدد الرسائل</label>
                <input 
                  type="number" 
                  [(ngModel)]="formData.messageCount" 
                  name="messageCount"
                  placeholder="0"
                  min="0"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label>
                <input 
                  type="checkbox" 
                  [(ngModel)]="formData.isFavorite" 
                  name="isFavorite"
                />
                إضافة نجمة (محادثة مميزة)
              </label>
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
              <button type="button" class="btn-secondary" (click)="closeDialog()">
                إلغاء
              </button>
              <button type="submit" class="btn-primary" [disabled]="!formData.title || !formData.content">
                {{ editingChat ? 'حفظ التعديلات' : 'حفظ المحادثة' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chats-container {
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
      border-left: 4px solid #3b82f6;
    }

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

    .filter-btn {
      padding: 0.75rem 1.5rem;
      border: 2px solid #e5e7eb;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-btn.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .filter-select {
      flex: 1;
      min-width: 200px;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
    }

    .chats-list {
      display: grid;
      gap: 1.5rem;
    }

    .chat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-right: 4px solid #e5e7eb;
      transition: all 0.2s;
    }

    .chat-card.favorite {
      border-right-color: #fbbf24;
      background: linear-gradient(to left, #fffbeb, white);
    }

    .chat-card:hover {
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .favorite-icon {
      font-size: 1.5rem;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .favorite-icon:hover {
      transform: scale(1.2);
    }

    .chat-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .chat-summary {
      color: #6b7280;
      margin: 0.5rem 0;
      font-size: 0.875rem;
    }

    .chat-badges {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 0.5rem;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .badge-topic {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge-messages {
      background: #f3f4f6;
      color: #4b5563;
    }

    .chat-actions {
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

    .btn-delete {
      background: #fee2e2;
    }

    .btn-delete:hover {
      background: #fecaca;
    }

    .chat-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .chat-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .chat-tags {
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
      max-width: 700px;
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

    .btn-close {
      padding: 0.5rem;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
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

    .dialog-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    @media (max-width: 768px) {
      .chats-container {
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

      .form-row {
        grid-template-columns: 1fr;
      }

      .chat-header {
        flex-direction: column;
        gap: 1rem;
      }

      .chat-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class ChatLogsComponent implements OnInit {
  chats: ChatLog[] = [];
  filteredChats: ChatLog[] = [];
  loading = false;
  showDialog = false;
  editingChat: ChatLog | null = null;

  searchQuery = '';
  filterView: 'all' | 'favorite' = 'all';
  filterTopic = '';

  formData: Partial<ChatLog> = {
    title: '',
    summary: '',
    content: '',
    messageCount: 0,
    topic: 'DEVELOPMENT',
    isFavorite: false,
    tags: []
  };
  tagsInput = '';

  private apiUrl = `${environment.apiUrl}/api/smart-notebook/chat-logs`;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadChats();
  }

  loadChats() {
    this.loading = true;
    this.http.get<ChatLog[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.chats = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading chats:', error);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredChats = this.chats.filter(chat => {
      const matchesSearch = !this.searchQuery || 
        chat.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (chat.summary && chat.summary.toLowerCase().includes(this.searchQuery.toLowerCase()));
      
      const matchesView = this.filterView === 'all' || 
        (this.filterView === 'favorite' && chat.isFavorite);
      
      const matchesTopic = !this.filterTopic || chat.topic === this.filterTopic;

      return matchesSearch && matchesView && matchesTopic;
    });
  }

  setFilterView(view: 'all' | 'favorite') {
    this.filterView = view;
    this.applyFilters();
  }

  getFavoriteChats(): ChatLog[] {
    return this.chats.filter(chat => chat.isFavorite);
  }

  getTodayChats(): ChatLog[] {
    const today = new Date().toDateString();
    return this.chats.filter(chat => new Date(chat.createdAt).toDateString() === today);
  }

  getTotalMessages(): number {
    return this.chats.reduce((sum, chat) => sum + chat.messageCount, 0);
  }

  toggleFavorite(chat: ChatLog) {
    this.http.post(`${this.apiUrl}/${chat.id}/favorite`, {}).subscribe({
      next: () => this.loadChats(),
      error: (error) => console.error('Error toggling favorite:', error)
    });
  }

  openCreateDialog() {
    this.editingChat = null;
    this.formData = {
      title: '',
      summary: '',
      content: '',
      messageCount: 0,
      topic: 'DEVELOPMENT',
      isFavorite: false,
      tags: []
    };
    this.tagsInput = '';
    this.showDialog = true;
  }

  editChat(chat: ChatLog) {
    this.editingChat = chat;
    this.formData = { ...chat };
    this.tagsInput = chat.tags.join(', ');
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.editingChat = null;
  }

  saveChat() {
    if (this.tagsInput) {
      this.formData.tags = this.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    if (this.editingChat) {
      this.http.patch(`${this.apiUrl}/${this.editingChat.id}`, this.formData).subscribe({
        next: () => {
          this.loadChats();
          this.closeDialog();
        },
        error: (error) => console.error('Error updating chat:', error)
      });
    } else {
      this.http.post(this.apiUrl, this.formData).subscribe({
        next: () => {
          this.loadChats();
          this.closeDialog();
        },
        error: (error) => console.error('Error creating chat:', error)
      });
    }
  }

  viewChat(chat: ChatLog) {
    console.log('View chat:', chat);
  }

  deleteChat(chat: ChatLog) {
    if (confirm('هل أنت متأكد من حذف هذه المحادثة؟')) {
      this.http.delete(`${this.apiUrl}/${chat.id}`).subscribe({
        next: () => this.loadChats(),
        error: (error) => console.error('Error deleting chat:', error)
      });
    }
  }

  exportChat(chat: ChatLog) {
    const blob = new Blob([chat.content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chat.title}.txt`;
    a.click();
  }

  linkToTask(chat: ChatLog) {
    console.log('Link to task:', chat);
  }

  getTopicLabel(topic: string): string {
    const labels: Record<string, string> = {
      'DEVELOPMENT': 'تطوير',
      'BUG_FIX': 'إصلاحات',
      'PLANNING': 'تخطيط',
      'DISCUSSION': 'نقاش'
    };
    return labels[topic] || topic;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
