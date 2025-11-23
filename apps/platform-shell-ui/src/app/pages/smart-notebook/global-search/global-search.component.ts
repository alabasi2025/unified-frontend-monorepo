import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'idea' | 'conversation' | 'report' | 'task';
  category?: string;
  createdAt: string;
  relevance: number;
}

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="global-search-container">
      <div class="search-header">
        <h2>🔍 البحث الشامل</h2>
        <p>ابحث في جميع محتويات Smart Notebook</p>
      </div>

      <div class="search-box">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (input)="onSearchChange()"
          placeholder="🔍 ابحث في الأفكار، المحادثات، التقارير، والمهام..."
          class="search-input"
        />
        <button *ngIf="searchQuery" (click)="clearSearch()" class="clear-btn">✕</button>
      </div>

      <div class="search-filters">
        <button
          *ngFor="let type of searchTypes"
          [class.active]="selectedType === type.value"
          (click)="selectType(type.value)"
          class="filter-btn"
        >
          {{ type.icon }} {{ type.label }}
        </button>
      </div>

      <div class="search-stats" *ngIf="searchResults.length > 0">
        <span>📊 عثر على {{ searchResults.length }} نتيجة</span>
        <span>⏱️ {{ searchTime }}ms</span>
      </div>

      <div class="search-results" *ngIf="!isSearching">
        <div *ngIf="searchResults.length === 0 && searchQuery" class="no-results">
          <p>❌ لم يتم العثور على نتائج</p>
          <p>جرب استخدام كلمات مفتاحية مختلفة</p>
        </div>

        <div *ngIf="searchResults.length === 0 && !searchQuery" class="empty-state">
          <p>🔍 ابدأ البحث للعثور على ما تحتاجه</p>
        </div>

        <div
          *ngFor="let result of searchResults"
          class="result-card"
          (click)="openResult(result)"
        >
          <div class="result-header">
            <span class="result-type" [class]="'type-' + result.type">
              {{ getTypeIcon(result.type) }} {{ getTypeLabel(result.type) }}
            </span>
            <span class="result-date">{{ formatDate(result.createdAt) }}</span>
          </div>
          <h3 class="result-title">{{ result.title }}</h3>
          <p class="result-content" [innerHTML]="highlightText(result.content)"></p>
          <div class="result-footer">
            <span *ngIf="result.category" class="result-category">🏷️ {{ result.category }}</span>
            <span class="result-relevance">📊 {{ (result.relevance * 100).toFixed(0) }}% ملاءمة</span>
          </div>
        </div>
      </div>

      <div *ngIf="isSearching" class="loading">
        <div class="spinner"></div>
        <p>جاري البحث...</p>
      </div>
    </div>
  `,
  styles: [`
    .global-search-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .search-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .search-header h2 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .search-box {
      position: relative;
      margin-bottom: 1.5rem;
    }

    .search-input {
      width: 100%;
      padding: 1rem 3rem 1rem 1rem;
      font-size: 1.1rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      transition: all 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .clear-btn {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: #e2e8f0;
      border: none;
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .clear-btn:hover {
      background: #cbd5e0;
    }

    .search-filters {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 0.5rem 1rem;
      border: 2px solid #e2e8f0;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .filter-btn:hover {
      border-color: #667eea;
      background: #f7fafc;
    }

    .filter-btn.active {
      border-color: #667eea;
      background: #667eea;
      color: white;
    }

    .search-stats {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem;
      background: #f7fafc;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: #4a5568;
    }

    .result-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .result-card:hover {
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
      transform: translateY(-2px);
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .result-type {
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .type-idea { background: #fef3c7; color: #92400e; }
    .type-conversation { background: #dbeafe; color: #1e40af; }
    .type-report { background: #d1fae5; color: #065f46; }
    .type-task { background: #fce7f3; color: #9f1239; }

    .result-date {
      font-size: 0.85rem;
      color: #718096;
    }

    .result-title {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
      color: #1a202c;
    }

    .result-content {
      color: #4a5568;
      line-height: 1.6;
      margin-bottom: 0.75rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .result-content mark {
      background: #fef3c7;
      padding: 0.1rem 0.2rem;
      border-radius: 3px;
    }

    .result-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      color: #718096;
    }

    .empty-state, .no-results {
      text-align: center;
      padding: 3rem;
      color: #718096;
    }

    .loading {
      text-align: center;
      padding: 3rem;
    }

    .spinner {
      border: 3px solid #e2e8f0;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class GlobalSearchComponent implements OnInit {
  searchQuery = '';
  selectedType: string | null = null;
  searchResults: SearchResult[] = [];
  isSearching = false;
  searchTime = 0;

  searchTypes = [
    { value: null, label: 'الكل', icon: '🔍' },
    { value: 'idea', label: 'الأفكار', icon: '💡' },
    { value: 'conversation', label: 'المحادثات', icon: '💬' },
    { value: 'report', label: 'التقارير', icon: '📊' },
    { value: 'task', label: 'المهام', icon: '✅' }
  ];

  private searchTimeout: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {}

  onSearchChange() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      if (this.searchQuery.trim()) {
        this.performSearch();
      } else {
        this.searchResults = [];
      }
    }, 300);
  }

  selectType(type: string | null) {
    this.selectedType = type;
    if (this.searchQuery.trim()) {
      this.performSearch();
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
  }

  async performSearch() {
    this.isSearching = true;
    const startTime = Date.now();

    try {
      const params: any = { q: this.searchQuery };
      if (this.selectedType) {
        params.type = this.selectedType;
      }

      const response = await this.http.get<SearchResult[]>(
        `${environment.apiUrl}/api/search/global`,
        { params }
      ).toPromise();

      this.searchResults = response || [];
      this.searchTime = Date.now() - startTime;
    } catch (error) {
      console.error('Search error:', error);
      this.searchResults = [];
    } finally {
      this.isSearching = false;
    }
  }

  getTypeIcon(type: string): string {
    const icons: any = {
      idea: '💡',
      conversation: '💬',
      report: '📊',
      task: '✅'
    };
    return icons[type] || '📄';
  }

  getTypeLabel(type: string): string {
    const labels: any = {
      idea: 'فكرة',
      conversation: 'محادثة',
      report: 'تقرير',
      task: 'مهمة'
    };
    return labels[type] || type;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  highlightText(text: string): string {
    if (!this.searchQuery) return text;
    
    const regex = new RegExp(`(${this.searchQuery})`, 'gi');
    return text.substring(0, 200).replace(regex, '<mark>$1</mark>') + '...';
  }

  openResult(result: SearchResult) {
    const routes: any = {
      idea: '/smart-notebook/ideas',
      conversation: '/smart-notebook/conversations',
      report: '/smart-notebook/reports',
      task: '/smart-notebook/tasks'
    };
    
    const route = routes[result.type];
    if (route) {
      this.router.navigate([route], { queryParams: { id: result.id } });
    }
  }
}
