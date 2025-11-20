import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  template: `
    <p-confirmDialog
      [style]="{ width: '450px' }"
      [baseZIndex]="10000"
      rejectButtonStyleClass="p-button-text"
    ></p-confirmDialog>
  `
})
export class ConfirmDialogComponent {
  constructor(private confirmationService: ConfirmationService) {}

  confirm(options: {
    message: string;
    header?: string;
    icon?: string;
    accept?: () => void;
    reject?: () => void;
  }) {
    this.confirmationService.confirm({
      message: options.message,
      header: options.header || 'تأكيد',
      icon: options.icon || 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: options.accept,
      reject: options.reject
    });
  }

  confirmDelete(entityName: string, onConfirm: () => void) {
    this.confirm({
      message: `هل أنت متأكد من حذف ${entityName}؟ لا يمكن التراجع عن هذا الإجراء.`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-trash',
      accept: onConfirm
    });
  }
}
