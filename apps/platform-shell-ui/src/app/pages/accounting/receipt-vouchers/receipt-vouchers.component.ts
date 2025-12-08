import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReceiptVouchersService } from '../../../services/accounting/receipt-vouchers.service';
import { CreateReceiptVoucherDTO, UpdateReceiptVoucherDTO, ReceiptVoucherResponseDTO } from '@semop/contracts';

/** PHASE: Sprint 2 - Accounting Cycle | Date: 2025-12-08 | Author: Manus AI */
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-receipt-vouchers',
  templateUrl: './receipt-vouchers.component.html',
  styleUrls: ['./receipt-vouchers.component.scss']
})
export class ReceiptVouchersComponent implements OnInit {
  items: ReceiptVoucherResponseDTO[] = [];
  selectedItem: ReceiptVoucherResponseDTO | null = null;
  isLoading = false;
  isEditing = false;

  constructor(private service: ReceiptVouchersService) {}

  ngOnInit(): void { this.loadItems(); }

  loadItems(): void {
    this.isLoading = true;
    this.service.getAll().subscribe({
      next: (data) => { this.items = data; this.isLoading = false; },
      error: (error) => { console.error('Error:', error); this.isLoading = false; }
    });
  }

  onEdit(item: ReceiptVoucherResponseDTO): void { this.selectedItem = item; this.isEditing = true; }

  onDelete(id: string): void {
    if (confirm('هل أنت متأكد؟')) {
      this.service.delete(id).subscribe({
        next: () => this.loadItems(),
        error: (error) => console.error('Error:', error)
      });
    }
  }

  onSave(dto: CreateReceiptVoucherDTO | UpdateReceiptVoucherDTO): void {
    if (this.isEditing && this.selectedItem) {
      this.service.update(this.selectedItem.id, dto as UpdateReceiptVoucherDTO).subscribe({
        next: () => { this.loadItems(); this.isEditing = false; this.selectedItem = null; }
      });
    } else {
      this.service.create(dto as CreateReceiptVoucherDTO).subscribe({ next: () => this.loadItems() });
    }
  }
}
