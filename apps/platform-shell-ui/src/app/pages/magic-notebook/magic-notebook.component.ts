import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MagicNotebookService } from '../../services/magic-notebook.service';

@Component({
  selector: 'app-magic-notebook',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './magic-notebook.component.html',
  styleUrls: ['./magic-notebook.component.scss']
})
export class MagicNotebookComponent implements OnInit {
  notebooks: any[] = [];
  loading = false;

  constructor(private magicNotebookService: MagicNotebookService) {}

  ngOnInit() {
    this.loadNotebooks();
  }

  loadNotebooks() {
    this.loading = true;
    this.magicNotebookService.getNotebooks().subscribe({
      next: (data) => {
        this.notebooks = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notebooks:', error);
        this.loading = false;
      }
    });
  }

  createNotebook() {
    const title = prompt('أدخل عنوان الدفتر:');
    if (title) {
      this.magicNotebookService.createNotebook({ title, createdBy: 'admin' }).subscribe({
        next: () => this.loadNotebooks(),
        error: (error) => console.error(error)
      });
    }
  }
}
