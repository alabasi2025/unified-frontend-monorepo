import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { 
  CreateCashTransactionDto, 
  UpdateCashTransactionDto, 
  CashTransactionResponseDto 
} from '@semop/contracts';

/**
 * PHASE: Sprint 2 - Accounting Cycle
 * Date: 2025-12-08
 * Author: Manus AI
 * Description: Cash Transactions Service for managing cash transactions data.
 */
@Injectable({
  providedIn: 'root'
})
export class CashTransactionsService {
  private apiUrl = `${environment.apiUrl}/api/cash-transactions`;

  constructor(private http: HttpClient) {}

  /**
   * Handles HTTP errors by logging and re-throwing a user-friendly error.
   * @param error The HttpErrorResponse object.
   * @returns An Observable that throws an error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Server Error Code: ${error.status}, Message: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Retrieves all cash transactions.
   * @returns An Observable of an array of CashTransactionResponseDto.
   */
  getAll(): Observable<CashTransactionResponseDto[]> {
    return this.http.get<CashTransactionResponseDto[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a single cash transaction by its ID.
   * @param id The ID of the cash transaction.
   * @returns An Observable of a single CashTransactionResponseDto.
   */
  getById(id: string): Observable<CashTransactionResponseDto> {
    return this.http.get<CashTransactionResponseDto>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Creates a new cash transaction.
   * @param dto The data transfer object for creating a cash transaction.
   * @returns An Observable of the created CashTransactionResponseDto.
   */
  create(dto: CreateCashTransactionDto): Observable<CashTransactionResponseDto> {
    return this.http.post<CashTransactionResponseDto>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing cash transaction.
   * @param id The ID of the cash transaction to update.
   * @param dto The data transfer object for updating a cash transaction.
   * @returns An Observable of the updated CashTransactionResponseDto.
   */
  update(id: string, dto: UpdateCashTransactionDto): Observable<CashTransactionResponseDto> {
    return this.http.put<CashTransactionResponseDto>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a cash transaction by its ID.
   * @param id The ID of the cash transaction to delete.
   * @returns An Observable that completes upon successful deletion.
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
