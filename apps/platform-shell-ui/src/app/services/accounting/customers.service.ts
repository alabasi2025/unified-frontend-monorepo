import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import {
  CreateCustomerDTO,
  UpdateCustomerDTO,
  CustomerResponseDTO
} from '@semop/contracts';

/**
 * PHASE: Sprint 2 - Accounting Cycle
 * Date: 2025-12-08
 * Author: Manus AI
 * Description: Customers service for managing customer data, including CRUD operations and error handling.
 */
@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private readonly apiUrl = `${environment.apiUrl}/api/customers`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  getAll(): Observable<CustomerResponseDTO[]> {
    return this.http.get<CustomerResponseDTO[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<CustomerResponseDTO> {
    return this.http.get<CustomerResponseDTO>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  create(dto: CreateCustomerDTO): Observable<CustomerResponseDTO> {
    return this.http.post<CustomerResponseDTO>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, dto: UpdateCustomerDTO): Observable<CustomerResponseDTO> {
    return this.http.put<CustomerResponseDTO>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
