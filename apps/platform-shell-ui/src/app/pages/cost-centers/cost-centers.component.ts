/**
 * PHASE: Sprint 1 - GL Foundation
 * Date: 2025-12-08
 * Author: Manus AI
 * Description: Cost Centers Management Component
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CostCentersService } from '../../services/cost-centers.service';
import { CreateCostCenterDto, UpdateCostCenterDto, CostCenterResponseDto } from '@semop/contracts';

@Component({
  selector: 'app-cost-centers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './cost-centers.component.html',
  styleUrls: ['./cost-centers.component.scss'],
})
export class CostCentersComponent implements OnInit {
  costCenters: CostCenterResponseDto[] = [];
  selectedCenter: Partial<CreateCostCenterDto | UpdateCostCenterDto> = {};
  displayDialog = false;
  isEdit = false;

  constructor(
    private costCentersService: CostCentersService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCenters();
  }

  loadCenters(): void {
    this.costCentersService.findAll().subscribe({
      next: (data) => {
        this.costCenters = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تحميل مراكز التكلفة',
        });
      },
    });
  }

  openNew(): void {
    this.selectedCenter = {};
    this.isEdit = false;
    this.displayDialog = true;
  }

  openEdit(center: CostCenterResponseDto): void {
    this.selectedCenter = { ...center };
    this.isEdit = true;
    this.displayDialog = true;
  }

  save(): void {
    if (this.isEdit && this.selectedCenter.id) {
      this.costCentersService.update(this.selectedCenter.id, this.selectedCenter as UpdateCostCenterDto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم تحديث مركز التكلفة بنجاح',
          });
          this.loadCenters();
          this.cancel();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل تحديث مركز التكلفة',
          });
        },
      });
    } else {
      this.costCentersService.create(this.selectedCenter as CreateCostCenterDto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم إنشاء مركز التكلفة بنجاح',
          });
          this.loadCenters();
          this.cancel();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل إنشاء مركز التكلفة',
          });
        },
      });
    }
  }

  delete(id: string): void {
    if (confirm('هل أنت متأكد من حذف مركز التكلفة؟')) {
      this.costCentersService.delete(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم حذف مركز التكلفة بنجاح',
          });
          this.loadCenters();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل حذف مركز التكلفة',
          });
        },
      });
    }
  }

  cancel(): void {
    this.displayDialog = false;
    this.selectedCenter = {};
  }
}
