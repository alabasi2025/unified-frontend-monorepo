import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface Account {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  type: string;
  parentAccountId?: string;
  level: number;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class AccountService extends BaseCrudService<Account> {
  protected endpoint = '/accounts';
  
  constructor(api: ApiService) { super(api); }

  getChildren(id: string): Observable<Account[]> {
    return this.api.get<Account[]>(`${this.endpoint}/${id}/children`);
  }

  getTree(): Observable<Account[]> {
    return this.api.get<Account[]>(`${this.endpoint}/tree`);
  }
}
