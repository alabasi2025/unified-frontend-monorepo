import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CashTransactionsService } from '../../../services/accounting/cash-transactions.service';
import { CreateCashTransactionDTO, UpdateCashTransactionDTO, CashTransactionResponseDTO } from '@semop/contracts';

/** PHASE: Sprint 2 - Accounting Cycle | Date: 2025-12-08 | Author: Manus AI */
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-cash-transactions',
  templateUrl: './cash-transactions.component.html',
  styleUrls: ['./cash-transactions.component.scss']
})
export class CashTransactionsComponent implements OnInit {
  items: CashTransactionResponseDTO[] = [];
  selectedItem: CashTransactionResponseDTO | null = null;
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

  onEdit(item: CashTransactionResponseDTO): void { this.selectedItem = item; this.isEditing = true; }

  onDelete(id: string): void {
    if (confirm('هل أنت متأكد؟')) {
      this.service.delete(id).subscribe({
        next: () => this.loadItems(),
        error: (error) => console.error('Error:', error)
      });
    }
  }

  onSave(dto: CreateCashTransactionDTO | UpdateCashTransactionDTO): void {
    if (this.isEditing && this.selectedItem) {
      this.service.update(this.selectedItem.id, dto as UpdateCashTransactionDTO).subscribe({
        next: () => { this.loadItems(); this.isEditing = false; this.selectedItem = null; }
      });
    } else {
      this.service.create(dto as CreateCashTransactionDTO).subscribe({ next: () => this.loadItems() });
    }
  }
}
