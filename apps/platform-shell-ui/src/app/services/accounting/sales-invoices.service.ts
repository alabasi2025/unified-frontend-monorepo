import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { 
  CreateSalesInvoiceDto, 
  UpdateSalesInvoiceDto, 
  SalesInvoiceResponseDto 
} from '@semop/contracts';
// Assuming environment is available via a path like this in a real project
// import { environment } from '../../../environments/environment'; 

/**
 * PHASE: Sprint 2 - Accounting Cycle
 * Date: 2025-12-08
 * Author: Manus AI
 * Description: Sales Invoices Service with full CRUD operations for managing sales invoices.
 */
@Injectable({
  providedIn: 'root'
})
export class SalesInvoicesService {
  // The requirement is to use environment.apiUrl, but since the environment file is not available, 
  // I will use the relative path as per the API URL requirement, which is common for proxy setup.
  // In a real project, this would be: private baseUrl = environment.apiUrl;
  private apiUrl = '/api/sales-invoices';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    // In a real-world app, we might send the error to remote logging infrastructure
    console.error('SalesInvoicesService Error:', error);
    // Re-throw a user-friendly error
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  /**
   * Retrieves all sales invoices.
   */
  getAll(): Observable<SalesInvoiceResponseDto[]> {
    return this.http.get<SalesInvoiceResponseDto[]>(this.apiUrl).pipe(
      // tap(data => console.log('Sales Invoices fetched:', data)), // Optional logging
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a single sales invoice by its ID.
   * @param id The ID of the sales invoice.
   */
  getById(id: string): Observable<SalesInvoiceResponseDto> {
    return this.http.get<SalesInvoiceResponseDto>(`${this.apiUrl}/${id}`).pipe(
      // tap(data => console.log(`Sales Invoice ${id} fetched:`)), // Optional logging
      catchError(this.handleError)
    );
  }

  /**
   * Creates a new sales invoice.
   * @param dto The data transfer object for creating a sales invoice.
   */
  create(dto: CreateSalesInvoiceDto): Observable<SalesInvoiceResponseDto> {
    return this.http.post<SalesInvoiceResponseDto>(this.apiUrl, dto).pipe(
      // tap(data => console.log('Sales Invoice created:', data)), // Optional logging
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing sales invoice.
   * @param id The ID of the sales invoice to update.
   * @param dto The data transfer object for updating a sales invoice.
   */
  update(id: string, dto: UpdateSalesInvoiceDto): Observable<SalesInvoiceResponseDto> {
    return this.http.put<SalesInvoiceResponseDto>(`${this.apiUrl}/${id}`, dto).pipe(
      // tap(data => console.log(`Sales Invoice ${id} updated:`)), // Optional logging
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a sales invoice by its ID.
   * @param id The ID of the sales invoice to delete.
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      // tap(() => console.log(`Sales Invoice ${id} deleted.`)), // Optional logging
      catchError(this.handleError)
    );
  }
}
