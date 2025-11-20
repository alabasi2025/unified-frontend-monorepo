import { createAction, props } from '@ngrx/store';

export const loadItems = createAction('[Inventory] Load Items');
export const loadItemsSuccess = createAction('[Inventory] Load Items Success', props<{ items: any[] }>());
export const loadWarehouses = createAction('[Inventory] Load Warehouses');
export const loadWarehousesSuccess = createAction('[Inventory] Load Warehouses Success', props<{ warehouses: any[] }>());
