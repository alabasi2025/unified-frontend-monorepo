/**
 * PHASE: Sprint 2 - Accounting Cycle
 * Date: 2025-12-08
 * Author: Manus AI
 * Description: Payment Vouchers Service for CRUD operations.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  CreatePaymentVoucherDto, 
  UpdatePaymentVoucherDto, 
  PaymentVoucherResponseDto 
} from '@semop/contracts';

@Injectable({
  providedIn: 'root'
})
export class PaymentVouchersService {
  // القاعدة 7: استخدام environment.apiUrl
  private apiUrl = `${environment.apiUrl}/api/payment-vouchers`;

  constructor(private http: HttpClient) {}

  // القاعدة 8: Error handling في كل method
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.error);
    // يمكن تحسين رسالة الخطأ هنا لتكون أكثر وضوحاً للمستخدم
    return throwError(() => new Error(`Something bad happened; please try again later. Details: ${error.message}`));
  }

  // Method: getAll()
  getAll(): Observable<PaymentVoucherResponseDto[]> {
    return this.http.get<PaymentVoucherResponseDto[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Method: getById(id)
  getById(id: string): Observable<PaymentVoucherResponseDto> {
    return this.http.get<PaymentVoucherResponseDto>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Method: create(dto)
  create(dto: CreatePaymentVoucherDto): Observable<PaymentVoucherResponseDto> {
    return this.http.post<PaymentVoucherResponseDto>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  // Method: update(id, dto)
  update(id: string, dto: UpdatePaymentVoucherDto): Observable<PaymentVoucherResponseDto> {
    return this.http.put<PaymentVoucherResponseDto>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  // Method: delete(id)
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
