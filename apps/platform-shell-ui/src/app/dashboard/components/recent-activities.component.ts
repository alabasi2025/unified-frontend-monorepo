import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card.component';
import { TimelineModule } from 'primeng/timeline';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-recent-activities',
  standalone: true,
  imports: [CommonModule, CardComponent, TimelineModule, AvatarModule],
  template: `
    <app-card header="الأنشطة الأخيرة">
      <p-timeline [value]="activities" align="right">
        <ng-template pTemplate="content" let-activity>
          <div class="activity-item">
            <div class="activity-header">
              <span class="activity-title">{{ activity.title }}</span>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
            <p class="activity-description">{{ activity.description }}</p>
            <span class="activity-user">{{ activity.user }}</span>
          </div>
        </ng-template>
        <ng-template pTemplate="marker" let-activity>
          <i [class]="activity.icon" [style.color]="activity.color"></i>
        </ng-template>
      </p-timeline>
    </app-card>
  `,
  styles: [`
    .activity-item {
      padding-bottom: 1rem;
    }

    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .activity-title {
      font-weight: 600;
      color: var(--text-color);
    }

    .activity-time {
      font-size: 0.75rem;
      color: var(--text-color-secondary);
    }

    .activity-description {
      margin: 0.5rem 0;
      font-size: 0.875rem;
      color: var(--text-color-secondary);
    }

    .activity-user {
      font-size: 0.75rem;
      color: var(--primary-color);
    }

    :host ::ng-deep .p-timeline-event-marker {
      border: 2px solid var(--primary-color);
      background: white;
    }
  `]
})
export class RecentActivitiesComponent implements OnInit {
  activities = [
    {
      title: 'فاتورة بيع جديدة',
      description: 'تم إنشاء فاتورة بيع رقم #INV-2024-001',
      user: 'أحمد محمد',
      time: 'منذ 5 دقائق',
      icon: 'pi pi-file-invoice',
      color: '#42A5F5'
    },
    {
      title: 'موظف جديد',
      description: 'تم إضافة موظف جديد إلى قسم المبيعات',
      user: 'سارة أحمد',
      time: 'منذ 30 دقيقة',
      icon: 'pi pi-user-plus',
      color: '#66BB6A'
    },
    {
      title: 'طلب شراء معتمد',
      description: 'تم اعتماد طلب شراء رقم #PO-2024-045',
      user: 'محمد علي',
      time: 'منذ ساعة',
      icon: 'pi pi-check-circle',
      color: '#FFA726'
    },
    {
      title: 'تحديث المخزون',
      description: 'تم تحديث كميات المخزون للمنتج A',
      user: 'فاطمة حسن',
      time: 'منذ ساعتين',
      icon: 'pi pi-box',
      color: '#AB47BC'
    }
  ];

  ngOnInit() {}
}
