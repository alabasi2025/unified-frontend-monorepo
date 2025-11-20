import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared';
import { DataTableComponent, TableColumn, TableAction } from '../../shared';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent, ButtonModule],
  template: `
    <app-page-header title="المشاريع" icon="pi pi-folder" [hasActions]="true">
      <div actions>
        <button pButton label="إضافة" icon="pi pi-plus" (click)="onAdd()"></button>
      </div>
    </app-page-header>
    <app-data-table [data]="items" [columns]="columns" [actions]="actions" [loading]="loading"></app-data-table>
  `
})
export class ProjectsListComponent implements OnInit {
  items: any[] = [];
  columns: TableColumn[] = [{"field": "code", "header": "الرمز"}, {"field": "nameAr", "header": "اسم المشروع"}, {"field": "unitName", "header": "الوحدة"}, {"field": "status", "header": "الحالة"}];
  actions: TableAction[] = [
    { icon: 'pi pi-eye', label: 'عرض', command: (row: any) => this.onView(row) },
    { icon: 'pi pi-pencil', label: 'تعديل', command: (row: any) => this.onEdit(row) },
    { icon: 'pi pi-trash', label: 'حذف', command: (row: any) => this.onDelete(row) }
  ];
  loading = false;

  constructor(private router: Router) {}
  ngOnInit() { this.loadData(); }
  loadData() { /* Load data */ }
  onAdd() { this.router.navigate(['/entities/projects/new']); }
  onView(item: any) { this.router.navigate(['/entities/projects', item.id]); }
  onEdit(item: any) { this.router.navigate(['/entities/projects', item.id, 'edit']); }
  onDelete(item: any) { /* Delete */ }
}
