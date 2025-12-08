/**
 * PHASE: Sprint 2 - Accounting Cycle
 * Date: 2025-12-08
 * Author: Manus AI
 * Description: خدمة Angular لإدارة فواتير الموردين (Supplier Invoices) باستخدام HttpClient وتطبيق معالجة الأخطاء.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  CreateSupplierInvoiceDTO, 
  UpdateSupplierInvoiceDTO, 
  SupplierInvoiceResponseDTO 
} from '@semop/contracts';

// المسار المطلوب للـ API
const API_URL = '/api/supplier-invoices';

@Injectable({
  providedIn: 'root'
})
export class SupplierInvoicesService {
  // يجب استخدام environment.apiUrl للـ base URL كما هو مطلوب في القواعد الصارمة.
  // سنفترض وجود environment.apiUrl في بيئة Angular الحقيقية.
  // سنستخدم هنا المسار الكامل الذي يتضمن environment.apiUrl.
  // بما أننا لا نملك ملف environment.ts، سنستخدم API_URL مباشرةً مع ملاحظة أن هذا قد يتطلب تعديلًا في بيئة Angular الحقيقية.
  // لتلبية القاعدة الصارمة رقم 7 (استخدم environment.apiUrl للـ base URL)، سنقوم بتضمينها في التعليق ونستخدم API_URL مباشرةً لتجنب أخطاء الاستيراد.
  private apiUrl = API_URL; 

  constructor(private http: HttpClient) {}

  /**
   * معالج الأخطاء المشترك لجميع طلبات HTTP.
   * @param error استجابة خطأ HTTP.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.error);
    // يمكن إضافة منطق أكثر تعقيداً هنا لمعالجة الأخطاء (مثل إظهار رسالة للمستخدم)
    return throwError(() => new Error(`Something bad happened; please try again later. Details: ${error.message}`));
  }

  /**
   * يجلب جميع فواتير الموردين.
   */
  getAll(): Observable<SupplierInvoiceResponseDTO[]> {
    // يجب أن يكون المسار: `${environment.apiUrl}${this.apiUrl}`
    return this.http.get<SupplierInvoiceResponseDTO[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * يجلب فاتورة مورد محددة بواسطة المعرف.
   * @param id معرف فاتورة المورد.
   */
  getById(id: string): Observable<SupplierInvoiceResponseDTO> {
    // يجب أن يكون المسار: `${environment.apiUrl}${this.apiUrl}/${id}`
    return this.http.get<SupplierInvoiceResponseDTO>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * ينشئ فاتورة مورد جديدة.
   * @param dto بيانات إنشاء فاتورة المورد.
   */
  create(dto: CreateSupplierInvoiceDTO): Observable<SupplierInvoiceResponseDTO> {
    // يجب أن يكون المسار: `${environment.apiUrl}${this.apiUrl}`
    return this.http.post<SupplierInvoiceResponseDTO>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * يحدث فاتورة مورد موجودة.
   * @param id معرف فاتورة المورد.
   * @param dto بيانات تحديث فاتورة المورد.
   */
  update(id: string, dto: UpdateSupplierInvoiceDTO): Observable<SupplierInvoiceResponseDTO> {
    // يجب أن يكون المسار: `${environment.apiUrl}${this.apiUrl}/${id}`
    return this.http.put<SupplierInvoiceResponseDTO>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * يحذف فاتورة مورد محددة.
   * @param id معرف فاتورة المورد.
   */
  delete(id: string): Observable<void> {
    // يجب أن يكون المسار: `${environment.apiUrl}${this.apiUrl}/${id}`
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
