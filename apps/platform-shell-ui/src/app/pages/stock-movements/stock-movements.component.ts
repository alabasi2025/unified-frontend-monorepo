import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { StockMovementsService, StockMovement, CreateStockMovementDto, StockMovementStatistics } from '../../services/stock-movements.service';

interface FilterOptions {
  warehouseId?: string;
  itemId?: string;
  movementType?: string;
  startDate?: Date;
  endDate?: Date;
}

@Component({
  selector: 'app-stock-movements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    CardModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="stock-movements-page">
      <p-toast position="top-center"></p-toast>
      <p-confirmDialog></p-confirmDialog>

      <!-- Page Header -->
      <div class="page-header">
        <h2>حركات المخزون</h2>
        <button 
          pButton 
          label="حركة جديدة" 
          icon="pi pi-plus" 
          (click)="openNew()"
          class="p-button-success">
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="statistics-section">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <i class="pi pi-arrow-down"></i>
          </div>
          <div class="stat-content">
            <span class="stat-label">إجمالي الوارد</span>
            <span class="stat-value">{{ statistics?.totalIncoming | number }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            <i class="pi pi-arrow-up"></i>
          </div>
          <div class="stat-content">
            <span class="stat-label">إجمالي الصادر</span>
            <span class="stat-value">{{ statistics?.totalOutgoing | number }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
            <i class="pi pi-calendar"></i>
          </div>
          <div class="stat-content">
            <span class="stat-label">حركات اليوم</span>
            <span class="stat-value">{{ statistics?.movementsToday | number }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
            <i class="pi pi-list"></i>
          </div>
          <div class="stat-content">
            <span class="stat-label">إجمالي الحركات</span>
            <span class="stat-value">{{ statistics?.totalMovements | number }}</span>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="card filters-card">
        <h3>الفلاتر</h3>
        <div class="filters-grid">
          <div class="filter-field">
            <label>المستودع</label>
            <p-dropdown 
              [(ngModel)]="filters.warehouseId"
              [options]="warehouses"
              optionLabel="nameAr"
              optionValue="id"
              placeholder="اختر المستودع"
              (onChange)="applyFilters()">
            </p-dropdown>
          </div>

          <div class="filter-field">
            <label>الصنف</label>
            <p-dropdown 
              [(ngModel)]="filters.itemId"
              [options]="items"
              optionLabel="nameAr"
              optionValue="id"
              placeholder="اختر الصنف"
              (onChange)="applyFilters()">
            </p-dropdown>
          </div>

          <div class="filter-field">
            <label>نوع الحركة</label>
            <p-dropdown 
              [(ngModel)]="filters.movementType"
              [options]="movementTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="اختر نوع الحركة"
              (onChange)="applyFilters()">
            </p-dropdown>
          </div>

          <div class="filter-field">
            <label>من التاريخ</label>
            <p-calendar 
              [(ngModel)]="filters.startDate"
              dateFormat="dd/mm/yy"
              [showIcon]="true"
              (onSelect)="applyFilters()">
            </p-calendar>
          </div>

          <div class="filter-field">
            <label>إلى التاريخ</label>
            <p-calendar 
              [(ngModel)]="filters.endDate"
              dateFormat="dd/mm/yy"
              [showIcon]="true"
              (onSelect)="applyFilters()">
            </p-calendar>
          </div>

          <div class="filter-field">
            <label>بحث سريع</label>
            <input 
              pInputText 
              type="text" 
              [(ngModel)]="searchText"
              (input)="applyFilters()"
              placeholder="ابحث عن حركة..." />
          </div>
        </div>

        <div class="filter-actions">
          <button 
            pButton 
            label="إعادة تعيين" 
            icon="pi pi-refresh"
            class="p-button-text"
            (click)="resetFilters()">
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="card">
        <p-table 
          #movementsTable
          [value]="filteredMovements" 
          [paginator]="true" 
          [rows]="10"
          [showCurrentPageReport]="true"
          currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords} حركة"
          [globalFilterFields]="['itemName', 'warehouseName', 'referenceId']"
          styleClass="p-datatable-gridlines"
          [loading]="loading">
          
          <ng-template pTemplate="caption">
            <div class="table-header">
              <span class="p-input-icon-left">
                <i class="pi pi-search"></i>
                <input 
                  pInputText 
                  type="text" 
                  #searchInput
                  (input)="movementsTable.filterGlobal(searchInput.value, 'contains')" 
                  placeholder="بحث سريع..." />
              </span>
            </div>
          </ng-template>

          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="createdAt">التاريخ <p-sortIcon field="createdAt"></p-sortIcon></th>
              <th pSortableColumn="warehouseName">المستودع <p-sortIcon field="warehouseName"></p-sortIcon></th>
              <th pSortableColumn="itemName">الصنف <p-sortIcon field="itemName"></p-sortIcon></th>
              <th pSortableColumn="movementType">نوع الحركة <p-sortIcon field="movementType"></p-sortIcon></th>
              <th pSortableColumn="quantity">الكمية <p-sortIcon field="quantity"></p-sortIcon></th>
              <th pSortableColumn="unitPrice">السعر الوحدة <p-sortIcon field="unitPrice"></p-sortIcon></th>
              <th pSortableColumn="totalValue">القيمة الإجمالية <p-sortIcon field="totalValue"></p-sortIcon></th>
              <th pSortableColumn="referenceId">المرجع <p-sortIcon field="referenceId"></p-sortIcon></th>
              <th pSortableColumn="createdBy">المستخدم <p-sortIcon field="createdBy"></p-sortIcon></th>
              <th>الملاحظات</th>
              <th>الإجراءات</th>
            </tr>
          </ng-template>

          <ng-template pTemplate="body" let-movement>
            <tr>
              <td>{{ movement.createdAt | date: 'dd/MM/yyyy HH:mm' }}</td>
              <td>{{ movement.warehouseName }}</td>
              <td>{{ movement.itemName }}</td>
              <td>
                <span [class]="'movement-badge ' + getMovementTypeClass(movement.movementType)">
                  {{ getMovementTypeLabel(movement.movementType) }}
                </span>
              </td>
              <td class="text-right">{{ movement.quantity | number }}</td>
              <td class="text-right">{{ movement.unitPrice | number: '1.2-2' }}</td>
              <td class="text-right">{{ movement.totalValue | number: '1.2-2' }}</td>
              <td>{{ movement.referenceId || '-' }}</td>
              <td>{{ movement.createdBy }}</td>
              <td>
                <span [title]="movement.notes" class="notes-cell">
                  {{ movement.notes ? (movement.notes.substring(0, 30) + '...') : '-' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    pButton 
                    icon="pi pi-eye" 
                    class="p-button-rounded p-button-text p-button-info"
                    (click)="viewMovement(movement)"
                    pTooltip="عرض">
                  </button>
                  <button 
                    pButton 
                    icon="pi pi-pencil" 
                    class="p-button-rounded p-button-text p-button-warning"
                    (click)="editMovement(movement)"
                    pTooltip="تعديل">
                  </button>
                  <button 
                    pButton 
                    icon="pi pi-trash" 
                    class="p-button-rounded p-button-text p-button-danger"
                    (click)="deleteMovement(movement)"
                    pTooltip="حذف">
                  </button>
                </div>
              </td>
            </tr>
          </ng-template>

          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="11" class="text-center">لا توجد حركات مخزون</td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <!-- Dialog للإضافة/التعديل -->
      <p-dialog 
        [(visible)]="movementDialog" 
        [header]="dialogTitle"
        [modal]="true" 
        [style]="{width: '700px'}"
        [draggable]="false"
        [resizable]="false">
        
        <div class="form-grid">
          <div class="form-field">
            <label for="warehouse">المستودع *</label>
            <p-dropdown 
              id="warehouse"
              [(ngModel)]="movement.warehouseId"
              [options]="warehouses"
              optionLabel="nameAr"
              optionValue="id"
              placeholder="اختر المستودع"
              required>
            </p-dropdown>
          </div>

          <div class="form-field">
            <label for="item">الصنف *</label>
            <p-dropdown 
              id="item"
              [(ngModel)]="movement.itemId"
              [options]="items"
              optionLabel="nameAr"
              optionValue="id"
              placeholder="اختر الصنف"
              required>
            </p-dropdown>
          </div>

          <div class="form-field">
            <label for="movementType">نوع الحركة *</label>
            <p-dropdown 
              id="movementType"
              [(ngModel)]="movement.movementType"
              [options]="movementTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="اختر نوع الحركة"
              required>
            </p-dropdown>
          </div>

          <div class="form-field">
            <label for="quantity">الكمية *</label>
            <p-inputNumber 
              id="quantity" 
              [(ngModel)]="movement.quantity" 
              [min]="0"
              placeholder="0"
              required>
            </p-inputNumber>
          </div>

          <div class="form-field">
            <label for="unitCost">سعر الوحدة</label>
            <p-inputNumber 
              id="unitCost" 
              [(ngModel)]="movement.unitCost" 
              [min]="0"
              mode="currency"
              currency="USD"
              placeholder="0.00">
            </p-inputNumber>
          </div>

          <div class="form-field">
            <label for="referenceType">نوع المرجع</label>
            <input 
              pInputText 
              id="referenceType" 
              [(ngModel)]="movement.referenceType" 
              placeholder="مثال: PURCHASE_ORDER" />
          </div>

          <div class="form-field">
            <label for="referenceId">رقم المرجع</label>
            <input 
              pInputText 
              id="referenceId" 
              [(ngModel)]="movement.referenceId" 
              placeholder="مثال: PO-001" />
          </div>

          <div class="form-field full-width">
            <label for="notes">الملاحظات</label>
            <textarea 
              pInputText 
              id="notes" 
              [(ngModel)]="movement.notes" 
              placeholder="أضف ملاحظات..."
              rows="3"
              style="resize: vertical; width: 100%;">
            </textarea>
          </div>
        </div>

        <ng-template pTemplate="footer">
          <button 
            pButton 
            label="إلغاء" 
            icon="pi pi-times" 
            class="p-button-text"
            (click)="hideDialog()">
          </button>
          <button 
            pButton 
            label="حفظ" 
            icon="pi pi-check" 
            (click)="saveMovement()"
            [disabled]="!isValid()">
          </button>
        </ng-template>
      </p-dialog>

      <!-- Dialog للعرض -->
      <p-dialog 
        [(visible)]="viewDialog" 
        header="تفاصيل حركة المخزون"
        [modal]="true" 
        [style]="{width: '600px'}"
        [draggable]="false"
        [resizable]="false">
        
        <div class="view-details" *ngIf="selectedMovement">
          <div class="detail-row">
            <span class="label">التاريخ:</span>
            <span class="value">{{ selectedMovement.createdAt | date: 'dd/MM/yyyy HH:mm' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">المستودع:</span>
            <span class="value">{{ selectedMovement.warehouseName }}</span>
          </div>
          <div class="detail-row">
            <span class="label">الصنف:</span>
            <span class="value">{{ selectedMovement.itemName }}</span>
          </div>
          <div class="detail-row">
            <span class="label">نوع الحركة:</span>
            <span class="value">
              <span [class]="'movement-badge ' + getMovementTypeClass(selectedMovement.movementType)">
                {{ getMovementTypeLabel(selectedMovement.movementType) }}
              </span>
            </span>
          </div>
          <div class="detail-row">
            <span class="label">الكمية:</span>
            <span class="value">{{ selectedMovement.quantity | number }}</span>
          </div>
          <div class="detail-row">
            <span class="label">سعر الوحدة:</span>
            <span class="value">{{ selectedMovement.unitPrice | number: '1.2-2' }}</span>
          </div>
          <div class="detail-row">
            <span class="label">القيمة الإجمالية:</span>
            <span class="value">{{ selectedMovement.totalValue | number: '1.2-2' }}</span>
          </div>
          <div class="detail-row" *ngIf="selectedMovement.referenceId">
            <span class="label">المرجع:</span>
            <span class="value">{{ selectedMovement.referenceType }} - {{ selectedMovement.referenceId }}</span>
          </div>
          <div class="detail-row" *ngIf="selectedMovement.notes">
            <span class="label">الملاحظات:</span>
            <span class="value">{{ selectedMovement.notes }}</span>
          </div>
          <div class="detail-row">
            <span class="label">المستخدم:</span>
            <span class="value">{{ selectedMovement.createdBy }}</span>
          </div>
        </div>
      </p-dialog>
    </div>
  `,
  styles: [`
    .stock-movements-page {
      padding: 24px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-header h2 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: #1a1f36;
    }

    /* Statistics Section */
    .statistics-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-label {
      font-size: 13px;
      color: #6c757d;
      font-weight: 500;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #1a1f36;
    }

    /* Filters Section */
    .filters-card {
      margin-bottom: 24px;
    }

    .filters-card h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #1a1f36;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .filter-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .filter-field label {
      font-size: 13px;
      font-weight: 600;
      color: #495057;
    }

    .filter-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    /* Table Styles */
    .card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .movement-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .movement-badge.in {
      background: #d4edda;
      color: #155724;
    }

    .movement-badge.out {
      background: #f8d7da;
      color: #721c24;
    }

    .movement-badge.transfer {
      background: #cce5ff;
      color: #004085;
    }

    .movement-badge.adjustment {
      background: #fff3cd;
      color: #856404;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .notes-cell {
      color: #6c757d;
      font-size: 12px;
    }

    /* Form Styles */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-field.full-width {
      grid-column: 1 / -1;
    }

    .form-field label {
      font-size: 13px;
      font-weight: 600;
      color: #495057;
    }

    /* View Details */
    .view-details {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .detail-row .label {
      font-weight: 600;
      color: #495057;
      min-width: 150px;
    }

    .detail-row .value {
      color: #1a1f36;
      text-align: right;
      flex: 1;
    }

    .text-center {
      text-align: center;
    }

    .text-right {
      text-align: right;
    }
  `]
})
export class StockMovementsComponent implements OnInit {
  movements: StockMovement[] = [];
  filteredMovements: StockMovement[] = [];
  selectedMovement: StockMovement | null = null;
  movement: any = {};
  
  movementDialog = false;
  viewDialog = false;
  loading = false;
  isEditing = false;
  
  statistics: StockMovementStatistics | null = null;
  
  filters: FilterOptions = {};
  searchText = '';
  
  warehouses: any[] = [];
  items: any[] = [];
  
  movementTypes = [
    { label: 'وارد', value: 'IN' },
    { label: 'صادر', value: 'OUT' },
    { label: 'تحويل', value: 'TRANSFER' },
    { label: 'تسوية', value: 'ADJUSTMENT' }
  ];

  dialogTitle = 'حركة مخزون جديدة';

  constructor(
    private stockMovementsService: StockMovementsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadMovements();
    this.loadStatistics();
    this.loadWarehouses();
    this.loadItems();
  }

  /**
   * تحميل جميع حركات المخزون
   */
  loadMovements() {
    this.loading = true;
    this.stockMovementsService.getAll().subscribe({
      next: (data) => {
        this.movements = data;
        this.filteredMovements = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading movements:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تحميل حركات المخزون'
        });
        this.loading = false;
      }
    });
  }

  /**
   * تحميل الإحصائيات
   */
  loadStatistics() {
    this.stockMovementsService.getStatistics().subscribe({
      next: (data) => {
        this.statistics = data;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      }
    });
  }

  /**
   * تحميل المستودعات (بيانات تجريبية)
   */
  loadWarehouses() {
    this.warehouses = [
      { id: '1', nameAr: 'المستودع الرئيسي' },
      { id: '2', nameAr: 'مستودع عدن' },
      { id: '3', nameAr: 'مستودع تعز' },
      { id: '4', nameAr: 'مستودع الحديدة' }
    ];
  }

  /**
   * تحميل الأصناف (بيانات تجريبية)
   */
  loadItems() {
    this.items = [
      { id: '1', nameAr: 'لابتوب Dell Latitude' },
      { id: '2', nameAr: 'شاشة Samsung 27"' },
      { id: '3', nameAr: 'طابعة HP LaserJet' },
      { id: '4', nameAr: 'ماوس Logitech' },
      { id: '5', nameAr: 'لوحة مفاتيح Mechanical' },
      { id: '6', nameAr: 'سماعات Bluetooth' }
    ];
  }

  /**
   * تطبيق الفلاتر
   */
  applyFilters() {
    this.filteredMovements = this.movements.filter(movement => {
      if (this.filters.warehouseId && movement.warehouseId !== this.filters.warehouseId) {
        return false;
      }
      if (this.filters.itemId && movement.itemId !== this.filters.itemId) {
        return false;
      }
      if (this.filters.movementType && movement.movementType !== this.filters.movementType) {
        return false;
      }
      if (this.filters.startDate) {
        const movementDate = new Date(movement.createdAt);
        if (movementDate < this.filters.startDate) {
          return false;
        }
      }
      if (this.filters.endDate) {
        const movementDate = new Date(movement.createdAt);
        const endDate = new Date(this.filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (movementDate > endDate) {
          return false;
        }
      }
      if (this.searchText) {
        const search = this.searchText.toLowerCase();
        return (
          movement.itemName.toLowerCase().includes(search) ||
          movement.warehouseName.toLowerCase().includes(search) ||
          (movement.referenceId && movement.referenceId.toLowerCase().includes(search))
        );
      }
      return true;
    });
  }

  /**
   * إعادة تعيين الفلاتر
   */
  resetFilters() {
    this.filters = {};
    this.searchText = '';
    this.filteredMovements = this.movements;
  }

  /**
   * فتح نموذج إضافة حركة جديدة
   */
  openNew() {
    this.movement = {};
    this.isEditing = false;
    this.dialogTitle = 'حركة مخزون جديدة';
    this.movementDialog = true;
  }

  /**
   * تعديل حركة
   */
  editMovement(movement: StockMovement) {
    this.movement = { ...movement };
    this.isEditing = true;
    this.dialogTitle = 'تعديل حركة المخزون';
    this.movementDialog = true;
  }

  /**
   * عرض تفاصيل حركة
   */
  viewMovement(movement: StockMovement) {
    this.selectedMovement = movement;
    this.viewDialog = true;
  }

  /**
   * حذف حركة
   */
  deleteMovement(movement: StockMovement) {
    this.confirmationService.confirm({
      message: 'هل أنت متأكد من حذف هذه الحركة؟',
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.stockMovementsService.delete(movement.id).subscribe({
          next: () => {
            this.movements = this.movements.filter(m => m.id !== movement.id);
            this.applyFilters();
            this.messageService.add({
              severity: 'success',
              summary: 'نجح',
              detail: 'تم حذف الحركة بنجاح'
            });
          },
          error: (error) => {
            console.error('Error deleting movement:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل حذف الحركة'
            });
          }
        });
      }
    });
  }

  /**
   * حفظ حركة (إضافة أو تعديل)
   */
  saveMovement() {
    if (!this.isValid()) {
      return;
    }

    if (this.isEditing) {
      this.stockMovementsService.update(this.movement.id, this.movement).subscribe({
        next: () => {
          const index = this.movements.findIndex(m => m.id === this.movement.id);
          if (index > -1) {
            this.movements[index] = this.movement;
          }
          this.applyFilters();
          this.hideDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'نجح',
            detail: 'تم تحديث الحركة بنجاح'
          });
        },
        error: (error) => {
          console.error('Error updating movement:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل تحديث الحركة'
          });
        }
      });
    } else {
      this.stockMovementsService.create(this.movement).subscribe({
        next: (newMovement) => {
          this.movements.push(newMovement);
          this.applyFilters();
          this.hideDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'نجح',
            detail: 'تم إضافة الحركة بنجاح'
          });
        },
        error: (error) => {
          console.error('Error creating movement:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل إضافة الحركة'
          });
        }
      });
    }
  }

  /**
   * إغلاق النموذج
   */
  hideDialog() {
    this.movementDialog = false;
    this.movement = {};
  }

  /**
   * التحقق من صحة النموذج
   */
  isValid(): boolean {
    return !!(
      this.movement.warehouseId &&
      this.movement.itemId &&
      this.movement.movementType &&
      this.movement.quantity
    );
  }

  /**
   * الحصول على تصنيف نوع الحركة
   */
  getMovementTypeClass(type: string): string {
    switch (type) {
      case 'IN':
        return 'in';
      case 'OUT':
        return 'out';
      case 'TRANSFER':
        return 'transfer';
      case 'ADJUSTMENT':
        return 'adjustment';
      default:
        return '';
    }
  }

  /**
   * الحصول على تسمية نوع الحركة
   */
  getMovementTypeLabel(type: string): string {
    switch (type) {
      case 'IN':
        return 'وارد';
      case 'OUT':
        return 'صادر';
      case 'TRANSFER':
        return 'تحويل';
      case 'ADJUSTMENT':
        return 'تسوية';
      default:
        return type;
    }
  }
}
