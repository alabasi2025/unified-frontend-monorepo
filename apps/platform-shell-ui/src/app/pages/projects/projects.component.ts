import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap } from 'rxjs';

// 1. تعريف الواجهات (Interfaces)
interface Project {
  id: number;
  name: string;
  description: string;
  status: 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';
  start_date: string; // ISO Date string
  end_date: string;   // ISO Date string
  budget: number;
}

interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// 2. تعريف خدمة البيانات (Mock Service for demonstration)
// في تطبيق حقيقي، ستكون هذه في ملف منفصل (project.service.ts)
class ProjectService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/projects';

  getProjects(page: number, limit: number, search: string): Observable<ApiResponse<Project>> {
    const params = {
      _page: page.toString(),
      _limit: limit.toString(),
      q: search,
    };
    // استخدام json-server كمحاكاة للـ API
    return this.http.get<Project[]>(this.baseUrl, { params, observe: 'response' }).pipe(
      map(response => {
        const totalCount = response.headers.get('X-Total-Count') || '0';
        return {
          data: response.body || [],
          total: parseInt(totalCount, 10),
          page: page,
          limit: limit,
        };
      }),
      catchError(error => {
        console.error('Error fetching projects:', error);
        return of({ data: [], total: 0, page: page, limit: limit });
      })
    );
  }

  createProject(project: Omit<Project, 'id'>): Observable<Project> {
    return this.http.post<Project>(this.baseUrl, project);
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

// 3. تعريف المكون (Component)
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  providers: [ProjectService],
  templateUrl: './projects.component.html',
  styles: [
    `
      /* Tailwind CSS utility classes will be used directly in the HTML template */
      /* Custom styles for modal backdrop and z-index if needed */
      .modal-backdrop {
        background-color: rgba(0, 0, 0, 0.5);
      }
    `,
  ],
})
export class ProjectsComponent implements OnInit {
  Math = Math;
  // حقن الخدمات
  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);

  // حالة البيانات
  projects$!: Observable<Project[]>;
  totalRecords$ = new BehaviorSubject<number>(0);
  isLoading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);

  // حالة التصفح والبحث
  currentPage$ = new BehaviorSubject<number>(1);
  pageSize = 10;
  searchQuery$ = new BehaviorSubject<string>('');
  
  // حالة الـ CRUD
  isModalOpen = false;
  isSubmitting = false;
  isEditMode = false;
  currentProjectId: number | null = null;
  projectForm!: FormGroup;

  // حالة رسائل النجاح
  successMessage$ = new BehaviorSubject<string | null>(null);

  // حالة الحقول
  projectStatuses = ['Pending', 'InProgress', 'Completed', 'Cancelled'];

  ngOnInit(): void {
    this.initForm();
    this.setupDataFlow();
  }

  // تهيئة النموذج التفاعلي
  initForm(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      status: ['Pending', Validators.required],
      start_date: [this.formatDate(new Date()), Validators.required],
      end_date: [this.formatDate(new Date()), Validators.required],
      budget: [0, [Validators.required, Validators.min(0)]],
    });
  }

  // إعداد تدفق البيانات باستخدام RxJS
  setupDataFlow(): void {
    this.projects$ = this.currentPage$.pipe(
      tap(() => {
        this.isLoading$.next(true);
        this.error$.next(null);
      }),
      switchMap(page =>
        this.searchQuery$.pipe(
          switchMap(search =>
            this.projectService.getProjects(page, this.pageSize, search).pipe(
              tap(response => {
                this.totalRecords$.next(response.total);
                this.isLoading$.next(false);
              }),
              map(response => response.data),
              catchError(err => {
                this.error$.next('فشل في تحميل بيانات المشاريع. يرجى المحاولة لاحقاً.');
                this.isLoading$.next(false);
                return of([]);
              })
            )
          )
        )
      )
    );
  }

  // وظائف التصفح (Pagination)
  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage$.next(page);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords$.value / this.pageSize);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // وظيفة البحث (Search)
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery$.next(input.value);
    this.currentPage$.next(1); // العودة للصفحة الأولى عند البحث
  }

  // وظائف الـ CRUD
  openCreateModal(): void {
    this.isEditMode = false;
    this.currentProjectId = null;
    this.initForm();
    this.isModalOpen = true;
  }

  openEditModal(project: Project): void {
    this.isEditMode = true;
    this.currentProjectId = project.id;
    this.projectForm.patchValue({
      name: project.name,
      description: project.description,
      status: project.status,
      start_date: this.formatDate(new Date(project.start_date)),
      end_date: this.formatDate(new Date(project.end_date)),
      budget: project.budget,
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.projectForm.reset();
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const projectData = this.projectForm.value;

    const operation$ = this.isEditMode
      ? this.projectService.updateProject(this.currentProjectId!, projectData)
      : this.projectService.createProject(projectData);

    operation$.pipe(
      tap(() => {
        this.isSubmitting = false;
        this.closeModal();
        this.showSuccessMessage(this.isEditMode ? 'تم تحديث المشروع بنجاح.' : 'تم إضافة المشروع بنجاح.');
        this.currentPage$.next(this.currentPage$.value); // إعادة تحميل البيانات
      }),
      catchError(err => {
        this.isSubmitting = false;
        this.error$.next(`فشل في ${this.isEditMode ? 'التعديل' : 'الإضافة'}: ${err.message || 'خطأ غير معروف'}`);
        return of(null);
      })
    ).subscribe();
  }

  onDelete(project: Project): void {
    if (confirm(`هل أنت متأكد من حذف المشروع: ${project.name}؟`)) {
      this.isLoading$.next(true);
      this.projectService.deleteProject(project.id).pipe(
        tap(() => {
          this.isLoading$.next(false);
          this.showSuccessMessage('تم حذف المشروع بنجاح.');
          this.currentPage$.next(this.currentPage$.value); // إعادة تحميل البيانات
        }),
        catchError(err => {
          this.isLoading$.next(false);
          this.error$.next(`فشل في الحذف: ${err.message || 'خطأ غير معروف'}`);
          return of(null);
        })
      ).subscribe();
    }
  }

  // وظيفة مساعدة لتنسيق التاريخ ليتناسب مع حقول الإدخال من نوع date
  private formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  // وظيفة عرض رسالة النجاح
  private showSuccessMessage(message: string): void {
    this.successMessage$.next(message);
    setTimeout(() => this.successMessage$.next(null), 5000);
  }
}
