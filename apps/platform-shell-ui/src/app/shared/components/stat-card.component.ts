import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <div class="stat-card" [class]="'stat-card-' + color">
      <div class="stat-card-icon">
        <i [class]="icon"></i>
      </div>
      <div class="stat-card-content">
        <div class="stat-card-value">{{ value }}</div>
        <div class="stat-card-label">{{ label }}</div>
        <div class="stat-card-change" *ngIf="change !== undefined" [class.positive]="change >= 0" [class.negative]="change < 0">
          <i [class]="change >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
          <span>{{ Math.abs(change) }}%</span>
          <span class="stat-card-change-label">{{ changeLabel }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
      border-radius: 8px;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .stat-card-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      color: white;
    }

    .stat-card-primary .stat-card-icon { background: var(--primary-color); }
    .stat-card-success .stat-card-icon { background: var(--green-500); }
    .stat-card-danger .stat-card-icon { background: var(--red-500); }
    .stat-card-warning .stat-card-icon { background: var(--orange-500); }
    .stat-card-info .stat-card-icon { background: var(--blue-500); }

    .stat-card-content {
      flex: 1;
    }

    .stat-card-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-color);
      line-height: 1;
      margin-bottom: 0.25rem;
    }

    .stat-card-label {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
      margin-bottom: 0.5rem;
    }

    .stat-card-change {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .stat-card-change.positive {
      color: var(--green-500);
    }

    .stat-card-change.negative {
      color: var(--red-500);
    }

    .stat-card-change-label {
      color: var(--text-color-secondary);
      font-weight: 400;
      margin-left: 0.25rem;
    }
  `]
})
export class StatCardComponent {
  @Input() icon: string = 'pi pi-chart-line';
  @Input() label: string = '';
  @Input() value: string | number = 0;
  @Input() change: number | undefined;
  @Input() changeLabel: string = 'من الشهر الماضي';
  @Input() color: 'primary' | 'success' | 'danger' | 'warning' | 'info' = 'primary';

  Math = Math;
}
