import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, catchError, finalize, map, of, switchMap, tap } from 'rxjs';

// 1. الواجهات (Interfaces)
export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  rating: number; // تقييم المورد
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

// 2. خدمة الموردين (SupplierService)
@Component({
  selector: 'app-supplier-service',
  standalone: true,
  imports: [HttpClientModule],
  template: ''
})
export class SupplierService {
  private apiUrl = 'http://localhost:3000/api/suppliers';
  private http = inject(HttpClient);

  // Read: جلب جميع الموردين
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<ApiResponse<Supplier[]>>(this.apiUrl).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching suppliers:', error);
        return of([]); // إرجاع مصفوفة فارغة عند الخطأ
      })
    );
  }

  // Create: إضافة مورد جديد
  createSupplier(supplier: Omit<Supplier, 'id'>): Observable<Supplier> {
    return this.http.post<ApiResponse<Supplier>>(this.apiUrl, supplier).pipe(
      map(response => response.data)
    );
  }

  // Update: تعديل مورد موجود
  updateSupplier(id: number, supplier: Omit<Supplier, 'id'>): Observable<Supplier> {
    return this.http.put<ApiResponse<Supplier>>(`${this.apiUrl}/${id}`, supplier).pipe(
      map(response => response.data)
    );
  }

  // Delete: حذف مورد
  deleteSupplier(id: number): Observable<any> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }
}

