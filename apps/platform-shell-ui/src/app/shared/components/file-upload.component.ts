import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FileUploadModule],
  template: `
    <p-fileUpload
      [name]="name"
      [url]="url"
      [multiple]="multiple"
      [accept]="accept"
      [maxFileSize]="maxFileSize"
      [auto]="auto"
      [chooseLabel]="chooseLabel"
      [uploadLabel]="uploadLabel"
      [cancelLabel]="cancelLabel"
      [showUploadButton]="showUploadButton"
      [showCancelButton]="showCancelButton"
      (onSelect)="onFileSelect.emit($event)"
      (onUpload)="onFileUpload.emit($event)"
      (onError)="onFileError.emit($event)"
      (onClear)="onFileClear.emit()"
      (onRemove)="onFileRemove.emit($event)"
    >
      <ng-template pTemplate="content">
        <ng-content></ng-content>
      </ng-template>
    </p-fileUpload>
  `
})
export class FileUploadComponent {
  @Input() name: string = 'file';
  @Input() url: string = '';
  @Input() multiple: boolean = false;
  @Input() accept: string = '*';
  @Input() maxFileSize: number = 10000000; // 10MB
  @Input() auto: boolean = false;
  @Input() chooseLabel: string = 'اختر ملف';
  @Input() uploadLabel: string = 'رفع';
  @Input() cancelLabel: string = 'إلغاء';
  @Input() showUploadButton: boolean = true;
  @Input() showCancelButton: boolean = true;

  @Output() onFileSelect = new EventEmitter<any>();
  @Output() onFileUpload = new EventEmitter<any>();
  @Output() onFileError = new EventEmitter<any>();
  @Output() onFileClear = new EventEmitter<void>();
  @Output() onFileRemove = new EventEmitter<any>();
}
