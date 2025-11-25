import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalesOrderLine {
  id?: string;
  itemId: string;
  itemName?: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discountRate: number;
  lineTotal?: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  customerId: string;
  customerName?: string;
  expectedDeliveryDate?: string;
  paymentTerms?: string;
  notes?: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'PARTIALLY_INVOICED' | 'INVOICED';
  totalAmount: number;
  lines: SalesOrderLine[];
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateSalesOrderDto {
  orderNumber: string;
  orderDate: string;
  customerId: string;
  expectedDeliveryDate?: string;
  paymentTerms?: string;
  notes?: string;
  lines: SalesOrderLine[];
  holdingId: string;
  unitId?: string;
  projectId?: string;
}

export interface UpdateSalesOrderDto {
  orderNumber?: string;
  orderDate?: string;
  customerId?: string;
  expectedDeliveryDate?: string;
  paymentTerms?: string;
  notes?: string;
  lines?: SalesOrderLine[];
}

export interface SalesOrderStatistics {
  totalOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  invoicedOrders: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalesOrdersService {
  private apiUrl = '/api/sales-orders';

  constructor(private http: HttpClient) {}

  /**
   * الحصول على جميع أوامر البيع مع الفلاتر
   */
  getAll(filters?: any): Observable<SalesOrder[]> {
    let url = this.apiUrl;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.customerId) params.append('customerId', filters.customerId);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (params.toString()) {
        url += '?' + params.toString();
      }
    }
    return this.http.get<SalesOrder[]>(url);
  }

  /**
   * الحصول على أمر بيع واحد بالمعرف
   */
  getOne(id: string): Observable<SalesOrder> {
    return this.http.get<SalesOrder>(`${this.apiUrl}/${id}`);
  }

  /**
   * إنشاء أمر بيع جديد
   */
  create(data: CreateSalesOrderDto): Observable<SalesOrder> {
    return this.http.post<SalesOrder>(this.apiUrl, data);
  }

  /**
   * تحديث أمر بيع
   */
  update(id: string, data: UpdateSalesOrderDto): Observable<SalesOrder> {
    return this.http.patch<SalesOrder>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * حذف أمر بيع
   */
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * اعتماد أمر بيع
   */
  approve(id: string): Observable<SalesOrder> {
    return this.http.post<SalesOrder>(`${this.apiUrl}/${id}/approve`, {});
  }

  /**
   * إلغاء أمر بيع
   */
  cancel(id: string): Observable<SalesOrder> {
    return this.http.post<SalesOrder>(`${this.apiUrl}/${id}/cancel`, {});
  }

  /**
   * الحصول على أوامر البيع حسب العميل
   */
  getByCustomer(customerId: string): Observable<SalesOrder[]> {
    return this.http.get<SalesOrder[]>(`${this.apiUrl}?customerId=${customerId}`);
  }

  /**
   * الحصول على إحصائيات أوامر البيع
   */
  getStatistics(): Observable<SalesOrderStatistics> {
    return this.http.get<SalesOrderStatistics>(`${this.apiUrl}/statistics`);
  }
}
