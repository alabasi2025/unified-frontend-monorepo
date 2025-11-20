import { Route } from '@angular/router';
import { authGuard } from './guards/auth.guard';

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
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'roles',
    loadComponent: () => import('./pages/roles/roles.component').then(m => m.RolesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'permissions',
    loadComponent: () => import('./pages/permissions/permissions.component').then(m => m.PermissionsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'holdings',
    loadComponent: () => import('./pages/holdings/holdings.component').then(m => m.HoldingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'units',
    loadComponent: () => import('./pages/units/units.component').then(m => m.UnitsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'customers',
    loadComponent: () => import('./pages/customers/customers.component').then(m => m.CustomersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'suppliers',
    loadComponent: () => import('./pages/suppliers/suppliers.component').then(m => m.SuppliersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'items',
    loadComponent: () => import('./pages/items/items.component').then(m => m.ItemsComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
