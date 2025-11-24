import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { NotificationsService, Notification } from '../../services/notifications.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    BadgeModule,
    OverlayPanelModule,
    ScrollPanelModule
  ],
  template: `
    <div class="notifications-container">
      <button 
        pButton 
        icon="pi pi-bell" 
        class="p-button-rounded p-button-text notifications-btn"
        (click)="op.toggle($event)"
        [pBadge]="unreadCount > 0 ? unreadCount.toString() : ''"
        badgeSeverity="danger">
      </button>

      <p-overlayPanel #op [style]="{width: '400px'}">
        <ng-template pTemplate="content">
          <div class="notifications-panel">
            <div class="panel-header">
              <h3>الإشعارات</h3>
              <button 
                pButton 
                label="تحديد الكل كمقروء" 
                class="p-button-text p-button-sm"
                (click)="markAllAsRead()"
                *ngIf="unreadCount > 0">
              </button>
            </div>

            <div class="notifications-list" *ngIf="notifications.length > 0">
              <div 
                *ngFor="let notification of notifications" 
                class="notification-item"
                [class.unread]="!notification.isRead"
                (click)="handleNotificationClick(notification)">
                
                <div class="notification-icon" [class]="'icon-' + notification.type">
                  <i [class]="getNotificationIcon(notification.type)"></i>
                </div>

                <div class="notification-content">
                  <h4>{{ notification.title }}</h4>
                  <p>{{ notification.message }}</p>
                  <small>{{ getTimeAgo(notification.createdAt) }}</small>
                </div>

                <button 
                  pButton 
                  icon="pi pi-times" 
                  class="p-button-text p-button-sm p-button-rounded delete-btn"
                  (click)="deleteNotification(notification, $event)">
                </button>
              </div>
            </div>

            <div class="empty-state" *ngIf="notifications.length === 0">
              <i class="pi pi-bell-slash" style="font-size: 3rem; color: #ccc;"></i>
              <p>لا توجد إشعارات</p>
            </div>

            <div class="panel-footer" *ngIf="notifications.length > 0">
              <button pButton label="عرض الكل" class="p-button-text" (click)="viewAllNotifications()"></button>
            </div>
          </div>
        </ng-template>
      </p-overlayPanel>
    </div>
  `,
  styles: [`
    .notifications-btn {
      position: relative;
    }
    .notifications-panel {
      max-height: 500px;
      display: flex;
      flex-direction: column;
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #e9ecef;
    }
    .panel-header h3 {
      margin: 0;
      font-size: 1.2rem;
      color: #2c3e50;
    }
    .notifications-list {
      max-height: 400px;
      overflow-y: auto;
    }
    .notification-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-bottom: 1px solid #f1f3f5;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }
    .notification-item:hover {
      background: #f8f9fa;
    }
    .notification-item.unread {
      background: #e3f2fd;
    }
    .notification-item.unread::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #2196f3;
    }
    .notification-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .icon-info {
      background: #e3f2fd;
      color: #2196f3;
    }
    .icon-success {
      background: #e8f5e9;
      color: #4caf50;
    }
    .icon-warning {
      background: #fff3e0;
      color: #ff9800;
    }
    .icon-error {
      background: #ffebee;
      color: #f44336;
    }
    .notification-content {
      flex: 1;
    }
    .notification-content h4 {
      margin: 0 0 0.25rem 0;
      font-size: 0.95rem;
      color: #2c3e50;
    }
    .notification-content p {
      margin: 0 0 0.5rem 0;
      font-size: 0.85rem;
      color: #7f8c8d;
      line-height: 1.4;
    }
    .notification-content small {
      color: #95a5a6;
      font-size: 0.75rem;
    }
    .delete-btn {
      opacity: 0;
      transition: opacity 0.2s;
    }
    .notification-item:hover .delete-btn {
      opacity: 1;
    }
    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: #7f8c8d;
    }
    .empty-state p {
      margin-top: 1rem;
    }
    .panel-footer {
      padding: 1rem;
      border-top: 1px solid #e9ecef;
      text-align: center;
    }
  `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  private subscription?: Subscription;

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit() {
    this.loadNotifications();
    this.loadUnreadCount();
    this.subscribeToNewNotifications();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadNotifications() {
    this.notificationsService.getNotifications({ limit: 10 }).subscribe({
      next: (response) => {
        this.notifications = response.data;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.loadMockNotifications();
      }
    });
  }

  loadMockNotifications() {
    this.notifications = [
      {
        id: '1',
        title: 'مهمة جديدة',
        message: 'تم تعيين مهمة جديدة لك: مراجعة كود نظام الخرائط',
        type: 'info',
        isRead: false,
        userId: '1',
        createdAt: new Date(Date.now() - 5 * 60000), // 5 minutes ago
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'تم إكمال مهمة',
        message: 'تم إكمال مهمة "تطوير واجهة المستخدم" بنجاح',
        type: 'success',
        isRead: false,
        userId: '1',
        createdAt: new Date(Date.now() - 30 * 60000), // 30 minutes ago
        updatedAt: new Date()
      },
      {
        id: '3',
        title: 'تعليق جديد',
        message: 'علق أحمد على فكرتك "نظام الإشعارات المتقدم"',
        type: 'info',
        isRead: true,
        userId: '1',
        createdAt: new Date(Date.now() - 2 * 3600000), // 2 hours ago
        updatedAt: new Date()
      }
    ];
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
  }

  loadUnreadCount() {
    this.notificationsService.getUnreadCount().subscribe({
      next: (count) => {
        this.unreadCount = count;
      },
      error: (error) => {
        console.error('Error loading unread count:', error);
      }
    });
  }

  subscribeToNewNotifications() {
    this.subscription = this.notificationsService.onNewNotification().subscribe({
      next: (notification) => {
        this.notifications.unshift(notification);
        this.unreadCount++;
        this.showBrowserNotification(notification);
      },
      error: (error) => {
        console.error('Error in notification subscription:', error);
      }
    });
  }

  showBrowserNotification(notification: Notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/assets/icons/icon-192x192.png'
      });
    }
  }

  handleNotificationClick(notification: Notification) {
    if (!notification.isRead) {
      this.markAsRead(notification);
    }
    // TODO: Navigate to related content
  }

  markAsRead(notification: Notification) {
    this.notificationsService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.isRead = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      },
      error: (error) => {
        console.error('Error marking as read:', error);
      }
    });
  }

  markAllAsRead() {
    this.notificationsService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
        this.unreadCount = 0;
      },
      error: (error) => {
        console.error('Error marking all as read:', error);
      }
    });
  }

  deleteNotification(notification: Notification, event: Event) {
    event.stopPropagation();
    
    this.notificationsService.deleteNotification(notification.id).subscribe({
      next: () => {
        const index = this.notifications.indexOf(notification);
        if (index > -1) {
          this.notifications.splice(index, 1);
          if (!notification.isRead) {
            this.unreadCount = Math.max(0, this.unreadCount - 1);
          }
        }
      },
      error: (error) => {
        console.error('Error deleting notification:', error);
      }
    });
  }

  getNotificationIcon(type: string): string {
    const icons: any = {
      info: 'pi pi-info-circle',
      success: 'pi pi-check-circle',
      warning: 'pi pi-exclamation-triangle',
      error: 'pi pi-times-circle'
    };
    return icons[type] || 'pi pi-bell';
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  }

  viewAllNotifications() {
    // TODO: Navigate to notifications page
    console.log('View all notifications');
  }
}
