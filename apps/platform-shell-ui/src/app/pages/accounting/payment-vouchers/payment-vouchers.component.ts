import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentVouchersService } from '../../../../services/accounting/payment-vouchers.service';
import { CreatePaymentVoucherDto, UpdatePaymentVoucherDto, PaymentVoucherResponseDto } from '@semop/contracts';

/**
 * PHASE: Sprint 2 - Accounting Cycle
 * Date: 2025-12-08
 * Author: Manus AI
 */
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-payment-vouchers',
  templateUrl: './payment-vouchers.component.html',
  styleUrls: ['./payment-vouchers.component.scss']
})
export class PaymentVouchersComponent implements OnInit {
  items: PaymentVoucherResponseDto[] = [];
  selectedItem: PaymentVoucherResponseDto | null = null;
  isLoading = false;
  isEditing = false;

  constructor(private service: PaymentVouchersService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.isLoading = true;
    this.service.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.isLoading = false;
      }
    });
  }

  onEdit(item: PaymentVoucherResponseDto): void {
    this.selectedItem = item;
    this.isEditing = true;
  }

  onDelete(id: string): void {
    if (confirm('هل أنت متأكد؟')) {
      this.service.delete(id).subscribe({
        next: () => this.loadItems(),
        error: (error) => console.error('Error:', error)
      });
    }
  }

  onSave(dto: CreatePaymentVoucherDto | UpdatePaymentVoucherDto): void {
    if (this.isEditing && this.selectedItem) {
      this.service.update(this.selectedItem.id, dto as UpdatePaymentVoucherDto).subscribe({
        next: () => {
          this.loadItems();
          this.isEditing = false;
          this.selectedItem = null;
        }
      });
    } else {
      this.service.create(dto as CreatePaymentVoucherDto).subscribe({
        next: () => this.loadItems()
      });
    }
  }
}
