import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { UsersService } from '../../services/users.service';
import { User, CreateUserRequest } from '../../models/user.model';

@Component({
  selector: 'app-users',
  imports: [CommonModule, MenubarModule, TableModule, ButtonModule, DialogModule, InputTextModule, FormsModule, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
    
    <p-menubar [model]="menuItems">
      <ng-template pTemplate="start">
        <span class="text-xl font-bold">SEMOP ERP</span>
      </ng-template>
    </p-menubar>

    <div class="p-4">
      <div class="flex justify-content-between align-items-center mb-4">
        <h1 class="text-3xl font-bold">إدارة المستخدمين</h1>
        <p-button label="إضافة مستخدم" icon="pi pi-plus" severity="success" (onClick)="showCreateDialog()"></p-button>
      </div>

      @if (loading) {
        <div class="text-center p-5">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          <p>جاري التحميل...</p>
        </div>
      } @else {
        <p-table [value]="users" [tableStyle]="{ 'min-width': '50rem' }">
          <ng-template pTemplate="header">
            <tr>
              <th>الرقم</th>
              <th>اسم المستخدم</th>
              <th>البريد الإلكتروني</th>
              <th>الاسم الكامل</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-user>
            <tr>
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.firstName }} {{ user.lastName }}</td>
              <td>
                <span [class]="'badge ' + (user.isActive ? 'badge-success' : 'badge-danger')">
                  {{ user.isActive ? 'نشط' : 'غير نشط' }}
                </span>
              </td>
              <td>
                <p-button icon="pi pi-pencil" severity="info" [text]="true" class="mr-2" (onClick)="editUser(user)"></p-button>
                <p-button icon="pi pi-trash" severity="danger" [text]="true" (onClick)="confirmDelete(user)"></p-button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      }
    </div>

    <!-- Create/Edit Dialog -->
    <p-dialog 
      [(visible)]="displayDialog" 
      [header]="editMode ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'" 
      [modal]="true" 
      [style]="{width: '450px'}">
      <div class="p-fluid">
        <div class="p-field mb-3">
          <label for="username">اسم المستخدم *</label>
          <input pInputText id="username" [(ngModel)]="currentUser.username" [disabled]="editMode" />
        </div>
        <div class="p-field mb-3">
          <label for="email">البريد الإلكتروني *</label>
          <input pInputText id="email" type="email" [(ngModel)]="currentUser.email" />
        </div>
        @if (!editMode) {
          <div class="p-field mb-3">
            <label for="password">كلمة المرور *</label>
            <input pInputText id="password" type="password" [(ngModel)]="currentUser.password" />
          </div>
        }
        <div class="p-field mb-3">
          <label for="firstName">الاسم الأول</label>
          <input pInputText id="firstName" [(ngModel)]="currentUser.firstName" />
        </div>
        <div class="p-field mb-3">
          <label for="lastName">اسم العائلة</label>
          <input pInputText id="lastName" [(ngModel)]="currentUser.lastName" />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <p-button label="إلغاء" icon="pi pi-times" (onClick)="displayDialog = false" [text]="true"></p-button>
        <p-button label="حفظ" icon="pi pi-check" (onClick)="saveUser()" [loading]="saving"></p-button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }
    .badge-success {
      background-color: #22c55e;
      color: white;
    }
    .badge-danger {
      background-color: #ef4444;
      color: white;
    }
    .mb-3 {
      margin-bottom: 1rem;
    }
  `]
})
export class UsersComponent implements OnInit {
  menuItems: MenuItem[] = [
    { label: 'الرئيسية', icon: 'pi pi-home', command: () => this.router.navigate(['/dashboard']) },
    { label: 'المستخدمين', icon: 'pi pi-users', command: () => this.router.navigate(['/users']) },
    { label: 'الأدوار', icon: 'pi pi-shield', command: () => this.router.navigate(['/roles']) },
    { label: 'الصلاحيات', icon: 'pi pi-lock', command: () => this.router.navigate(['/permissions']) }
  ];

  users: User[] = [];
  loading = false;
  displayDialog = false;
  editMode = false;
  saving = false;
  currentUser: any = {};

  constructor(
    private router: Router,
    private usersService: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.usersService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل المستخدمين' });
        console.error('Error loading users:', error);
      }
    });
  }

  showCreateDialog() {
    this.editMode = false;
    this.currentUser = {};
    this.displayDialog = true;
  }

  editUser(user: User) {
    this.editMode = true;
    this.currentUser = { ...user };
    this.displayDialog = true;
  }

  saveUser() {
    if (!this.currentUser.username || !this.currentUser.email) {
      this.messageService.add({ severity: 'warn', summary: 'تحذير', detail: 'الرجاء ملء الحقول المطلوبة' });
      return;
    }

    if (!this.editMode && !this.currentUser.password) {
      this.messageService.add({ severity: 'warn', summary: 'تحذير', detail: 'الرجاء إدخال كلمة المرور' });
      return;
    }

    this.saving = true;

    if (this.editMode) {
      // Update
      this.usersService.update(this.currentUser.id, this.currentUser).subscribe({
        next: () => {
          this.saving = false;
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'نجح', detail: 'تم تحديث المستخدم بنجاح' });
          this.loadUsers();
        },
        error: (error) => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحديث المستخدم' });
          console.error('Error updating user:', error);
        }
      });
    } else {
      // Create
      this.usersService.create(this.currentUser as CreateUserRequest).subscribe({
        next: () => {
          this.saving = false;
          this.displayDialog = false;
          this.messageService.add({ severity: 'success', summary: 'نجح', detail: 'تم إضافة المستخدم بنجاح' });
          this.loadUsers();
        },
        error: (error) => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل إضافة المستخدم' });
          console.error('Error creating user:', error);
        }
      });
    }
  }

  confirmDelete(user: User) {
    this.confirmationService.confirm({
      message: `هل أنت متأكد من حذف المستخدم ${user.username}؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this.deleteUser(user.id);
      }
    });
  }

  deleteUser(id: number) {
    this.usersService.delete(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'نجح', detail: 'تم حذف المستخدم بنجاح' });
        this.loadUsers();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل حذف المستخدم' });
        console.error('Error deleting user:', error);
      }
    });
  }
}
