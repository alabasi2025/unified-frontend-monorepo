import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../shared';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-hr-widget',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, ButtonModule],
  template: `
    <app-card header="الموارد البشرية">
      <div class="hr-stats">
        <div class="hr-stat-item">
          <i class="pi pi-users stat-icon"></i>
          <div class="stat-content">
            <span class="stat-value">156</span>
            <span class="stat-label">إجمالي الموظفين</span>
          </div>
        </div>

        <div class="hr-stat-item">
          <i class="pi pi-clock stat-icon"></i>
          <div class="stat-content">
            <span class="stat-value">142</span>
            <span class="stat-label">حاضر اليوم</span>
          </div>
        </div>

        <div class="hr-stat-item">
          <i class="pi pi-calendar-times stat-icon"></i>
          <div class="stat-content">
            <span class="stat-value">8</span>
            <span class="stat-label">في إجازة</span>
          </div>
        </div>

        <div class="hr-stat-item">
          <i class="pi pi-exclamation-circle stat-icon"></i>
          <div class="stat-content">
            <span class="stat-value">6</span>
            <span class="stat-label">غائب</span>
          </div>
        </div>
      </div>
      <button
        pButton
        label="عرض التفاصيل"
        icon="pi pi-arrow-left"
        class="p-button-text w-full mt-3"
        routerLink="/hr/employees"
      ></button>
    </app-card>
  `,
  styles: [`
    .hr-stats {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .hr-stat-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--surface-ground);
      border-radius: 6px;
    }

    .stat-icon {
      font-size: 2rem;
      color: var(--primary-color);
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-color);
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
    }
  `]
})
export class HrWidgetComponent implements OnInit {
  ngOnInit() {}
}
