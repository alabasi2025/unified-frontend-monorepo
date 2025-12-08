/**
 * PHASE: Sprint 1 - GL Foundation
 * Date: 2025-12-08
 * Author: Manus AI
 * Description: Fiscal Years Management Component
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FiscalYearsService } from '../../services/fiscal-years.service';
import { CreateFiscalYearDto, UpdateFiscalYearDto, FiscalYearResponseDto } from '@semop/contracts';

@Component({
  selector: 'app-fiscal-years',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CalendarModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './fiscal-years.component.html',
  styleUrls: ['./fiscal-years.component.scss'],
})
export class FiscalYearsComponent implements OnInit {
  fiscalYears: FiscalYearResponseDto[] = [];
  selectedYear: Partial<CreateFiscalYearDto | UpdateFiscalYearDto> = {};
  displayDialog = false;
  isEdit = false;

  constructor(
    private fiscalYearsService: FiscalYearsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadYears();
  }

  loadYears(): void {
    this.fiscalYearsService.findAll().subscribe({
      next: (data) => {
        this.fiscalYears = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تحميل السنوات المالية',
        });
      },
    });
  }

  openNew(): void {
    this.selectedYear = {};
    this.isEdit = false;
    this.displayDialog = true;
  }

  openEdit(year: FiscalYearResponseDto): void {
    this.selectedYear = { ...year };
    this.isEdit = true;
    this.displayDialog = true;
  }

  save(): void {
    if (this.isEdit && this.selectedYear.id) {
      this.fiscalYearsService.update(this.selectedYear.id.toString(), this.selectedYear as UpdateFiscalYearDto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم تحديث السنة المالية بنجاح',
          });
          this.loadYears();
          this.cancel();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل تحديث السنة المالية',
          });
        },
      });
    } else {
      this.fiscalYearsService.create(this.selectedYear as CreateFiscalYearDto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم إنشاء السنة المالية بنجاح',
          });
          this.loadYears();
          this.cancel();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل إنشاء السنة المالية',
          });
        },
      });
    }
  }

  delete(id: number): void {
    if (confirm('هل أنت متأكد من حذف هذه السنة المالية؟')) {
      this.fiscalYearsService.delete(id.toString()).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم حذف السنة المالية بنجاح',
          });
          this.loadYears();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل حذف السنة المالية',
          });
        },
      });
    }
  }

  cancel(): void {
    this.displayDialog = false;
    this.selectedYear = {};
  }
}
