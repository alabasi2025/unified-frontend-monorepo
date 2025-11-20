import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbModule],
  template: `
    <p-breadcrumb [model]="items" [home]="home" styleClass="bg-transparent border-none"></p-breadcrumb>
  `
})
export class BreadcrumbComponent {
  @Input() items: MenuItem[] = [];
  @Input() home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
}
