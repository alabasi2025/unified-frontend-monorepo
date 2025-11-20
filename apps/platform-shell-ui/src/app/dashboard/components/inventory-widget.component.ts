import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../shared/components/card.component';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-inventory-widget',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, ButtonModule, TagModule],
  template: `
    <app-card header="حالة المخزون">
      <div class="inventory-list">
        <div *ngFor="let item of inventoryItems" class="inventory-item">
          <div class="item-info">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-quantity">{{ item.quantity }} {{ item.unit }}</span>
          </div>
          <p-tag
            [value]="item.status"
            [severity]="getStatusSeverity(item.status)"
          ></p-tag>
        </div>
      </div>
      <button
        pButton
        label="عرض الكل"
        icon="pi pi-arrow-left"
        class="p-button-text w-full mt-3"
        routerLink="/inventory/items"
      ></button>
    </app-card>
  `,
  styles: [`
    .inventory-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .inventory-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--surface-ground);
      border-radius: 6px;
    }

    .item-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .item-name {
      font-weight: 600;
      color: var(--text-color);
    }

    .item-quantity {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
    }
  `]
})
export class InventoryWidgetComponent implements OnInit {
  inventoryItems = [
    { name: 'منتج A', quantity: 150, unit: 'قطعة', status: 'متوفر' },
    { name: 'منتج B', quantity: 25, unit: 'قطعة', status: 'منخفض' },
    { name: 'منتج C', quantity: 0, unit: 'قطعة', status: 'نفذ' },
    { name: 'منتج D', quantity: 500, unit: 'قطعة', status: 'متوفر' }
  ];

  ngOnInit() {}

  getStatusSeverity(status: string): string {
    const severityMap: Record<string, string> = {
      'متوفر': 'success',
      'منخفض': 'warning',
      'نفذ': 'danger'
    };
    return severityMap[status] || 'info';
  }
}
