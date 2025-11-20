import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ChartModule],
  template: `
    <div class="dashboard-container">
      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card purple">
          <div class="stat-icon">
            <i class="pi pi-users"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.usersCount }}</div>
            <div class="stat-label">المستخدمين</div>
            <div class="stat-trend positive">
              <i class="pi pi-arrow-up"></i>
              <span>+12% من الشهر الماضي</span>
            </div>
          </div>
        </div>

        <div class="stat-card pink">
          <div class="stat-icon">
            <i class="pi pi-shield"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.rolesCount }}</div>
            <div class="stat-label">الأدوار</div>
            <div class="stat-trend positive">
              <i class="pi pi-arrow-up"></i>
              <span>+3 جديد</span>
            </div>
          </div>
        </div>

        <div class="stat-card blue">
          <div class="stat-icon">
            <i class="pi pi-briefcase"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.customersCount }}</div>
            <div class="stat-label">العملاء</div>
            <div class="stat-trend positive">
              <i class="pi pi-arrow-up"></i>
              <span>+18% هذا الشهر</span>
            </div>
          </div>
        </div>

        <div class="stat-card green">
          <div class="stat-icon">
            <i class="pi pi-truck"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.suppliersCount }}</div>
            <div class="stat-label">الموردين</div>
            <div class="stat-trend neutral">
              <i class="pi pi-minus"></i>
              <span>لا تغيير</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="charts-row">
        <div class="chart-container">
          <div class="chart-header">
            <h3>المبيعات الشهرية</h3>
            <p>آخر 6 أشهر</p>
          </div>
          <p-chart type="line" [data]="salesChartData" [options]="lineChartOptions" height="300px"></p-chart>
        </div>

        <div class="chart-container">
          <div class="chart-header">
            <h3>توزيع العملاء</h3>
            <p>حسب الحالة</p>
          </div>
          <p-chart type="doughnut" [data]="customersChartData" [options]="doughnutChartOptions" height="300px"></p-chart>
        </div>
      </div>

      <!-- Second Charts Row -->
      <div class="charts-row">
        <div class="chart-container">
          <div class="chart-header">
            <h3>الإيرادات الشهرية</h3>
            <p>مقارنة بالعام الماضي</p>
          </div>
          <p-chart type="bar" [data]="revenueChartData" [options]="barChartOptions" height="300px"></p-chart>
        </div>

        <div class="chart-container">
          <div class="chart-header">
            <h3>المشاريع حسب الحالة</h3>
            <p>التوزيع الحالي</p>
          </div>
          <p-chart type="pie" [data]="projectsChartData" [options]="pieChartOptions" height="300px"></p-chart>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="activities-section">
        <div class="section-header">
          <h3>النشاطات الأخيرة</h3>
          <button pButton label="عرض الكل" class="p-button-text"></button>
        </div>
        <div class="activities-list">
          <div class="activity-item" *ngFor="let activity of recentActivities">
            <div class="activity-icon" [ngClass]="activity.type">
              <i [class]="activity.icon"></i>
            </div>
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
            <div class="activity-badge" [ngClass]="activity.type">
              {{ activity.badge }}
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <div class="section-header">
          <h3>إجراءات سريعة</h3>
        </div>
        <div class="actions-grid">
          <button pButton class="action-btn purple" (click)="navigate('/users')">
            <i class="pi pi-user-plus"></i>
            <span>إضافة مستخدم</span>
          </button>
          <button pButton class="action-btn blue" (click)="navigate('/projects')">
            <i class="pi pi-folder-plus"></i>
            <span>مشروع جديد</span>
          </button>
          <button pButton class="action-btn green" (click)="navigate('/customers')">
            <i class="pi pi-user-plus"></i>
            <span>عميل جديد</span>
          </button>
          <button pButton class="action-btn orange" (click)="navigate('/reports')">
            <i class="pi pi-file-pdf"></i>
            <span>تقرير مالي</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 0;
    }

    /* Statistics Cards */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
    }

    .stat-card.purple::before {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .stat-card.pink::before {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .stat-card.blue::before {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .stat-card.green::before {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.15);
    }

    .stat-icon {
      width: 80px;
      height: 80px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      color: white;
      flex-shrink: 0;
    }

    .stat-card.purple .stat-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .stat-card.pink .stat-icon {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .stat-card.blue .stat-icon {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .stat-card.green .stat-icon {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 1rem;
      color: #7f8c8d;
      margin-bottom: 0.75rem;
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      padding: 0.375rem 0.75rem;
      border-radius: 20px;
      display: inline-flex;
    }

    .stat-trend.positive {
      background: #d4edda;
      color: #155724;
    }

    .stat-trend.neutral {
      background: #e2e3e5;
      color: #383d41;
    }

    /* Charts */
    .charts-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .chart-container {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .chart-header {
      margin-bottom: 1.5rem;
    }

    .chart-header h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.25rem;
      color: #2c3e50;
      font-weight: 600;
    }

    .chart-header p {
      margin: 0;
      font-size: 0.875rem;
      color: #7f8c8d;
    }

    /* Activities */
    .activities-section {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      margin-bottom: 2rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h3 {
      margin: 0;
      font-size: 1.25rem;
      color: #2c3e50;
      font-weight: 600;
    }

    .activities-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 12px;
      transition: all 0.2s;
    }

    .activity-item:hover {
      background: #e9ecef;
      transform: translateX(-4px);
    }

    .activity-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .activity-icon.success {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .activity-icon.info {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .activity-icon.warning {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    .activity-icon.primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .activity-content {
      flex: 1;
    }

    .activity-title {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.25rem;
    }

    .activity-time {
      font-size: 0.875rem;
      color: #7f8c8d;
    }

    .activity-badge {
      padding: 0.375rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .activity-badge.success {
      background: #d4edda;
      color: #155724;
    }

    .activity-badge.info {
      background: #d1ecf1;
      color: #0c5460;
    }

    .activity-badge.warning {
      background: #fff3cd;
      color: #856404;
    }

    .activity-badge.primary {
      background: #e7e3fc;
      color: #5a4a9f;
    }

    /* Quick Actions */
    .quick-actions-section {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      height: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.3s;
    }

    .action-btn i {
      font-size: 1.75rem;
    }

    .action-btn.purple {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .action-btn.purple:hover {
      background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
    }

    .action-btn.blue {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }

    .action-btn.blue:hover {
      background: linear-gradient(135deg, #3d9be9 0%, #00d9e5 100%);
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(79, 172, 254, 0.3);
    }

    .action-btn.green {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      color: white;
    }

    .action-btn.green:hover {
      background: linear-gradient(135deg, #32d66a 0%, #27e6c4 100%);
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(67, 233, 123, 0.3);
    }

    .action-btn.orange {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      color: white;
    }

    .action-btn.orange:hover {
      background: linear-gradient(135deg, #f95d89 0%, #fed12d 100%);
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(250, 112, 154, 0.3);
    }

    @media (max-width: 768px) {
      .charts-row {
        grid-template-columns: 1fr;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats = {
    usersCount: 0,
    rolesCount: 0,
    customersCount: 0,
    suppliersCount: 0
  };

  salesChartData: any;
  customersChartData: any;
  revenueChartData: any;
  projectsChartData: any;

  lineChartOptions: any;
  doughnutChartOptions: any;
  barChartOptions: any;
  pieChartOptions: any;

  recentActivities = [
    {
      icon: 'pi pi-user-plus',
      title: 'تم إضافة مستخدم جديد: أحمد محمد',
      time: 'منذ 5 دقائق',
      type: 'success',
      badge: 'جديد'
    },
    {
      icon: 'pi pi-folder',
      title: 'تم إنشاء مشروع: تطوير نظام المحاسبة',
      time: 'منذ 15 دقيقة',
      type: 'info',
      badge: 'مشروع'
    },
    {
      icon: 'pi pi-shopping-cart',
      title: 'طلب شراء جديد من مورد ABC بقيمة 50,000 ريال',
      time: 'منذ ساعة',
      type: 'warning',
      badge: 'مشتريات'
    },
    {
      icon: 'pi pi-check-circle',
      title: 'تم الموافقة على الفاتورة #1234',
      time: 'منذ ساعتين',
      type: 'success',
      badge: 'موافق'
    },
    {
      icon: 'pi pi-users',
      title: 'اجتماع فريق المبيعات - الساعة 3 مساءً',
      time: 'منذ 3 ساعات',
      type: 'primary',
      badge: 'اجتماع'
    }
  ];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadStats();
    this.initializeCharts();
  }

  loadStats() {
    this.http.get<any>('/api/dashboard/stats').subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: () => {
        // Use dummy data if API fails
        this.stats = {
          usersCount: 5,
          rolesCount: 8,
          customersCount: 125,
          suppliersCount: 87
        };
      }
    });
  }

  initializeCharts() {
    // Sales Line Chart
    this.salesChartData = {
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
      datasets: [
        {
          label: 'المبيعات (ألف ريال)',
          data: [65, 59, 80, 81, 96, 105],
          fill: true,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
          pointBackgroundColor: '#667eea',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5
        }
      ]
    };

    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0,0,0,0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    };

    // Customers Doughnut Chart
    this.customersChartData = {
      labels: ['عملاء جدد', 'عملاء حاليون', 'عملاء غير نشطين'],
      datasets: [
        {
          data: [45, 125, 30],
          backgroundColor: ['#667eea', '#43e97b', '#e0e0e0'],
          hoverBackgroundColor: ['#5568d3', '#32d66a', '#d0d0d0'],
          borderWidth: 0
        }
      ]
    };

    this.doughnutChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };

    // Revenue Bar Chart
    this.revenueChartData = {
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
      datasets: [
        {
          label: '2025',
          data: [120, 150, 180, 170, 200, 220],
          backgroundColor: '#667eea',
          borderRadius: 8
        },
        {
          label: '2024',
          data: [100, 130, 150, 140, 160, 180],
          backgroundColor: '#e0e0e0',
          borderRadius: 8
        }
      ]
    };

    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0,0,0,0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    };

    // Projects Pie Chart
    this.projectsChartData = {
      labels: ['قيد التنفيذ', 'مكتمل', 'معلق', 'ملغي'],
      datasets: [
        {
          data: [35, 45, 15, 5],
          backgroundColor: ['#4facfe', '#43e97b', '#fee140', '#f5576c'],
          hoverBackgroundColor: ['#3d9be9', '#32d66a', '#fed12d', '#e44659'],
          borderWidth: 0
        }
      ]
    };

    this.pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
