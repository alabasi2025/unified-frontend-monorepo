 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, tap, delay } from 'rxjs/operators';

// Define the Customer interface
const API_URL = 'http://localhost:3000/api/customers';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'Individual' | 'Business'; // Example types
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  template: `
    <div class="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">إدارة العملاء</h1>

        <!-- Header and Controls -->
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="ابحث عن عميل..."
            (input)="onSearchChange($event)"
            class="w-full md:w-80 p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-right"
          />
          <button
            (click)="openCreateModal()"
            class="w-full md:w-auto flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            إضافة عميل جديد
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="text-center py-10">
          <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-2 text-indigo-600">جاري تحميل البيانات...</p>
        </div>

        <!-- Error/Empty State -->
        <div *ngIf="error && !isLoading" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
          <span class="block sm:inline">{{ error }}</span>
        </div>

        <!-- Customers Table -->
        <div *ngIf="(customers$ | async) as customers" class="bg-white shadow-xl rounded-lg overflow-hidden">
          <div *ngIf="customers.length > 0">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الهاتف</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العنوان</th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النوع</th>
                  <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let customer of customers">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ customer.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ customer.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ customer.phone }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ customer.address }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span [ngClass]="{'bg-green-100 text-green-800': customer.type === 'Individual', 'bg-blue-100 text-blue-800': customer.type === 'Business'}" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ customer.type === 'Individual' ? 'فرد' : 'شركة' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button (click)="openEditModal(customer)" class="text-indigo-600 hover:text-indigo-900 ml-3">
                      <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      تعديل
                    </button>
                    <button (click)="deleteCustomer(customer.id)" class="text-red-600 hover:text-red-900">
                      <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      حذف
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Pagination -->
            <div class="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-white">
              <div class="flex-1 flex justify-between sm:hidden">
                <button (click)="onPageChange(currentPage - 1)" [disabled]="currentPage === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">السابق</button>
                <button (click)="onPageChange(currentPage + 1)" [disabled]="currentPage * pageSize >= totalCustomers" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">التالي</button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    عرض
                    <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
                    إلى
                    <span class="font-medium">{{ Math.min(currentPage * pageSize, totalCustomers) }}</span>
                    من
                    <span class="font-medium">{{ totalCustomers }}</span>
                    نتائج
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button (click)="onPageChange(currentPage - 1)" [disabled]="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span class="sr-only">السابق</span>
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                    
                    <!-- Simple page number display -->
                    <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      الصفحة {{ currentPage }}
                    </span>

                    <button (click)="onPageChange(currentPage + 1)" [disabled]="currentPage * pageSize >= totalCustomers" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span class="sr-only">التالي</span>
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CRUD Modal -->
    <div *ngIf="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="closeModal()"></div>

        <!-- Modal panel -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form [formGroup]="customerForm" (ngSubmit)="saveCustomer()">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {{ isEditMode ? 'تعديل بيانات العميل' : 'إضافة عميل جديد' }}
                  </h3>
                  <div class="mt-4 space-y-4">
                    
                    <!-- Name -->
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-700">الاسم</label>
                      <input id="name" type="text" formControlName="name" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right" required>
                      <div *ngIf="formControls['name'].invalid && (formControls['name'].dirty || formControls['name'].touched)" class="mt-1 text-xs text-red-600">
                        <div *ngIf="formControls['name'].errors?.['required']">الاسم مطلوب.</div>
                        <div *ngIf="formControls['name'].errors?.['minlength']">يجب أن يكون الاسم 3 أحرف على الأقل.</div>
                      </div>
                    </div>

                    <!-- Email -->
                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                      <input id="email" type="email" formControlName="email" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right" required>
                      <div *ngIf="formControls['email'].invalid && (formControls['email'].dirty || formControls['email'].touched)" class="mt-1 text-xs text-red-600">
                        <div *ngIf="formControls['email'].errors?.['required']">البريد الإلكتروني مطلوب.</div>
                        <div *ngIf="formControls['email'].errors?.['email']">صيغة البريد الإلكتروني غير صحيحة.</div>
                      </div>
                    </div>

                    <!-- Phone -->
                    <div>
                      <label for="phone" class="block text-sm font-medium text-gray-700">الهاتف</label>
                      <input id="phone" type="tel" formControlName="phone" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right" required>
                      <div *ngIf="formControls['phone'].invalid && (formControls['phone'].dirty || formControls['phone'].touched)" class="mt-1 text-xs text-red-600">
                        <div *ngIf="formControls['phone'].errors?.['required']">رقم الهاتف مطلوب.</div>
                        <div *ngIf="formControls['phone'].errors?.['pattern']">صيغة رقم الهاتف غير صحيحة (10 أرقام على الأقل).</div>
                      </div>
                    </div>

                    <!-- Address -->
                    <div>
                      <label for="address" class="block text-sm font-medium text-gray-700">العنوان</label>
                      <input id="address" type="text" formControlName="address" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right" required>
                      <div *ngIf="formControls['address'].errors?.['required'] && (formControls['address'].dirty || formControls['address'].touched)" class="mt-1 text-xs text-red-600">
                        العنوان مطلوب.
                      </div>
                    </div>

                    <!-- Type -->
                    <div>
                      <label for="type" class="block text-sm font-medium text-gray-700">النوع</label>
                      <select id="type" formControlName="type" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right" required>
                        <option value="Individual">فرد</option>
                        <option value="Business">شركة</option>
                      </select>
                      <div *ngIf="formControls['type'].errors?.['required'] && (formControls['type'].dirty || formControls['type'].touched)" class="mt-1 text-xs text-red-600">
                        النوع مطلوب.
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="submit" [disabled]="customerForm.invalid || isLoading" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-150 ease-in-out">
                <span *ngIf="!isLoading">{{ isEditMode ? 'حفظ التعديلات' : 'إضافة العميل' }}</span>
                <span *ngIf="isLoading">جاري الحفظ...</span>
              </button>
              <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition duration-150 ease-in-out">
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: `
    /* Tailwind CSS will be used via direct class application in the template */
  `
})
export class CustomersComponent implements OnInit {
  Math = Math;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    // Component initialization logic will go here
  }

  // State management
  customers$: Observable<Customer[]> = of([]);
  isLoading = false;
  error: string | null = null;
  
  // Pagination and Filtering
  currentPage = 1;
  pageSize = 10;
  totalCustomers = 0;
  searchTerm = '';

  // Modal state
  isModalOpen = false;
  isEditMode = false;
  currentCustomer: Customer | null = null;
  customerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.customerForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,}$')]],
      address: ['', Validators.required],
      type: ['Individual', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  // --- Service/API Methods (CRUD) ---

  loadCustomers(): void {
    this.isLoading = true;
    this.error = null;
    // Simulate pagination/filtering on the backend for the request
    const params = {
      _page: this.currentPage.toString(),
      _limit: this.pageSize.toString(),
      q: this.searchTerm
    };

    this.customers$ = this.http.get<Customer[]>(API_URL, { params }).pipe(
      // In a real app, you'd get total count from headers. Here we simulate it.
      tap(data => {
        this.totalCustomers = 50; // Simulated total count
        if (data.length === 0 && this.searchTerm === '') {
          this.error = 'لا توجد بيانات عملاء لعرضها.';
        }
      }),
      catchError(err => {
        console.error('Error loading customers:', err);
        this.error = 'فشل في تحميل بيانات العملاء. يرجى المحاولة مرة أخرى.';
        return of([]); // Return an empty array on error
      }),
      finalize(() => this.isLoading = false)
    );
  }

  saveCustomer(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const customerData = this.customerForm.value;
    let request: Observable<Customer>;

    if (this.isEditMode && customerData.id) {
      // Update
      request = this.http.put<Customer>(`${API_URL}/${customerData.id}`, customerData).pipe(
        tap(() => this.showSuccessMessage('تم تحديث بيانات العميل بنجاح.')),
        catchError(err => this.handleError(err, 'فشل في تحديث العميل.'))
      );
    } else {
      // Create
      // Remove ID for creation
      delete customerData.id; 
      request = this.http.post<Customer>(API_URL, customerData).pipe(
        tap(() => this.showSuccessMessage('تم إضافة عميل جديد بنجاح.')),
        catchError(err => this.handleError(err, 'فشل في إضافة العميل.'))
      );
    }

    request.subscribe({
      next: () => {
        this.closeModal();
        this.loadCustomers(); // Reload data after success
      },
      error: () => {
        this.isLoading = false; // Error handled in pipe, but ensure loading state is reset
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  deleteCustomer(id: number): void {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا العميل؟')) {
      return;
    }

    this.isLoading = true;
    this.http.delete(`${API_URL}/${id}`).pipe(
      tap(() => this.showSuccessMessage('تم حذف العميل بنجاح.')),
      catchError(err => this.handleError(err, 'فشل في حذف العميل.')),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => this.loadCustomers(), // Reload data after success
      error: () => {} // Error handled in pipe
    });
  }

  // --- UI/UX Methods ---

  openCreateModal(): void {
    this.isEditMode = false;
    this.currentCustomer = null;
    this.customerForm.reset({ type: 'Individual' });
    this.isModalOpen = true;
  }

  openEditModal(customer: Customer): void {
    this.isEditMode = true;
    this.currentCustomer = customer;
    this.customerForm.patchValue(customer);
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.customerForm.reset();
  }

  onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.loadCustomers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCustomers();
  }

  // --- Utility Methods ---

  handleError(err: any, defaultMessage: string): Observable<any> {
    this.error = defaultMessage;
    this.isLoading = false;
    // In a real app, you'd check for specific error codes (e.g., 404, 500)
    console.error('API Error:', err);
    return throwError(() => new Error(defaultMessage));
  }

  showSuccessMessage(message: string): void {
    // Simple success message implementation (can be replaced with a toast service)
    alert(message);
  }

  get formControls() {
    return this.customerForm.controls;
  }

  // All other methods (CRUD, filtering, etc.) will be added here
}
