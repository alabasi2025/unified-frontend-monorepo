/**
 * PHASE: Sprint 2 - Accounting Cycle
 * Date: 2025-12-08
 * Author: Manus AI
 * Description: خدمة Angular لإدارة عمليات السلفة النثرية (Petty Cash) والتفاعل مع واجهة برمجة التطبيقات /api/petty-cash.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  CreatePettyCashDto, 
  UpdatePettyCashDto, 
  PettyCashResponseDto 
} from '@semop/contracts';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PettyCashService {
  // القاعدة 7: استخدام environment.apiUrl للـ base URL
  // القاعدة 3: API URL: /api/petty-cash
  private apiUrl = `${environment.apiUrl}/petty-cash`;

  // القاعدة 2: استخدام HttpClient من @angular/common/http
  constructor(private http: HttpClient) {}

  // القاعدة 8: Error handling في كل method
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.error);
    return throwError(() => new Error(`Petty Cash Service Error: ${error.status} - ${error.message}`));
  }

  /**
   * يجلب جميع سجلات السلفة النثرية.
   * القاعدة 6: getAll(): Observable<XResponseDto[]>
   */
  getAll(): Observable<PettyCashResponseDto[]> {
    return this.http.get<PettyCashResponseDto[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * يجلب سجل سلفة نثرية بواسطة المعرف.
   * القاعدة 6: getById(id: string): Observable<XResponseDto>
   * @param id معرف السجل.
   */
  getById(id: string): Observable<PettyCashResponseDto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<PettyCashResponseDto>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * ينشئ سجل سلفة نثرية جديد.
   * القاعدة 6: create(dto: CreateXDto): Observable<XResponseDto>
   * @param dto بيانات إنشاء السجل.
   */
  create(dto: CreatePettyCashDto): Observable<PettyCashResponseDto> {
    return this.http.post<PettyCashResponseDto>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * يحدث سجل سلفة نثرية موجود.
   * القاعدة 6: update(id: string, dto: UpdateXDto): Observable<XResponseDto>
   * @param id معرف السجل.
   * @param dto بيانات تحديث السجل.
   */
  update(id: string, dto: UpdatePettyCashDto): Observable<PettyCashResponseDto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<PettyCashResponseDto>(url, dto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * يحذف سجل سلفة نثرية بواسطة المعرف.
   * القاعدة 6: delete(id: string): Observable<void>
   * @param id معرف السجل.
   */
  delete(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }
}
