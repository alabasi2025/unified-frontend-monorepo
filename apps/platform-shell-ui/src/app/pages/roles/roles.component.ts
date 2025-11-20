import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="p-4">
      <h2>إدارة الأدوار</h2>
      
      <p-button label="إضافة دور" icon="pi pi-plus" (onClick)="showAddDialog()"></p-button>
      
      <p-table [value]="roles" [loading]="loading" styleClass="p-datatable-gridlines mt-3">
        <ng-template pTemplate="header">
          <tr>
            <th>الرقم</th>
            <th>الاسم</th>
            <th>الكود</th>
            <th>الوصف</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-role>
          <tr>
            <td>{{ role.id }}</td>
            <td>{{ role.name }}</td>
            <td>{{ role.code }}</td>
            <td>{{ role.description }}</td>
            <td>
              <span [class]="role.isActive ? 'text-green-500' : 'text-red-500'">
                {{ role.isActive ? 'نشط' : 'غير نشط' }}
              </span>
            </td>
            <td>
              <p-button icon="pi pi-pencil" class="p-button-sm p-button-warning mr-2" (onClick)="editRole(role)"></p-button>
              <p-button icon="pi pi-trash" class="p-button-sm p-button-danger" (onClick)="deleteRole(role)"></p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <p-dialog [(visible)]="displayDialog" [header]="editMode ? 'تعديل دور' : 'إضافة دور جديد'" [modal]="true" [style]="{width: '500px'}">
        <div class="p-fluid">
          <div class="field">
            <label for="name">الاسم *</label>
            <input pInputText id="name" [(ngModel)]="currentRole.name" required />
          </div>
          <div class="field">
            <label for="code">الكود *</label>
            <input pInputText id="code" [(ngModel)]="currentRole.code" required />
          </div>
          <div class="field">
            <label for="description">الوصف</label>
            <input pInputText id="description" [(ngModel)]="currentRole.description" />
          </div>
        </div>
        <ng-template pTemplate="footer">
          <p-button label="إلغاء" icon="pi pi-times" (onClick)="displayDialog = false" styleClass="p-button-text"></p-button>
          <p-button label="حفظ" icon="pi pi-check" (onClick)="saveRole()" [loading]="saving"></p-button>
        </ng-template>
      </p-dialog>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>
    </div>
  `
})
export class RolesComponent implements OnInit {
  roles: any[] = [];
  loading = false;
  displayDialog = false;
  editMode = false;
  saving = false;
  currentRole: any = {};

  constructor(
    private rolesService: RolesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.loading = true;
    this.rolesService.getAll().subscribe({
      next: (data) => {
        this.roles = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل تحميل الأدوار' });
      }
    });
  }

  showAddDialog() {
    this.currentRole = {};
    this.editMode = false;
    this.displayDialog = true;
  }

  editRole(role: any) {
    this.currentRole = { ...role };
    this.editMode = true;
    this.displayDialog = true;
  }

  saveRole() {
    this.saving = true;
    const operation = this.editMode 
      ? this.rolesService.update(this.currentRole.id, this.currentRole)
      : this.rolesService.create(this.currentRole);

    operation.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'نجح', detail: this.editMode ? 'تم تحديث الدور' : 'تم إضافة الدور' });
        this.displayDialog = false;
        this.saving = false;
        this.loadRoles();
      },
      error: (error) => {
        console.error('Error saving role:', error);
        this.saving = false;
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل حفظ الدور' });
      }
    });
  }

  deleteRole(role: any) {
    this.confirmationService.confirm({
      message: `هل أنت متأكد من حذف الدور "${role.name}"؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this.rolesService.delete(role.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'نجح', detail: 'تم حذف الدور' });
            this.loadRoles();
          },
          error: (error) => {
            console.error('Error deleting role:', error);
            this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل حذف الدور' });
          }
        });
      }
    });
  }
}
