import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, MenuModule, BadgeModule, AvatarModule],
  template: `
    <header class="layout-header">
      <div class="header-start">
        <button
          pButton
          icon="pi pi-bars"
          class="p-button-text p-button-rounded"
          (click)="toggleSidebar.emit()"
        ></button>
        
        <div class="header-breadcrumb">
          <span class="text-xl font-semibold">{{ pageTitle }}</span>
        </div>
      </div>

      <div class="header-end">
        <!-- Search -->
        <button
          pButton
          icon="pi pi-search"
          class="p-button-text p-button-rounded"
        ></button>

        <!-- Notifications -->
        <button
          pButton
          icon="pi pi-bell"
          class="p-button-text p-button-rounded"
          pBadge
          [value]="notificationCount"
          severity="danger"
        ></button>

        <!-- User Menu -->
        <div class="header-user">
          <p-avatar
            [label]="userInitials"
            shape="circle"
            [style]="{ 'background-color': '#2196F3', 'color': '#ffffff', 'cursor': 'pointer' }"
            (click)="userMenu.toggle($event)"
          ></p-avatar>
          <p-menu #userMenu [model]="userMenuItems" [popup]="true"></p-menu>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .layout-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: white;
      border-bottom: 1px solid var(--surface-border);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-start,
    .header-end {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-breadcrumb {
      margin-right: 1rem;
    }

    .header-user {
      position: relative;
    }

    @media (max-width: 768px) {
      .layout-header {
        padding: 1rem;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  pageTitle = 'لوحة التحكم';
  notificationCount = '3';
  userInitials = 'أ';
  userMenuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userInitials = (user.name || user.firstName)?.charAt(0).toUpperCase() || 'U';
    }

    this.userMenuItems = [
      {
        label: 'الملف الشخصي',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/profile'])
      },
      {
        label: 'الإعدادات',
        icon: 'pi pi-cog',
        command: () => this.router.navigate(['/settings'])
      },
      {
        separator: true
      },
      {
        label: 'تسجيل الخروج',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
