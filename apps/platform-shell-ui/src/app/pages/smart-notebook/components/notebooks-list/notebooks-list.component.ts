import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotebookService } from '../../services/notebook.service';

interface Notebook {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  sectionsCount?: number;
  pagesCount?: number;
}

@Component({
  selector: 'app-notebooks-list',
  templateUrl: './notebooks-list.component.html',
  styleUrls: ['./notebooks-list.component.scss']
})
export class NotebooksListComponent implements OnInit {
  notebooks: Notebook[] = [];
  loading = false;
  searchQuery = '';

  constructor(
    private notebookService: NotebookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNotebooks();
  }

  loadNotebooks(): void {
    this.loading = true;
    this.notebookService.getAll().subscribe({
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

  openNotebook(notebookId: string): void {
    this.router.navigate(['/smart-notebook/notebooks', notebookId]);
  }

  createNotebook(): void {
    const title = prompt('عنوان الدفتر الجديد:');
    if (title) {
      this.notebookService.create({ title }).subscribe({
        next: (notebook) => {
          this.notebooks.unshift(notebook);
          this.openNotebook(notebook.id);
        },
        error: (error) => {
          console.error('Error creating notebook:', error);
          alert('فشل إنشاء الدفتر');
        }
      });
    }
  }

  deleteNotebook(notebookId: string, event: Event): void {
    event.stopPropagation();
    if (confirm('هل أنت متأكد من حذف هذا الدفتر؟')) {
      this.notebookService.delete(notebookId).subscribe({
        next: () => {
          this.notebooks = this.notebooks.filter(n => n.id !== notebookId);
        },
        error: (error) => {
          console.error('Error deleting notebook:', error);
          alert('فشل حذف الدفتر');
        }
      });
    }
  }

  get filteredNotebooks(): Notebook[] {
    if (!this.searchQuery) {
      return this.notebooks;
    }
    return this.notebooks.filter(n =>
      n.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
