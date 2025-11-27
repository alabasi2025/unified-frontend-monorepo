import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common'; // إضافة CurrencyPipe لـ HTML
import { Observable, throwError, of, BehaviorSubject, combineLatest } from 'rxjs';
import { catchError, finalize, map, startWith, switchMap, tap } from 'rxjs/operators';

// 1. واجهة البيانات (Item Interface)
export interface Item {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
}

// 2. خدمة البيانات (ItemService)
@Component({
  selector: 'app-item-service',
  standalone: true,
  imports: [HttpClientModule],
  template: '',
})
export class ItemService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/items';

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  getItem(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createItem(item: Omit<Item, 'id'>): Observable<Item> {
    return this.http.post<Item>(this.baseUrl, item).pipe(
      catchError(this.handleError)
    );
  }

  updateItem(id: number, item: Omit<Item, 'id'>): Observable<Item> {
    return this.http.put<Item>(`${this.baseUrl}/${id}`, item).pipe(
      catchError(this.handleError)
    );
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    // يمكن تحسين معالجة الأخطاء هنا لإظهار رسائل أكثر وضوحاً للمستخدم
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}

// 3. المكون الرئيسي (ItemsComponent)
@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './items.component.html',
  styles: [
    `
      /* يمكن إضافة أنماط مخصصة هنا إذا لزم الأمر */
    `,
  ],
  providers: [ItemService],
})
export class ItemsComponent implements OnInit {
  // حقن الخدمات
  private itemService = inject(ItemService);
  private fb = inject(FormBuilder);

  // حالة المكون
  items$!: Observable<Item[]>;
  loading = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  
  // حالة الجدول والبحث
  private refresh$ = new BehaviorSubject<boolean>(true);
  searchControl = this.fb.control('');
  currentPage = signal(1);
  pageSize = 10;
  totalItems = signal(0);
  totalPages = signal(0);

  // حالة الـ Modal
  isModalOpen = signal(false);
  isEditMode = signal(false);
  selectedItem = signal<Item | null>(null);
  itemForm!: FormGroup;

  // الأعمدة
  columns = [
    { key: 'name', label: 'الاسم' },
    { key: 'description', label: 'الوصف' },
    { key: 'category', label: 'الفئة' },
    { key: 'price', label: 'السعر' },
    { key: 'quantity', label: 'الكمية' },
    { key: 'unit', label: 'الوحدة' },
    { key: 'actions', label: 'الإجراءات' },
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadItems();
  }

  initForm(): void {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      unit: ['', [Validators.required]],
    });
  }

  loadItems(): void {
    this.loading.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    // دمج تدفقات البيانات: التحديث، البحث، والصفحة الحالية
    this.items$ = combineLatest([
      this.refresh$,
      this.searchControl.valueChanges.pipe(startWith('')),
      this.currentPage,
    ]).pipe(
      // عند حدوث أي تغيير، قم بتبديل إلى استدعاء API
      switchMap(([_, searchTerm, page]) => {
        // هنا يجب أن يتم استدعاء API مع معلمات البحث والصفحة
        // بما أننا نستخدم واجهة خلفية وهمية (http://localhost:3000/api)، سنقوم بمحاكاة منطق البحث والصفحات في الواجهة الأمامية
        // في تطبيق حقيقي، يجب أن ترسل هذه المعلمات إلى الخادم.
        
        // محاكاة استدعاء API
        return this.itemService.getItems().pipe(
          map(items => {
            // 1. تصفية البيانات بناءً على البحث
            const filteredItems = items.filter(item => 
              item.name.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
              item.category.toLowerCase().includes(searchTerm?.toLowerCase() || '')
            );

            // 2. حساب إجمالي العناصر والصفحات
            this.totalItems.set(filteredItems.length);
            this.totalPages.set(Math.ceil(filteredItems.length / this.pageSize));

            // 3. تطبيق الترحيل (Pagination)
            const startIndex = (page - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return filteredItems.slice(startIndex, endIndex);
          }),
          catchError(err => {
            this.error.set('فشل في تحميل البيانات: ' + err.message);
            return of([]); // إرجاع مصفوفة فارغة عند الخطأ
          }),
          finalize(() => this.loading.set(false))
        );
      })
    );
  }

  // *******************************************************************
  // وظائف الـ CRUD
  // *******************************************************************

  // فتح الـ Modal لوضع الإضافة
  openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedItem.set(null);
    this.itemForm.reset({ price: 0, quantity: 0 });
    this.isModalOpen.set(true);
  }

  // فتح الـ Modal لوضع التعديل
  openEditModal(item: Item): void {
    this.isEditMode.set(true);
    this.selectedItem.set(item);
    this.itemForm.patchValue(item);
    this.isModalOpen.set(true);
  }

  // إغلاق الـ Modal
  closeModal(): void {
    this.isModalOpen.set(false);
    this.itemForm.reset();
  }

  // إرسال النموذج (إضافة أو تعديل)
  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    const itemData = this.itemForm.value;
    const isEdit = this.isEditMode();
    const itemId = this.selectedItem()?.id;

    let operation$: Observable<Item | void>;
    let successMsg: string;

    if (isEdit && itemId) {
      // عملية التعديل
      operation$ = this.itemService.updateItem(itemId, itemData);
      successMsg = 'تم تعديل العنصر بنجاح.';
    } else {
      // عملية الإضافة
      operation$ = this.itemService.createItem(itemData);
      successMsg = 'تم إضافة العنصر بنجاح.';
    }

    operation$.pipe(
      tap(() => {
        this.closeModal();
        this.successMessage.set(successMsg);
        this.refresh$.next(true); // تحديث قائمة العناصر
      }),
      catchError(err => {
        this.error.set(err.message);
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe();
  }

  // عملية الحذف
  deleteItem(item: Item): void {
    if (confirm(`هل أنت متأكد من حذف العنصر: ${item.name}؟`)) {
      this.loading.set(true);
      this.error.set(null);
      this.successMessage.set(null);

      this.itemService.deleteItem(item.id).pipe(
        tap(() => {
          this.successMessage.set('تم حذف العنصر بنجاح.');
          this.refresh$.next(true); // تحديث قائمة العناصر
        }),
        catchError(err => {
          this.error.set(err.message);
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      ).subscribe();
    }
  }

  // *******************************************************************
  // وظائف الـ Pagination
  // *******************************************************************

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  // *******************************************************************
  // وظائف مساعدة للـ UI
  // *******************************************************************

  get isFirstPage(): boolean {
    return this.currentPage() === 1;
  }

  get isLastPage(): boolean {
    return this.currentPage() === this.totalPages();
  }

  // دالة مساعدة لحساب الحد الأقصى لعرض عدد العناصر في الصفحة
  getMaxItemIndex(): number {
    return Math.min(this.currentPage() * this.pageSize, this.totalItems());
  }
}
