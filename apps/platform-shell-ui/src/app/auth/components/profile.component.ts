import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { FileUploadModule } from 'primeng/fileupload';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { PageHeaderComponent } from '../../shared/components/page-header.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    TabsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    AvatarModule,
    FileUploadModule,
    PageHeaderComponent
  ],
  template: `
    <app-page-header
      title="الملف الشخصي"
      subtitle="إدارة معلوماتك الشخصية وإعدادات الحساب"
      icon="pi pi-user"
    ></app-page-header>

    <div class="grid">
      <div class="col-12 lg:col-4">
        <p-card>
          <div class="profile-avatar-section">
            <p-avatar
              [label]="userInitials"
              size="xlarge"
              shape="circle"
              [style]="{ 'width': '120px', 'height': '120px', 'font-size': '3rem', 'background-color': '#2196F3', 'color': '#ffffff' }"
            ></p-avatar>
            
            <h3 class="mt-3 mb-1">{{ currentUser?.name }}</h3>
            <p class="text-color-secondary mb-3">{{ currentUser?.email }}</p>
            
            <p-fileUpload
              mode="basic"
              chooseLabel="تغيير الصورة"
              accept="image/*"
              [maxFileSize]="1000000"
              (onSelect)="onAvatarSelect($event)"
              [auto]="true"
              chooseIcon="pi pi-upload"
            ></p-fileUpload>
          </div>

          <div class="profile-info mt-4">
            <div class="info-item">
              <span class="info-label">الدور:</span>
              <span class="info-value">{{ currentUser?.role }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">تاريخ الانضمام:</span>
              <span class="info-value">{{ currentUser?.createdAt | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">آخر تسجيل دخول:</span>
              <span class="info-value">{{ currentUser?.lastLogin | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
          </div>
        </p-card>
      </div>

      <div class="col-12 lg:col-8">
        <p-card>
          <p-tabs>
            <!-- Personal Information Tab -->
            <p-tabPanel header="المعلومات الشخصية" leftIcon="pi pi-user">
              <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()">
                <div class="grid">
                  <div class="col-12 md:col-6">
                    <div class="field">
                      <label for="name">الاسم الكامل</label>
                      <input
                        id="name"
                        type="text"
                        pInputText
                        formControlName="name"
                        class="w-full"
                      />
                    </div>
                  </div>

                  <div class="col-12 md:col-6">
                    <div class="field">
                      <label for="email">البريد الإلكتروني</label>
                      <input
                        id="email"
                        type="email"
                        pInputText
                        formControlName="email"
                        class="w-full"
                      />
                    </div>
                  </div>

                  <div class="col-12 md:col-6">
                    <div class="field">
                      <label for="phone">رقم الهاتف</label>
                      <input
                        id="phone"
                        type="tel"
                        pInputText
                        formControlName="phone"
                        class="w-full"
                      />
                    </div>
                  </div>

                  <div class="col-12 md:col-6">
                    <div class="field">
                      <label for="position">المسمى الوظيفي</label>
                      <input
                        id="position"
                        type="text"
                        pInputText
                        formControlName="position"
                        class="w-full"
                      />
                    </div>
                  </div>

                  <div class="col-12">
                    <button
                      pButton
                      type="submit"
                      label="حفظ التغييرات"
                      icon="pi pi-check"
                      [loading]="loadingProfile"
                      [disabled]="profileForm.invalid"
                    ></button>
                  </div>
                </div>
              </form>
            </p-tabPanel>

            <!-- Change Password Tab -->
            <p-tabPanel header="تغيير كلمة المرور" leftIcon="pi pi-lock">
              <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()">
                <div class="grid">
                  <div class="col-12">
                    <div class="field">
                      <label for="currentPassword">كلمة المرور الحالية</label>
                      <p-password
                        id="currentPassword"
                        formControlName="currentPassword"
                        [toggleMask]="true"
                        [feedback]="false"
                        styleClass="w-full"
                        inputStyleClass="w-full"
                      ></p-password>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="field">
                      <label for="newPassword">كلمة المرور الجديدة</label>
                      <p-password
                        id="newPassword"
                        formControlName="newPassword"
                        [toggleMask]="true"
                        styleClass="w-full"
                        inputStyleClass="w-full"
                      ></p-password>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="field">
                      <label for="confirmNewPassword">تأكيد كلمة المرور الجديدة</label>
                      <p-password
                        id="confirmNewPassword"
                        formControlName="confirmNewPassword"
                        [toggleMask]="true"
                        [feedback]="false"
                        styleClass="w-full"
                        inputStyleClass="w-full"
                      ></p-password>
                      <small class="p-error" *ngIf="passwordForm.hasError('passwordMismatch') && passwordForm.get('confirmNewPassword')?.touched">
                        كلمات المرور غير متطابقة
                      </small>
                    </div>
                  </div>

                  <div class="col-12">
                    <button
                      pButton
                      type="submit"
                      label="تغيير كلمة المرور"
                      icon="pi pi-key"
                      [loading]="loadingPassword"
                      [disabled]="passwordForm.invalid"
                    ></button>
                  </div>
                </div>
              </form>
            </p-tabPanel>

            <!-- Preferences Tab -->
            <p-tabPanel header="التفضيلات" leftIcon="pi pi-cog">
              <form [formGroup]="preferencesForm" (ngSubmit)="onUpdatePreferences()">
                <div class="grid">
                  <div class="col-12">
                    <div class="field">
                      <label for="language">اللغة</label>
                      <select id="language" formControlName="language" class="w-full p-inputtext">
                        <option value="ar">العربية</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="field">
                      <label for="theme">المظهر</label>
                      <select id="theme" formControlName="theme" class="w-full p-inputtext">
                        <option value="light">فاتح</option>
                        <option value="dark">داكن</option>
                        <option value="auto">تلقائي</option>
                      </select>
                    </div>
                  </div>

                  <div class="col-12">
                    <button
                      pButton
                      type="submit"
                      label="حفظ التفضيلات"
                      icon="pi pi-check"
                      [loading]="loadingPreferences"
                    ></button>
                  </div>
                </div>
              </form>
            </p-tabPanel>
          </p-tabs>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 2rem 0;
      border-bottom: 1px solid var(--surface-border);
    }

    .profile-info {
      padding-top: 1rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--surface-border);
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-label {
      font-weight: 600;
      color: var(--text-color-secondary);
    }

    .info-value {
      color: var(--text-color);
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

    :host ::ng-deep .p-tabview .p-tabview-panels {
      padding: 2rem;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  preferencesForm!: FormGroup;
  
  currentUser: any;
  userInitials = 'U';
  
  loadingProfile = false;
  loadingPassword = false;
  loadingPreferences = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.userInitials = this.currentUser?.name?.charAt(0).toUpperCase() || 'U';

    this.initForms();
  }

  initForms() {
    this.profileForm = this.fb.group({
      name: [this.currentUser?.name || '', Validators.required],
      email: [this.currentUser?.email || '', [Validators.required, Validators.email]],
      phone: [this.currentUser?.phone || ''],
      position: [this.currentUser?.position || '']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });

    this.preferencesForm = this.fb.group({
      language: [this.currentUser?.preferences?.language || 'ar'],
      theme: [this.currentUser?.preferences?.theme || 'light']
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmNewPassword = form.get('confirmNewPassword');
    
    if (newPassword && confirmNewPassword && newPassword.value !== confirmNewPassword.value) {
      return { passwordMismatch: true };
    }
    
    return null;
  }

  async onUpdateProfile() {
    if (this.profileForm.invalid) return;

    this.loadingProfile = true;
    try {
      await this.authService.updateProfile(this.profileForm.value);
      this.notificationService.success('تم تحديث المعلومات الشخصية بنجاح');
    } catch (error: any) {
      this.notificationService.error(error.message || 'فشل تحديث المعلومات');
    } finally {
      this.loadingProfile = false;
    }
  }

  async onChangePassword() {
    if (this.passwordForm.invalid) return;

    this.loadingPassword = true;
    try {
      const { currentPassword, newPassword } = this.passwordForm.value;
      await this.authService.changePassword(currentPassword, newPassword);
      this.notificationService.success('تم تغيير كلمة المرور بنجاح');
      this.passwordForm.reset();
    } catch (error: any) {
      this.notificationService.error(error.message || 'فشل تغيير كلمة المرور');
    } finally {
      this.loadingPassword = false;
    }
  }

  async onUpdatePreferences() {
    this.loadingPreferences = true;
    try {
      await this.authService.updatePreferences(this.preferencesForm.value);
      this.notificationService.success('تم حفظ التفضيلات بنجاح');
    } catch (error: any) {
      this.notificationService.error(error.message || 'فشل حفظ التفضيلات');
    } finally {
      this.loadingPreferences = false;
    }
  }

  onAvatarSelect(event: any) {
    const file = event.files[0];
    if (file) {
      // Handle avatar upload
      this.notificationService.info('جاري رفع الصورة...');
      // Implement upload logic here
    }
  }
}
