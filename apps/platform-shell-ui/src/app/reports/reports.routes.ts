import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'financial',
    loadComponent: () => import('./financialreports/financialreports-list.component').then(m => m.FinancialReportsListComponent)
  },
  {
    path: 'inventory',
    loadComponent: () => import('./inventoryreports/inventoryreports-list.component').then(m => m.InventoryReportsListComponent)
  },
  {
    path: 'hr',
    loadComponent: () => import('./hrreports/hrreports-list.component').then(m => m.HRReportsListComponent)
  }
];
