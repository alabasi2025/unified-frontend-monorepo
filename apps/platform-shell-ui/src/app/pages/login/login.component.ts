import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, PasswordModule, CardModule, MessageModule],
  template: `
    <div class="login-container">
      <p-card header="SEMOP ERP - تسجيل الدخول" styleClass="login-card">
        <div class="p-fluid">
          @if (errorMessage) {
            <p-message severity="error" [text]="errorMessage" styleClass="mb-3"></p-message>
          }
          
          <div class="p-field mb-3">
            <label for="username">اسم المستخدم</label>
            <input 
              pInputText 
              id="username" 
              [(ngModel)]="username"
              [disabled]="loading"
              (keyup.enter)="login()" />
          </div>
          
          <div class="p-field mb-3">
            <label for="password">كلمة المرور</label>
            <p-password 
              id="password" 
              [(ngModel)]="password" 
              [feedback]="false"
              [disabled]="loading"
              (keyup.enter)="login()"></p-password>
          </div>
          
          <p-button 
            label="دخول" 
            icon="pi pi-sign-in" 
            (onClick)="login()" 
            [loading]="loading"
            styleClass="w-full"></p-button>

          <div class="mt-3 text-center text-sm text-gray-600">
            <p>للتجربة: admin / admin123</p>
          </div>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .login-card {
      width: 400px;
      max-width: 90%;
    }
    .mb-3 {
      margin-bottom: 1rem;
    }
    .mt-3 {
      margin-top: 1rem;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';
  returnUrl = '/dashboard';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'الرجاء إدخال اسم المستخدم وكلمة المرور';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'فشل تسجيل الدخول. الرجاء التحقق من البيانات والمحاولة مرة أخرى.';
        console.error('Login error:', error);
      }
    });
  }
}
