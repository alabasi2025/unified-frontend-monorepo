import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountingState } from './accounting.reducer';

export const selectAccountingState = createFeatureSelector<AccountingState>('accounting');
export const selectAccounts = createSelector(selectAccountingState, (state) => state.accounts);
export const selectJournalEntries = createSelector(selectAccountingState, (state) => state.journalEntries);
