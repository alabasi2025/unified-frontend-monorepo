import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  customerId: string;
  status: string;
  totalAmount: number;
  lines: any[];
}

@Injectable({ providedIn: 'root' })
export class SalesInvoiceService extends BaseCrudService<SalesInvoice> {
  protected endpoint = '/sales-invoices';
  
  constructor(api: ApiService) { super(api); }

  post(id: string): Observable<SalesInvoice> {
    return this.api.post<SalesInvoice>(`${this.endpoint}/${id}/post`, {});
  }
}
