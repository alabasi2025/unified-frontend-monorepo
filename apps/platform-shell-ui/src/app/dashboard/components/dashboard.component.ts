import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../shared/components/stat-card.component';
import { CardComponent } from '../../shared/components/card.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { RevenueChartComponent } from './revenue-chart.component';
import { ExpenseChartComponent } from './expense-chart.component';
import { SalesChartComponent } from './sales-chart.component';
import { InventoryWidgetComponent } from './inventory-widget.component';
import { HrWidgetComponent } from './hr-widget.component';
import { RecentActivitiesComponent } from './recent-activities.component';
import { QuickActionsComponent } from './quick-actions.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    CardComponent,
    PageHeaderComponent,
    RevenueChartComponent,
    ExpenseChartComponent,
    SalesChartComponent,
    InventoryWidgetComponent,
    HrWidgetComponent,
    RecentActivitiesComponent,
    QuickActionsComponent
  ],
  template: `
    <app-page-header
      title="لوحة التحكم"
      subtitle="نظرة عامة على أداء المؤسسة"
      icon="pi pi-home"
    ></app-page-header>

    <!-- Statistics Cards -->
    <div class="grid">
      <div class="col-12 md:col-6 lg:col-3">
        <app-stat-card
          icon="pi pi-dollar"
          label="إجمالي الإيرادات"
          [value]="stats.totalRevenue"
          [change]="stats.revenueChange"
          color="success"
        ></app-stat-card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <app-stat-card
          icon="pi pi-chart-line"
          label="إجمالي المصروفات"
          [value]="stats.totalExpenses"
          [change]="stats.expensesChange"
          color="danger"
        ></app-stat-card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <app-stat-card
          icon="pi pi-shopping-cart"
          label="طلبات البيع"
          [value]="stats.salesOrders"
          [change]="stats.salesOrdersChange"
          color="primary"
        ></app-stat-card>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <app-stat-card
          icon="pi pi-users"
          label="الموظفون"
          [value]="stats.employees"
          [change]="stats.employeesChange"
          color="info"
        ></app-stat-card>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid">
      <div class="col-12 lg:col-8">
        <app-revenue-chart></app-revenue-chart>
      </div>

      <div class="col-12 lg:col-4">
        <app-expense-chart></app-expense-chart>
      </div>
    </div>

    <!-- Widgets Row -->
    <div class="grid">
      <div class="col-12 lg:col-4">
        <app-sales-chart></app-sales-chart>
      </div>

      <div class="col-12 lg:col-4">
        <app-inventory-widget></app-inventory-widget>
      </div>

      <div class="col-12 lg:col-4">
        <app-hr-widget></app-hr-widget>
      </div>
    </div>

    <!-- Activities and Quick Actions -->
    <div class="grid">
      <div class="col-12 lg:col-8">
        <app-recent-activities></app-recent-activities>
      </div>

      <div class="col-12 lg:col-4">
        <app-quick-actions></app-quick-actions>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats = {
    totalRevenue: '2,450,000 ر.س',
    revenueChange: 12.5,
    totalExpenses: '1,850,000 ر.س',
    expensesChange: -5.2,
    salesOrders: '342',
    salesOrdersChange: 8.3,
    employees: '156',
    employeesChange: 3.1
  };

  ngOnInit() {
    // Load dashboard data
  }
}
