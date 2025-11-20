import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent)
  },
  {
    path: 'roles',
    loadComponent: () => import('./pages/roles/roles.component').then(m => m.RolesComponent)
  },
  {
    path: 'permissions',
    loadComponent: () => import('./pages/permissions/permissions.component').then(m => m.PermissionsComponent)
  },
  {
    path: 'holdings',
    loadComponent: () => import('./pages/holdings/holdings.component').then(m => m.HoldingsComponent)
  },
  {
    path: 'units',
    loadComponent: () => import('./pages/units/units.component').then(m => m.UnitsComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'customers',
    loadComponent: () => import('./pages/customers/customers.component').then(m => m.CustomersComponent)
  },
  {
    path: 'suppliers',
    loadComponent: () => import('./pages/suppliers/suppliers.component').then(m => m.SuppliersComponent)
  },
  {
    path: 'items',
    loadComponent: () => import('./pages/items/items.component').then(m => m.ItemsComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
