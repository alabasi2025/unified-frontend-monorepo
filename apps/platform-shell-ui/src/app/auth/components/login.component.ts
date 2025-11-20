import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    MessageModule
  ],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <i class="pi pi-building text-primary" style="font-size: 3rem"></i>
          <h1>SEMOP</h1>
          <p>نظام إدارة المؤسسات الشامل</p>
        </div>

        <p-card>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <h2 class="text-center mb-4">تسجيل الدخول</h2>

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

            <div class="field">
              <label for="password">كلمة المرور</label>
              <p-password
                id="password"
                formControlName="password"
                placeholder="أدخل كلمة المرور"
                [toggleMask]="true"
                [feedback]="false"
                styleClass="w-full"
                inputStyleClass="w-full"
                [class.ng-invalid]="isFieldInvalid('password')"
              ></p-password>
              <small class="p-error" *ngIf="isFieldInvalid('password')">
                كلمة المرور مطلوبة
              </small>
            </div>

            <div class="field-checkbox mb-4">
              <p-checkbox
                id="rememberMe"
                formControlName="rememberMe"
                [binary]="true"
                label="تذكرني"
              ></p-checkbox>
            </div>

            <button
              pButton
              type="submit"
              label="تسجيل الدخول"
              icon="pi pi-sign-in"
              class="w-full mb-3"
              [loading]="loading"
              [disabled]="loginForm.invalid"
            ></button>

            <div class="text-center">
              <a routerLink="/auth/forgot-password" class="text-primary">نسيت كلمة المرور؟</a>
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

    .field-checkbox {
      display: flex;
      align-items: center;
    }

    :host ::ng-deep .p-password {
      width: 100%;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
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
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password);
      
      this.notificationService.success('تم تسجيل الدخول بنجاح');
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = error.message || 'فشل تسجيل الدخول. يرجى التحقق من البيانات والمحاولة مرة أخرى.';
      this.notificationService.error(this.errorMessage);
    } finally {
      this.loading = false;
    }
  }
}
