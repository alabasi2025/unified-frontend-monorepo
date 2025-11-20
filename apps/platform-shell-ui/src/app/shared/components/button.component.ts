import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule],
  template: `
    <button
      pButton
      pRipple
      [type]="type"
      [label]="label"
      [icon]="icon"
      [iconPos]="iconPos"
      [loading]="loading"
      [disabled]="disabled"
      [class]="getButtonClass()"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() iconPos: 'left' | 'right' = 'left';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'text' = 'primary';
  @Input() size: 'small' | 'normal' | 'large' = 'normal';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() rounded: boolean = false;
  @Input() outlined: boolean = false;
  @Input() raised: boolean = false;

  @Output() onClick = new EventEmitter<Event>();

  getButtonClass(): string {
    const classes: string[] = [];

    // Variant
    if (this.variant !== 'primary') {
      if (this.variant === 'text') {
        classes.push('p-button-text');
      } else {
        classes.push(`p-button-${this.variant}`);
      }
    }

    // Size
    if (this.size === 'small') classes.push('p-button-sm');
    if (this.size === 'large') classes.push('p-button-lg');

    // Modifiers
    if (this.fullWidth) classes.push('w-full');
    if (this.rounded) classes.push('p-button-rounded');
    if (this.outlined) classes.push('p-button-outlined');
    if (this.raised) classes.push('p-button-raised');

    return classes.join(' ');
  }
}
