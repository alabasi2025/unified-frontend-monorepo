import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';

interface FiscalPeriod {
  id: number;
  periodName: string;
  startDate: Date;
  endDate: Date;
  status: string;
  isClosed: boolean;
  closedBy?: string;
  closedAt?: Date;
}

@Component({
  selector: 'app-fiscal-periods',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DatePickerModule,
    ToastModule,
    CheckboxModule
  ],
  providers: [MessageService],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>الفترات المالية</h1>
        <button pButton label="فترة جديدة" icon="pi pi-plus" (click)="openNew()"></button>
      </div>

      <div class="card">
        <p-table 
          [value]="periods" 
          [paginator]="true" 
          [rows]="10"
          [globalFilterFields]="['periodName','status']"
          responsiveLayout="scroll">
          
          <ng-template pTemplate="caption">
            <div class="table-header">
              <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <input pInputText type="text" 
                       (input)="onSearch($event)" 
                       placeholder="بحث..." />
              </span>
            </div>
          </ng-template>

          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="periodName">
                اسم الفترة <p-sortIcon field="periodName"></p-sortIcon>
              </th>
              <th pSortableColumn="startDate">
                تاريخ البداية <p-sortIcon field="startDate"></p-sortIcon>
              </th>
              <th pSortableColumn="endDate">
                تاريخ النهاية <p-sortIcon field="endDate"></p-sortIcon>
              </th>
              <th>المدة (أيام)</th>
              <th>الحالة</th>
              <th>مغلقة</th>
              <th>الإجراءات</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-period>
            <tr>
              <td><strong>{{ period.periodName }}</strong></td>
              <td>{{ period.startDate | date:'dd/MM/yyyy' }}</td>
              <td>{{ period.endDate | date:'dd/MM/yyyy' }}</td>
              <td>{{ calculateDuration(period.startDate, period.endDate) }}</td>
              <td>
                <span [class]="'status-badge status-' + period.status">
                  {{ getStatusLabel(period.status) }}
                </span>
              </td>
              <td>
                <span [class]="'closed-badge ' + (period.isClosed ? 'closed' : 'open')">
                  <i [class]="period.isClosed ? 'pi pi-lock' : 'pi pi-lock-open'"></i>
                  {{ period.isClosed ? 'مغلقة' : 'مفتوحة' }}
                </span>
              </td>
              <td>
                <button pButton icon="pi pi-eye" 
                        class="p-button-rounded p-button-text p-button-info"
                        (click)="viewPeriod(period)"
                        pTooltip="عرض"></button>
                <button pButton icon="pi pi-pencil" 
                        class="p-button-rounded p-button-text p-button-warning"
                        (click)="editPeriod(period)"
                        [disabled]="period.isClosed"
                        pTooltip="تعديل"></button>
                <button pButton icon="pi pi-lock" 
                        class="p-button-rounded p-button-text p-button-secondary"
                        (click)="closePeriod(period)"
                        [disabled]="period.isClosed"
                        pTooltip="إغلاق الفترة"></button>
                <button pButton icon="pi pi-trash" 
                        class="p-button-rounded p-button-text p-button-danger"
                        (click)="deletePeriod(period)"
                        [disabled]="period.isClosed"
                        pTooltip="حذف"></button>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="7" class="text-center">لا توجد فترات مالية</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- Dialog -->
      <p-dialog 
        [(visible)]="periodDialog" 
        [header]="dialogTitle"
        [modal]="true" 
        [style]="{width: '600px'}">
        
        <div class="period-form">
          <div class="form-group">
            <label>اسم الفترة *</label>
            <input pInputText [(ngModel)]="period.periodName" 
                   placeholder="مثال: الربع الأول 2025" />
            <small class="help-text">اسم وصفي للفترة المالية</small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>تاريخ البداية *</label>
              <p-datepicker [(ngModel)]="period.startDate" 
                          dateFormat="dd/mm/yy"
                          [showIcon]="true"
                          (onSelect)="onDateChange()"></p-datepicker>
            </div>

            <div class="form-group">
              <label>تاريخ النهاية *</label>
              <p-datepicker [(ngModel)]="period.endDate" 
                          dateFormat="dd/mm/yy"
                          [showIcon]="true"
                          [minDate]="period.startDate"
                          (onSelect)="onDateChange()"></p-datepicker>
            </div>
          </div>

          <div class="info-box" *ngIf="period.startDate && period.endDate">
            <i class="pi pi-info-circle"></i>
            <span>مدة الفترة: <strong>{{ calculateDuration(period.startDate, period.endDate) }}</strong> يوم</span>
          </div>

          <div class="form-group">
            <label>الحالة *</label>
            <div class="status-options">
              <label class="radio-option">
                <input type="radio" name="status" value="active" [(ngModel)]="period.status" />
                <span>نشطة</span>
              </label>
              <label class="radio-option">
                <input type="radio" name="status" value="future" [(ngModel)]="period.status" />
                <span>مستقبلية</span>
              </label>
              <label class="radio-option">
                <input type="radio" name="status" value="inactive" [(ngModel)]="period.status" />
                <span>غير نشطة</span>
              </label>
            </div>
          </div>

          <div class="warning-box" *ngIf="isEditMode && period.isClosed">
            <i class="pi pi-exclamation-triangle"></i>
            <span>هذه الفترة مغلقة ولا يمكن تعديلها. يجب إعادة فتحها أولاً.</span>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <button pButton label="إلغاء" 
                  icon="pi pi-times" 
                  class="p-button-text"
                  (click)="hideDialog()"></button>
          <button pButton label="حفظ" 
                  icon="pi pi-check" 
                  (click)="savePeriod()"
                  [disabled]="!isValid() || (isEditMode && period.isClosed)"></button>
        </ng-template>
      </p-dialog>

      <!-- View Dialog -->
      <p-dialog 
        [(visible)]="viewDialog" 
        header="تفاصيل الفترة المالية"
        [modal]="true" 
        [style]="{width: '600px'}">
        
        <div class="view-content" *ngIf="selectedPeriod">
          <div class="detail-row">
            <span class="detail-label">اسم الفترة:</span>
            <span class="detail-value"><strong>{{ selectedPeriod.periodName }}</strong></span>
          </div>

          <div class="detail-row">
            <span class="detail-label">تاريخ البداية:</span>
            <span class="detail-value">{{ selectedPeriod.startDate | date:'dd/MM/yyyy' }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">تاريخ النهاية:</span>
            <span class="detail-value">{{ selectedPeriod.endDate | date:'dd/MM/yyyy' }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">المدة:</span>
            <span class="detail-value">{{ calculateDuration(selectedPeriod.startDate, selectedPeriod.endDate) }} يوم</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">الحالة:</span>
            <span class="detail-value">
              <span [class]="'status-badge status-' + selectedPeriod.status">
                {{ getStatusLabel(selectedPeriod.status) }}
              </span>
            </span>
          </div>

          <div class="detail-row">
            <span class="detail-label">حالة الإغلاق:</span>
            <span class="detail-value">
              <span [class]="'closed-badge ' + (selectedPeriod.isClosed ? 'closed' : 'open')">
                <i [class]="selectedPeriod.isClosed ? 'pi pi-lock' : 'pi pi-lock-open'"></i>
                {{ selectedPeriod.isClosed ? 'مغلقة' : 'مفتوحة' }}
              </span>
            </span>
          </div>

          <div class="detail-row" *ngIf="selectedPeriod.isClosed">
            <span class="detail-label">أغلقت بواسطة:</span>
            <span class="detail-value">{{ selectedPeriod.closedBy }}</span>
          </div>

          <div class="detail-row" *ngIf="selectedPeriod.isClosed">
            <span class="detail-label">تاريخ الإغلاق:</span>
            <span class="detail-value">{{ selectedPeriod.closedAt | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <button pButton label="إغلاق" 
                  icon="pi pi-times" 
                  (click)="viewDialog = false"></button>
        </ng-template>
      </p-dialog>

      <p-toast></p-toast>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1.5rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .page-header h1 {
      margin: 0;
      font-size: 1.75rem;
      color: #333;
    }

    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1.5rem;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .status-active {
      background: #d4edda;
      color: #155724;
    }

    .status-future {
      background: #d1ecf1;
      color: #0c5460;
    }

    .status-inactive {
      background: #f8d7da;
      color: #721c24;
    }

    .closed-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .closed-badge.closed {
      background: #f8d7da;
      color: #721c24;
    }

    .closed-badge.open {
      background: #d4edda;
      color: #155724;
    }

    .text-center {
      text-align: center;
    }

    .period-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1rem 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #333;
    }

    .help-text {
      color: #666;
      font-size: 0.85rem;
    }

    .info-box {
      background: #d1ecf1;
      border: 1px solid #bee5eb;
      border-radius: 6px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #0c5460;
    }

    .info-box i {
      font-size: 1.5rem;
    }

    .warning-box {
      background: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 6px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #856404;
    }

    .warning-box i {
      font-size: 1.5rem;
    }

    .status-options {
      display: flex;
      gap: 1.5rem;
    }

    .radio-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .radio-option input[type="radio"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .view-content {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding: 1rem 0;
    }

    .detail-row {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e9ecef;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-weight: 600;
      color: #666;
    }

    .detail-value {
      color: #333;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 0.75rem;
    }

    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: #f8f9fa;
      color: #495057;
      font-weight: 600;
    }

    :host ::ng-deep .p-dialog .p-dialog-content {
      padding: 1.5rem;
    }
  `]
})
export class FiscalPeriodsComponent implements OnInit {
  periods: FiscalPeriod[] = [];
  period: any = {};
  selectedPeriod: FiscalPeriod | null = null;
  periodDialog = false;
  viewDialog = false;
  dialogTitle = '';
  isEditMode = false;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.loadPeriods();
  }

  loadPeriods() {
    // Mock data
    this.periods = [
      {
        id: 1,
        periodName: 'الربع الأول 2025',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-03-31'),
        status: 'active',
        isClosed: false
      },
      {
        id: 2,
        periodName: 'الربع الثاني 2025',
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-06-30'),
        status: 'future',
        isClosed: false
      },
      {
        id: 3,
        periodName: 'الربع الثالث 2025',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-09-30'),
        status: 'future',
        isClosed: false
      },
      {
        id: 4,
        periodName: 'الربع الرابع 2024',
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-12-31'),
        status: 'inactive',
        isClosed: true,
        closedBy: 'admin',
        closedAt: new Date('2025-01-05')
      }
    ];
  }

  openNew() {
    this.period = {
      periodName: '',
      startDate: null,
      endDate: null,
      status: 'future',
      isClosed: false
    };
    this.isEditMode = false;
    this.dialogTitle = 'فترة مالية جديدة';
    this.periodDialog = true;
  }

  editPeriod(period: FiscalPeriod) {
    this.period = { ...period };
    this.isEditMode = true;
    this.dialogTitle = 'تعديل الفترة المالية';
    this.periodDialog = true;
  }

  viewPeriod(period: FiscalPeriod) {
    this.selectedPeriod = period;
    this.viewDialog = true;
  }

  deletePeriod(period: FiscalPeriod) {
    if (confirm('هل أنت متأكد من حذف هذه الفترة المالية؟')) {
      this.periods = this.periods.filter(p => p.id !== period.id);
      this.messageService.add({
        severity: 'success',
        summary: 'نجح',
        detail: 'تم حذف الفترة المالية بنجاح'
      });
    }
  }

  closePeriod(period: FiscalPeriod) {
    if (confirm('هل أنت متأكد من إغلاق هذه الفترة المالية؟ لن تتمكن من إضافة أو تعديل القيود فيها بعد الإغلاق.')) {
      period.isClosed = true;
      period.closedBy = 'admin';
      period.closedAt = new Date();
      this.messageService.add({
        severity: 'success',
        summary: 'نجح',
        detail: 'تم إغلاق الفترة المالية بنجاح'
      });
    }
  }

  savePeriod() {
    if (!this.isValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'يرجى ملء جميع الحقول المطلوبة'
      });
      return;
    }

    if (this.period.endDate <= this.period.startDate) {
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية'
      });
      return;
    }

    if (this.isEditMode) {
      const index = this.periods.findIndex(p => p.id === this.period.id);
      this.periods[index] = this.period;
    } else {
      this.period.id = this.periods.length + 1;
      this.periods.push(this.period);
    }

    this.messageService.add({
      severity: 'success',
      summary: 'نجح',
      detail: 'تم حفظ الفترة المالية بنجاح'
    });

    this.hideDialog();
  }

  hideDialog() {
    this.periodDialog = false;
    this.period = {};
  }

  isValid(): boolean {
    return this.period.periodName && 
           this.period.startDate && 
           this.period.endDate &&
           this.period.status;
  }

  onDateChange() {
    // Trigger calculation when dates change
  }

  calculateDuration(startDate: Date, endDate: Date): number {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  onSearch(event: any) {
    // Implement search logic
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'active': 'نشطة',
      'future': 'مستقبلية',
      'inactive': 'غير نشطة'
    };
    return labels[status] || status;
  }
}
