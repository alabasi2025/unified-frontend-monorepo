import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared';
import { DataTableComponent, TableColumn, TableAction } from '../../shared';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent, ButtonModule],
  template: `
    <app-page-header title="الأدوار" icon="pi pi-shield" [hasActions]="true">
      <div actions>
        <button pButton label="إضافة" icon="pi pi-plus" (click)="onAdd()"></button>
      </div>
    </app-page-header>
    <app-data-table [data]="items" [columns]="columns" [actions]="actions" [loading]="loading"></app-data-table>
  `
})
export class RolesListComponent implements OnInit {
  items: any[] = [];
  columns: TableColumn[] = [{"field": "name", "header": "الاسم"}, {"field": "description", "header": "الوصف"}, {"field": "permissionsCount", "header": "عدد الصلاحيات"}];
  actions: TableAction[] = [
    { icon: 'pi pi-eye', label: 'عرض', command: (row: any) => this.onView(row) },
    { icon: 'pi pi-pencil', label: 'تعديل', command: (row: any) => this.onEdit(row) },
    { icon: 'pi pi-trash', label: 'حذف', command: (row: any) => this.onDelete(row) }
  ];
  loading = false;

  constructor(private router: Router) {}
  ngOnInit() { this.loadData(); }
  loadData() { /* Load data */ }
  onAdd() { this.router.navigate(['/users/roles/new']); }
  onView(item: any) { this.router.navigate(['/users/roles', item.id]); }
  onEdit(item: any) { this.router.navigate(['/users/roles', item.id, 'edit']); }
  onDelete(item: any) { /* Delete */ }
}
