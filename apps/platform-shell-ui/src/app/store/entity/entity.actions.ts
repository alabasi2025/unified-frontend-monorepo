import { createAction, props } from '@ngrx/store';

export const loadHoldings = createAction('[Entity] Load Holdings');
export const loadHoldingsSuccess = createAction('[Entity] Load Holdings Success', props<{ holdings: any[] }>());
export const loadUnits = createAction('[Entity] Load Units');
export const loadUnitsSuccess = createAction('[Entity] Load Units Success', props<{ units: any[] }>());
export const loadProjects = createAction('[Entity] Load Projects');
export const loadProjectsSuccess = createAction('[Entity] Load Projects Success', props<{ projects: any[] }>());
