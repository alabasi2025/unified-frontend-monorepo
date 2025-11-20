import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EntityState } from './entity.reducer';

export const selectEntityState = createFeatureSelector<EntityState>('entity');
export const selectHoldings = createSelector(selectEntityState, (state) => state.holdings);
export const selectUnits = createSelector(selectEntityState, (state) => state.units);
export const selectProjects = createSelector(selectEntityState, (state) => state.projects);
