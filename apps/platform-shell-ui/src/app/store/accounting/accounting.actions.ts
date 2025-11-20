import { createAction, props } from '@ngrx/store';

export const loadAccounts = createAction('[Accounting] Load Accounts');
export const loadAccountsSuccess = createAction('[Accounting] Load Accounts Success', props<{ accounts: any[] }>());
export const loadJournalEntries = createAction('[Accounting] Load Journal Entries');
export const loadJournalEntriesSuccess = createAction('[Accounting] Load Journal Entries Success', props<{ entries: any[] }>());
