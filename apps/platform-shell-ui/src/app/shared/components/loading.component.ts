import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div [class]="getContainerClass()" *ngIf="visible">
      <p-progressSpinner
        [style]="{ width: size, height: size }"
        [strokeWidth]="strokeWidth"
        [fill]="fill"
        [animationDuration]="animationDuration"
      ></p-progressSpinner>
      <p *ngIf="message" class="mt-3 text-center">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .loading-inline {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }

    .loading-center {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }
  `]
})
export class LoadingComponent {
  @Input() visible: boolean = true;
  @Input() message: string = '';
  @Input() type: 'overlay' | 'inline' | 'center' = 'inline';
  @Input() size: string = '50px';
  @Input() strokeWidth: string = '4';
  @Input() fill: string = 'transparent';
  @Input() animationDuration: string = '1s';

  getContainerClass(): string {
    switch (this.type) {
      case 'overlay':
        return 'loading-overlay';
      case 'center':
        return 'loading-center';
      default:
        return 'loading-inline';
    }
  }
}
