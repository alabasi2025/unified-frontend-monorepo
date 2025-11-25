import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StockMovement {
  id: string;
  warehouseId: string;
  warehouseName: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  unitPrice?: number;
  totalValue?: number;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface CreateStockMovementDto {
  warehouseId: string;
  itemId: string;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  unitCost?: number;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
  holdingId: string;
  unitId?: string;
  projectId?: string;
}

export interface StockMovementStatistics {
  totalIncoming: number;
  totalOutgoing: number;
  movementsToday: number;
  totalMovements: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockMovementsService {
  private apiUrl = '/api/stock-movements';

  constructor(private http: HttpClient) {}

  /**
   * الحصول على جميع حركات المخزون مع الفلاتر
   */
  getAll(filters?: any): Observable<StockMovement[]> {
    let url = this.apiUrl;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.warehouseId) params.append('warehouseId', filters.warehouseId);
      if (filters.itemId) params.append('itemId', filters.itemId);
      if (filters.movementType) params.append('movementType', filters.movementType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (params.toString()) {
        url += '?' + params.toString();
      }
    }
    return this.http.get<StockMovement[]>(url);
  }

  /**
   * الحصول على حركة واحدة بالمعرف
   */
  getOne(id: string): Observable<StockMovement> {
    return this.http.get<StockMovement>(`${this.apiUrl}/${id}`);
  }

  /**
   * إنشاء حركة مخزون جديدة
   */
  create(data: CreateStockMovementDto): Observable<StockMovement> {
    return this.http.post<StockMovement>(this.apiUrl, data);
  }

  /**
   * الحصول على حركات المخزون حسب المستودع
   */
  getByWarehouse(warehouseId: string): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(`${this.apiUrl}?warehouseId=${warehouseId}`);
  }

  /**
   * الحصول على حركات المخزون حسب الصنف
   */
  getByItem(itemId: string): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(`${this.apiUrl}?itemId=${itemId}`);
  }

  /**
   * الحصول على إحصائيات حركات المخزون
   */
  getStatistics(): Observable<StockMovementStatistics> {
    return this.http.get<StockMovementStatistics>(`${this.apiUrl}/statistics`);
  }

  /**
   * تحديث حركة مخزون
   */
  update(id: string, data: any): Observable<StockMovement> {
    return this.http.patch<StockMovement>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * حذف حركة مخزون
   */
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
