import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Auth routes (no layout)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./auth').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./auth').then(m => m.ResetPasswordComponent)
      }
    ]
  },

  // Main application routes (with layout)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./auth').then(m => m.ProfileComponent)
      },

      // Entities Module
      {
        path: 'entities/holdings',
        children: [
          {
            path: '',
            loadComponent: () => import('./entities/holdings/holdings-list.component').then(m => m.HoldingsListComponent)
          }
        ]
      },

      // Users Module  
      {
        path: 'users',
        children: [
          {
            path: '',
            loadComponent: () => import('./users/users/users-list.component').then(m => m.UsersListComponent)
          }
        ]
      },

      // Feature modules - simplified
      {
        path: 'accounting',
        loadChildren: () => import('./accounting/accounting.routes').then(m => m.routes)
      },
      {
        path: 'inventory',
        loadChildren: () => import('./inventory/inventory.routes').then(m => m.routes)
      },
      {
        path: 'purchases',
        loadChildren: () => import('./purchases/purchases.routes').then(m => m.routes)
      },
      {
        path: 'sales',
        loadChildren: () => import('./sales/sales.routes').then(m => m.routes)
      },
      {
        path: 'hr',
        loadChildren: () => import('./hr/hr.routes').then(m => m.routes)
      },
      {
        path: 'payroll',
        loadChildren: () => import('./payroll/payroll.routes').then(m => m.routes)
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.routes').then(m => m.routes)
      }
    ]
  },

  // 404
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
