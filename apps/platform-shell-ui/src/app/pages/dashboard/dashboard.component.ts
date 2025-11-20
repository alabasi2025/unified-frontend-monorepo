import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MenubarModule, CardModule, ButtonModule],
  template: `
    <p-menubar [model]="menuItems">
      <ng-template pTemplate="start">
        <span class="text-xl font-bold">SEMOP ERP</span>
      </ng-template>
    </p-menubar>

    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">لوحة التحكم الرئيسية</h1>
      
      <div class="grid">
        <div class="col-12 md:col-6 lg:col-3">
          <p-card header="المستخدمين" styleClass="text-center">
            <i class="pi pi-users text-4xl text-primary mb-3"></i>
            <p class="text-2xl font-bold">150</p>
            <p-button label="عرض" (onClick)="navigate('/users')" styleClass="w-full mt-2"></p-button>
          </p-card>
        </div>
        
        <div class="col-12 md:col-6 lg:col-3">
          <p-card header="الأدوار" styleClass="text-center">
            <i class="pi pi-shield text-4xl text-success mb-3"></i>
            <p class="text-2xl font-bold">12</p>
            <p-button label="عرض" (onClick)="navigate('/roles')" styleClass="w-full mt-2"></p-button>
          </p-card>
        </div>
        
        <div class="col-12 md:col-6 lg:col-3">
          <p-card header="العملاء" styleClass="text-center">
            <i class="pi pi-briefcase text-4xl text-warning mb-3"></i>
            <p class="text-2xl font-bold">450</p>
            <p-button label="عرض" (onClick)="navigate('/customers')" styleClass="w-full mt-2"></p-button>
          </p-card>
        </div>
        
        <div class="col-12 md:col-6 lg:col-3">
          <p-card header="الموردين" styleClass="text-center">
            <i class="pi pi-shopping-cart text-4xl text-danger mb-3"></i>
            <p class="text-2xl font-bold">280</p>
            <p-button label="عرض" (onClick)="navigate('/suppliers')" styleClass="w-full mt-2"></p-button>
          </p-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-menubar {
      margin-bottom: 2rem;
    }
  `]
})
export class DashboardComponent {
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

  constructor(private router: Router) {}

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
