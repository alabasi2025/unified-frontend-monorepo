import { createAction, props } from '@ngrx/store';

export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction('[User] Load Users Success', props<{ users: any[] }>());
export const loadUsersFailure = createAction('[User] Load Users Failure', props<{ error: string }>());

export const selectUser = createAction('[User] Select User', props<{ userId: string }>());
export const clearSelectedUser = createAction('[User] Clear Selected User');
