import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';

// 1. تعريف الواجهات
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive';
}

interface ApiResponse {
  data: User[];
  total: number;
}

interface State {
  users: User[];
  loading: boolean;
  error: string | null;
  totalUsers: number;
  currentPage: number;
  pageSize: number;
  searchTerm: string;
}

// 2. المكون الرئيسي
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  template: '<div class="p-6"><h2 class="text-2xl font-bold mb-4">إدارة المستخدمين</h2><p>صفحة إدارة المستخدمين قيد التطوير</p></div>',
  styles: [], // سيتم استخدام Tailwind CSS مباشرة في HTML
})
export class UsersComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private readonly API_BASE_URL = 'http://localhost:3000/api/users';

  // حالة المكون باستخدام RxJS
  private stateSubject = new BehaviorSubject<State>({
    users: [],
    loading: false,
    error: null,
    totalUsers: 0,
    currentPage: 1,
    pageSize: 10,
    searchTerm: '',
  });
  state$ = this.stateSubject.asObservable();

  // حالة الـ Modal
  isModalOpen = signal(false);
  isEditMode = signal(false);
  selectedUser = signal<User | null>(null);
  userForm!: FormGroup;

  // حالة رسائل النجاح
  successMessage = signal<string | null>(null);

  // 3. تهيئة المكون
  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  // 4. تهيئة نموذج الفورم
  initForm(user?: User): void {
    this.userForm = this.fb.group({
      id: [user?.id || null],
      name: [user?.name || '', [Validators.required, Validators.minLength(3)]],
      email: [user?.email || '', [Validators.required, Validators.email]],
      role: [user?.role || 'user', [Validators.required]],
      status: [user?.status || 'active', [Validators.required]],
    });
  }

  // 5. جلب البيانات (Read)
  loadUsers(): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({ ...currentState, loading: true, error: null });

    // محاكاة Pagination و Filtering على الـ API
    const params = {
      _page: currentState.currentPage.toString(),
      _limit: currentState.pageSize.toString(),
      q: currentState.searchTerm,
    };

    this.http.get<User[]>(this.API_BASE_URL, { params }).pipe(
      // بما أن الـ API الفعلي قد لا يدعم الـ total count في الـ body، سنفترض أنه في الـ headers
      // لكن لغرض المحاكاة، سنستخدم API وهمي أو نفترض أننا نحصل على كل شيء ونقوم بالـ pagination محليًا
      // سنفترض أن الـ API يرجع كل البيانات وسنقوم بالـ filtering والـ pagination محليًا لتبسيط الكود
      // في تطبيق حقيقي، يجب استخدام API يدعم الـ pagination والـ filtering من جهة الخادم.

      // هنا سنقوم بجلب كل البيانات (لغرض العرض) ثم تطبيق الـ filtering والـ pagination محليًا
      // ملاحظة: هذا غير فعال للبيانات الكبيرة، لكنه يفي بمتطلبات العرض والـ filtering.
      switchMap(() => this.http.get<User[]>(this.API_BASE_URL)),
      map(allUsers => {
        const filteredUsers = allUsers.filter(user =>
          user.name.toLowerCase().includes(currentState.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(currentState.searchTerm.toLowerCase())
        );

        const startIndex = (currentState.currentPage - 1) * currentState.pageSize;
        const paginatedUsers = filteredUsers.slice(startIndex, startIndex + currentState.pageSize);

        return {
          users: paginatedUsers,
          totalUsers: filteredUsers.length,
        };
      }),
      tap(({ users, totalUsers }) => {
        this.stateSubject.next({
          ...currentState,
          users,
          totalUsers,
          loading: false,
        });
      }),
      catchError(error => {
        console.error('Error loading users:', error);
        this.stateSubject.next({ ...currentState, loading: false, error: 'فشل في تحميل بيانات المستخدمين.' });
        return of(null);
      })
    ).subscribe();
  }

  // 6. عمليات الـ CRUD

  // فتح Modal الإضافة
  openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedUser.set(null);
    this.initForm();
    this.isModalOpen.set(true);
  }

  // فتح Modal التعديل
  openEditModal(user: User): void {
    this.isEditMode.set(true);
    this.selectedUser.set(user);
    this.initForm(user);
    this.isModalOpen.set(true);
  }

  // إغلاق Modal
  closeModal(): void {
    this.isModalOpen.set(false);
    this.userForm.reset();
  }

  // حفظ (إضافة/تعديل)
  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const user: User = this.userForm.value;
    const isEdit = this.isEditMode();

    const request$ = isEdit
      ? this.http.put<User>(`${this.API_BASE_URL}/${user.id}`, user)
      : this.http.post<User>(this.API_BASE_URL, { ...user, id: Date.now() }); // محاكاة ID

    request$.pipe(
      tap(() => {
        this.closeModal();
        this.loadUsers();
        this.showSuccessMessage(isEdit ? 'تم تعديل المستخدم بنجاح.' : 'تم إضافة المستخدم بنجاح.');
      }),
      catchError(error => {
        console.error('Error saving user:', error);
        this.stateSubject.next({ ...this.stateSubject.value, error: isEdit ? 'فشل في تعديل المستخدم.' : 'فشل في إضافة المستخدم.' });
        return of(null);
      })
    ).subscribe();
  }

  // حذف
  deleteUser(user: User): void {
    if (confirm(`هل أنت متأكد من حذف المستخدم: ${user.name}؟`)) {
      this.http.delete(`${this.API_BASE_URL}/${user.id}`).pipe(
        tap(() => {
          this.loadUsers();
          this.showSuccessMessage('تم حذف المستخدم بنجاح.');
        }),
        catchError(error => {
          console.error('Error deleting user:', error);
          this.stateSubject.next({ ...this.stateSubject.value, error: 'فشل في حذف المستخدم.' });
          return of(null);
        })
      ).subscribe();
    }
  }

  // 7. Pagination و Filtering

  onPageChange(page: number): void {
    const currentState = this.stateSubject.value;
    if (page >= 1 && page <= Math.ceil(currentState.totalUsers / currentState.pageSize)) {
      this.stateSubject.next({ ...currentState, currentPage: page });
      this.loadUsers();
    }
  }

  onSearch(searchTerm: string): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({ ...currentState, searchTerm, currentPage: 1 });
    this.loadUsers();
  }

  // 8. رسائل النجاح
  showSuccessMessage(message: string): void {
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  // 9. وظيفة مساعدة لإنشاء مصفوفة أرقام لـ Pagination
  getPages(total: number, pageSize: number): number[] {
    const totalPages = Math.ceil(total / pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
