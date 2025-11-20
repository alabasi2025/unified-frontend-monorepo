import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'processing',
    loadComponent: () => import('./payrollprocessings/payrollprocessings-list.component').then(m => m.PayrollProcessingsListComponent)
  },
  {
    path: 'items',
    loadComponent: () => import('./payrollitems/payrollitems-list.component').then(m => m.PayrollItemsListComponent)
  }
];
