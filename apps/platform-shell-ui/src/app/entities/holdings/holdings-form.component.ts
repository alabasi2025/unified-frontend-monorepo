import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { HoldingsService } from '../../core/services/api/holdings.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-holdings-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ButtonModule,
    PageHeaderComponent
  ],
  template: `
    <app-page-header
      [title]="isEditMode ? 'تعديل شركة قابضة' : 'إضافة شركة قابضة'"
      [showBackButton]="true"
      backRoute="/entities/holdings"
      icon="pi pi-briefcase"
    ></app-page-header>

    <div class="grid">
      <div class="col-12">
        <p-card>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="field">
                  <label for="code">الرمز *</label>
                  <input
                    id="code"
                    type="text"
                    pInputText
                    formControlName="code"
                    class="w-full"
                  />
                  <small class="p-error" *ngIf="form.get('code')?.invalid && form.get('code')?.touched">
                    الرمز مطلوب
                  </small>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="field">
                  <label for="status">الحالة *</label>
                  <p-dropdown
                    id="status"
                    formControlName="status"
                    [options]="statusOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="اختر الحالة"
                    class="w-full"
                  ></p-dropdown>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="field">
                  <label for="nameAr">الاسم بالعربية *</label>
                  <input
                    id="nameAr"
                    type="text"
                    pInputText
                    formControlName="nameAr"
                    class="w-full"
                  />
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="field">
                  <label for="nameEn">الاسم بالإنجليزية *</label>
                  <input
                    id="nameEn"
                    type="text"
                    pInputText
                    formControlName="nameEn"
                    class="w-full"
                  />
                </div>
              </div>

              <div class="col-12">
                <div class="field">
                  <label for="description">الوصف</label>
                  <textarea
                    id="description"
                    pInputTextarea
                    formControlName="description"
                    rows="3"
                    class="w-full"
                  ></textarea>
                </div>
              </div>

              <div class="col-12">
                <div class="flex gap-2">
                  <button
                    pButton
                    type="submit"
                    label="حفظ"
                    icon="pi pi-check"
                    [loading]="loading"
                    [disabled]="form.invalid"
                  ></button>
                  <button
                    pButton
                    type="button"
                    label="إلغاء"
                    icon="pi pi-times"
                    class="p-button-secondary"
                    (click)="onCancel()"
                  ></button>
                </div>
              </div>
            </div>
          </form>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .field {
      margin-bottom: 1.5rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
  `]
})
export class HoldingsFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEditMode = false;
  holdingId: string | null = null;

  statusOptions = [
    { label: 'نشط', value: 'ACTIVE' },
    { label: 'غير نشط', value: 'INACTIVE' }
  ];

  constructor(
    private fb: FormBuilder,
    private holdingsService: HoldingsService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.holdingId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.holdingId && this.route.snapshot.url[this.route.snapshot.url.length - 1].path === 'edit';

    this.form = this.fb.group({
      code: ['', Validators.required],
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      description: [''],
      status: ['ACTIVE', Validators.required]
    });

    if (this.isEditMode && this.holdingId) {
      this.loadHolding(this.holdingId);
    }
  }

  async loadHolding(id: string) {
    try {
      const holding = await this.holdingsService.findOne(id);
      this.form.patchValue(holding);
    } catch (error: any) {
      this.notificationService.error('فشل تحميل البيانات');
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    try {
      if (this.isEditMode && this.holdingId) {
        await this.holdingsService.update(this.holdingId, this.form.value);
        this.notificationService.success('تم تحديث الشركة القابضة بنجاح');
      } else {
        await this.holdingsService.create(this.form.value);
        this.notificationService.success('تم إضافة الشركة القابضة بنجاح');
      }
      this.router.navigate(['/entities/holdings']);
    } catch (error: any) {
      this.notificationService.error(error.message || 'فشل حفظ البيانات');
    } finally {
      this.loading = false;
    }
  }

  onCancel() {
    this.router.navigate(['/entities/holdings']);
  }
}
