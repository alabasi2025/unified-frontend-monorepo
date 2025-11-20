import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

export interface TableAction {
  icon: string;
  label: string;
  command: (row: any) => void;
  visible?: (row: any) => boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, TooltipModule],
  template: `
    <p-table
      [value]="data"
      [columns]="columns"
      [paginator]="paginator"
      [rows]="rows"
      [totalRecords]="totalRecords"
      [loading]="loading"
      [lazy]="lazy"
      (onLazyLoad)="onLazyLoad.emit($event)"
      [globalFilterFields]="globalFilterFields"
      responsiveLayout="scroll"
      styleClass="p-datatable-gridlines"
    >
      <ng-template pTemplate="caption" *ngIf="showSearch">
        <div class="flex justify-content-between">
          <span class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input
              pInputText
              type="text"
              (input)="onGlobalFilter($event)"
              placeholder="بحث..."
            />
          </span>
          <ng-content select="[actions]"></ng-content>
        </div>
      </ng-template>

      <ng-template pTemplate="header">
        <tr>
          <th *ngFor="let col of columns" [pSortableColumn]="col.sortable ? col.field : undefined" [style.width]="col.width">
            {{ col.header }}
            <p-sortIcon *ngIf="col.sortable" [field]="col.field"></p-sortIcon>
          </th>
          <th *ngIf="actions && actions.length > 0" style="width: 120px">الإجراءات</th>
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-row>
        <tr>
          <td *ngFor="let col of columns">
            {{ row[col.field] }}
          </td>
          <td *ngIf="actions && actions.length > 0">
            <button
              *ngFor="let action of actions"
              pButton
              [icon]="action.icon"
              [pTooltip]="action.label"
              class="p-button-sm p-button-text"
              (click)="action.command(row)"
              [style.display]="action.visible ? (action.visible(row) ? 'inline-block' : 'none') : 'inline-block'"
            ></button>
          </td>
        </tr>
      </ng-template>

      <ng-template pTemplate="emptymessage">
        <tr>
          <td [attr.colspan]="columns.length + (actions ? 1 : 0)" class="text-center">
            لا توجد بيانات
          </td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class DataTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() paginator: boolean = true;
  @Input() rows: number = 10;
  @Input() totalRecords: number = 0;
  @Input() loading: boolean = false;
  @Input() lazy: boolean = false;
  @Input() showSearch: boolean = true;
  @Output() onLazyLoad = new EventEmitter<any>();
  @Output() onSearch = new EventEmitter<string>();

  globalFilterFields: string[] = [];

  ngOnInit() {
    this.globalFilterFields = this.columns.filter(c => c.filterable).map(c => c.field);
  }

  onGlobalFilter(event: any) {
    this.onSearch.emit(event.target.value);
  }
}
