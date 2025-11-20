import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    AvatarModule,
    TooltipModule
  ],
  template: `
    <div class="layout-wrapper">
      <!-- Sidebar -->
      <div class="layout-sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="sidebar-header">
          <div class="logo">
            <i class="pi pi-building"></i>
            <span *ngIf="!sidebarCollapsed">SEMOP ERP</span>
          </div>
          <button 
            pButton 
            icon="pi pi-bars" 
            class="p-button-text p-button-rounded toggle-btn"
            (click)="toggleSidebar()">
          </button>
        </div>

        <div class="sidebar-menu">
          <div class="menu-section">
            <div class="section-title" *ngIf="!sidebarCollapsed">الرئيسية</div>
            <a routerLink="/dashboard" routerLinkActive="active" class="menu-item">
              <i class="pi pi-home"></i>
              <span *ngIf="!sidebarCollapsed">لوحة التحكم</span>
            </a>
          </div>

          <div class="menu-section">
            <div class="section-title" *ngIf="!sidebarCollapsed">الإدارة</div>
            <a routerLink="/users" routerLinkActive="active" class="menu-item">
              <i class="pi pi-users"></i>
              <span *ngIf="!sidebarCollapsed">المستخدمين</span>
            </a>
            <a routerLink="/roles" routerLinkActive="active" class="menu-item">
              <i class="pi pi-shield"></i>
              <span *ngIf="!sidebarCollapsed">الأدوار</span>
            </a>
            <a routerLink="/permissions" routerLinkActive="active" class="menu-item">
              <i class="pi pi-lock"></i>
              <span *ngIf="!sidebarCollapsed">الصلاحيات</span>
            </a>
          </div>

          <div class="menu-section">
            <div class="section-title" *ngIf="!sidebarCollapsed">الهيكل التنظيمي</div>
            <a routerLink="/holdings" routerLinkActive="active" class="menu-item">
              <i class="pi pi-sitemap"></i>
              <span *ngIf="!sidebarCollapsed">الشركات القابضة</span>
            </a>
            <a routerLink="/units" routerLinkActive="active" class="menu-item">
              <i class="pi pi-box"></i>
              <span *ngIf="!sidebarCollapsed">الوحدات</span>
            </a>
            <a routerLink="/projects" routerLinkActive="active" class="menu-item">
              <i class="pi pi-briefcase"></i>
              <span *ngIf="!sidebarCollapsed">المشاريع</span>
            </a>
          </div>

          <div class="menu-section">
            <div class="section-title" *ngIf="!sidebarCollapsed">المحاسبة</div>
            <a routerLink="/accounts" routerLinkActive="active" class="menu-item">
              <i class="pi pi-wallet"></i>
              <span *ngIf="!sidebarCollapsed">دليل الحسابات</span>
            </a>
            <a routerLink="/journal-entries" routerLinkActive="active" class="menu-item">
              <i class="pi pi-book"></i>
              <span *ngIf="!sidebarCollapsed">القيود اليومية</span>
            </a>
            <a routerLink="/cost-centers" routerLinkActive="active" class="menu-item">
              <i class="pi pi-chart-pie"></i>
              <span *ngIf="!sidebarCollapsed">مراكز التكلفة</span>
            </a>
            <a routerLink="/fiscal-years" routerLinkActive="active" class="menu-item">
              <i class="pi pi-calendar"></i>
              <span *ngIf="!sidebarCollapsed">السنوات المالية</span>
            </a>
          </div>

          <div class="menu-section">
            <div class="section-title" *ngIf="!sidebarCollapsed">المخزون</div>
            <a routerLink="/warehouses" routerLinkActive="active" class="menu-item">
              <i class="pi pi-box"></i>
              <span *ngIf="!sidebarCollapsed">المستودعات</span>
            </a>
            <a routerLink="/items" routerLinkActive="active" class="menu-item">
              <i class="pi pi-shopping-cart"></i>
              <span *ngIf="!sidebarCollapsed">الأصناف</span>
            </a>
            <a routerLink="/stock-movements" routerLinkActive="active" class="menu-item">
              <i class="pi pi-arrows-h"></i>
              <span *ngIf="!sidebarCollapsed">حركات المخزون</span>
            </a>
            <a routerLink="/stock-counts" routerLinkActive="active" class="menu-item">
              <i class="pi pi-list"></i>
              <span *ngIf="!sidebarCollapsed">جرد المخزون</span>
            </a>
          </div>

          <div class="menu-section">
            <div class="section-title" *ngIf="!sidebarCollapsed">المشتريات</div>
            <a routerLink="/purchase-orders" routerLinkActive="active" class="menu-item">
              <i class="pi pi-shopping-cart"></i>
              <span *ngIf="!sidebarCollapsed">أوامر الشراء</span>
            </a>
            <a routerLink="/purchase-invoices" routerLinkActive="active" class="menu-item">
              <i class="pi pi-file"></i>
              <span *ngIf="!sidebarCollapsed">فواتير الشراء</span>
            </a>
            <a routerLink="/purchase-returns" routerLinkActive="active" class="menu-item">
              <i class="pi pi-undo"></i>
              <span *ngIf="!sidebarCollapsed">مرتجعات المشتريات</span>
            </a>
          </div>

          <div class="menu-section">
            <div class="section-title" *ngIf="!sidebarCollapsed">المبيعات</div>
            <a routerLink="/sales-orders" routerLinkActive="active" class="menu-item">
              <i class="pi pi-dollar"></i>
              <span *ngIf="!sidebarCollapsed">أوامر البيع</span>
            </a>
            <a routerLink="/sales-invoices" routerLinkActive="active" class="menu-item">
              <i class="pi pi-file"></i>
              <span *ngIf="!sidebarCollapsed">فواتير البيع</span>
            </a>
            <a routerLink="/sales-returns" routerLinkActive="active" class="menu-item">
              <i class="pi pi-undo"></i>
              <span *ngIf="!sidebarCollapsed">مرتجعات المبيعات</span>
            </a>
          </div>

          <div class="menu-section">
            <div class="section-title" *ngIf="!sidebarCollapsed">العملاء والموردين</div>
            <a routerLink="/customers" routerLinkActive="active" class="menu-item">
              <i class="pi pi-user"></i>
              <span *ngIf="!sidebarCollapsed">العملاء</span>
            </a>
            <a routerLink="/suppliers" routerLinkActive="active" class="menu-item">
              <i class="pi pi-truck"></i>
              <span *ngIf="!sidebarCollapsed">الموردين</span>
            </a>
          </div>

          <div class="menu-section">
            <div class="section-title" *ngIf="!sidebarCollapsed">التقارير</div>
            <a routerLink="/reports" routerLinkActive="active" class="menu-item">
              <i class="pi pi-chart-bar"></i>
              <span *ngIf="!sidebarCollapsed">التقارير</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="layout-main" [class.expanded]="sidebarCollapsed">
        <!-- Topbar -->
        <div class="layout-topbar">
          <div class="topbar-left">
            <h2 class="page-title">{{ pageTitle }}</h2>
          </div>
          <div class="topbar-right">
            <div class="user-info">
              <p-avatar 
                [label]="currentUser?.username?.charAt(0).toUpperCase()" 
                shape="circle" 
                [style]="{'background-color':'#2196F3', 'color': '#ffffff'}">
              </p-avatar>
              <div class="user-details">
                <span class="username">{{ currentUser?.username }}</span>
                <span class="role">مدير النظام</span>
              </div>
              <button 
                pButton 
                icon="pi pi-sign-out" 
                class="p-button-text p-button-rounded"
                (click)="logout()"
                pTooltip="تسجيل خروج"
                tooltipPosition="bottom">
              </button>
            </div>
          </div>
        </div>

        <!-- Page Content -->
        <div class="layout-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      min-height: 100vh;
      background: #f5f7fa;
    }

    .layout-sidebar {
      width: 280px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      transition: all 0.3s ease;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
      position: fixed;
      height: 100vh;
      overflow-y: auto;
      z-index: 1000;
    }

    .layout-sidebar.collapsed {
      width: 80px;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .logo i {
      font-size: 2rem;
    }

    .toggle-btn {
      color: white !important;
    }

    .sidebar-menu {
      padding: 1rem 0;
    }

    .menu-section {
      margin-bottom: 1.5rem;
    }

    .section-title {
      padding: 0.5rem 1.5rem;
      font-size: 0.75rem;
      text-transform: uppercase;
      opacity: 0.7;
      font-weight: 600;
      letter-spacing: 1px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1.5rem;
      color: rgba(255,255,255,0.9);
      text-decoration: none;
      transition: all 0.2s;
      position: relative;
    }

    .menu-item:hover {
      background: rgba(255,255,255,0.1);
      color: white;
    }

    .menu-item.active {
      background: rgba(255,255,255,0.15);
      color: white;
      font-weight: 600;
    }

    .menu-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: white;
    }

    .menu-item i {
      font-size: 1.25rem;
      min-width: 24px;
    }

    .layout-main {
      flex: 1;
      margin-right: 280px;
      transition: all 0.3s ease;
    }

    .layout-main.expanded {
      margin-right: 80px;
    }

    .layout-topbar {
      background: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 999;
    }

    .page-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      text-align: right;
    }

    .username {
      font-weight: 600;
      color: #2c3e50;
    }

    .role {
      font-size: 0.875rem;
      color: #7f8c8d;
    }

    .layout-content {
      padding: 2rem;
      min-height: calc(100vh - 80px);
    }

    /* Scrollbar Styling */
    .layout-sidebar::-webkit-scrollbar {
      width: 6px;
    }

    .layout-sidebar::-webkit-scrollbar-track {
      background: rgba(255,255,255,0.1);
    }

    .layout-sidebar::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.3);
      border-radius: 3px;
    }

    .layout-sidebar::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.5);
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  sidebarCollapsed = false;
  pageTitle = 'لوحة التحكم';
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.updatePageTitle();
    
    // Listen to route changes to update page title
    this.router.events.subscribe(() => {
      this.updatePageTitle();
    });
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  updatePageTitle() {
    const route = this.router.url;
    const titles: { [key: string]: string } = {
      '/dashboard': 'لوحة التحكم',
      '/users': 'إدارة المستخدمين',
      '/roles': 'إدارة الأدوار',
      '/permissions': 'إدارة الصلاحيات',
      '/holdings': 'إدارة الشركات القابضة',
      '/units': 'إدارة الوحدات',
      '/projects': 'إدارة المشاريع',
      '/customers': 'إدارة العملاء',
      '/suppliers': 'إدارة الموردين',
      '/items': 'إدارة الأصناف',
      '/reports': 'التقارير'
    };
    this.pageTitle = titles[route] || 'SEMOP ERP';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
