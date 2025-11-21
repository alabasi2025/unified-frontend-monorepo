import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ButtonModule, 
    InputTextModule, 
    CardModule, 
    CheckboxModule
  ],
  template: `
    <div class="iot-login-wrapper">
      <!-- IoT Animated Background -->
      <canvas id="iot-canvas" class="iot-canvas"></canvas>
      
      <!-- Network Grid -->
      <div class="network-grid"></div>
      
      <!-- Floating Particles -->
      <div class="particles">
        <div class="particle" *ngFor="let p of particles" [style.left.%]="p.x" [style.top.%]="p.y" [style.animation-delay.s]="p.delay"></div>
      </div>

      <!-- Main Container -->
      <div class="iot-container">
        <!-- Left Panel - IoT Dashboard Style -->
        <div class="iot-panel left-panel">
          <div class="panel-glow"></div>
          
          <!-- Logo Section -->
          <div class="iot-logo-section">
            <div class="logo-hexagon">
              <div class="hexagon-inner">
                <i class="pi pi-bolt"></i>
              </div>
              <div class="hexagon-ring"></div>
              <div class="hexagon-ring ring-2"></div>
            </div>
            <h1 class="iot-title">SEMOP ERP</h1>
            <p class="iot-subtitle">Smart Enterprise Resource Planning</p>
          </div>

          <!-- Status Indicators -->
          <div class="status-grid">
            <div class="status-card">
              <div class="status-icon online">
                <i class="pi pi-check-circle"></i>
              </div>
              <div class="status-info">
                <span class="status-label">System Status</span>
                <span class="status-value">Online</span>
              </div>
            </div>
            
            <div class="status-card">
              <div class="status-icon">
                <i class="pi pi-server"></i>
              </div>
              <div class="status-info">
                <span class="status-label">Server</span>
                <span class="status-value">Active</span>
              </div>
            </div>
            
            <div class="status-card">
              <div class="status-icon">
                <i class="pi pi-shield"></i>
              </div>
              <div class="status-info">
                <span class="status-label">Security</span>
                <span class="status-value">Secured</span>
              </div>
            </div>
            
            <div class="status-card">
              <div class="status-icon">
                <i class="pi pi-users"></i>
              </div>
              <div class="status-info">
                <span class="status-label">Users</span>
                <span class="status-value">{{ activeUsers }}</span>
              </div>
            </div>
          </div>

          <!-- Version Info -->
          <div class="version-badge">
            <span class="version-label">v1.7.0</span>
            <div class="version-pulse"></div>
          </div>
        </div>

        <!-- Right Panel - Login Form -->
        <div class="iot-panel right-panel">
          <div class="panel-glow"></div>
          
          <div class="login-card">
            <div class="card-header">
              <div class="header-icon">
                <i class="pi pi-lock"></i>
              </div>
              <h2>تسجيل الدخول</h2>
              <p>الوصول إلى لوحة التحكم الذكية</p>
            </div>

            @if (errorMessage) {
              <div class="alert-box error">
                <i class="pi pi-exclamation-triangle"></i>
                <span>{{ errorMessage }}</span>
              </div>
            }

            <form class="iot-form" (ngSubmit)="login()">
              <div class="form-field">
                <label class="field-label">
                  <i class="pi pi-user"></i>
                  <span>اسم المستخدم</span>
                </label>
                <div class="input-wrapper">
                  <input 
                    pInputText 
                    [(ngModel)]="username"
                    name="username"
                    [disabled]="loading"
                    placeholder="أدخل اسم المستخدم"
                    class="iot-input"
                    (keyup.enter)="login()" />
                  <div class="input-border"></div>
                </div>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="pi pi-lock"></i>
                  <span>كلمة المرور</span>
                </label>
                <div class="input-wrapper">
                  <input 
                    [type]="showPassword ? 'text' : 'password'"
                    pInputText 
                    [(ngModel)]="password"
                    name="password"
                    [disabled]="loading"
                    placeholder="أدخل كلمة المرور"
                    class="iot-input"
                    (keyup.enter)="login()" />
                  <button 
                    type="button"
                    class="toggle-password"
                    (click)="showPassword = !showPassword">
                    <i [class]="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                  </button>
                  <div class="input-border"></div>
                </div>
              </div>

              <div class="form-options">
                <div class="checkbox-wrapper">
                  <p-checkbox 
                    [(ngModel)]="rememberMe" 
                    name="rememberMe"
                    [binary]="true" 
                    inputId="rememberMe">
                  </p-checkbox>
                  <label for="rememberMe">تذكرني</label>
                </div>
                <a href="#" class="link-text" (click)="forgotPassword($event)">
                  نسيت كلمة المرور؟
                </a>
              </div>

              <!-- CAPTCHA Section -->
              <div class="captcha-section">
                <label class="field-label">
                  <i class="pi pi-shield"></i>
                  <span>رمز التحقق</span>
                </label>
                <div class="captcha-wrapper">
                  <canvas 
                    id="captcha-canvas" 
                    width="250" 
                    height="80"
                    class="captcha-canvas"
                    [class.error]="captchaError">
                  </canvas>
                  <button 
                    type="button" 
                    class="refresh-captcha"
                    (click)="generateCaptcha()"
                    title="تحديث رمز التحقق">
                    <i class="pi pi-refresh"></i>
                  </button>
                </div>
                <div class="input-wrapper">
                  <input 
                    pInputText 
                    [(ngModel)]="captchaInput"
                    name="captcha"
                    [disabled]="loading"
                    placeholder="أدخل رمز التحقق"
                    class="iot-input"
                    [class.error]="captchaError"
                    maxlength="6"
                    (keyup.enter)="login()" />
                  <div class="input-border"></div>
                </div>
              </div>

              <button 
                type="submit"
                class="iot-button primary"
                [disabled]="loading">
                <span class="button-content">
                  <i class="pi pi-sign-in"></i>
                  <span>{{ loading ? 'جاري التحقق...' : 'تسجيل الدخول' }}</span>
                </span>
                <div class="button-glow"></div>
              </button>

              <div class="divider">
                <span>أو</span>
              </div>

              <div class="demo-section">
                <div class="demo-header">
                  <i class="pi pi-info-circle"></i>
                  <span>حساب تجريبي</span>
                </div>
                <div class="demo-credentials">
                  <div class="credential-item">
                    <span class="label">المستخدم:</span>
                    <code class="value">admin</code>
                  </div>
                  <div class="credential-item">
                    <span class="label">كلمة المرور:</span>
                    <code class="value">admin123</code>
                  </div>
                </div>
                <button 
                  type="button" 
                  class="iot-button secondary"
                  (click)="useDemoCredentials()"
                  [disabled]="loading">
                  <span class="button-content">
                    <i class="pi pi-bolt"></i>
                    <span>استخدام الحساب التجريبي</span>
                  </span>
                  <div class="button-glow"></div>
                </button>
              </div>
            </form>

            <div class="card-footer">
              <p>© 2025 SEMOP ERP. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* IoT Smart System Design */
    .iot-login-wrapper {
      position: relative;
      min-height: 100vh;
      background: #0a0e27;
      overflow: hidden;
      direction: rtl;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* Animated Canvas Background */
    .iot-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    /* Network Grid */
    .network-grid {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      z-index: 1;
      animation: gridMove 20s linear infinite;
    }

    @keyframes gridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(50px, 50px); }
    }

    /* Floating Particles */
    .particles {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 2;
    }

    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(0, 255, 255, 0.6);
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
      animation: particleFloat 15s infinite ease-in-out;
    }

    @keyframes particleFloat {
      0%, 100% {
        transform: translateY(0) translateX(0);
        opacity: 0;
      }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% {
        transform: translateY(-100vh) translateX(50px);
        opacity: 0;
      }
    }

    /* Main Container */
    .iot-container {
      position: relative;
      z-index: 10;
      display: flex;
      min-height: 100vh;
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 20px;
      gap: 40px;
    }

    /* IoT Panel */
    .iot-panel {
      position: relative;
      flex: 1;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(0, 255, 255, 0.2);
      border-radius: 20px;
      padding: 40px;
      backdrop-filter: blur(20px);
      box-shadow: 
        0 0 40px rgba(0, 255, 255, 0.1),
        inset 0 0 40px rgba(0, 255, 255, 0.05);
    }

    .panel-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(0, 255, 255, 0.8) 50%, 
        transparent 100%);
      animation: glowMove 3s ease-in-out infinite;
    }

    @keyframes glowMove {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }

    /* Left Panel - Dashboard */
    .left-panel {
      display: flex;
      flex-direction: column;
      gap: 40px;
    }

    /* Logo Section */
    .iot-logo-section {
      text-align: center;
    }

    .logo-hexagon {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 0 auto 30px;
    }

    .hexagon-inner {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #00ffff 0%, #0080ff 100%);
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: hexagonPulse 3s ease-in-out infinite;
    }

    .hexagon-inner i {
      font-size: 50px;
      color: #0a0e27;
      font-weight: bold;
    }

    .hexagon-ring {
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      border: 2px solid rgba(0, 255, 255, 0.3);
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      animation: ringRotate 10s linear infinite;
    }

    .ring-2 {
      top: -20px;
      left: -20px;
      right: -20px;
      bottom: -20px;
      border-color: rgba(0, 255, 255, 0.2);
      animation-duration: 15s;
      animation-direction: reverse;
    }

    @keyframes hexagonPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    @keyframes ringRotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .iot-title {
      font-size: 42px;
      font-weight: 800;
      background: linear-gradient(135deg, #00ffff 0%, #0080ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 10px 0;
      letter-spacing: 2px;
    }

    .iot-subtitle {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      margin: 0;
      letter-spacing: 1px;
    }

    /* Status Grid */
    .status-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .status-card {
      background: rgba(0, 255, 255, 0.05);
      border: 1px solid rgba(0, 255, 255, 0.2);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      transition: all 0.3s ease;
    }

    .status-card:hover {
      background: rgba(0, 255, 255, 0.1);
      border-color: rgba(0, 255, 255, 0.4);
      transform: translateY(-2px);
    }

    .status-icon {
      width: 50px;
      height: 50px;
      background: rgba(0, 255, 255, 0.1);
      border: 2px solid rgba(0, 255, 255, 0.3);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #00ffff;
    }

    .status-icon.online {
      background: rgba(0, 255, 0, 0.1);
      border-color: rgba(0, 255, 0, 0.3);
      color: #00ff00;
      animation: statusPulse 2s ease-in-out infinite;
    }

    @keyframes statusPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7); }
      50% { box-shadow: 0 0 0 10px rgba(0, 255, 0, 0); }
    }

    .status-info {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .status-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }

    .status-value {
      font-size: 16px;
      font-weight: 600;
      color: #00ffff;
    }

    /* Version Badge */
    .version-badge {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 20px;
      background: rgba(0, 255, 255, 0.1);
      border: 1px solid rgba(0, 255, 255, 0.3);
      border-radius: 20px;
      margin-top: auto;
    }

    .version-label {
      color: #00ffff;
      font-weight: 600;
      font-size: 14px;
    }

    .version-pulse {
      width: 8px;
      height: 8px;
      background: #00ff00;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    /* Right Panel - Login Form */
    .right-panel {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .login-card {
      width: 100%;
      max-width: 450px;
    }

    .card-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .header-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #00ffff 0%, #0080ff 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      color: #0a0e27;
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
      animation: iconFloat 3s ease-in-out infinite;
    }

    @keyframes iconFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .card-header h2 {
      font-size: 32px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 10px 0;
    }

    .card-header p {
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
      font-size: 14px;
    }

    /* Alert Box */
    .alert-box {
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 25px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
    }

    .alert-box.error {
      background: rgba(255, 0, 0, 0.1);
      border: 1px solid rgba(255, 0, 0, 0.3);
      color: #ff4444;
    }

    /* IoT Form */
    .iot-form {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .field-label {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-weight: 500;
    }

    .field-label i {
      color: #00ffff;
    }

    .input-wrapper {
      position: relative;
    }

    .iot-input {
      width: 100%;
      padding: 15px 20px;
      background: rgba(0, 255, 255, 0.05);
      border: 1px solid rgba(0, 255, 255, 0.2);
      border-radius: 10px;
      color: #ffffff;
      font-size: 15px;
      transition: all 0.3s ease;
    }

    .iot-input:focus {
      outline: none;
      background: rgba(0, 255, 255, 0.1);
      border-color: #00ffff;
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
    }

    .iot-input::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }

    .input-border {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #00ffff 0%, #0080ff 100%);
      transition: width 0.3s ease;
    }

    .iot-input:focus + .input-border {
      width: 100%;
    }

    .toggle-password {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      font-size: 18px;
      transition: color 0.3s ease;
    }

    .toggle-password:hover {
      color: #00ffff;
    }

    /* Form Options */
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
    }

    .checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.7);
    }

    .link-text {
      color: #00ffff;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .link-text:hover {
      color: #0080ff;
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }

    /* CAPTCHA Section */
    .captcha-section {
      margin: 20px 0;
    }

    .captcha-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
    }

    .captcha-canvas {
      border: 2px solid rgba(0, 255, 255, 0.3);
      border-radius: 8px;
      background: #0f1419;
      transition: all 0.3s ease;
    }

    .captcha-canvas.error {
      border-color: rgba(255, 0, 0, 0.5);
      animation: shake 0.5s;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    .refresh-captcha {
      background: rgba(0, 255, 255, 0.1);
      border: 2px solid rgba(0, 255, 255, 0.3);
      color: #00ffff;
      width: 50px;
      height: 50px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .refresh-captcha:hover {
      background: rgba(0, 255, 255, 0.2);
      border-color: #00ffff;
      transform: rotate(180deg);
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
    }

    .iot-input.error {
      border-color: rgba(255, 0, 0, 0.5) !important;
    }

    /* IoT Button */
    .iot-button {
      position: relative;
      padding: 16px 32px;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .iot-button.primary {
      background: linear-gradient(135deg, #00ffff 0%, #0080ff 100%);
      color: #0a0e27;
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.4);
    }

    .iot-button.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 40px rgba(0, 255, 255, 0.6);
    }

    .iot-button.secondary {
      background: rgba(0, 255, 255, 0.1);
      color: #00ffff;
      border: 1px solid rgba(0, 255, 255, 0.3);
    }

    .iot-button.secondary:hover {
      background: rgba(0, 255, 255, 0.2);
      border-color: #00ffff;
    }

    .iot-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .button-content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .button-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
      transform: translate(-50%, -50%) scale(0);
      transition: transform 0.5s ease;
    }

    .iot-button:active .button-glow {
      transform: translate(-50%, -50%) scale(2);
    }

    /* Divider */
    .divider {
      display: flex;
      align-items: center;
      gap: 15px;
      color: rgba(255, 255, 255, 0.4);
      font-size: 14px;
      margin: 10px 0;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(0, 255, 255, 0.3) 50%, 
        transparent 100%);
    }

    /* Demo Section */
    .demo-section {
      background: rgba(0, 255, 255, 0.05);
      border: 1px solid rgba(0, 255, 255, 0.2);
      border-radius: 12px;
      padding: 20px;
    }

    .demo-header {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #00ffff;
      font-weight: 600;
      margin-bottom: 15px;
    }

    .demo-credentials {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 15px;
    }

    .credential-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    }

    .credential-item .label {
      color: rgba(255, 255, 255, 0.6);
    }

    .credential-item .value {
      background: rgba(0, 255, 255, 0.1);
      border: 1px solid rgba(0, 255, 255, 0.3);
      padding: 4px 12px;
      border-radius: 6px;
      color: #00ffff;
      font-family: 'Courier New', monospace;
    }

    /* Card Footer */
    .card-footer {
      margin-top: 30px;
      text-align: center;
      color: rgba(255, 255, 255, 0.4);
      font-size: 12px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .iot-container {
        flex-direction: column;
      }

      .left-panel {
        order: 2;
      }

      .right-panel {
        order: 1;
      }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  rememberMe = false;
  loading = false;
  errorMessage = '';
  returnUrl = '';
  activeUsers = 127;
  particles: any[] = [];
  captchaText = '';
  captchaInput = '';
  captchaError = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.generateParticles();
    this.initCanvas();
    this.generateCaptcha();
  }

  generateParticles() {
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 15
      });
    }
  }

  generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.captchaText = captcha;
    this.captchaInput = '';
    this.captchaError = false;
    
    setTimeout(() => {
      this.drawCaptcha();
    }, 100);
  }

  drawCaptcha() {
    const canvas = document.getElementById('captcha-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background with gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add noise
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(0, 255, 255, ${Math.random() * 0.1})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }
    
    // Draw lines
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(0, 255, 255, ${Math.random() * 0.3 + 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    
    // Draw text
    ctx.font = 'bold 32px Arial';
    ctx.textBaseline = 'middle';
    
    const spacing = canvas.width / (this.captchaText.length + 1);
    for (let i = 0; i < this.captchaText.length; i++) {
      const x = spacing * (i + 1);
      const y = canvas.height / 2 + (Math.random() - 0.5) * 10;
      const angle = (Math.random() - 0.5) * 0.3;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      // Text shadow
      ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
      ctx.fillText(this.captchaText[i], 2, 2);
      
      // Main text
      const hue = Math.random() * 60 + 160;
      ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
      ctx.fillText(this.captchaText[i], 0, 0);
      
      ctx.restore();
    }
  }

  initCanvas() {
    setTimeout(() => {
      const canvas = document.getElementById('iot-canvas') as HTMLCanvasElement;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const nodes: any[] = [];
      const nodeCount = 50;

      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5
        });
      }

      function animate() {
        ctx!.clearRect(0, 0, canvas.width, canvas.height);

        nodes.forEach(node => {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
          if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

          ctx!.beginPath();
          ctx!.arc(node.x, node.y, 2, 0, Math.PI * 2);
          ctx!.fillStyle = 'rgba(0, 255, 255, 0.5)';
          ctx!.fill();
        });

        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              ctx!.beginPath();
              ctx!.moveTo(nodes[i].x, nodes[i].y);
              ctx!.lineTo(nodes[j].x, nodes[j].y);
              ctx!.strokeStyle = `rgba(0, 255, 255, ${0.2 * (1 - distance / 150)})`;
              ctx!.lineWidth = 1;
              ctx!.stroke();
            }
          }
        }

        requestAnimationFrame(animate);
      }

      animate();
    }, 100);
  }

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'الرجاء إدخال اسم المستخدم وكلمة المرور';
      return;
    }

    if (this.captchaInput.toUpperCase() !== this.captchaText) {
      this.captchaError = true;
      this.errorMessage = 'رمز التحقق غير صحيح';
      this.generateCaptcha();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.captchaError = false;

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'فشل تسجيل الدخول. تحقق من بياناتك.';
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
    alert('سيتم إضافة هذه الميزة قريباً');
  }
}
