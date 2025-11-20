import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  supplierId: string;
  status: string;
  totalAmount: number;
  lines: any[];
}

@Injectable({ providedIn: 'root' })
export class PurchaseInvoiceService extends BaseCrudService<PurchaseInvoice> {
  protected endpoint = '/purchase-invoices';
  
  constructor(api: ApiService) { super(api); }

  post(id: string): Observable<PurchaseInvoice> {
    return this.api.post<PurchaseInvoice>(`${this.endpoint}/${id}/post`, {});
  }
}
