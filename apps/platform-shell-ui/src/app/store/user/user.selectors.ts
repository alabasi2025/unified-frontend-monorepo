import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');
export const selectAllUsers = createSelector(selectUserState, (state) => state.users);
export const selectSelectedUser = createSelector(selectUserState, (state) => state.selectedUser);
export const selectUserLoading = createSelector(selectUserState, (state) => state.loading);
export const selectUserError = createSelector(selectUserState, (state) => state.error);
