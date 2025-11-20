import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HrState } from './hr.reducer';

export const selectHrState = createFeatureSelector<HrState>('hr');
export const selectEmployees = createSelector(selectHrState, (state) => state.employees);
export const selectDepartments = createSelector(selectHrState, (state) => state.departments);
