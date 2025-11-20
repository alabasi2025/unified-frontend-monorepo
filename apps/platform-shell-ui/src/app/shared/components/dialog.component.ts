import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  template: `
    <p-dialog
      [(visible)]="visible"
      [header]="header"
      [modal]="modal"
      [style]="{ width: width }"
      [draggable]="draggable"
      [resizable]="resizable"
      (onHide)="onHide.emit()"
    >
      <ng-content></ng-content>
      
      <ng-template pTemplate="footer" *ngIf="showFooter">
        <button
          pButton
          [label]="cancelLabel"
          icon="pi pi-times"
          class="p-button-text"
          (click)="onCancel()"
          *ngIf="showCancel"
        ></button>
        <button
          pButton
          [label]="confirmLabel"
          icon="pi pi-check"
          (click)="onConfirm.emit()"
          [loading]="loading"
          *ngIf="showConfirm"
        ></button>
      </ng-template>
    </p-dialog>
  `
})
export class DialogComponent {
  @Input() visible: boolean = false;
  @Input() header: string = '';
  @Input() width: string = '50vw';
  @Input() modal: boolean = true;
  @Input() draggable: boolean = false;
  @Input() resizable: boolean = false;
  @Input() showFooter: boolean = true;
  @Input() showCancel: boolean = true;
  @Input() showConfirm: boolean = true;
  @Input() cancelLabel: string = 'إلغاء';
  @Input() confirmLabel: string = 'تأكيد';
  @Input() loading: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onHide = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();

  onCancel() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.onHide.emit();
  }
}
