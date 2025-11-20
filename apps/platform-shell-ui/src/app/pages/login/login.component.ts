import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, PasswordModule, CardModule],
  template: `
    <div class="login-container">
      <p-card header="SEMOP ERP - تسجيل الدخول" styleClass="login-card">
        <div class="p-fluid">
          <div class="p-field mb-3">
            <label for="username">اسم المستخدم</label>
            <input pInputText id="username" [(ngModel)]="username" />
          </div>
          <div class="p-field mb-3">
            <label for="password">كلمة المرور</label>
            <p-password id="password" [(ngModel)]="password" [feedback]="false"></p-password>
          </div>
          <p-button label="دخول" icon="pi pi-sign-in" (onClick)="login()" styleClass="w-full"></p-button>
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
  `]
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    // Simple login - في الإنتاج يجب استخدام Backend API
    if (this.username && this.password) {
      this.router.navigate(['/dashboard']);
    }
  }
}
