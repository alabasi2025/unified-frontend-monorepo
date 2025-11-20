import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header.component';
import { SidebarComponent } from './sidebar.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent, FooterComponent],
  template: `
    <div class="layout-wrapper" [class.layout-sidebar-collapsed]="sidebarCollapsed">
      <app-sidebar
        [collapsed]="sidebarCollapsed"
        (toggleSidebar)="toggleSidebar()"
      ></app-sidebar>
      
      <div class="layout-main">
        <app-header
          (toggleSidebar)="toggleSidebar()"
        ></app-header>
        
        <div class="layout-content">
          <router-outlet></router-outlet>
        </div>
        
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      min-height: 100vh;
      background: var(--surface-ground);
    }

    .layout-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-right: 280px;
      transition: margin-right 0.3s;
    }

    .layout-sidebar-collapsed .layout-main {
      margin-right: 80px;
    }

    .layout-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    @media (max-width: 991px) {
      .layout-main {
        margin-right: 0;
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  sidebarCollapsed = false;

  ngOnInit() {
    // Check localStorage for sidebar state
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      this.sidebarCollapsed = savedState === 'true';
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem('sidebarCollapsed', String(this.sidebarCollapsed));
  }
}
