import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../shared/components/card.component';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-notifications-widget',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, BadgeModule, ButtonModule],
  template: `
    <app-card header="الإشعارات">
      <div class="notifications-list">
        <div *ngFor="let notification of notifications" class="notification-item" [class.unread]="!notification.read">
          <div class="notification-icon" [style.background-color]="notification.color">
            <i [class]="notification.icon"></i>
          </div>
          <div class="notification-content">
            <span class="notification-title">{{ notification.title }}</span>
            <span class="notification-time">{{ notification.time }}</span>
          </div>
          <i *ngIf="!notification.read" class="pi pi-circle-fill unread-indicator"></i>
        </div>
      </div>
      <button
        pButton
        label="عرض الكل"
        icon="pi pi-arrow-left"
        class="p-button-text w-full mt-3"
      ></button>
    </app-card>
  `,
  styles: [`
    .notifications-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .notification-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 6px;
      transition: background 0.2s;
    }

    .notification-item:hover {
      background: var(--surface-hover);
    }

    .notification-item.unread {
      background: var(--primary-50);
    }

    .notification-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .notification-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .notification-title {
      font-size: 0.875rem;
      color: var(--text-color);
    }

    .notification-time {
      font-size: 0.75rem;
      color: var(--text-color-secondary);
    }

    .unread-indicator {
      font-size: 0.5rem;
      color: var(--primary-color);
    }
  `]
})
export class NotificationsWidgetComponent implements OnInit {
  notifications = [
    {
      title: 'فاتورة جديدة بانتظار الموافقة',
      time: 'منذ 10 دقائق',
      icon: 'pi pi-file-invoice',
      color: '#42A5F5',
      read: false
    },
    {
      title: 'تم اعتماد طلب الإجازة',
      time: 'منذ ساعة',
      icon: 'pi pi-check',
      color: '#66BB6A',
      read: false
    },
    {
      title: 'تنبيه: مخزون منخفض',
      time: 'منذ ساعتين',
      icon: 'pi pi-exclamation-triangle',
      color: '#FFA726',
      read: true
    }
  ];

  ngOnInit() {}
}
