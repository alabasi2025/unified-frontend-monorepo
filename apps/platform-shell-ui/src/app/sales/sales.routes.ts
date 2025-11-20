import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'customers',
    loadComponent: () => import('./customers/customers-list.component').then(m => m.CustomersListComponent)
  },
  {
    path: 'quotations',
    loadComponent: () => import('./quotations/quotations-list.component').then(m => m.QuotationsListComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./salesorders/salesorders-list.component').then(m => m.SalesOrdersListComponent)
  },
  {
    path: 'invoices',
    loadComponent: () => import('./salesinvoices/salesinvoices-list.component').then(m => m.SalesInvoicesListComponent)
  }
];
