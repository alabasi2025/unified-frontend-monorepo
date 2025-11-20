import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducer';
import { userReducer, UserState } from './user/user.reducer';
import { entityReducer, EntityState } from './entity/entity.reducer';
import { accountingReducer, AccountingState } from './accounting/accounting.reducer';
import { inventoryReducer, InventoryState } from './inventory/inventory.reducer';
import { hrReducer, HrState } from './hr/hr.reducer';

export interface AppState {
  auth: AuthState;
  user: UserState;
  entity: EntityState;
  accounting: AccountingState;
  inventory: InventoryState;
  hr: HrState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  user: userReducer,
  entity: entityReducer,
  accounting: accountingReducer,
  inventory: inventoryReducer,
  hr: hrReducer
};

export const metaReducers: MetaReducer<AppState>[] = [];

// Selective re-exports to avoid conflicts
export * from './auth/auth.actions';
export * from './auth/auth.selectors';
export * from './auth/auth.effects';
export type { AuthState } from './auth/auth.reducer';

export * from './user/user.actions';
export * from './user/user.selectors';
export type { UserState } from './user/user.reducer';

export * from './entity/entity.actions';
export * from './entity/entity.selectors';
export type { EntityState } from './entity/entity.reducer';

export * from './accounting/accounting.actions';
export * from './accounting/accounting.selectors';
export type { AccountingState } from './accounting/accounting.reducer';

export * from './inventory/inventory.actions';
export * from './inventory/inventory.selectors';
export type { InventoryState } from './inventory/inventory.reducer';

export * from './hr/hr.actions';
export * from './hr/hr.selectors';
export type { HrState } from './hr/hr.reducer';
