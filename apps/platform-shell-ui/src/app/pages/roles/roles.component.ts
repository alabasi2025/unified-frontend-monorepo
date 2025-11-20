import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-roles',
  imports: [CommonModule, MenubarModule, TableModule, ButtonModule],
  template: `
    <p-menubar [model]="menuItems"><ng-template pTemplate="start"><span class="text-xl font-bold">SEMOP ERP</span></ng-template></p-menubar>
    <div class="p-4">
      <div class="flex justify-content-between align-items-center mb-4">
        <h1 class="text-3xl font-bold">إدارة الأدوار</h1>
        <p-button label="إضافة دور" icon="pi pi-plus" severity="success"></p-button>
      </div>
      <p-table [value]="items" [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template pTemplate="header"><tr><th>الرقم</th><th>الاسم</th><th>الوصف</th><th>الإجراءات</th></tr></ng-template>
        <ng-template pTemplate="body" let-item><tr><td>{{ item.id }}</td><td>{{ item.name }}</td><td>{{ item.description }}</td><td><p-button icon="pi pi-pencil" severity="info" [text]="true" class="mr-2"></p-button><p-button icon="pi pi-trash" severity="danger" [text]="true"></p-button></td></tr></ng-template>
      </p-table>
    </div>
  `
})
export class RolesComponent {
  menuItems: MenuItem[] = [
    { label: 'الرئيسية', icon: 'pi pi-home', command: () => this.router.navigate(['/dashboard']) }
  ];
  items = [
    { id: 1, name: 'مدير النظام', description: 'صلاحيات كاملة' },
    { id: 2, name: 'محاسب', description: 'إدارة الحسابات' }
  ];
  constructor(private router: Router) {}
}
