import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../shared/components/card.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, ButtonModule],
  template: `
    <app-card header="إجراءات سريعة">
      <div class="quick-actions-grid">
        <button
          *ngFor="let action of actions"
          pButton
          [label]="action.label"
          [icon]="action.icon"
          class="p-button-outlined quick-action-btn"
          [routerLink]="action.route"
        ></button>
      </div>
    </app-card>
  `,
  styles: [`
    .quick-actions-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .quick-action-btn {
      justify-content: flex-start;
      text-align: right;
    }

    :host ::ng-deep .quick-action-btn .p-button-label {
      flex: 1;
      text-align: right;
    }
  `]
})
export class QuickActionsComponent {
  actions = [
    { label: 'إنشاء فاتورة بيع', icon: 'pi pi-file-invoice', route: '/sales/invoices/new' },
    { label: 'إضافة موظف', icon: 'pi pi-user-plus', route: '/hr/employees/new' },
    { label: 'طلب شراء جديد', icon: 'pi pi-shopping-cart', route: '/purchases/orders/new' },
    { label: 'قيد يومية', icon: 'pi pi-book', route: '/accounting/journal-entries/new' },
    { label: 'حركة مخزون', icon: 'pi pi-arrows-h', route: '/inventory/movements/new' },
    { label: 'تقرير مالي', icon: 'pi pi-chart-bar', route: '/reports/financial' }
  ];
}
