import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InventoryState } from './inventory.reducer';

export const selectInventoryState = createFeatureSelector<InventoryState>('inventory');
export const selectItems = createSelector(selectInventoryState, (state) => state.items);
export const selectWarehouses = createSelector(selectInventoryState, (state) => state.warehouses);
