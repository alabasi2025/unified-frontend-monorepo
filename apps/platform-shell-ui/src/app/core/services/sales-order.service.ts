import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface SalesOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  customerId: string;
  status: string;
  totalAmount: number;
  lines: any[];
}

@Injectable({ providedIn: 'root' })
export class SalesOrderService extends BaseCrudService<SalesOrder> {
  protected endpoint = '/sales-orders';
  
  constructor(api: ApiService) { super(api); }

  approve(id: string): Observable<SalesOrder> {
    return this.api.post<SalesOrder>(`${this.endpoint}/${id}/approve`, {});
  }

  cancel(id: string): Observable<SalesOrder> {
    return this.api.post<SalesOrder>(`${this.endpoint}/${id}/cancel`, {});
  }
}
