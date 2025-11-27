import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">🔔 الإشعارات</h2>
        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          تحديد الكل كمقروء
        </button>
      </div>

      <!-- Filters -->
      <div class="mb-4 flex gap-4">
        <select class="border rounded px-3 py-2">
          <option value="all">جميع الأنواع</option>
          <option value="info">معلومات</option>
          <option value="warning">تحذير</option>
          <option value="error">خطأ</option>
          <option value="success">نجاح</option>
        </select>
        <select class="border rounded px-3 py-2">
          <option value="all">الكل</option>
          <option value="unread">غير مقروء</option>
          <option value="read">مقروء</option>
        </select>
      </div>

      <!-- Notifications List -->
      <div class="space-y-3">
        <div *ngFor="let notification of notifications" 
             [ngClass]="{'p-4 rounded-lg border-l-4': true, 'bg-gray-50': notification.isRead, 'bg-white shadow': !notification.isRead}"
             [class]="getTypeClass(notification.type)">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-800">{{ notification.title }}</h3>
              <p class="text-gray-600 mt-1">{{ notification.message }}</p>
              <span class="text-sm text-gray-400 mt-2 block">{{ formatDate(notification.createdAt) }}</span>
            </div>
            <div class="flex gap-2">
              <button *ngIf="!notification.isRead" 
                      class="text-blue-500 hover:text-blue-700 text-sm">
                تحديد كمقروء
              </button>
              <button class="text-red-500 hover:text-red-700 text-sm">
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex justify-center gap-2">
        <button class="px-3 py-1 border rounded hover:bg-gray-100">السابق</button>
        <button class="px-3 py-1 bg-blue-500 text-white rounded">1</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100">2</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100">3</button>
        <button class="px-3 py-1 border rounded hover:bg-gray-100">التالي</button>
      </div>
    </div>
  `,
  styles: []
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [
    {
      id: 1,
      title: 'مرحباً بك في نظام SEMOP',
      message: 'تم تسجيل دخولك بنجاح إلى النظام',
      type: 'success',
      isRead: false,
      createdAt: new Date()
    },
    {
      id: 2,
      title: 'تحديث مهم',
      message: 'يرجى مراجعة الإعدادات الجديدة',
      type: 'info',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: 3,
      title: 'تحذير',
      message: 'المخزون منخفض لبعض الأصناف',
      type: 'warning',
      isRead: true,
      createdAt: new Date(Date.now() - 7200000)
    },
    {
      id: 4,
      title: 'خطأ في النظام',
      message: 'فشل في الاتصال بقاعدة البيانات',
      type: 'error',
      isRead: true,
      createdAt: new Date(Date.now() - 10800000)
    }
  ];

  ngOnInit(): void {}

  getTypeClass(type: string): string {
    const classes = {
      info: 'border-blue-500',
      warning: 'border-yellow-500',
      error: 'border-red-500',
      success: 'border-green-500'
    };
    return classes[type as keyof typeof classes] || 'border-gray-500';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
