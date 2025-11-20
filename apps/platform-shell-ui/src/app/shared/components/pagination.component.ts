import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, PaginatorModule],
  template: `
    <p-paginator
      [rows]="rows"
      [totalRecords]="totalRecords"
      [rowsPerPageOptions]="rowsPerPageOptions"
      [showCurrentPageReport]="showCurrentPageReport"
      [currentPageReportTemplate]="currentPageReportTemplate"
      (onPageChange)="onPageChange.emit($event)"
    ></p-paginator>
  `
})
export class PaginationComponent {
  @Input() rows: number = 10;
  @Input() totalRecords: number = 0;
  @Input() rowsPerPageOptions: number[] = [10, 25, 50, 100];
  @Input() showCurrentPageReport: boolean = true;
  @Input() currentPageReportTemplate: string = 'عرض {first} إلى {last} من {totalRecords} سجل';

  @Output() onPageChange = new EventEmitter<any>();
}
