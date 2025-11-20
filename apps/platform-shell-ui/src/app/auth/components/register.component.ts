import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule
  ],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <i class="pi pi-building text-primary" style="font-size: 3rem"></i>
          <h1>SEMOP</h1>
          <p>إنشاء حساب جديد</p>
        </div>

        <p-card>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <h2 class="text-center mb-4">التسجيل</h2>

            <p-message
              *ngIf="errorMessage"
              severity="error"
              [text]="errorMessage"
              styleClass="w-full mb-3"
            ></p-message>

            <div class="field">
              <label for="name">الاسم الكامل</label>
              <input
                id="name"
                type="text"
                pInputText
                formControlName="name"
                placeholder="أدخل الاسم الكامل"
                class="w-full"
                [class.ng-invalid]="isFieldInvalid('name')"
              />
              <small class="p-error" *ngIf="isFieldInvalid('name')">
                الاسم مطلوب
              </small>
            </div>

            <div class="field">
              <label for="email">البريد الإلكتروني</label>
              <input
                id="email"
                type="email"
                pInputText
                formControlName="email"
                placeholder="أدخل البريد الإلكتروني"
                class="w-full"
                [class.ng-invalid]="isFieldInvalid('email')"
              />
              <small class="p-error" *ngIf="isFieldInvalid('email')">
                البريد الإلكتروني مطلوب ويجب أن يكون صحيحاً
              </small>
            </div>

            <div class="field">
              <label for="password">كلمة المرور</label>
              <p-password
                id="password"
                formControlName="password"
                placeholder="أدخل كلمة المرور"
                [toggleMask]="true"
                styleClass="w-full"
                inputStyleClass="w-full"
                [class.ng-invalid]="isFieldInvalid('password')"
              ></p-password>
              <small class="p-error" *ngIf="isFieldInvalid('password')">
                كلمة المرور يجب أن تكون 8 أحرف على الأقل
              </small>
            </div>

            <div class="field">
              <label for="confirmPassword">تأكيد كلمة المرور</label>
              <p-password
                id="confirmPassword"
                formControlName="confirmPassword"
                placeholder="أعد إدخال كلمة المرور"
                [toggleMask]="true"
                [feedback]="false"
                styleClass="w-full"
                inputStyleClass="w-full"
                [class.ng-invalid]="isFieldInvalid('confirmPassword')"
              ></p-password>
              <small class="p-error" *ngIf="isFieldInvalid('confirmPassword')">
                كلمات المرور غير متطابقة
              </small>
            </div>

            <button
              pButton
              type="submit"
              label="إنشاء حساب"
              icon="pi pi-user-plus"
              class="w-full mb-3"
              [loading]="loading"
              [disabled]="registerForm.invalid"
            ></button>

            <div class="text-center">
              <span>لديك حساب بالفعل؟ </span>
              <a routerLink="/auth/login" class="text-primary">تسجيل الدخول</a>
            </div>
          </form>
        </p-card>

        <div class="auth-footer">
          <p>© {{ currentYear }} SEMOP. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-600) 100%);
      padding: 2rem;
    }

    .auth-card {
      width: 100%;
      max-width: 450px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
      color: white;
    }

    .auth-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 1rem 0 0.5rem;
    }

    .auth-header p {
      font-size: 1rem;
      opacity: 0.9;
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      color: white;
      opacity: 0.8;
      font-size: 0.875rem;
    }

    .field {
      margin-bottom: 1.5rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    :host ::ng-deep .p-password {
      width: 100%;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  errorMessage = '';
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const { name, email, password } = this.registerForm.value;
      await this.authService.register({ name, email, password });
      
      this.notificationService.success('تم إنشاء الحساب بنجاح');
      this.router.navigate(['/auth/login']);
    } catch (error: any) {
      this.errorMessage = error.message || 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.';
      this.notificationService.error(this.errorMessage);
    } finally {
      this.loading = false;
    }
  }
}
