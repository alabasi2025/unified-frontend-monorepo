import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { 
  CreateBankAccountDto, 
  UpdateBankAccountDto, 
  BankAccountResponseDto 
} from '@semop/contracts';

/**
 * PHASE: Sprint 2 - Accounting Cycle
 * Date: 2025-12-08
 * Author: Manus AI
 * Description: Bank Accounts Service for managing bank account data via API.
 */
@Injectable({
  providedIn: 'root'
})
export class BankAccountsService {
  // استخدام environment.apiUrl للـ base URL كما هو مطلوب، وإضافة المسار الخاص بالخدمة
  private apiUrl = `${environment.apiUrl}/api/bank-accounts`; 

  constructor(private http: HttpClient) {}

  /**
   * معالج الأخطاء المركزي.
   * @param error استجابة الخطأ من HTTP.
   * @returns Observable خطأ جديد.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.error);
    // يمكن تحسين هذا الجزء لإرجاع خطأ أكثر تحديدًا أو رسالة صديقة للمستخدم
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  /**
   * يجلب جميع الحسابات البنكية.
   * @returns Observable من مصفوفة BankAccountResponseDto.
   */
  getAll(): Observable<BankAccountResponseDto[]> {
    return this.http.get<BankAccountResponseDto[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * يجلب حساب بنكي واحد بواسطة المعرف الخاص به.
   * @param id معرف الحساب البنكي.
   * @returns Observable من BankAccountResponseDto واحد.
   */
  getById(id: string): Observable<BankAccountResponseDto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<BankAccountResponseDto>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * ينشئ حساب بنكي جديد.
   * @param dto كائن نقل البيانات لإنشاء حساب بنكي.
   * @returns Observable من BankAccountResponseDto المنشأ.
   */
  create(dto: CreateBankAccountDto): Observable<BankAccountResponseDto> {
    return this.http.post<BankAccountResponseDto>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * يحدث حساب بنكي موجود.
   * @param id معرف الحساب البنكي للتحديث.
   * @param dto كائن نقل البيانات لتحديث حساب بنكي.
   * @returns Observable من BankAccountResponseDto المحدث.
   */
  update(id: string, dto: UpdateBankAccountDto): Observable<BankAccountResponseDto> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<BankAccountResponseDto>(url, dto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * يحذف حساب بنكي بواسطة المعرف الخاص به.
   * @param id معرف الحساب البنكي للحذف.
   * @returns Observable يكتمل عند الحذف الناجح.
   */
  delete(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError)
    );
  }
}
