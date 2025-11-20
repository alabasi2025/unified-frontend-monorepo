import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb.component';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbComponent, ButtonModule],
  template: `
    <div class="page-header">
      <app-breadcrumb [items]="breadcrumbItems" *ngIf="breadcrumbItems.length > 0"></app-breadcrumb>
      
      <div class="page-header-content">
        <div class="page-header-text">
          <button 
            *ngIf="showBackButton" 
            pButton 
            icon="pi pi-arrow-right" 
            class="p-button-text p-button-sm"
            [routerLink]="backRoute"
            style="margin-left: 0.5rem"
          ></button>
          <i [class]="icon" class="page-header-icon" *ngIf="icon"></i>
          <div>
            <h1 class="page-header-title">{{ title }}</h1>
            <p class="page-header-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
          </div>
        </div>
        
        <div class="page-header-actions" *ngIf="hasActions">
          <ng-content select="[actions]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: 2rem;
    }

    .page-header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
    }

    .page-header-text {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .page-header-icon {
      font-size: 2rem;
      color: var(--primary-color);
    }

    .page-header-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-color);
      margin: 0;
    }

    .page-header-subtitle {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
      margin: 0.25rem 0 0 0;
    }

    .page-header-actions {
      display: flex;
      gap: 0.5rem;
    }

    @media (max-width: 768px) {
      .page-header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() icon: string = '';
  @Input() breadcrumbItems: MenuItem[] = [];
  @Input() hasActions: boolean = false;
  @Input() showBackButton: boolean = false;
  @Input() backRoute: string = '/';

  constructor(private router: Router) {}
}
