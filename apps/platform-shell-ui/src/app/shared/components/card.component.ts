import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <p-card [header]="header" [subheader]="subheader" [styleClass]="styleClass">
      <ng-template pTemplate="header" *ngIf="headerTemplate">
        <ng-content select="[header]"></ng-content>
      </ng-template>
      
      <ng-content></ng-content>
      
      <ng-template pTemplate="footer" *ngIf="footerTemplate">
        <ng-content select="[footer]"></ng-content>
      </ng-template>
    </p-card>
  `,
  styles: [`
    :host ::ng-deep .p-card {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }
    
    :host ::ng-deep .p-card .p-card-title {
      font-size: 1.25rem;
      font-weight: 600;
    }
  `]
})
export class CardComponent {
  @Input() header: string = '';
  @Input() subheader: string = '';
  @Input() styleClass: string = '';
  @Input() headerTemplate: boolean = false;
  @Input() footerTemplate: boolean = false;
}
