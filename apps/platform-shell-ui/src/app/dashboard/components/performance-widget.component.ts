import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card.component';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-performance-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, KnobModule],
  template: `
    <app-card header="مؤشرات الأداء">
      <div class="performance-grid">
        <div class="performance-item">
          <p-knob [(ngModel)]="salesTarget" [readonly]="true" valueColor="#42A5F5"></p-knob>
          <span class="performance-label">هدف المبيعات</span>
        </div>
        <div class="performance-item">
          <p-knob [(ngModel)]="collectionRate" [readonly]="true" valueColor="#66BB6A"></p-knob>
          <span class="performance-label">معدل التحصيل</span>
        </div>
        <div class="performance-item">
          <p-knob [(ngModel)]="customerSatisfaction" [readonly]="true" valueColor="#FFA726"></p-knob>
          <span class="performance-label">رضا العملاء</span>
        </div>
      </div>
    </app-card>
  `,
  styles: [`
    .performance-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 2rem;
      text-align: center;
    }

    .performance-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .performance-label {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
    }
  `]
})
export class PerformanceWidgetComponent implements OnInit {
  salesTarget = 75;
  collectionRate = 82;
  customerSatisfaction = 90;

  ngOnInit() {}
}
