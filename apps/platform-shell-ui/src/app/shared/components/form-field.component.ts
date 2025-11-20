import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, InputNumberModule, CheckboxModule, TextareaModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true
    }
  ],
  template: `
    <div class="form-field">
      <label *ngIf="label" [for]="id" class="form-label">
        {{ label }}
        <span *ngIf="required" class="required-asterisk">*</span>
      </label>

      <input
        *ngIf="type === 'text' || type === 'email' || type === 'password'"
        [type]="type"
        [id]="id"
        pInputText
        [(ngModel)]="value"
        (ngModelChange)="onChange($event)"
        (blur)="onTouched()"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [required]="required"
        class="w-full"
      />

      <input
        *ngIf="type === 'number'"
        type="number"
        [id]="id"
        pInputText
        [(ngModel)]="value"
        (ngModelChange)="onChange($event)"
        (blur)="onTouched()"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [required]="required"
        class="w-full"
      />

      <textarea
        *ngIf="type === 'textarea'"
        [id]="id"
        pTextarea
        [(ngModel)]="value"
        (ngModelChange)="onChange($event)"
        (blur)="onTouched()"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [required]="required"
        [rows]="rows"
        class="w-full"
      ></textarea>

      <p-checkbox
        *ngIf="type === 'checkbox'"
        [(ngModel)]="value"
        (ngModelChange)="onChange($event)"
        (onBlur)="onTouched()"
        [binary]="true"
        [disabled]="disabled"
      ></p-checkbox>

      <small *ngIf="hint" class="form-hint">{{ hint }}</small>
      <small *ngIf="error" class="form-error">{{ error }}</small>
    </div>
  `,
  styles: [`
    .form-field {
      margin-bottom: 1rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--text-color);
    }

    .required-asterisk {
      color: var(--red-500);
      margin-inline-start: 0.25rem;
    }

    .form-hint {
      display: block;
      margin-top: 0.25rem;
      color: var(--text-color-secondary);
      font-size: 0.875rem;
    }

    .form-error {
      display: block;
      margin-top: 0.25rem;
      color: var(--red-500);
      font-size: 0.875rem;
    }
  `]
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'checkbox' = 'text';
  @Input() placeholder: string = '';
  @Input() hint: string = '';
  @Input() error: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() rows: number = 3;

  value: any;
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
