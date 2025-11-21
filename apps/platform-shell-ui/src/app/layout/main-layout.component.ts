import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface MenuSection {
  title: string;
  icon: string;
  items: MenuItem[];
  expanded?: boolean;
  color?: string; // لون مخصص لكل قسم
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
  animations: [
    trigger('slideDown', [
      state('collapsed', style({
        height: '0',
        opacity: '0'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ])
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
            <div class="logo-icon">
              <i class="pi pi-bolt"></i>
            </div>
            <span *ngIf="!sidebarCollapsed" class="logo-text">SEMOP ERP</span>
          </div>
        </div>

        <div class="sidebar-menu">
          <!-- الرئيسية -->
          <div class="menu-section">
            <a routerLink="/dashboard" routerLinkActive="active" class="menu-item dashboard-item">
              <div class="menu-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <i class="pi pi-home"></i>
              </div>
              <span *ngIf="!sidebarCollapsed">لوحة التحكم</span>
              <div class="menu-glow"></div>
            </a>
          </div>

          <!-- الأنظمة مع تبويبات منبثقة -->
          <div class="menu-section" *ngFor="let section of menuSections">
            <div class="menu-item parent" 
                 [class.active]="section.expanded"
                 (click)="toggleSection(section)">
              <div class="menu-icon" [style.background]="section.color">
                <i [class]="section.icon"></i>
              </div>
              <span *ngIf="!sidebarCollapsed">{{ section.title }}</span>
              <i *ngIf="!sidebarCollapsed" 
                 class="pi toggle-icon"
                 [class.pi-chevron-down]="!section.expanded"
                 [class.pi-chevron-up]="section.expanded"></i>
              <div class="menu-glow"></div>
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
                <div class="sub-glow"></div>
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
                class="p-button-text p-button-rounded logout-btn"
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
                class="user-avatar"
                [style]="{'background':'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 'color': '#ffffff'}">
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
      background: #f8f9fa;
    }

    .layout-wrapper.rtl {
      direction: rtl;
    }

    /* Sidebar - تصميم جديد مبهج */
    .layout-sidebar {
      width: 280px;
      background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: white;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 4px 0 20px rgba(0,0,0,0.15);
      position: fixed;
      right: 0;
      top: 0;
      bottom: 0;
      overflow-y: auto;
      overflow-x: hidden;
      z-index: 1000;
    }

    .layout-sidebar.collapsed {
      width: 80px;
    }

    .layout-sidebar::-webkit-scrollbar {
      width: 6px;
    }

    .layout-sidebar::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
      border-radius: 10px;
    }

    .layout-sidebar::-webkit-scrollbar-track {
      background: rgba(255,255,255,0.05);
    }

    /* Sidebar Header - تصميم جديد */
    .sidebar-header {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      border-bottom: 2px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(10px);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      white-space: nowrap;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      animation: pulse 2s ease-in-out infinite;
    }

    .logo-icon i {
      font-size: 1.5rem;
      color: white;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      }
    }

    .toggle-btn {
      color: white !important;
      flex-shrink: 0;
      background: rgba(255,255,255,0.1) !important;
      transition: all 0.3s ease;
    }

    .toggle-btn:hover {
      background: rgba(255,255,255,0.2) !important;
      transform: rotate(90deg);
    }

    /* Sidebar Menu - تصميم جديد */
    .sidebar-menu {
      padding: 1rem 0.5rem;
    }

    .menu-section {
      margin-bottom: 0.5rem;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: rgba(255,255,255,0.85);
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      white-space: nowrap;
      border-radius: 12px;
      margin: 0 0.5rem;
      overflow: hidden;
    }

    .menu-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 10px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
    }

    .menu-icon i {
      font-size: 1.125rem;
      color: white;
    }

    .menu-glow {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      transform: translateX(100%);
      transition: transform 0.6s ease;
    }

    .menu-item:hover .menu-glow {
      transform: translateX(-100%);
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
      transform: translateX(-3px);
    }

    .menu-item:hover .menu-icon {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 6px 15px rgba(0,0,0,0.3);
    }

    .menu-item.active {
      background: rgba(255,255,255,0.15);
      border-right: 4px solid #ffd700;
      box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
    }

    .menu-item.dashboard-item:hover {
      background: linear-gradient(90deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
    }

    .menu-item.sub {
      padding-right: 3rem;
      font-size: 0.9rem;
      color: rgba(255,255,255,0.75);
      margin: 0.25rem 0.5rem;
    }

    .menu-item.sub i {
      font-size: 0.875rem;
      color: rgba(255,255,255,0.6);
    }

    .sub-glow {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 0;
      background: linear-gradient(180deg, #667eea, #764ba2);
      transition: height 0.3s ease;
      border-radius: 2px;
    }

    .menu-item.sub:hover {
      background: rgba(255,255,255,0.08);
      padding-right: 2.9rem;
      color: white;
    }

    .menu-item.sub:hover .sub-glow {
      height: 70%;
    }

    .menu-item.sub.active {
      background: linear-gradient(90deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
      color: white;
      border-right: 3px solid #ffd700;
      font-weight: 500;
    }

    .menu-item.sub.active .sub-glow {
      height: 100%;
    }

    /* Submenu */
    .submenu {
      overflow: hidden;
    }

    /* Main Content */
    .layout-main {
      flex: 1;
      margin-right: 280px;
      transition: margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .layout-main.expanded {
      margin-right: 80px;
    }

    /* Topbar - تصميم محسّن */
    .layout-topbar {
      background: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 2px solid #f0f0f0;
    }

    .page-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-avatar {
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;
    }

    .user-avatar:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .logout-btn {
      color: #e74c3c !important;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      background: rgba(231, 76, 60, 0.1) !important;
      transform: rotate(15deg);
    }

    /* Content */
    .layout-content {
      padding: 2rem;
      animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
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
      padding: 0.75rem 0;
      margin: 0.5rem 0.5rem;
    }

    .layout-sidebar.collapsed .menu-icon {
      margin: 0 auto;
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
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
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
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
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
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
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
      color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
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
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
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
      color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      expanded: false,
      items: [
        { label: 'العملاء', icon: 'pi pi-user', routerLink: '/customers' },
        { label: 'الموردين', icon: 'pi pi-truck', routerLink: '/suppliers' }
      ]
    },
    {
      title: 'التقارير',
      icon: 'pi pi-chart-bar',
      color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      expanded: false,
      items: [
        { label: 'التقارير المالية', icon: 'pi pi-chart-line', routerLink: '/reports' }
      ]
    },
    {
      title: 'نظام الجينات',
      icon: 'pi pi-sparkles',
      color: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      expanded: false,
      items: [
        { label: '🧬 إدارة الجينات', icon: 'pi pi-cog', routerLink: '/genes' }
      ]
    },
    {
      title: 'إدارة المهام',
      icon: 'pi pi-check-square',
      color: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
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
      color: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
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
      color: 'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)',
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
