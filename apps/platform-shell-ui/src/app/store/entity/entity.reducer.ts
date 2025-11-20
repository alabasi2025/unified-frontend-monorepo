import { createReducer, on } from '@ngrx/store';
import * as EntityActions from './entity.actions';

export interface EntityState {
  holdings: any[];
  units: any[];
  projects: any[];
  loading: boolean;
}

export const initialState: EntityState = {
  holdings: [],
  units: [],
  projects: [],
  loading: false
};

export const entityReducer = createReducer(
  initialState,
  on(EntityActions.loadHoldingsSuccess, (state, { holdings }) => ({ ...state, holdings })),
  on(EntityActions.loadUnitsSuccess, (state, { units }) => ({ ...state, units })),
  on(EntityActions.loadProjectsSuccess, (state, { projects }) => ({ ...state, projects }))
);
