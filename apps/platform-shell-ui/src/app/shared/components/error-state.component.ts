import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="error-state">
      <i [class]="icon" class="error-state-icon"></i>
      <h3 class="error-state-title">{{ title }}</h3>
      <p class="error-state-message">{{ message }}</p>
      <div class="error-state-details" *ngIf="details">
        <details>
          <summary>تفاصيل الخطأ</summary>
          <pre>{{ details }}</pre>
        </details>
      </div>
      <button
        *ngIf="showRetry"
        pButton
        label="إعادة المحاولة"
        icon="pi pi-refresh"
        (click)="onRetry.emit()"
        class="mt-3"
      ></button>
    </div>
  `,
  styles: [`
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .error-state-icon {
      font-size: 4rem;
      color: var(--red-500);
      margin-bottom: 1.5rem;
    }

    .error-state-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 0.5rem;
    }

    .error-state-message {
      font-size: 1rem;
      color: var(--text-color-secondary);
      max-width: 500px;
      line-height: 1.6;
    }

    .error-state-details {
      margin-top: 1rem;
      max-width: 600px;
    }

    .error-state-details summary {
      cursor: pointer;
      color: var(--primary-color);
      font-size: 0.875rem;
    }

    .error-state-details pre {
      margin-top: 0.5rem;
      padding: 1rem;
      background: var(--surface-100);
      border-radius: 4px;
      text-align: left;
      font-size: 0.75rem;
      overflow-x: auto;
    }
  `]
})
export class ErrorStateComponent {
  @Input() icon: string = 'pi pi-exclamation-circle';
  @Input() title: string = 'حدث خطأ';
  @Input() message: string = 'عذراً، حدث خطأ أثناء تحميل البيانات';
  @Input() details: string = '';
  @Input() showRetry: boolean = true;
  @Output() onRetry = new EventEmitter<void>();
}
