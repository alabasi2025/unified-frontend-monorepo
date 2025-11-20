import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'accounts',
    loadComponent: () => import('./accounts/accounts-list.component').then(m => m.AccountsListComponent)
  },
  {
    path: 'journal-entries',
    loadComponent: () => import('./journalentrys/journalentrys-list.component').then(m => m.JournalEntrysListComponent)
  },
  {
    path: 'cost-centers',
    loadComponent: () => import('./costcenters/costcenters-list.component').then(m => m.CostCentersListComponent)
  },
  {
    path: 'fiscal-years',
    loadComponent: () => import('./fiscalyears/fiscalyears-list.component').then(m => m.FiscalYearsListComponent)
  }
];
