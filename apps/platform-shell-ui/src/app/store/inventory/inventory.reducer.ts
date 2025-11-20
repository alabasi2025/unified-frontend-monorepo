import { createReducer, on } from '@ngrx/store';
import * as InventoryActions from './inventory.actions';

export interface InventoryState {
  items: any[];
  warehouses: any[];
  loading: boolean;
}

export const initialState: InventoryState = {
  items: [],
  warehouses: [],
  loading: false
};

export const inventoryReducer = createReducer(
  initialState,
  on(InventoryActions.loadItemsSuccess, (state, { items }) => ({ ...state, items })),
  on(InventoryActions.loadWarehousesSuccess, (state, { warehouses }) => ({ ...state, warehouses }))
);
