import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-users',
  imports: [CommonModule, MenubarModule, TableModule, ButtonModule],
  template: `
    <p-menubar [model]="menuItems">
      <ng-template pTemplate="start">
        <span class="text-xl font-bold">SEMOP ERP</span>
      </ng-template>
    </p-menubar>

    <div class="p-4">
      <div class="flex justify-content-between align-items-center mb-4">
        <h1 class="text-3xl font-bold">إدارة المستخدمين</h1>
        <p-button label="إضافة مستخدم" icon="pi pi-plus" severity="success"></p-button>
      </div>

      <p-table [value]="users" [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template pTemplate="header">
          <tr>
            <th>الرقم</th>
            <th>الاسم</th>
            <th>البريد الإلكتروني</th>
            <th>الدور</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-user>
          <tr>
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <span [class]="'badge ' + (user.active ? 'badge-success' : 'badge-danger')">
                {{ user.active ? 'نشط' : 'غير نشط' }}
              </span>
            </td>
            <td>
              <p-button icon="pi pi-pencil" severity="info" [text]="true" class="mr-2"></p-button>
              <p-button icon="pi pi-trash" severity="danger" [text]="true"></p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`
    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }
    .badge-success {
      background-color: #22c55e;
      color: white;
    }
    .badge-danger {
      background-color: #ef4444;
      color: white;
    }
  `]
})
export class UsersComponent {
  menuItems: MenuItem[] = [
    { label: 'الرئيسية', icon: 'pi pi-home', command: () => this.router.navigate(['/dashboard']) },
    { label: 'المستخدمين', icon: 'pi pi-users', command: () => this.router.navigate(['/users']) },
    { label: 'الأدوار', icon: 'pi pi-shield', command: () => this.router.navigate(['/roles']) },
    { label: 'الصلاحيات', icon: 'pi pi-lock', command: () => this.router.navigate(['/permissions']) }
  ];

  users = [
    { id: 1, name: 'أحمد محمد', email: 'ahmed@semop.com', role: 'مدير النظام', active: true },
    { id: 2, name: 'فاطمة علي', email: 'fatima@semop.com', role: 'محاسب', active: true },
    { id: 3, name: 'محمود حسن', email: 'mahmoud@semop.com', role: 'مستخدم', active: false },
    { id: 4, name: 'سارة خالد', email: 'sara@semop.com', role: 'مدير مبيعات', active: true },
    { id: 5, name: 'عمر يوسف', email: 'omar@semop.com', role: 'مستخدم', active: true }
  ];

  constructor(private router: Router) {}
}
