import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule, 
    FormsModule, 
    ButtonModule, 
    InputTextModule, 
    PasswordModule, 
    CardModule, 
    MessageModule,
    CheckboxModule,
    DividerModule
  ],
  template: `
    <div class="login-wrapper">
      <!-- Animated Background -->
      <div class="background-animation">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
        <div class="circle circle-4"></div>
      </div>

      <!-- Login Container -->
      <div class="login-container">
        <!-- Left Side - Branding -->
        <div class="branding-section">
          <div class="logo-container">
            <div class="logo-circle">
              <i class="pi pi-building" style="font-size: 4rem; color: white;"></i>
            </div>
            <h1 class="brand-title">SEMOP ERP</h1>
            <p class="brand-subtitle">نظام إدارة موارد المؤسسات المتكامل</p>
          </div>

          <div class="features-list">
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>إدارة محاسبية متكاملة</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>نظام مخزون ذكي</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>تقارير تحليلية متقدمة</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>واجهة عربية احترافية</span>
            </div>
          </div>

          <div class="version-info">
            <span>الإصدار 2.0.0</span>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="form-section">
          <div class="form-card">
            <div class="form-header">
              <h2>مرحباً بك</h2>
              <p>سجل دخولك للمتابعة</p>
            </div>

            @if (errorMessage) {
              <div class="error-message">
                <i class="pi pi-exclamation-circle"></i>
                <span>{{ errorMessage }}</span>
              </div>
            }

            <form class="login-form" (ngSubmit)="login()">
              <div class="form-group">
                <label for="username">
                  <i class="pi pi-user"></i>
                  اسم المستخدم
                </label>
                <input 
                  pInputText 
                  id="username" 
                  [(ngModel)]="username"
                  name="username"
                  [disabled]="loading"
                  placeholder="أدخل اسم المستخدم"
                  class="form-input"
                  (keyup.enter)="login()" />
              </div>

              <div class="form-group">
                <label for="password">
                  <i class="pi pi-lock"></i>
                  كلمة المرور
                </label>
                <div class="password-input-wrapper">
                  <input 
                    [type]="showPassword ? 'text' : 'password'"
                    pInputText 
                    id="password" 
                    [(ngModel)]="password"
                    name="password"
                    [disabled]="loading"
                    placeholder="أدخل كلمة المرور"
                    class="form-input"
                    (keyup.enter)="login()" />
                  <button 
                    type="button"
                    class="password-toggle"
                    (click)="showPassword = !showPassword"
                    [disabled]="loading">
                    <i [class]="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="form-options">
                <div class="remember-me">
                  <p-checkbox 
                    [(ngModel)]="rememberMe" 
                    name="rememberMe"
                    [binary]="true" 
                    inputId="rememberMe">
                  </p-checkbox>
                  <label for="rememberMe">تذكرني</label>
                </div>
                <a href="#" class="forgot-password" (click)="forgotPassword($event)">
                  نسيت كلمة المرور؟
                </a>
              </div>

              <p-button 
                label="تسجيل الدخول" 
                icon="pi pi-sign-in" 
                type="submit"
                [loading]="loading"
                styleClass="login-button w-full">
              </p-button>

              <p-divider align="center" styleClass="divider-text">
                <span class="divider-content">أو</span>
              </p-divider>

              <div class="demo-credentials">
                <div class="demo-header">
                  <i class="pi pi-info-circle"></i>
                  <span>حساب تجريبي</span>
                </div>
                <div class="demo-details">
                  <div class="demo-item">
                    <span class="demo-label">المستخدم:</span>
                    <code>admin</code>
                  </div>
                  <div class="demo-item">
                    <span class="demo-label">كلمة المرور:</span>
                    <code>admin123</code>
                  </div>
                </div>
                <button 
                  type="button" 
                  class="use-demo-btn"
                  (click)="useDemoCredentials()"
                  [disabled]="loading">
                  <i class="pi pi-bolt"></i>
                  استخدام الحساب التجريبي
                </button>
              </div>
            </form>

            <div class="form-footer">
              <p>© 2025 SEMOP ERP. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Main Wrapper */
    .login-wrapper {
      position: relative;
      min-height: 100vh;
      overflow: hidden;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    /* Animated Background */
    .background-animation {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 0;
    }

    .circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: float 20s infinite ease-in-out;
    }

    .circle-1 {
      width: 300px;
      height: 300px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .circle-2 {
      width: 200px;
      height: 200px;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }

    .circle-3 {
      width: 150px;
      height: 150px;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }

    .circle-4 {
      width: 250px;
      height: 250px;
      top: 30%;
      right: 30%;
      animation-delay: 6s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0) scale(1);
        opacity: 0.3;
      }
      50% {
        transform: translateY(-50px) scale(1.1);
        opacity: 0.5;
      }
    }

    /* Login Container */
    .login-container {
      position: relative;
      z-index: 1;
      display: flex;
      min-height: 100vh;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Branding Section */
    .branding-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 3rem;
      color: white;
    }

    .logo-container {
      text-align: center;
      margin-bottom: 3rem;
      animation: fadeInUp 1s ease-out;
    }

    .logo-circle {
      width: 120px;
      height: 120px;
      margin: 0 auto 1.5rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .logo-circle:hover {
      transform: scale(1.1) rotate(5deg);
    }

    .brand-title {
      font-size: 3rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .brand-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
    }

    .features-list {
      width: 100%;
      max-width: 400px;
      animation: fadeInUp 1s ease-out 0.2s backwards;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      margin-bottom: 1rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .feature-item:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateX(-10px);
    }

    .feature-item i {
      font-size: 1.5rem;
      color: #4ade80;
    }

    .version-info {
      margin-top: 2rem;
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      font-size: 0.9rem;
      animation: fadeInUp 1s ease-out 0.4s backwards;
    }

    /* Form Section */
    .form-section {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .form-card {
      width: 100%;
      max-width: 480px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 3rem;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: fadeInRight 0.8s ease-out;
    }

    .form-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-header h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .form-header p {
      color: #6b7280;
      margin: 0;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #fee2e2;
      border: 1px solid #fecaca;
      border-radius: 12px;
      color: #dc2626;
      margin-bottom: 1.5rem;
      animation: shake 0.5s ease;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.95rem;
    }

    .form-group label i {
      color: #667eea;
    }

    .form-input {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      outline: none;
    }

    .password-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .password-input-wrapper .form-input {
      padding-right: 3rem;
    }

    .password-toggle {
      position: absolute;
      right: 1rem;
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.3s ease;
    }

    .password-toggle:hover {
      color: #667eea;
    }

    .password-toggle:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: -0.5rem;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .remember-me label {
      font-size: 0.9rem;
      color: #6b7280;
      cursor: pointer;
    }

    .forgot-password {
      font-size: 0.9rem;
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .forgot-password:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    ::ng-deep .login-button {
      height: 3rem;
      font-size: 1.1rem;
      font-weight: 600;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    ::ng-deep .login-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }

    ::ng-deep .divider-text {
      margin: 1.5rem 0;
    }

    .divider-content {
      color: #9ca3af;
      font-size: 0.875rem;
      padding: 0 1rem;
    }

    .demo-credentials {
      background: #f3f4f6;
      border-radius: 12px;
      padding: 1.25rem;
      border: 1px solid #e5e7eb;
    }

    .demo-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      color: #374151;
      font-weight: 600;
    }

    .demo-header i {
      color: #667eea;
    }

    .demo-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .demo-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
    }

    .demo-label {
      color: #6b7280;
      min-width: 80px;
    }

    code {
      background: white;
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      color: #667eea;
      font-weight: 600;
      border: 1px solid #e5e7eb;
    }

    .use-demo-btn {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .use-demo-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }

    .use-demo-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .form-footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .form-footer p {
      color: #9ca3af;
      font-size: 0.875rem;
      margin: 0;
    }

    /* Animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateX(50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .branding-section {
        display: none;
      }
      
      .form-section {
        flex: 1;
      }
    }

    @media (max-width: 640px) {
      .form-card {
        padding: 2rem 1.5rem;
      }

      .brand-title {
        font-size: 2rem;
      }

      .form-header h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  errorMessage = '';
  rememberMe = false;
  showPassword = false;
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

  useDemoCredentials() {
    this.username = 'admin';
    this.password = 'admin123';
    this.login();
  }

  forgotPassword(event: Event) {
    event.preventDefault();
    this.errorMessage = 'ميزة استعادة كلمة المرور قيد التطوير. للتجربة استخدم: admin / admin123';
  }
}
