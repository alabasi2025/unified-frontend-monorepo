import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../services/auth.service';

interface MenuSection {
  title: string;
  icon: string;
  items: MenuItem[];
  expanded?: boolean;
}

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
    <div class="layout-wrapper rtl">
      <!-- Sidebar -->
      <div class="layout-sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="sidebar-header">
          <button 
            pButton 
            icon="pi pi-bars" 
            class="p-button-text p-button-rounded toggle-btn"
            (click)="toggleSidebar()">
          </button>
          <div class="logo">
            <i class="pi pi-building"></i>
            <span *ngIf="!sidebarCollapsed">SEMOP ERP</span>
          </div>
        </div>

        <div class="sidebar-menu">
          <!-- الرئيسية -->
          <div class="menu-section">
            <a routerLink="/dashboard" routerLinkActive="active" class="menu-item">
              <i class="pi pi-home"></i>
              <span *ngIf="!sidebarCollapsed">لوحة التحكم</span>
            </a>
          </div>

          <!-- الأنظمة مع تبويبات منبثقة -->
          <div class="menu-section" *ngFor="let section of menuSections">
            <div class="menu-item parent" 
                 [class.active]="section.expanded"
                 (click)="toggleSection(section)">
              <i [class]="section.icon"></i>
              <span *ngIf="!sidebarCollapsed">{{ section.title }}</span>
              <i *ngIf="!sidebarCollapsed" 
                 class="pi toggle-icon"
                 [class.pi-chevron-down]="!section.expanded"
                 [class.pi-chevron-up]="section.expanded"></i>
            </div>
            
            <div class="submenu" 
                 [class.expanded]="section.expanded && !sidebarCollapsed"
                 [@slideDown]="section.expanded && !sidebarCollapsed ? 'expanded' : 'collapsed'">
              <a *ngFor="let item of section.items" 
                 [routerLink]="item.routerLink" 
                 routerLinkActive="active"
                 class="menu-item sub">
                <i [class]="item.icon"></i>
                <span>{{ item.label }}</span>
              </a>
            </div>
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
              <button 
                pButton 
                icon="pi pi-sign-out" 
                class="p-button-text p-button-rounded"
                (click)="logout()"
                pTooltip="تسجيل خروج"
                tooltipPosition="bottom">
              </button>
              <div class="user-details">
                <span class="username">{{ currentUser?.username }}</span>
                <span class="role">مدير النظام</span>
              </div>
              <p-avatar 
                [label]="currentUser?.username?.charAt(0).toUpperCase()" 
                shape="circle" 
                [style]="{'background-color':'#2196F3', 'color': '#ffffff'}">
              </p-avatar>
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
      background: #f5f5f5;
    }

    .layout-wrapper.rtl {
      direction: rtl;
    }

    /* Sidebar */
    .layout-sidebar {
      width: 280px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
      position: fixed;
      right: 0;
      top: 0;
      bottom: 0;
      overflow-y: auto;
      overflow-x: hidden;
      z-index: 1000;
    }

    .layout-sidebar.collapsed {
      width: 70px;
    }

    .layout-sidebar::-webkit-scrollbar {
      width: 6px;
    }

    .layout-sidebar::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.3);
      border-radius: 3px;
    }

    /* Sidebar Header */
    .sidebar-header {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      gap: 1rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 700;
      white-space: nowrap;
    }

    .logo i {
      font-size: 1.5rem;
    }

    .toggle-btn {
      color: white !important;
      flex-shrink: 0;
    }

    /* Sidebar Menu */
    .sidebar-menu {
      padding: 1rem 0;
    }

    .menu-section {
      margin-bottom: 0.5rem;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.5rem;
      color: rgba(255,255,255,0.9);
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
      position: relative;
      white-space: nowrap;
    }

    .menu-item i {
      font-size: 1.125rem;
      flex-shrink: 0;
    }

    .menu-item.parent {
      font-weight: 600;
      justify-content: space-between;
    }

    .menu-item.parent .toggle-icon {
      margin-right: auto;
      font-size: 0.875rem;
      transition: transform 0.3s ease;
    }

    .menu-item:hover {
      background: rgba(255,255,255,0.1);
    }

    .menu-item.active {
      background: rgba(255,255,255,0.15);
      border-right: 3px solid white;
    }

    .menu-item.sub {
      padding-right: 3rem;
      font-size: 0.9rem;
      color: rgba(255,255,255,0.8);
    }

    .menu-item.sub:hover {
      background: rgba(255,255,255,0.08);
      padding-right: 2.9rem;
    }

    .menu-item.sub.active {
      background: rgba(255,255,255,0.12);
      color: white;
      border-right: 3px solid #ffd700;
    }

    /* Submenu */
    .submenu {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .submenu.expanded {
      max-height: 1000px;
    }

    /* Main Content */
    .layout-main {
      flex: 1;
      margin-right: 280px;
      transition: margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .layout-main.expanded {
      margin-right: 70px;
    }

    /* Topbar */
    .layout-topbar {
      background: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .page-title {
      margin: 0;
      font-size: 1.5rem;
      color: #333;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .username {
      font-weight: 600;
      color: #333;
    }

    .role {
      font-size: 0.875rem;
      color: #666;
    }

    /* Content */
    .layout-content {
      padding: 2rem;
    }

    /* Collapsed State */
    .layout-sidebar.collapsed .menu-item span {
      display: none;
    }

    .layout-sidebar.collapsed .menu-item.parent .toggle-icon {
      display: none;
    }

    .layout-sidebar.collapsed .submenu {
      display: none;
    }

    .layout-sidebar.collapsed .menu-item {
      justify-content: center;
      padding: 0.875rem 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .layout-sidebar {
        transform: translateX(100%);
      }

      .layout-sidebar.collapsed {
        transform: translateX(0);
      }

      .layout-main {
        margin-right: 0;
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  sidebarCollapsed = false;
  pageTitle = 'لوحة التحكم';
  currentUser: any;
  
  menuSections: MenuSection[] = [
    {
      title: 'الإدارة',
      icon: 'pi pi-users',
      expanded: false,
      items: [
        { label: 'المستخدمين', icon: 'pi pi-user', routerLink: '/users' },
        { label: 'الأدوار', icon: 'pi pi-shield', routerLink: '/roles' },
        { label: 'الصلاحيات', icon: 'pi pi-lock', routerLink: '/permissions' }
      ]
    },
    {
      title: 'الهيكل التنظيمي',
      icon: 'pi pi-sitemap',
      expanded: false,
      items: [
        { label: 'الشركات القابضة', icon: 'pi pi-building', routerLink: '/holdings' },
        { label: 'الوحدات', icon: 'pi pi-box', routerLink: '/units' },
        { label: 'المشاريع', icon: 'pi pi-briefcase', routerLink: '/projects' }
      ]
    },
    {
      title: 'المحاسبة',
      icon: 'pi pi-wallet',
      expanded: false,
      items: [
        { label: 'دليل الحسابات', icon: 'pi pi-list', routerLink: '/accounts' },
        { label: 'التسلسل الهرمي', icon: 'pi pi-sitemap', routerLink: '/accounting/account-hierarchy' },
        { label: 'أرصدة الحسابات', icon: 'pi pi-money-bill', routerLink: '/accounting/account-balances' },
        { label: 'القيود اليومية', icon: 'pi pi-book', routerLink: '/accounting/journal-entries' },
        { label: 'مراكز التكلفة', icon: 'pi pi-chart-pie', routerLink: '/accounting/cost-centers' },
        { label: 'السنوات المالية', icon: 'pi pi-calendar', routerLink: '/accounting/fiscal-years' },
        { label: 'الفترات المالية', icon: 'pi pi-clock', routerLink: '/accounting/fiscal-periods' }
      ]
    },
    {
      title: 'المخزون',
      icon: 'pi pi-database',
      expanded: false,
      items: [
        { label: 'المستودعات', icon: 'pi pi-home', routerLink: '/warehouses' },
        { label: 'الأصناف', icon: 'pi pi-tags', routerLink: '/items' },
        { label: 'حركات المخزون', icon: 'pi pi-arrows-h', routerLink: '/stock-movements' },
        { label: 'جرد المخزون', icon: 'pi pi-check-square', routerLink: '/stock-counts' }
      ]
    },
    {
      title: 'المشتريات',
      icon: 'pi pi-shopping-cart',
      expanded: false,
      items: [
        { label: 'أوامر الشراء', icon: 'pi pi-file', routerLink: '/purchase-orders' },
        { label: 'فواتير الشراء', icon: 'pi pi-file-invoice', routerLink: '/purchase-invoices' },
        { label: 'مرتجعات المشتريات', icon: 'pi pi-replay', routerLink: '/purchase-returns' }
      ]
    },
    {
      title: 'المبيعات',
      icon: 'pi pi-dollar',
      expanded: false,
      items: [
        { label: 'أوامر البيع', icon: 'pi pi-file', routerLink: '/sales-orders' },
        { label: 'فواتير البيع', icon: 'pi pi-file-invoice', routerLink: '/sales-invoices' },
        { label: 'مرتجعات المبيعات', icon: 'pi pi-replay', routerLink: '/sales-returns' }
      ]
    },
    {
      title: 'العملاء والموردين',
      icon: 'pi pi-users',
      expanded: false,
      items: [
        { label: 'العملاء', icon: 'pi pi-user', routerLink: '/customers' },
        { label: 'الموردين', icon: 'pi pi-truck', routerLink: '/suppliers' }
      ]
    },
    {
      title: 'التقارير',
      icon: 'pi pi-chart-bar',
      expanded: false,
      items: [
        { label: 'التقارير المالية', icon: 'pi pi-chart-line', routerLink: '/reports' }
      ]
    },
    {
      title: 'نظام الجينات',
      icon: 'pi pi-sparkles',
      expanded: false,
      items: [
        { label: '🧬 إدارة الجينات', icon: 'pi pi-cog', routerLink: '/genes' }
      ]
    },
    {
      title: 'إدارة المهام',
      icon: 'pi pi-check-square',
      expanded: false,
      items: [
        { label: 'قائمة المهام', icon: 'pi pi-list', routerLink: '/tasks' },
        { label: 'المهام النشطة', icon: 'pi pi-play', routerLink: '/tasks/active' },
        { label: 'المهام المكتملة', icon: 'pi pi-check', routerLink: '/tasks/completed' },
        { label: 'لوحة كانبان', icon: 'pi pi-th-large', routerLink: '/tasks/kanban' }
      ]
    },
    {
      title: 'التوثيق',
      icon: 'pi pi-book',
      expanded: false,
      items: [
        { label: 'المخطط الشامل', icon: 'pi pi-file', routerLink: '/documentation' },
        { label: 'دليل المستخدم', icon: 'pi pi-question-circle', routerLink: '/documentation/user-guide' },
        { label: 'دليل المطور', icon: 'pi pi-code', routerLink: '/documentation/developer-guide' }
      ]
    },
    {
      title: 'التطوير',
      icon: 'pi pi-code',
      expanded: false,
      items: [
        { label: 'المطور (AI)', icon: 'pi pi-sparkles', routerLink: '/developer' },
        { label: 'API Explorer', icon: 'pi pi-server', routerLink: '/developer/api' }
      ]
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.updatePageTitle();
    
    this.router.events.subscribe(() => {
      this.updatePageTitle();
    });
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleSection(section: MenuSection) {
    if (!this.sidebarCollapsed) {
      section.expanded = !section.expanded;
    }
  }

  updatePageTitle() {
    const url = this.router.url;
    const titles: { [key: string]: string } = {
      '/dashboard': 'لوحة التحكم',
      '/users': 'المستخدمين',
      '/roles': 'الأدوار',
      '/permissions': 'الصلاحيات',
      '/holdings': 'الشركات القابضة',
      '/units': 'الوحدات',
      '/projects': 'المشاريع',
      '/accounts': 'دليل الحسابات',
      '/customers': 'العملاء',
      '/suppliers': 'الموردين',
      '/items': 'الأصناف',
      '/reports': 'التقارير',
      '/genes': 'نظام الجينات',
      '/tasks': 'إدارة المهام',
      '/tasks/active': 'المهام النشطة',
      '/tasks/completed': 'المهام المكتملة',
      '/tasks/kanban': 'لوحة كانبان',
      '/developer': 'المطور (AI)',
      '/documentation': 'التوثيق',
      '/documentation/user-guide': 'دليل المستخدم',
      '/documentation/developer-guide': 'دليل المطور'
    };
    this.pageTitle = titles[url] || 'SEMOP ERP';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
