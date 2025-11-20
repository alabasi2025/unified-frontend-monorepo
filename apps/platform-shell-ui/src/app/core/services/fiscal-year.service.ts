import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface FiscalYear {
  id: string;
  year: number;
  startDate: string;
  endDate: string;
  status: string;
  isCurrent: boolean;
  periods: FiscalPeriod[];
}

export interface FiscalPeriod {
  id: string;
  periodNumber: number;
  startDate: string;
  endDate: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class FiscalYearService extends BaseCrudService<FiscalYear> {
  protected endpoint = '/fiscal-years';
  
  constructor(api: ApiService) { super(api); }

  getCurrent(): Observable<FiscalYear> {
    return this.api.get<FiscalYear>(`${this.endpoint}/current`);
  }

  close(id: string): Observable<FiscalYear> {
    return this.api.post<FiscalYear>(`${this.endpoint}/${id}/close`, {});
  }

  lock(id: string): Observable<FiscalYear> {
    return this.api.post<FiscalYear>(`${this.endpoint}/${id}/lock`, {});
  }
}
