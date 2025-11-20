import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  supplierId: string;
  status: string;
  totalAmount: number;
  lines: any[];
}

@Injectable({ providedIn: 'root' })
export class PurchaseOrderService extends BaseCrudService<PurchaseOrder> {
  protected endpoint = '/purchase-orders';
  
  constructor(api: ApiService) { super(api); }

  approve(id: string): Observable<PurchaseOrder> {
    return this.api.post<PurchaseOrder>(`${this.endpoint}/${id}/approve`, {});
  }

  cancel(id: string): Observable<PurchaseOrder> {
    return this.api.post<PurchaseOrder>(`${this.endpoint}/${id}/cancel`, {});
  }
}
