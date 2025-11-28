import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 24px; direction: rtl;">
      <button (click)="goBack()" style="padding: 8px 16px; background: #f0f0f0; border: none; border-radius: 8px; cursor: pointer;">العودة</button>
      <h1>البحث المتقدم</h1>
      <p>قريباً...</p>
    </div>
  `
})
export class SearchComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}
  
  goBack(): void {
    const notebookId = this.route.snapshot.params['id'];
    this.router.navigate(['/magic-notebook', notebookId]);
  }
}
