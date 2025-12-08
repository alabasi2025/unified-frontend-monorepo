import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsService, GetReportDto } from './reports.service';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CardModule,
    ButtonModule,

    ToastModule
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  providers: [MessageService]
})
export class ReportsComponent implements OnInit {
  selectedReport: string = 'inventory-summary';
  reportData: any[] = [];
  loading: boolean = false;
  filter: GetReportDto = {};

  constructor(
    private reportsService: ReportsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // تحميل التقرير الافتراضي عند بدء التشغيل
    this.generateReport();
  }

  generateReport(): void {
    this.loading = true;
    this.reportData = []; // مسح البيانات القديمة

    let reportObservable: Observable<any>;

    switch (this.selectedReport) {
      case 'inventory-summary':
        reportObservable = this.reportsService.getInventorySummary(this.filter);
        break;
      case 'sales-by-item':
        reportObservable = this.reportsService.getSalesByItem(this.filter);
        break;
      case 'stock-movement':
        reportObservable = this.reportsService.getStockMovement(this.filter);
        break;
      default:
        this.loading = false;
        return;
    }

    reportObservable.subscribe({
      next: (response: any) => {
        this.reportData = response.data;
        this.messageService.add({
          severity: 'success',
          summary: 'نجاح',
          detail: response.message,
        });
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في جلب التقرير: ' + err.error.message,
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  // دالة مساعدة للحصول على رؤوس الأعمدة للجدول
  getReportColumns(): any[] {
    if (this.reportData.length === 0) {
      return [];
    }
    const keys = Object.keys(this.reportData[0]);
    // تحويل أسماء المفاتيح الإنجليزية إلى أسماء عربية للعرض
    const columnMap: { [key: string]: string } = {
      itemName: 'اسم الصنف',
      totalQuantity: 'إجمالي الكمية',
      totalValue: 'إجمالي القيمة',
      lastUpdate: 'آخر تحديث',
      salesQuantity: 'كمية المبيعات',
      salesRevenue: 'إيرادات المبيعات',
      period: 'الفترة',
      date: 'التاريخ',
      movementType: 'نوع الحركة',
      quantity: 'الكمية',
      source: 'المصدر',
      destination: 'الوجهة',
    };

    return keys.map((key) => ({
      field: key,
      header: columnMap[key] || key,
    }));
  }
}
