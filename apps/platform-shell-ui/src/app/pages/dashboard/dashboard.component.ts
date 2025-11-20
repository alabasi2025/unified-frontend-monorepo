import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MenubarModule, CardModule, ButtonModule],
  template: `
    <p-menubar [model]="menuItems">
      <ng-template pTemplate="start">
        <span class="text-xl font-bold">SEMOP ERP</span>
      </ng-template>
      <ng-template pTemplate="end">
        <div class="flex align-items-center gap-2">
          <span class="text-sm">{{ currentUser?.username }}</span>
          <p-button label="تسجيل خروج" icon="pi pi-sign-out" severity="danger" [text]="true" (onClick)="logout()"></p-button>
        </div>
      </ng-template>
    </p-menubar>

    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">لوحة التحكم الرئيسية</h1>
      
      @if (loading) {
        <div class="text-center p-5">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          <p>جاري تحميل الإحصائيات...</p>
        </div>
      } @else {
        <div class="grid">
          <div class="col-12 md:col-6 lg:col-3">
            <p-card header="المستخدمين" styleClass="text-center">
              <i class="pi pi-users text-4xl text-primary mb-3"></i>
              <p class="text-2xl font-bold">{{ stats.usersCount }}</p>
              <p-button label="عرض" (onClick)="navigate('/users')" styleClass="w-full mt-2"></p-button>
            </p-card>
          </div>
          
          <div class="col-12 md:col-6 lg:col-3">
            <p-card header="الأدوار" styleClass="text-center">
              <i class="pi pi-shield text-4xl text-success mb-3"></i>
              <p class="text-2xl font-bold">{{ stats.rolesCount }}</p>
              <p-button label="عرض" (onClick)="navigate('/roles')" styleClass="w-full mt-2"></p-button>
            </p-card>
          </div>
          
          <div class="col-12 md:col-6 lg:col-3">
            <p-card header="العملاء" styleClass="text-center">
              <i class="pi pi-briefcase text-4xl text-warning mb-3"></i>
              <p class="text-2xl font-bold">{{ stats.customersCount }}</p>
              <p-button label="عرض" (onClick)="navigate('/customers')" styleClass="w-full mt-2"></p-button>
            </p-card>
          </div>
          
          <div class="col-12 md:col-6 lg:col-3">
            <p-card header="الموردين" styleClass="text-center">
              <i class="pi pi-shopping-cart text-4xl text-danger mb-3"></i>
              <p class="text-2xl font-bold">{{ stats.suppliersCount }}</p>
              <p-button label="عرض" (onClick)="navigate('/suppliers')" styleClass="w-full mt-2"></p-button>
            </p-card>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-menubar {
      margin-bottom: 2rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  menuItems: MenuItem[] = [
    {
      label: 'الرئيسية',
      icon: 'pi pi-home',
      command: () => this.navigate('/dashboard')
    },
    {
      label: 'الإدارة',
      icon: 'pi pi-cog',
      items: [
        { label: 'المستخدمين', icon: 'pi pi-users', command: () => this.navigate('/users') },
        { label: 'الأدوار', icon: 'pi pi-shield', command: () => this.navigate('/roles') },
        { label: 'الصلاحيات', icon: 'pi pi-lock', command: () => this.navigate('/permissions') }
      ]
    },
    {
      label: 'الهيكل التنظيمي',
      icon: 'pi pi-sitemap',
      items: [
        { label: 'الشركات القابضة', icon: 'pi pi-building', command: () => this.navigate('/holdings') },
        { label: 'الوحدات', icon: 'pi pi-box', command: () => this.navigate('/units') },
        { label: 'المشاريع', icon: 'pi pi-folder', command: () => this.navigate('/projects') }
      ]
    },
    {
      label: 'العمليات',
      icon: 'pi pi-briefcase',
      items: [
        { label: 'العملاء', icon: 'pi pi-user', command: () => this.navigate('/customers') },
        { label: 'الموردين', icon: 'pi pi-shopping-cart', command: () => this.navigate('/suppliers') },
        { label: 'الأصناف', icon: 'pi pi-tags', command: () => this.navigate('/items') }
      ]
    },
    {
      label: 'التقارير',
      icon: 'pi pi-chart-bar',
      command: () => this.navigate('/reports')
    }
  ];

  stats = {
    usersCount: 0,
    rolesCount: 0,
    customersCount: 0,
    suppliersCount: 0
  };

  loading = false;
  currentUser: any = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    
    // Load statistics from API
    this.http.get<any>('/api/dashboard/stats').subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        // Use dummy data if API fails
        this.stats = {
          usersCount: 0,
          rolesCount: 0,
          customersCount: 0,
          suppliersCount: 0
        };
        console.error('Error loading stats:', error);
      }
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
