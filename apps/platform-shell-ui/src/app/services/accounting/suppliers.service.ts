import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// افتراض مسار environment بناءً على مسار الخدمة
import { environment } from '../../../environments/environment'; 

import { 
  CreateSupplierDto, 
  UpdateSupplierDto, 
  SupplierResponseDto 
} from '@semop/contracts';

/**
 * PHASE: Sprint 2 - Accounting Cycle
 * Date: 2025-12-08
 * Author: Manus AI
 * Description: Suppliers Service for managing supplier data.
 */
@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  // استخدام environment.apiUrl للـ base URL كما هو مطلوب
  private apiUrl = `${environment.apiUrl}/api/suppliers`;

  constructor(private http: HttpClient) {}

  /**
   * معالج الأخطاء المشترك لجميع طلبات HTTP
   * @param error كائن HttpErrorResponse
   * @returns Observable يحتوي على خطأ
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // خطأ من جانب العميل أو الشبكة
      console.error('An error occurred:', error.error.message);
    } else {
      // خطأ من جانب الخادم
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // إرجاع Observable بخطأ موجه للمستخدم
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  /**
   * استرداد قائمة بجميع الموردين
   * @returns Observable<SupplierResponseDto[]>
   */
  getAll(): Observable<SupplierResponseDto[]> {
    return this.http.get<SupplierResponseDto[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * استرداد مورد واحد بواسطة المعرف
   * @param id معرف المورد
   * @returns Observable<SupplierResponseDto>
   */
  getById(id: string): Observable<SupplierResponseDto> {
    return this.http.get<SupplierResponseDto>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * إنشاء مورد جديد
   * @param dto بيانات إنشاء المورد
   * @returns Observable<SupplierResponseDto>
   */
  create(dto: CreateSupplierDto): Observable<SupplierResponseDto> {
    return this.http.post<SupplierResponseDto>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * تحديث مورد موجود
   * @param id معرف المورد
   * @param dto بيانات تحديث المورد
   * @returns Observable<SupplierResponseDto>
   */
  update(id: string, dto: UpdateSupplierDto): Observable<SupplierResponseDto> {
    return this.http.put<SupplierResponseDto>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * حذف مورد
   * @param id معرف المورد
   * @returns Observable<void>
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
