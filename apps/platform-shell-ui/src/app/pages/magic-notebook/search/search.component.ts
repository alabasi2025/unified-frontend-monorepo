import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MagicNotebookService } from '../../../services/magic-notebook.service';

interface SearchResult {
  id: string;
  type: 'page' | 'section' | 'idea' | 'task' | 'note';
  title: string;
  description: string;
  content: string;
  matchedText: string;
  createdAt: string;
  icon: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  notebookId: string = '';
  searchQuery: string = '';
  results: SearchResult[] = [];
  filteredResults: SearchResult[] = [];
  filterType: string = 'all';
  isSearching: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notebookService: MagicNotebookService
  ) {}

  ngOnInit() {
    this.notebookId = this.route.snapshot.paramMap.get('id') || '';
  }

  performSearch() {
    if (!this.searchQuery.trim()) {
      this.results = [];
      this.filteredResults = [];
      return;
    }

    this.isSearching = true;

    // Simulate search delay
    setTimeout(() => {
      // Mock data - replace with actual service call
      this.results = [
        {
          id: '1',
          type: 'page' as const,
          title: 'مقدمة المشروع',
          description: 'نظرة عامة على المشروع',
          content: 'هذا المشروع يهدف إلى...',
          matchedText: '...المشروع يهدف إلى تطوير نظام...',
          createdAt: new Date().toISOString(),
          icon: '📄'
        },
        {
          id: '2',
          type: 'idea' as const,
          title: 'تحسين الأداء',
          description: 'أفكار لتحسين أداء النظام',
          content: 'يمكن تحسين الأداء عن طريق...',
          matchedText: '...تحسين الأداء عن طريق استخدام cache...',
          createdAt: new Date().toISOString(),
          icon: '💡'
        },
        {
          id: '3',
          type: 'task' as const,
          title: 'تطوير API',
          description: 'تطوير REST APIs',
          content: 'المهام المطلوبة لتطوير API...',
          matchedText: '...تطوير REST APIs للنظام...',
          createdAt: new Date().toISOString(),
          icon: '✅'
        }
      ].filter(item =>
        item.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      this.applyFilter();
      this.isSearching = false;
    }, 500);
  }

  applyFilter() {
    if (this.filterType === 'all') {
      this.filteredResults = [...this.results];
    } else {
      this.filteredResults = this.results.filter(r => r.type === this.filterType);
    }
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'page': '#4facfe',
      'section': '#43e97b',
      'idea': '#fa709a',
      'task': '#a78bfa',
      'note': '#fbbf24'
    };
    return colors[type] || '#667eea';
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'page': 'صفحة',
      'section': 'قسم',
      'idea': 'فكرة',
      'task': 'مهمة',
      'note': 'ملاحظة'
    };
    return labels[type] || type;
  }

  highlightMatch(text: string): string {
    if (!this.searchQuery.trim()) return text;
    
    const regex = new RegExp(`(${this.searchQuery})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  openResult(result: SearchResult) {
    // Navigate to the result
    const routes: { [key: string]: string } = {
      'page': 'pages',
      'section': 'sections',
      'idea': 'ideas',
      'task': 'tasks',
      'note': 'sticky-notes'
    };
    
    const route = routes[result.type];
    if (route) {
      this.router.navigate(['/magic-notebook', this.notebookId, route]);
    }
  }

  goBack() {
    this.router.navigate(['/magic-notebook', this.notebookId]);
  }
}
