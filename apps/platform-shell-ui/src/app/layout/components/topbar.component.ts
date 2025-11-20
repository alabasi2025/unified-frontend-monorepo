import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <div class="topbar">
      <div class="topbar-left">
        <button
          *ngIf="showBackButton"
          pButton
          icon="pi pi-arrow-right"
          class="p-button-text p-button-rounded"
          [routerLink]="backRoute"
        ></button>
        <h2 class="topbar-title">{{ title }}</h2>
      </div>
      
      <div class="topbar-right">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 0;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--surface-border);
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .topbar-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-color);
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    @media (max-width: 768px) {
      .topbar {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .topbar-title {
        font-size: 1.25rem;
      }
    }
  `]
})
export class TopbarComponent {
  @Input() title: string = '';
  @Input() showBackButton: boolean = false;
  @Input() backRoute: string = '/';
}
