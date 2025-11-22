import { Route } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout.component';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'users', loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent) },
      { path: 'roles', loadComponent: () => import('./pages/roles/roles.component').then(m => m.RolesComponent) },
      { path: 'permissions', loadComponent: () => import('./pages/permissions/permissions.component').then(m => m.PermissionsComponent) },
      { path: 'holdings', loadComponent: () => import('./pages/holdings/holdings.component').then(m => m.HoldingsComponent) },
      { path: 'units', loadComponent: () => import('./pages/units/units.component').then(m => m.UnitsComponent) },
      { path: 'projects', loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent) },
      { path: 'customers', loadComponent: () => import('./pages/customers/customers.component').then(m => m.CustomersComponent) },
      { path: 'suppliers', loadComponent: () => import('./pages/suppliers/suppliers.component').then(m => m.SuppliersComponent) },
      { path: 'items', loadComponent: () => import('./pages/items/items.component').then(m => m.ItemsComponent) },
      { path: 'reports', loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent) },
      
      // Accounting Module Routes
      { path: 'accounts', loadComponent: () => import('./pages/accounting/accounts.component').then(m => m.AccountsComponent) },
      { path: 'accounting/journal-entries', loadComponent: () => import('./pages/accounting/journal-entries.component').then(m => m.JournalEntriesComponent) },
      { path: 'accounting/account-balances', loadComponent: () => import('./pages/accounting/account-balances.component').then(m => m.AccountBalancesComponent) },
      { path: 'accounting/account-hierarchy', loadComponent: () => import('./pages/accounting/account-hierarchy.component').then(m => m.AccountHierarchyComponent) },
      { path: 'accounting/fiscal-periods', loadComponent: () => import('./pages/accounting/fiscal-periods.component').then(m => m.FiscalPeriodsComponent) },
      { path: 'accounting/cost-centers', loadComponent: () => import('./pages/accounting/cost-centers.component').then(m => m.CostCentersComponent) },
      { path: 'accounting/fiscal-years', loadComponent: () => import('./pages/accounting/fiscal-years.component').then(m => m.FiscalYearsComponent) },
      
      // Inventory Module Routes
      { path: 'warehouses', loadComponent: () => import('./pages/warehouses/warehouses.component').then(m => m.WarehousesComponent) },
      
      // Genes System
      { path: 'genes', loadComponent: () => import('./pages/genes/genes.component').then(m => m.GenesComponent) },
      
      // Tasks System
      { path: 'tasks', loadComponent: () => import('./pages/tasks/tasks-list.component').then(m => m.TasksListComponent) },
      { path: 'tasks/list', loadComponent: () => import('./pages/tasks/tasks-list.component').then(m => m.TasksListComponent) },
      { path: 'tasks/kanban', loadComponent: () => import('./pages/tasks/tasks-kanban.component').then(m => m.TasksKanbanComponent) },
      
      // Maps System
      { path: 'maps', loadComponent: () => import('./features/maps/maps.component').then(m => m.MapsComponent) },
      
      // Smart Notebook System
      { path: 'smart-notebook', redirectTo: 'smart-notebook/dashboard', pathMatch: 'full' },
      { path: 'smart-notebook/dashboard', loadComponent: () => import('./pages/smart-notebook/dashboard/smart-dashboard.component').then(m => m.SmartDashboardComponent) },
      { path: 'smart-notebook/ideas', loadComponent: () => import('./pages/smart-notebook/ideas/ideas-bank.component').then(m => m.IdeasBankComponent) },
      { path: 'smart-notebook/chats', loadComponent: () => import('./pages/smart-notebook/chats/chat-logs.component').then(m => m.ChatLogsComponent) },
      { path: 'smart-notebook/reports', loadComponent: () => import('./pages/smart-notebook/reports/reports-library.component').then(m => m.ReportsLibraryComponent) },
      { path: 'smart-notebook/tasks', loadComponent: () => import('./pages/smart-notebook/notebook-tasks/notebook-tasks.component').then(m => m.NotebookTasksComponent) },
      
      { path: 'developer', loadComponent: () => import('./pages/developer/developer-chat.component').then(m => m.DeveloperChatComponent) },
      { path: 'documentation', loadComponent: () => import('./pages/documentation/documentation-viewer.component').then(m => m.DocumentationViewerComponent) },
      { path: 'documentation/user-guide', loadComponent: () => import('./pages/documentation/documentation-viewer.component').then(m => m.DocumentationViewerComponent) },
      { path: 'documentation/developer-guide', loadComponent: () => import('./pages/documentation/documentation-viewer.component').then(m => m.DocumentationViewerComponent) }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
