import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { 
  CreateReceiptVoucherDto, 
  UpdateReceiptVoucherDto, 
  ReceiptVoucherResponseDto 
} from '@semop/contracts';

/**
 * PHASE: Sprint 2 - Accounting Cycle
 * Date: 2025-12-08
 * Author: Manus AI
 * Description: Service for managing Receipt Vouchers (سندات القبض) in the accounting module.
 */
@Injectable({
  providedIn: 'root'
})
export class ReceiptVouchersService {
  // API URL: /api/receipt-vouchers
  private apiUrl = `${environment.apiUrl}/receipt-vouchers`;

  constructor(private http: HttpClient) {}

  /**
   * Handles HTTP errors.
   * @param error The HttpErrorResponse object.
   * @returns An Observable that throws an error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    // In a real application, this would log the error to a remote logging infrastructure
    console.error('An error occurred:', error.error);
    // Return an observable with a user-facing error message
    return throwError(() => new Error('An error occurred while processing the request. Please try again later.'));
  }

  /**
   * Retrieves all receipt vouchers.
   * @returns An Observable of an array of ReceiptVoucherResponseDto.
   */
  getAll(): Observable<ReceiptVoucherResponseDto[]> {
    return this.http.get<ReceiptVoucherResponseDto[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a single receipt voucher by its ID.
   * @param id The ID of the receipt voucher.
   * @returns An Observable of a single ReceiptVoucherResponseDto.
   */
  getById(id: string): Observable<ReceiptVoucherResponseDto> {
    return this.http.get<ReceiptVoucherResponseDto>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Creates a new receipt voucher.
   * @param dto The data transfer object for creating a receipt voucher.
   * @returns An Observable of the created ReceiptVoucherResponseDto.
   */
  create(dto: CreateReceiptVoucherDto): Observable<ReceiptVoucherResponseDto> {
    return this.http.post<ReceiptVoucherResponseDto>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing receipt voucher.
   * @param id The ID of the receipt voucher to update.
   * @param dto The data transfer object for updating a receipt voucher.
   * @returns An Observable of the updated ReceiptVoucherResponseDto.
   */
  update(id: string, dto: UpdateReceiptVoucherDto): Observable<ReceiptVoucherResponseDto> {
    return this.http.put<ReceiptVoucherResponseDto>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a receipt voucher by its ID.
   * @param id The ID of the receipt voucher to delete.
   * @returns An Observable that completes upon successful deletion.
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
