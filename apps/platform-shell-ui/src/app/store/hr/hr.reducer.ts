import { createReducer, on } from '@ngrx/store';
import * as HrActions from './hr.actions';

export interface HrState {
  employees: any[];
  departments: any[];
  loading: boolean;
}

export const initialState: HrState = {
  employees: [],
  departments: [],
  loading: false
};

export const hrReducer = createReducer(
  initialState,
  on(HrActions.loadEmployeesSuccess, (state, { employees }) => ({ ...state, employees })),
  on(HrActions.loadDepartmentsSuccess, (state, { departments }) => ({ ...state, departments }))
);
