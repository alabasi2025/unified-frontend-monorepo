import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  template: `
    <div class="search-bar">
      <span class="p-input-icon-left" [class.w-full]="fullWidth">
        <i class="pi pi-search"></i>
        <input
          type="text"
          pInputText
          [(ngModel)]="searchTerm"
          (ngModelChange)="onSearchChange($event)"
          (keyup.enter)="onSearchSubmit()"
          [placeholder]="placeholder"
          [class.w-full]="fullWidth"
        />
      </span>
      <button
        *ngIf="showButton"
        pButton
        [label]="buttonLabel"
        icon="pi pi-search"
        (click)="onSearchSubmit()"
        class="mr-2"
      ></button>
      <button
        *ngIf="searchTerm && showClear"
        pButton
        icon="pi pi-times"
        class="p-button-text p-button-rounded"
        (click)="onClear()"
      ></button>
    </div>
  `,
  styles: [`
    .search-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .search-bar .p-input-icon-left {
      flex: 1;
    }

    .search-bar input {
      width: 100%;
    }
  `]
})
export class SearchBarComponent {
  @Input() placeholder: string = 'بحث...';
  @Input() buttonLabel: string = 'بحث';
  @Input() showButton: boolean = false;
  @Input() showClear: boolean = true;
  @Input() fullWidth: boolean = true;
  @Input() debounceTime: number = 300;

  @Output() onSearch = new EventEmitter<string>();

  searchTerm: string = '';
  private debounceTimer: any;

  onSearchChange(value: string) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.onSearch.emit(value);
    }, this.debounceTime);
  }

  onSearchSubmit() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.onSearch.emit(this.searchTerm);
  }

  onClear() {
    this.searchTerm = '';
    this.onSearch.emit('');
  }
}
