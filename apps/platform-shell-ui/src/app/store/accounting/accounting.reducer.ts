import { createReducer, on } from '@ngrx/store';
import * as AccountingActions from './accounting.actions';

export interface AccountingState {
  accounts: any[];
  journalEntries: any[];
  loading: boolean;
}

export const initialState: AccountingState = {
  accounts: [],
  journalEntries: [],
  loading: false
};

export const accountingReducer = createReducer(
  initialState,
  on(AccountingActions.loadAccountsSuccess, (state, { accounts }) => ({ ...state, accounts })),
  on(AccountingActions.loadJournalEntriesSuccess, (state, { entries }) => ({ ...state, journalEntries: entries }))
);
