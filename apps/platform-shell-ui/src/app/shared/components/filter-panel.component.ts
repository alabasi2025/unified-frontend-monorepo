import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
  options?: any[];
  value?: any;
}

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, PanelModule, ButtonModule],
  template: `
    <p-panel [header]="header" [toggleable]="toggleable" [collapsed]="collapsed">
      <div class="filter-panel-content">
        <ng-content></ng-content>
      </div>
      
      <ng-template pTemplate="footer">
        <div class="flex justify-content-between">
          <button
            pButton
            label="إعادة تعيين"
            icon="pi pi-refresh"
            class="p-button-text"
            (click)="onReset.emit()"
          ></button>
          <button
            pButton
            label="تطبيق"
            icon="pi pi-check"
            (click)="onApply.emit()"
          ></button>
        </div>
      </ng-template>
    </p-panel>
  `,
  styles: [`
    .filter-panel-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      padding: 1rem 0;
    }

    @media (max-width: 768px) {
      .filter-panel-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FilterPanelComponent {
  @Input() header: string = 'الفلاتر';
  @Input() toggleable: boolean = true;
  @Input() collapsed: boolean = false;

  @Output() onApply = new EventEmitter<void>();
  @Output() onReset = new EventEmitter<void>();
}
