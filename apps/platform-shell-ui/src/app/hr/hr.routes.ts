import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'employees',
    loadComponent: () => import('./employees/employees-list.component').then(m => m.EmployeesListComponent)
  },
  {
    path: 'departments',
    loadComponent: () => import('./departments/departments-list.component').then(m => m.DepartmentsListComponent)
  },
  {
    path: 'attendance',
    loadComponent: () => import('./attendances/attendances-list.component').then(m => m.AttendancesListComponent)
  },
  {
    path: 'leaves',
    loadComponent: () => import('./leaves/leaves-list.component').then(m => m.LeavesListComponent)
  }
];
