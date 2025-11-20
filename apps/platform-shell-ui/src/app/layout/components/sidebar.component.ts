import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  routerLink?: string;
  items?: MenuItem[];
  permission?: string;
  badge?: string;
  badgeSeverity?: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, RippleModule, TooltipModule],
  template: `
    <aside class="layout-sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <i class="pi pi-building text-primary text-3xl"></i>
          <span *ngIf="!collapsed" class="sidebar-logo-text">SEMOP</span>
        </div>
      </div>

      <nav class="sidebar-menu">
        <ul class="menu-list">
          <li *ngFor="let item of menuItems" class="menu-item">
            <a
              *ngIf="!item.items && hasPermission(item.permission)"
              [routerLink]="item.routerLink"
              routerLinkActive="active"
              class="menu-link"
              pRipple
              [pTooltip]="collapsed ? item.label : ''"
              tooltipPosition="left"
            >
              <i [class]="item.icon"></i>
              <span *ngIf="!collapsed" class="menu-label">{{ item.label }}</span>
              <span *ngIf="item.badge && !collapsed" [class]="'badge badge-' + (item.badgeSeverity || 'primary')">
                {{ item.badge }}
              </span>
            </a>

            <div *ngIf="item.items && hasPermission(item.permission)" class="menu-group">
              <div class="menu-group-header" (click)="toggleGroup(item)">
                <i [class]="item.icon"></i>
                <span *ngIf="!collapsed" class="menu-label">{{ item.label }}</span>
                <i *ngIf="!collapsed && item.items" [class]="item['expanded'] ? 'pi pi-chevron-down' : 'pi pi-chevron-left'" class="menu-toggle-icon"></i>
              </div>
              <ul *ngIf="item['expanded'] && !collapsed" class="submenu-list">
                <li *ngFor="let subItem of item.items" class="submenu-item">
                  <a
                    *ngIf="hasPermission(subItem.permission)"
                    [routerLink]="subItem.routerLink"
                    routerLinkActive="active"
                    class="submenu-link"
                    pRipple
                  >
                    <i [class]="subItem.icon"></i>
                    <span class="menu-label">{{ subItem.label }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <button
          pButton
          [icon]="collapsed ? 'pi pi-angle-double-left' : 'pi pi-angle-double-right'"
          class="p-button-text w-full"
          (click)="toggleSidebar.emit()"
          [pTooltip]="collapsed ? 'توسيع القائمة' : 'طي القائمة'"
          tooltipPosition="left"
        ></button>
      </div>
    </aside>
  `,
  styles: [`
    .layout-sidebar {
      width: 280px;
      background: var(--surface-card);
      border-left: 1px solid var(--surface-border);
      display: flex;
      flex-direction: column;
      position: fixed;
      right: 0;
      top: 0;
      height: 100vh;
      transition: width 0.3s;
      z-index: 999;
    }

    .layout-sidebar.collapsed {
      width: 80px;
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--surface-border);
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .sidebar-logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-color);
    }

    .sidebar-menu {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 0;
    }

    .menu-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .menu-item {
      margin-bottom: 0.25rem;
    }

    .menu-link,
    .menu-group-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1.5rem;
      color: var(--text-color);
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      position: relative;
    }

    .menu-link:hover,
    .menu-group-header:hover {
      background: var(--surface-hover);
    }

    .menu-link.active {
      background: var(--primary-color);
      color: white;
    }

    .menu-link.active::before {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background: var(--primary-color);
    }

    .menu-label {
      flex: 1;
      white-space: nowrap;
    }

    .menu-toggle-icon {
      font-size: 0.75rem;
      transition: transform 0.2s;
    }

    .submenu-list {
      list-style: none;
      padding: 0;
      margin: 0;
      background: var(--surface-ground);
    }

    .submenu-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1.5rem 0.75rem 3rem;
      color: var(--text-color-secondary);
      text-decoration: none;
      transition: all 0.2s;
      font-size: 0.875rem;
    }

    .submenu-link:hover {
      background: var(--surface-hover);
      color: var(--text-color);
    }

    .submenu-link.active {
      color: var(--primary-color);
      font-weight: 600;
    }

    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge-primary {
      background: var(--primary-color);
      color: white;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid var(--surface-border);
    }

    .collapsed .menu-label,
    .collapsed .menu-toggle-icon,
    .collapsed .badge {
      display: none;
    }

    .collapsed .menu-link,
    .collapsed .menu-group-header {
      justify-content: center;
      padding: 0.875rem;
    }

    @media (max-width: 991px) {
      .layout-sidebar {
        transform: translateX(100%);
      }

      .layout-sidebar:not(.collapsed) {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    {
      label: 'لوحة التحكم',
      icon: 'pi pi-home',
      routerLink: '/dashboard'
    },
    {
      label: 'الكيانات',
      icon: 'pi pi-building',
      items: [
        { label: 'الشركات القابضة', icon: 'pi pi-briefcase', routerLink: '/entities/holdings', permission: 'holdings.view' },
        { label: 'الوحدات', icon: 'pi pi-sitemap', routerLink: '/entities/units', permission: 'units.view' },
        { label: 'المشاريع', icon: 'pi pi-folder', routerLink: '/entities/projects', permission: 'projects.view' }
      ]
    },
    {
      label: 'المستخدمون والصلاحيات',
      icon: 'pi pi-users',
      items: [
        { label: 'المستخدمون', icon: 'pi pi-user', routerLink: '/users', permission: 'users.view' },
        { label: 'الأدوار', icon: 'pi pi-shield', routerLink: '/users/roles', permission: 'roles.view' },
        { label: 'الصلاحيات', icon: 'pi pi-lock', routerLink: '/users/permissions', permission: 'permissions.view' }
      ]
    },
    {
      label: 'المحاسبة',
      icon: 'pi pi-calculator',
      items: [
        { label: 'دليل الحسابات', icon: 'pi pi-list', routerLink: '/accounting/accounts', permission: 'accounts.view' },
        { label: 'القيود اليومية', icon: 'pi pi-book', routerLink: '/accounting/journal-entries', permission: 'journal_entries.view' },
        { label: 'مراكز التكلفة', icon: 'pi pi-tag', routerLink: '/accounting/cost-centers', permission: 'cost_centers.view' },
        { label: 'السنوات المالية', icon: 'pi pi-calendar', routerLink: '/accounting/fiscal-years', permission: 'fiscal_years.view' }
      ]
    },
    {
      label: 'المخزون',
      icon: 'pi pi-box',
      items: [
        { label: 'الأصناف', icon: 'pi pi-shopping-bag', routerLink: '/inventory/items', permission: 'items.view' },
        { label: 'المستودعات', icon: 'pi pi-warehouse', routerLink: '/inventory/warehouses', permission: 'warehouses.view' },
        { label: 'حركات المخزون', icon: 'pi pi-arrows-h', routerLink: '/inventory/movements', permission: 'stock_movements.view' }
      ]
    },
    {
      label: 'المشتريات',
      icon: 'pi pi-shopping-cart',
      items: [
        { label: 'الموردون', icon: 'pi pi-truck', routerLink: '/purchases/suppliers', permission: 'suppliers.view' },
        { label: 'طلبات الشراء', icon: 'pi pi-file', routerLink: '/purchases/orders', permission: 'purchase_orders.view' },
        { label: 'فواتير الشراء', icon: 'pi pi-file-invoice', routerLink: '/purchases/invoices', permission: 'purchase_invoices.view' }
      ]
    },
    {
      label: 'المبيعات',
      icon: 'pi pi-dollar',
      items: [
        { label: 'العملاء', icon: 'pi pi-users', routerLink: '/sales/customers', permission: 'customers.view' },
        { label: 'عروض الأسعار', icon: 'pi pi-file-edit', routerLink: '/sales/quotations', permission: 'quotations.view' },
        { label: 'طلبات البيع', icon: 'pi pi-file', routerLink: '/sales/orders', permission: 'sales_orders.view' },
        { label: 'فواتير البيع', icon: 'pi pi-file-invoice', routerLink: '/sales/invoices', permission: 'sales_invoices.view' }
      ]
    },
    {
      label: 'الموارد البشرية',
      icon: 'pi pi-id-card',
      items: [
        { label: 'الموظفون', icon: 'pi pi-user', routerLink: '/hr/employees', permission: 'employees.view' },
        { label: 'الأقسام', icon: 'pi pi-sitemap', routerLink: '/hr/departments', permission: 'departments.view' },
        { label: 'الحضور والانصراف', icon: 'pi pi-clock', routerLink: '/hr/attendance', permission: 'attendance.view' },
        { label: 'الإجازات', icon: 'pi pi-calendar-times', routerLink: '/hr/leaves', permission: 'leaves.view' }
      ]
    },
    {
      label: 'الرواتب',
      icon: 'pi pi-money-bill',
      items: [
        { label: 'معالجة الرواتب', icon: 'pi pi-calculator', routerLink: '/payroll/processing', permission: 'payroll.process' },
        { label: 'بنود الرواتب', icon: 'pi pi-list', routerLink: '/payroll/items', permission: 'payroll_items.view' },
        { label: 'تقارير الرواتب', icon: 'pi pi-chart-bar', routerLink: '/payroll/reports', permission: 'payroll.view' }
      ]
    },
    {
      label: 'التقارير',
      icon: 'pi pi-chart-line',
      items: [
        { label: 'التقارير المالية', icon: 'pi pi-chart-bar', routerLink: '/reports/financial', permission: 'reports.view' },
        { label: 'تقارير المخزون', icon: 'pi pi-box', routerLink: '/reports/inventory', permission: 'reports.view' },
        { label: 'تقارير الموارد البشرية', icon: 'pi pi-users', routerLink: '/reports/hr', permission: 'reports.view' }
      ]
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Auto-expand active menu groups
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.expandActiveGroups();
      });

    this.expandActiveGroups();
  }

  hasPermission(permission?: string): boolean {
    if (!permission) return true;
    return this.authService.hasPermission(permission);
  }

  toggleGroup(item: MenuItem) {
    item['expanded'] = !item['expanded'];
  }

  private expandActiveGroups() {
    const currentUrl = this.router.url;
    this.menuItems.forEach(item => {
      if (item.items) {
        const hasActiveChild = item.items.some(subItem => 
          subItem.routerLink && currentUrl.startsWith(subItem.routerLink)
        );
        if (hasActiveChild) {
          item['expanded'] = true;
        }
      }
    });
  }
}
