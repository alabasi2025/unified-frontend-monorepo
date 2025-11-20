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
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
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
        path: 'reports',
        loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent)
      },
      // Accounting
      { path: 'accounts', loadComponent: () => import('./pages/accounting/accounts/accounts.component').then(m => m.AccountsComponent) },
      { path: 'journal-entries', loadComponent: () => import('./pages/accounting/journal-entries/journal-entries.component').then(m => m.JournalEntriesComponent) },
      { path: 'cost-centers', loadComponent: () => import('./pages/accounting/cost-centers/cost-centers.component').then(m => m.CostCentersComponent) },
      { path: 'fiscal-years', loadComponent: () => import('./pages/accounting/fiscal-years/fiscal-years.component').then(m => m.FiscalYearsComponent) },
      { path: 'fiscal-periods', loadComponent: () => import('./pages/accounting/fiscal-periods/fiscal-periods.component').then(m => m.FiscalPeriodsComponent) },
      { path: 'account-balances', loadComponent: () => import('./pages/accounting/account-balances/account-balances.component').then(m => m.AccountBalancesComponent) },
      { path: 'account-hierarchy', loadComponent: () => import('./pages/accounting/account-hierarchy/account-hierarchy.component').then(m => m.AccountHierarchyComponent) },
      // Inventory
      { path: 'warehouses', loadComponent: () => import('./pages/inventory/warehouses/warehouses.component').then(m => m.WarehousesComponent) },
      { path: 'stock-levels', loadComponent: () => import('./pages/inventory/stock-levels/stock-levels.component').then(m => m.StockLevelsComponent) },
      { path: 'stock-movements', loadComponent: () => import('./pages/inventory/stock-movements/stock-movements.component').then(m => m.StockMovementsComponent) },
      { path: 'stock-counts', loadComponent: () => import('./pages/inventory/stock-counts/stock-counts.component').then(m => m.StockCountsComponent) },
      { path: 'item-categories', loadComponent: () => import('./pages/inventory/item-categories/item-categories.component').then(m => m.ItemCategoriesComponent) },
      // Purchases
      { path: 'purchase-orders', loadComponent: () => import('./pages/purchases/purchase-orders/purchase-orders.component').then(m => m.PurchaseOrdersComponent) },
      { path: 'purchase-invoices', loadComponent: () => import('./pages/purchases/purchase-invoices/purchase-invoices.component').then(m => m.PurchaseInvoicesComponent) },
      { path: 'purchase-returns', loadComponent: () => import('./pages/purchases/purchase-returns/purchase-returns.component').then(m => m.PurchaseReturnsComponent) },
      // Sales
      { path: 'sales-orders', loadComponent: () => import('./pages/sales/sales-orders/sales-orders.component').then(m => m.SalesOrdersComponent) },
      { path: 'sales-invoices', loadComponent: () => import('./pages/sales/sales-invoices/sales-invoices.component').then(m => m.SalesInvoicesComponent) },
      { path: 'sales-returns', loadComponent: () => import('./pages/sales/sales-returns/sales-returns.component').then(m => m.SalesReturnsComponent) },
      // Suppliers & Customers
      { path: 'supplier-categories', loadComponent: () => import('./pages/supplier-categories/supplier-categories.component').then(m => m.SupplierCategoriesComponent) },
      { path: 'supplier-addresses', loadComponent: () => import('./pages/supplier-addresses/supplier-addresses.component').then(m => m.SupplierAddressesComponent) },
      { path: 'supplier-contacts', loadComponent: () => import('./pages/supplier-contacts/supplier-contacts.component').then(m => m.SupplierContactsComponent) },
      { path: 'customer-categories', loadComponent: () => import('./pages/customer-categories/customer-categories.component').then(m => m.CustomerCategoriesComponent) },
      { path: 'customer-addresses', loadComponent: () => import('./pages/customer-addresses/customer-addresses.component').then(m => m.CustomerAddressesComponent) },
      { path: 'customer-contacts', loadComponent: () => import('./pages/customer-contacts/customer-contacts.component').then(m => m.CustomerContactsComponent) }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