// 3. المكون الرئيسي (SuppliersComponent)
@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [SupplierService],
  template: `
    <div dir="rtl" class="p-6 bg-gray-50 min-h-screen">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">إدارة الموردين</h1>

        <!-- شريط الأدوات والبحث -->
        <div class="flex justify-between items-center mb-6">
          <div class="relative w-full max-w-md">
            <input
              type="text"
              placeholder="ابحث بالاسم أو البريد الإلكتروني..."
              (input)="onSearch($event)"
              class="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            />
            <svg class="absolute right-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <button
            (click)="openModal()"
            class="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            + إضافة جديد
          </button>
        </div>

        <!-- حالة التحميل -->
        <div *ngIf="isLoading" class="text-center py-10">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-2 text-indigo-600">جاري تحميل البيانات...</p>
        </div>

        <!-- حالة البيانات الفارغة -->
        <div *ngIf="!isLoading && (filteredSuppliers$ | async)?.length === 0" class="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg bg-white">
          <svg class="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">لا يوجد موردون</h3>
          <p class="mt-1 text-sm text-gray-500">ابدأ بإضافة مورد جديد للبدء.</p>
          <div class="mt-6">
            <button
              (click)="openModal()"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              إضافة مورد جديد
            </button>
          </div>
        </div>

        <!-- جدول عرض البيانات -->
        <div *ngIf="!isLoading && (filteredSuppliers$ | async)?.length > 0" class="bg-white shadow-xl rounded-lg overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الهاتف</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العنوان</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التقييم</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let supplier of (paginatedSuppliers$ | async)">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ supplier.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ supplier.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ supplier.phone }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ supplier.address }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [ngClass]="{'bg-green-100 text-green-800': supplier.rating >= 4, 'bg-yellow-100 text-yellow-800': supplier.rating < 4 && supplier.rating >= 2, 'bg-red-100 text-red-800': supplier.rating < 2}">
                    {{ supplier.rating }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button (click)="openModal(supplier)" class="text-indigo-600 hover:text-indigo-900 ml-3">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button (click)="confirmDelete(supplier)" class="text-red-600 hover:text-red-900">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="px-6 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-200">
            <div class="flex-1 flex justify-between sm:hidden">
              <button (click)="prevPage()" [disabled]="currentPage === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">السابق</button>
              <button (click)="nextPage()" [disabled]="currentPage === totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">التالي</button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  عرض
                  <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
                  إلى
                  <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span>
                  من
                  <span class="font-medium">{{ totalItems }}</span>
                  نتائج
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button (click)="prevPage()" [disabled]="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span class="sr-only">السابق</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  </button>
                  <ng-container *ngFor="let page of pageNumbers">
                    <button (click)="goToPage(page)" [ngClass]="{'z-10 bg-indigo-50 border-indigo-500 text-indigo-600': currentPage === page, 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': currentPage !== page}" class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                      {{ page }}
                    </button>
                  </ng-container>
                  <button (click)="nextPage()" [disabled]="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span class="sr-only">التالي</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <!-- رسالة التنبيه (Success/Error) -->
        <div *ngIf="alertMessage" [ngClass]="{'bg-green-100 border-green-400 text-green-700': alertType === 'success', 'bg-red-100 border-red-400 text-red-700': alertType === 'error'}"
             class="fixed top-4 right-4 p-4 rounded-lg shadow-lg border-l-4" role="alert">
          <p class="font-bold">{{ alertType === 'success' ? 'نجاح!' : 'خطأ!' }}</p>
          <p>{{ alertMessage }}</p>
        </div>

        <!-- Modal (إضافة/تعديل) -->
        <div *ngIf="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- خلفية المودال -->
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="closeModal()"></div>

            <!-- محتوى المودال -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form [formGroup]="supplierForm" (ngSubmit)="saveSupplier()">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {{ isEditMode ? 'تعديل المورد: ' + supplierForm.get('name')?.value : 'إضافة مورد جديد' }}
                  </h3>
                  <div class="mt-4 space-y-4">
                    <!-- حقل الاسم -->
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700">الاسم</label>
                      <input id="name" type="text" formControlName="name" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                      <div *ngIf="supplierForm.get('name')?.invalid && (supplierForm.get('name')?.dirty || supplierForm.get('name')?.touched)" class="text-red-500 text-xs mt-1">
                        <div *ngIf="supplierForm.get('name')?.errors?.['required']">الاسم مطلوب.</div>
                      </div>
                    </div>

                    <!-- حقل البريد الإلكتروني -->
                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                      <input id="email" type="email" formControlName="email" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                      <div *ngIf="supplierForm.get('email')?.invalid && (supplierForm.get('email')?.dirty || supplierForm.get('email')?.touched)" class="text-red-500 text-xs mt-1">
                        <div *ngIf="supplierForm.get('email')?.errors?.['required']">البريد الإلكتروني مطلوب.</div>
                        <div *ngIf="supplierForm.get('email')?.errors?.['email']">صيغة البريد الإلكتروني غير صحيحة.</div>
                      </div>
                    </div>

                    <!-- حقل الهاتف -->
                    <div>
                      <label for="phone" class="block text-sm font-medium text-gray-700">الهاتف</label>
                      <input id="phone" type="text" formControlName="phone" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                      <div *ngIf="supplierForm.get('phone')?.invalid && (supplierForm.get('phone')?.dirty || supplierForm.get('phone')?.touched)" class="text-red-500 text-xs mt-1">
                        <div *ngIf="supplierForm.get('phone')?.errors?.['required']">الهاتف مطلوب.</div>
                      </div>
                    </div>

                    <!-- حقل العنوان -->
                    <div>
                      <label for="address" class="block text-sm font-medium text-gray-700">العنوان</label>
                      <input id="address" type="text" formControlName="address" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                      <div *ngIf="supplierForm.get('address')?.invalid && (supplierForm.get('address')?.dirty || supplierForm.get('address')?.touched)" class="text-red-500 text-xs mt-1">
                        <div *ngIf="supplierForm.get('address')?.errors?.['required']">العنوان مطلوب.</div>
                      </div>
                    </div>

                    <!-- حقل التقييم -->
                    <div>
                      <label for="rating" class="block text-sm font-medium text-gray-700">التقييم (1-5)</label>
                      <input id="rating" type="number" formControlName="rating" min="1" max="5" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                      <div *ngIf="supplierForm.get('rating')?.invalid && (supplierForm.get('rating')?.dirty || supplierForm.get('rating')?.touched)" class="text-red-500 text-xs mt-1">
                        <div *ngIf="supplierForm.get('rating')?.errors?.['required']">التقييم مطلوب.</div>
                        <div *ngIf="supplierForm.get('rating')?.errors?.['min'] || supplierForm.get('rating')?.errors?.['max']">يجب أن يكون التقييم بين 1 و 5.</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" [disabled]="supplierForm.invalid || isSaving"
                          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                    <span *ngIf="!isSaving">{{ isEditMode ? 'حفظ التعديلات' : 'إضافة المورد' }}</span>
                    <span *ngIf="isSaving" class="flex items-center">
                      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                      جاري الحفظ...
                    </span>
                  </button>
                  <button type="button" (click)="closeModal()"
                          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Modal (تأكيد الحذف) -->
        <div *ngIf="isDeleteModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="delete-modal-title" role="dialog" aria-modal="true">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="closeDeleteModal()"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-right">
                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="delete-modal-title">
                      تأكيد الحذف
                    </h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        هل أنت متأكد من أنك تريد حذف المورد <span class="font-semibold">{{ supplierToDelete?.name }}</span>؟ لا يمكن التراجع عن هذا الإجراء.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" (click)="deleteSupplier()" [disabled]="isDeleting"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                  <span *ngIf="!isDeleting">حذف</span>
                  <span *ngIf="isDeleting" class="flex items-center">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    جاري الحذف...
                  </span>
                </button>
                <button type="button" (click)="closeDeleteModal()"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
})
export class SuppliersComponent implements OnInit {
  private supplierService = inject(SupplierService);
  private fb = inject(FormBuilder);

  // حالة التحميل
  isLoading: boolean = false;
  isSaving: boolean = false;
  isDeleting: boolean = false;

  // حالة المودال
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  supplierForm!: FormGroup;
  supplierToEdit: Supplier | null = null;

  // حالة الحذف
  isDeleteModalOpen: boolean = false;
  supplierToDelete: Supplier | null = null;

  // حالة التنبيه
  alertMessage: string | null = null;
  alertType: 'success' | 'error' = 'success';

  // البيانات و RxJS
  private suppliersSubject = new BehaviorSubject<Supplier[]>([]);
  suppliers$ = this.suppliersSubject.asObservable();

  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();

  // Pagination
  pageSize: number = 10;
  currentPage: number = 1;
  totalItems: number = 0;
  totalPages: number = 0;
  pageNumbers: number[] = [];

  // Observable للبيانات المفلترة والمقسمة
  filteredSuppliers$: Observable<Supplier[]>;
  paginatedSuppliers$: Observable<Supplier[]>;

  constructor() {
    // تهيئة النموذج
    this.initForm();

    // منطق البحث والتصفية والتقسيم
    this.filteredSuppliers$ = this.search$.pipe(
      switchMap(searchTerm => this.suppliers$.pipe(
        map(suppliers => this.filterSuppliers(suppliers, searchTerm)),
        tap(filteredSuppliers => {
          this.totalItems = filteredSuppliers.length;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.currentPage = 1; // إعادة تعيين الصفحة عند البحث
          this.updatePageNumbers();
        })
      ))
    );

    this.paginatedSuppliers$ = this.filteredSuppliers$.pipe(
      map(suppliers => this.paginateSuppliers(suppliers))
    );
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  // تهيئة نموذج الإضافة/التعديل
  initForm(supplier?: Supplier): void {
    this.supplierForm = this.fb.group({
      id: [supplier?.id || null],
      name: [supplier?.name || '', Validators.required],
      email: [supplier?.email || '', [Validators.required, Validators.email]],
      phone: [supplier?.phone || '', Validators.required],
      address: [supplier?.address || '', Validators.required],
      rating: [supplier?.rating || 1, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  // جلب البيانات
  loadSuppliers(): void {
    this.isLoading = true;
    this.supplierService.getSuppliers().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (suppliers) => {
        // إضافة بيانات وهمية إذا كانت فارغة لغرض العرض
        if (suppliers.length === 0) {
          suppliers = this.generateMockSuppliers(25);
        }
        this.suppliersSubject.next(suppliers);
      },
      error: (err) => {
        this.showAlert('حدث خطأ أثناء جلب الموردين.', 'error');
        // إضافة بيانات وهمية عند فشل الاتصال بالـ API
        this.suppliersSubject.next(this.generateMockSuppliers(25));
      }
    });
  }

  // منطق البحث
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value.trim());
  }

  filterSuppliers(suppliers: Supplier[], searchTerm: string): Supplier[] {
    if (!searchTerm) {
      return suppliers;
    }
    const lowerCaseTerm = searchTerm.toLowerCase();
    return suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(lowerCaseTerm) ||
      supplier.email.toLowerCase().includes(lowerCaseTerm)
    );
  }

  // منطق التقسيم (Pagination)
  paginateSuppliers(suppliers: Supplier[]): Supplier[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return suppliers.slice(startIndex, startIndex + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // إعادة تشغيل الـ Observable للتقسيم
      this.suppliersSubject.next(this.suppliersSubject.getValue());
    }
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  updatePageNumbers(): void {
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // فتح وإغلاق المودال (إضافة/تعديل)
  openModal(supplier?: Supplier): void {
    this.isEditMode = !!supplier;
    this.supplierToEdit = supplier || null;
    this.initForm(supplier);
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.supplierForm.reset();
    this.supplierToEdit = null;
  }

  // حفظ (إضافة أو تعديل) المورد
  saveSupplier(): void {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValue = this.supplierForm.value;
    const supplierData: Omit<Supplier, 'id'> = {
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      address: formValue.address,
      rating: formValue.rating,
    };

    let save$: Observable<Supplier>;
    let successMessage: string;

    if (this.isEditMode && formValue.id) {
      save$ = this.supplierService.updateSupplier(formValue.id, supplierData);
      successMessage = 'تم تعديل المورد بنجاح.';
    } else {
      // تعيين ID وهمي للمورد الجديد في حالة عدم وجود API حقيقي
      const newSupplier: Supplier = { ...supplierData, id: Date.now() };
      save$ = this.supplierService.createSupplier(supplierData).pipe(
        // في حالة الـ Mock API، نحتاج إلى إضافة المورد يدوياً إلى الـ Subject
        map(() => newSupplier)
      );
      successMessage = 'تم إضافة المورد بنجاح.';
    }

    save$.pipe(
      finalize(() => this.isSaving = false)
    ).subscribe({
      next: (savedSupplier) => {
        this.updateSuppliersList(savedSupplier);
        this.showAlert(successMessage, 'success');
        this.closeModal();
      },
      error: (err) => {
        this.showAlert(`فشل في ${this.isEditMode ? 'تعديل' : 'إضافة'} المورد.`, 'error');
        // في حالة الـ Mock API، يجب محاكاة النجاح يدوياً
        if (!this.isEditMode) {
             const newSupplier: Supplier = { ...supplierData, id: Date.now() };
             this.updateSuppliersList(newSupplier);
             this.showAlert(successMessage, 'success');
             this.closeModal();
        }
      }
    });
  }

  // فتح وإغلاق مودال الحذف
  confirmDelete(supplier: Supplier): void {
    this.supplierToDelete = supplier;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.supplierToDelete = null;
  }

  // حذف المورد
  deleteSupplier(): void {
    if (!this.supplierToDelete) return;

    this.isDeleting = true;
    const id = this.supplierToDelete.id;

    this.supplierService.deleteSupplier(id).pipe(
      finalize(() => this.isDeleting = false)
    ).subscribe({
      next: () => {
        this.removeSupplierFromList(id);
        this.showAlert('تم حذف المورد بنجاح.', 'success');
        this.closeDeleteModal();
      },
      error: (err) => {
        this.showAlert('فشل في حذف المورد.', 'error');
        // في حالة الـ Mock API، يجب محاكاة النجاح يدوياً
        this.removeSupplierFromList(id);
        this.showAlert('تم حذف المورد بنجاح (Mock).', 'success');
        this.closeDeleteModal();
      }
    });
  }

  // تحديث قائمة الموردين بعد الإضافة/التعديل
  updateSuppliersList(savedSupplier: Supplier): void {
    const currentSuppliers = this.suppliersSubject.getValue();
    const index = currentSuppliers.findIndex(s => s.id === savedSupplier.id);

    if (index > -1) {
      // تعديل
      currentSuppliers[index] = savedSupplier;
    } else {
      // إضافة
      currentSuppliers.unshift(savedSupplier);
    }
    this.suppliersSubject.next([...currentSuppliers]);
  }

  // إزالة المورد من القائمة بعد الحذف
  removeSupplierFromList(id: number): void {
    const currentSuppliers = this.suppliersSubject.getValue();
    const updatedSuppliers = currentSuppliers.filter(s => s.id !== id);
    this.suppliersSubject.next(updatedSuppliers);
  }

  // عرض رسالة التنبيه
  showAlert(message: string, type: 'success' | 'error'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = null;
    }, 3000);
  }

  // دالة لتوليد بيانات وهمية (Mock Data)
  generateMockSuppliers(count: number): Supplier[] {
    const mockSuppliers: Supplier[] = [];
    for (let i = 1; i <= count; i++) {
      mockSuppliers.push({
        id: i,
        name: `المورد رقم ${i}`,
        email: `supplier${i}@example.com`,
        phone: `+96650${Math.floor(Math.random() * 90000000)}`,
        address: `شارع ${i}، حي ${i % 5 + 1}، الرياض`,
        rating: Math.floor(Math.random() * 5) + 1, // تقييم بين 1 و 5
      });
    }
    return mockSuppliers;
  }
}
