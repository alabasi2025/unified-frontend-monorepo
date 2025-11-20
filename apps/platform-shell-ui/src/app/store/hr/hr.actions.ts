import { createAction, props } from '@ngrx/store';

export const loadEmployees = createAction('[HR] Load Employees');
export const loadEmployeesSuccess = createAction('[HR] Load Employees Success', props<{ employees: any[] }>());
export const loadDepartments = createAction('[HR] Load Departments');
export const loadDepartmentsSuccess = createAction('[HR] Load Departments Success', props<{ departments: any[] }>());
