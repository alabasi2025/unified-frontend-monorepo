import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="empty-state">
      <i [class]="icon" class="empty-state-icon"></i>
      <h3 class="empty-state-title">{{ title }}</h3>
      <p class="empty-state-message">{{ message }}</p>
      <button
        *ngIf="actionLabel"
        pButton
        [label]="actionLabel"
        [icon]="actionIcon"
        (click)="onAction.emit()"
        class="mt-3"
      ></button>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .empty-state-icon {
      font-size: 4rem;
      color: var(--text-color-secondary);
      margin-bottom: 1.5rem;
    }

    .empty-state-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 0.5rem;
    }

    .empty-state-message {
      font-size: 1rem;
      color: var(--text-color-secondary);
      max-width: 500px;
      line-height: 1.6;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon: string = 'pi pi-inbox';
  @Input() title: string = 'لا توجد بيانات';
  @Input() message: string = 'لم يتم العثور على أي عناصر';
  @Input() actionLabel: string = '';
  @Input() actionIcon: string = 'pi pi-plus';
  @Output() onAction = new EventEmitter<void>();
}
