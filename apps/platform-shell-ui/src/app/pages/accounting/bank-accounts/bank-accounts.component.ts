import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankAccountsService } from '../../../services/accounting/bank-accounts.service';
import { CreateBankAccountDTO, UpdateBankAccountDTO, BankAccountResponseDTO } from '@semop/contracts';

/** PHASE: Sprint 2 - Accounting Cycle | Date: 2025-12-08 | Author: Manus AI */
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss']
})
export class BankAccountsComponent implements OnInit {
  items: BankAccountResponseDTO[] = [];
  selectedItem: BankAccountResponseDTO | null = null;
  isLoading = false;
  isEditing = false;

  constructor(private service: BankAccountsService) {}

  ngOnInit(): void { this.loadItems(); }

  loadItems(): void {
    this.isLoading = true;
    this.service.getAll().subscribe({
      next: (data) => { this.items = data; this.isLoading = false; },
      error: (error) => { console.error('Error:', error); this.isLoading = false; }
    });
  }

  onEdit(item: BankAccountResponseDTO): void { this.selectedItem = item; this.isEditing = true; }

  onDelete(id: string): void {
    if (confirm('هل أنت متأكد؟')) {
      this.service.delete(id).subscribe({
        next: () => this.loadItems(),
        error: (error) => console.error('Error:', error)
      });
    }
  }

  onSave(dto: CreateBankAccountDTO | UpdateBankAccountDTO): void {
    if (this.isEditing && this.selectedItem) {
      this.service.update(this.selectedItem.id, dto as UpdateBankAccountDTO).subscribe({
        next: () => { this.loadItems(); this.isEditing = false; this.selectedItem = null; }
      });
    } else {
      this.service.create(dto as CreateBankAccountDTO).subscribe({ next: () => this.loadItems() });
    }
  }
}
