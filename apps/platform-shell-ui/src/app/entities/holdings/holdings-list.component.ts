import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { DataTableComponent, TableColumn, TableAction } from '../../shared/components/data-table.component';
import { ButtonModule } from 'primeng/button';
import { HoldingsService } from '../../core/services/api/holdings.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-holdings-list',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, DataTableComponent, ButtonModule, ConfirmDialogComponent],
  template: `
    <app-page-header
      title="الشركات القابضة"
      subtitle="إدارة الشركات القابضة في النظام"
      icon="pi pi-briefcase"
      [hasActions]="true"
    >
      <div actions>
        <button
          pButton
          label="إضافة شركة قابضة"
          icon="pi pi-plus"
          (click)="onAdd()"
        ></button>
      </div>
    </app-page-header>

    <app-data-table
      [data]="holdings"
      [columns]="columns"
      [actions]="actions"
      [loading]="loading"
      [totalRecords]="totalRecords"
      [lazy]="true"
      (onLazyLoad)="loadHoldings($event)"
      (onSearch)="onSearch($event)"
    ></app-data-table>

    <app-confirm-dialog></app-confirm-dialog>
  `
})
export class HoldingsListComponent implements OnInit {
  holdings: any[] = [];
  columns: TableColumn[] = [
    { field: 'code', header: 'الرمز', sortable: true, filterable: true },
    { field: 'nameAr', header: 'الاسم بالعربية', sortable: true, filterable: true },
    { field: 'nameEn', header: 'الاسم بالإنجليزية', sortable: true, filterable: true },
    { field: 'status', header: 'الحالة', sortable: true },
    { field: 'createdAt', header: 'تاريخ الإنشاء', sortable: true }
  ];
  actions: TableAction[] = [
    {
      icon: 'pi pi-eye',
      label: 'عرض',
      command: (row: any) => this.onView(row)
    },
    {
      icon: 'pi pi-pencil',
      label: 'تعديل',
      command: (row: any) => this.onEdit(row)
    },
    {
      icon: 'pi pi-trash',
      label: 'حذف',
      command: (row: any) => this.onDelete(row)
    }
  ];
  loading = false;
  totalRecords = 0;

  constructor(
    private holdingsService: HoldingsService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadHoldings({});
  }

  async loadHoldings(event: any) {
    this.loading = true;
    try {
      const result = await this.holdingsService.findAll({
        page: event.first ? Math.floor(event.first / event.rows) + 1 : 1,
        limit: event.rows || 10,
        sortBy: event.sortField,
        sortOrder: event.sortOrder === 1 ? 'ASC' : 'DESC'
      });
      this.holdings = result.data;
      this.totalRecords = result.total;
    } catch (error: any) {
      this.notificationService.error('فشل تحميل البيانات');
    } finally {
      this.loading = false;
    }
  }

  onSearch(term: string) {
    // Implement search logic
  }

  onAdd() {
    this.router.navigate(['/entities/holdings/new']);
  }

  onView(holding: any) {
    this.router.navigate(['/entities/holdings', holding.id]);
  }

  onEdit(holding: any) {
    this.router.navigate(['/entities/holdings', holding.id, 'edit']);
  }

  async onDelete(holding: any) {
    // Implement delete with confirmation
  }
}
