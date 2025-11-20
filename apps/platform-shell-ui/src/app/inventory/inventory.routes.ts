import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'items',
    loadComponent: () => import('./items/items-list.component').then(m => m.ItemsListComponent)
  },
  {
    path: 'warehouses',
    loadComponent: () => import('./warehouses/warehouses-list.component').then(m => m.WarehousesListComponent)
  },
  {
    path: 'movements',
    loadComponent: () => import('./movements/movements-list.component').then(m => m.MovementsListComponent)
  }
];
