import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface PayrollPeriod {
  id: string;
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  status: string;
  totalGrossSalary: number;
  totalDeductions: number;
  totalNetSalary: number;
}

@Injectable({ providedIn: 'root' })
export class PayrollService extends BaseCrudService<PayrollPeriod> {
  protected endpoint = '/payroll';
  
  constructor(api: ApiService) { super(api); }

  calculate(id: string): Observable<PayrollPeriod> {
    return this.api.post<PayrollPeriod>(`${this.endpoint}/${id}/calculate`, {});
  }

  approve(id: string): Observable<PayrollPeriod> {
    return this.api.post<PayrollPeriod>(`${this.endpoint}/${id}/approve`, {});
  }

  process(id: string): Observable<PayrollPeriod> {
    return this.api.post<PayrollPeriod>(`${this.endpoint}/${id}/process`, {});
  }
}
