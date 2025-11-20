import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface JournalEntry {
  id: string;
  entryNumber: string;
  entryDate: string;
  type: string;
  description: string;
  status: string;
  totalDebit: number;
  totalCredit: number;
  lines: JournalEntryLine[];
}

export interface JournalEntryLine {
  accountId: string;
  debit: number;
  credit: number;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class JournalEntryService extends BaseCrudService<JournalEntry> {
  protected endpoint = '/journal-entries';
  
  constructor(api: ApiService) { super(api); }

  post(id: string): Observable<JournalEntry> {
    return this.api.post<JournalEntry>(`${this.endpoint}/${id}/post`, {});
  }

  reverse(id: string): Observable<JournalEntry> {
    return this.api.post<JournalEntry>(`${this.endpoint}/${id}/reverse`, {});
  }
}
