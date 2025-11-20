import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    MessageModule
  ],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <i class="pi pi-lock text-primary" style="font-size: 3rem"></i>
          <h1>استعادة كلمة المرور</h1>
          <p>أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور</p>
        </div>

        <p-card>
          <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
            <p-message
              *ngIf="successMessage"
              severity="success"
              [text]="successMessage"
              styleClass="w-full mb-3"
            ></p-message>

            <p-message
              *ngIf="errorMessage"
              severity="error"
              [text]="errorMessage"
              styleClass="w-full mb-3"
            ></p-message>

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

            <button
              pButton
              type="submit"
              label="إرسال رابط الاستعادة"
              icon="pi pi-send"
              class="w-full mb-3"
              [loading]="loading"
              [disabled]="forgotPasswordForm.invalid"
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
  `]
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  async onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.get('email')?.markAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { email } = this.forgotPasswordForm.value;
      await this.authService.forgotPassword(email);
      
      this.successMessage = 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني';
      this.notificationService.success(this.successMessage);
      
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 3000);
    } catch (error: any) {
      this.errorMessage = error.message || 'فشل إرسال رابط الاستعادة. يرجى المحاولة مرة أخرى.';
      this.notificationService.error(this.errorMessage);
    } finally {
      this.loading = false;
    }
  }
}
