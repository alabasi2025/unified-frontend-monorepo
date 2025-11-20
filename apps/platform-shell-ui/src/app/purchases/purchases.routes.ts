import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'suppliers',
    loadComponent: () => import('./suppliers/suppliers-list.component').then(m => m.SuppliersListComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./purchaseorders/purchaseorders-list.component').then(m => m.PurchaseOrdersListComponent)
  },
  {
    path: 'invoices',
    loadComponent: () => import('./purchaseinvoices/purchaseinvoices-list.component').then(m => m.PurchaseInvoicesListComponent)
  }
];
