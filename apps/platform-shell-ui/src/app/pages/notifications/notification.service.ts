import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay, map } from 'rxjs';
import {
  INotificationService,
  Notification,
  NotificationFilter,
  CreateNotificationPayload,
  UpdateNotificationPayload
} from './notification.contracts';

/**
 * NotificationService
 * 
 * @description
 * Core service for managing notifications in the SEMOP ERP system.
 * Implements INotificationService from API Contract.
 * Provides CRUD operations, filtering, and status management.
 * 
 * @implements {INotificationService}
 * @see notification.contracts.ts
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService implements INotificationService {
  // In-memory storage for demo purposes
  private notifications = signal<Notification[]>([
    {
      id: 1,
      type: 'info',
      title: 'مرحباً بك في نظام SEMOP',
      message: 'تم تسجيل دخولك بنجاح',
      status: 'unread',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      userId: 1
    },
    {
      id: 2,
      type: 'success',
      title: 'تم حفظ البيانات',
      message: 'تم حفظ بيانات العميل بنجاح',
      status: 'read',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      userId: 1
    },
    {
      id: 3,
      type: 'warning',
      title: 'تنبيه',
      message: 'يوجد فواتير مستحقة الدفع',
      status: 'unread',
      createdAt: new Date(Date.now() - 10800000).toISOString(),
      userId: 1
    },
    {
      id: 4,
      type: 'error',
      title: 'خطأ في النظام',
      message: 'فشل الاتصال بقاعدة البيانات',
      status: 'unread',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      userId: 1
    }
  ]);

  private nextId = 5;

  /**
   * Get all notifications with optional filtering
   * @param filter - Optional filter criteria
   * @returns Observable of filtered notifications
   */
  getAll(filter?: NotificationFilter): Observable<Notification[]> {
    try {
      let result = [...this.notifications()];

      if (filter) {
        // Filter by type
        if (filter.type) {
          result = result.filter(n => n.type === filter.type);
        }

        // Filter by status
        if (filter.status) {
          result = result.filter(n => n.status === filter.status);
        }

        // Filter by date range
        if (filter.startDate) {
          const startDate = new Date(filter.startDate);
          result = result.filter(n => new Date(n.createdAt) >= startDate);
        }

        if (filter.endDate) {
          const endDate = new Date(filter.endDate);
          result = result.filter(n => new Date(n.createdAt) <= endDate);
        }

        // Search in title and message
        if (filter.searchTerm) {
          const term = filter.searchTerm.toLowerCase();
          result = result.filter(n =>
            n.title.toLowerCase().includes(term) ||
            n.message.toLowerCase().includes(term)
          );
        }

        // Sorting
        if (filter.sortBy) {
          result.sort((a, b) => {
            let comparison = 0;

            switch (filter.sortBy) {
              case 'date':
                comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                break;
              case 'type':
                comparison = a.type.localeCompare(b.type);
                break;
              case 'status':
                comparison = a.status.localeCompare(b.status);
                break;
            }

            return filter.sortDirection === 'desc' ? -comparison : comparison;
          });
        }

        // Pagination
        if (filter.page !== undefined && filter.pageSize !== undefined) {
          const start = (filter.page - 1) * filter.pageSize;
          const end = start + filter.pageSize;
          result = result.slice(start, end);
        }
      }

      // Simulate network delay
      return of(result).pipe(delay(300));
    } catch (error) {
      return throwError(() => new Error('فشل في جلب الإشعارات'));
    }
  }

  /**
   * Get notification by ID
   * @param id - Notification ID
   * @returns Observable of notification or error
   */
  getById(id: number): Observable<Notification> {
    try {
      const notification = this.notifications().find(n => n.id === id);

      if (!notification) {
        return throwError(() => new Error(`الإشعار رقم ${id} غير موجود`));
      }

      return of(notification).pipe(delay(200));
    } catch (error) {
      return throwError(() => new Error('فشل في جلب الإشعار'));
    }
  }

  /**
   * Create new notification
   * @param payload - Notification data
   * @returns Observable of created notification
   */
  create(payload: CreateNotificationPayload): Observable<Notification> {
    try {
      const newNotification: Notification = {
        id: this.nextId++,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        status: 'unread',
        createdAt: new Date().toISOString(),
        userId: payload.userId,
        link: payload.link,
        metadata: payload.metadata
      };

      this.notifications.update(notifications => [...notifications, newNotification]);

      return of(newNotification).pipe(delay(300));
    } catch (error) {
      return throwError(() => new Error('فشل في إنشاء الإشعار'));
    }
  }

  /**
   * Update existing notification
   * @param id - Notification ID
   * @param payload - Updated data
   * @returns Observable of updated notification
   */
  update(id: number, payload: UpdateNotificationPayload): Observable<Notification> {
    try {
      const index = this.notifications().findIndex(n => n.id === id);

      if (index === -1) {
        return throwError(() => new Error(`الإشعار رقم ${id} غير موجود`));
      }

      this.notifications.update(notifications => {
        const updated = [...notifications];
        updated[index] = {
          ...updated[index],
          ...payload,
          updatedAt: new Date().toISOString()
        };
        return updated;
      });

      return of(this.notifications()[index]).pipe(delay(300));
    } catch (error) {
      return throwError(() => new Error('فشل في تحديث الإشعار'));
    }
  }

  /**
   * Delete notification
   * @param id - Notification ID
   * @returns Observable of void
   */
  delete(id: number): Observable<void> {
    try {
      const index = this.notifications().findIndex(n => n.id === id);

      if (index === -1) {
        return throwError(() => new Error(`الإشعار رقم ${id} غير موجود`));
      }

      this.notifications.update(notifications =>
        notifications.filter(n => n.id !== id)
      );

      return of(void 0).pipe(delay(200));
    } catch (error) {
      return throwError(() => new Error('فشل في حذف الإشعار'));
    }
  }

  /**
   * Mark notification as read
   * @param id - Notification ID
   * @returns Observable of void
   */
  markAsRead(id: number): Observable<void> {
    try {
      const index = this.notifications().findIndex(n => n.id === id);

      if (index === -1) {
        return throwError(() => new Error(`الإشعار رقم ${id} غير موجود`));
      }

      this.notifications.update(notifications => {
        const updated = [...notifications];
        updated[index] = {
          ...updated[index],
          status: 'read',
          readAt: new Date().toISOString()
        };
        return updated;
      });

      return of(void 0).pipe(delay(200));
    } catch (error) {
      return throwError(() => new Error('فشل في تحديث حالة الإشعار'));
    }
  }

  /**
   * Mark all notifications as read
   * @returns Observable of void
   */
  markAllAsRead(): Observable<void> {
    try {
      this.notifications.update(notifications =>
        notifications.map(n => ({
          ...n,
          status: 'read' as const,
          readAt: new Date().toISOString()
        }))
      );

      return of(void 0).pipe(delay(300));
    } catch (error) {
      return throwError(() => new Error('فشل في تحديث حالة الإشعارات'));
    }
  }

  /**
   * Get count of unread notifications
   * @returns Observable of unread count
   */
  getUnreadCount(): Observable<number> {
    try {
      const count = this.notifications().filter(n => n.status === 'unread').length;
      return of(count).pipe(delay(100));
    } catch (error) {
      return throwError(() => new Error('فشل في حساب الإشعارات غير المقروءة'));
    }
  }
}
