import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../core';
import { NotificationService } from '../../core';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    PasswordModule,
    ButtonModule,
    MessageModule
  ],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <i class="pi pi-key text-primary" style="font-size: 3rem"></i>
          <h1>إعادة تعيين كلمة المرور</h1>
          <p>أدخل كلمة المرور الجديدة</p>
        </div>

        <p-card>
          <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()">
            <p-message
              *ngIf="errorMessage"
              severity="error"
              [text]="errorMessage"
              styleClass="w-full mb-3"
            ></p-message>

            <div class="field">
              <label for="password">كلمة المرور الجديدة</label>
              <p-password
                id="password"
                formControlName="password"
                placeholder="أدخل كلمة المرور الجديدة"
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
              label="إعادة تعيين كلمة المرور"
              icon="pi pi-check"
              class="w-full mb-3"
              [loading]="loading"
              [disabled]="resetPasswordForm.invalid"
            ></button>

            <div class="text-center">
              <a routerLink="/auth/login" class="text-primary">
                <i class="pi pi-arrow-right"></i> العودة لتسجيل الدخول
              </a>
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
      font-size: 2rem;
      font-weight: 700;
      margin: 1rem 0 0.5rem;
    }

    .auth-header p {
      font-size: 0.875rem;
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
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  loading = false;
  errorMessage = '';
  resetToken = '';
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.resetToken = this.route.snapshot.queryParams['token'] || '';
    
    if (!this.resetToken) {
      this.notificationService.error('رابط غير صالح');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.resetPasswordForm = this.fb.group({
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
    const field = this.resetPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  async onSubmit() {
    if (this.resetPasswordForm.invalid) {
      Object.keys(this.resetPasswordForm.controls).forEach(key => {
        this.resetPasswordForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const { password } = this.resetPasswordForm.value;
      await this.authService.resetPassword(this.resetToken, password);
      
      this.notificationService.success('تم إعادة تعيين كلمة المرور بنجاح');
      this.router.navigate(['/auth/login']);
    } catch (error: any) {
      this.errorMessage = error.message || 'فشل إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.';
      this.notificationService.error(this.errorMessage);
    } finally {
      this.loading = false;
    }
  }
}
