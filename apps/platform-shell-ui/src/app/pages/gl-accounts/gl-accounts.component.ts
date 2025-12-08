/**
 * PHASE: Sprint 1 - GL Foundation
 * Date: 2025-12-08
 * Author: Manus AI
 * Description: GL Accounts Management Component
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { GlAccountsService } from '../../services/gl-accounts.service';
import { CreateAccountDto, UpdateAccountDto, AccountResponseDto } from '@semop/contracts';

@Component({
  selector: 'app-gl-accounts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './gl-accounts.component.html',
  styleUrls: ['./gl-accounts.component.scss'],
})
export class GlAccountsComponent implements OnInit {
  accounts: AccountResponseDto[] = [];
  selectedAccount: Partial<CreateAccountDto | UpdateAccountDto> = {};
  displayDialog = false;
  isEdit = false;

  accountTypes = [
    { label: 'أصول', value: 'ASSET' },
    { label: 'خصوم', value: 'LIABILITY' },
    { label: 'حقوق ملكية', value: 'EQUITY' },
    { label: 'إيرادات', value: 'REVENUE' },
    { label: 'مصروفات', value: 'EXPENSE' },
  ];

  constructor(
    private glAccountsService: GlAccountsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.glAccountsService.findAll().subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تحميل الحسابات',
        });
      },
    });
  }

  openNew(): void {
    this.selectedAccount = {};
    this.isEdit = false;
    this.displayDialog = true;
  }

  openEdit(account: AccountResponseDto): void {
    this.selectedAccount = { ...account };
    this.isEdit = true;
    this.displayDialog = true;
  }

  save(): void {
    if (this.isEdit && this.selectedAccount.id) {
      this.glAccountsService.update(this.selectedAccount.id, this.selectedAccount as UpdateAccountDto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم تحديث الحساب بنجاح',
          });
          this.loadAccounts();
          this.cancel();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل تحديث الحساب',
          });
        },
      });
    } else {
      this.glAccountsService.create(this.selectedAccount as CreateAccountDto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم إنشاء الحساب بنجاح',
          });
          this.loadAccounts();
          this.cancel();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل إنشاء الحساب',
          });
        },
      });
    }
  }

  delete(id: string): void {
    if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
      this.glAccountsService.delete(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'نجاح',
            detail: 'تم حذف الحساب بنجاح',
          });
          this.loadAccounts();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل حذف الحساب',
          });
        },
      });
    }
  }

  cancel(): void {
    this.displayDialog = false;
    this.selectedAccount = {};
  }
}
