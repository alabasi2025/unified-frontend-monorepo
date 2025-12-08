import { Component, OnInit } from '@angular/core';
import { CashTransactionsService } from '../../../../services/accounting/cash-transactions.service';
import { CreateCashTransactionDto, UpdateCashTransactionDto, CashTransactionResponseDto } from '@semop/contracts';

/** PHASE: Sprint 2 - Accounting Cycle | Date: 2025-12-08 | Author: Manus AI */
@Component({
  selector: 'app-cash-transactions',
  templateUrl: './cash-transactions.component.html',
  styleUrls: ['./cash-transactions.component.scss']
})
export class CashTransactionsComponent implements OnInit {
  items: CashTransactionResponseDto[] = [];
  selectedItem: CashTransactionResponseDto | null = null;
  isLoading = false;
  isEditing = false;

  constructor(private service: CashTransactionsService) {}

  ngOnInit(): void { this.loadItems(); }

  loadItems(): void {
    this.isLoading = true;
    this.service.getAll().subscribe({
      next: (data) => { this.items = data; this.isLoading = false; },
      error: (error) => { console.error('Error:', error); this.isLoading = false; }
    });
  }

  onEdit(item: CashTransactionResponseDto): void { this.selectedItem = item; this.isEditing = true; }

  onDelete(id: string): void {
    if (confirm('هل أنت متأكد؟')) {
      this.service.delete(id).subscribe({
        next: () => this.loadItems(),
        error: (error) => console.error('Error:', error)
      });
    }
  }

  onSave(dto: CreateCashTransactionDto | UpdateCashTransactionDto): void {
    if (this.isEditing && this.selectedItem) {
      this.service.update(this.selectedItem.id, dto as UpdateCashTransactionDto).subscribe({
        next: () => { this.loadItems(); this.isEditing = false; this.selectedItem = null; }
      });
    } else {
      this.service.create(dto as CreateCashTransactionDto).subscribe({ next: () => this.loadItems() });
    }
  }
}
