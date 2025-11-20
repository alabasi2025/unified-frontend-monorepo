import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';

export interface UserState {
  users: any[];
  selectedUser: any | null;
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsers, (state) => ({ ...state, loading: true })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({ ...state, users, loading: false })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(UserActions.selectUser, (state, { userId }) => ({
    ...state,
    selectedUser: state.users.find(u => u.id === userId) || null
  })),
  on(UserActions.clearSelectedUser, (state) => ({ ...state, selectedUser: null }))
);
