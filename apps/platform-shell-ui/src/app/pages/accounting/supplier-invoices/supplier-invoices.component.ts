import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierInvoicesService } from '../../../services/accounting/supplier-invoices.service';
import { CreateSupplierInvoiceDTO, UpdateSupplierInvoiceDTO, SupplierInvoiceResponseDTO } from '@semop/contracts';

/**
 * PHASE: Sprint 2 - Accounting Cycle
 * Date: 2025-12-08
 * Author: Manus AI
 */
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-supplier-invoices',
  templateUrl: './supplier-invoices.component.html',
  styleUrls: ['./supplier-invoices.component.scss']
})
export class SupplierInvoicesComponent implements OnInit {
  items: SupplierInvoiceResponseDTO[] = [];
  selectedItem: SupplierInvoiceResponseDTO | null = null;
  isLoading = false;
  isEditing = false;

  constructor(private service: SupplierInvoicesService) {}

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

  onEdit(item: SupplierInvoiceResponseDTO): void {
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

  onSave(dto: CreateSupplierInvoiceDTO | UpdateSupplierInvoiceDTO): void {
    if (this.isEditing && this.selectedItem) {
      this.service.update(this.selectedItem.id, dto as UpdateSupplierInvoiceDTO).subscribe({
        next: () => {
          this.loadItems();
          this.isEditing = false;
          this.selectedItem = null;
        }
      });
    } else {
      this.service.create(dto as CreateSupplierInvoiceDTO).subscribe({
        next: () => this.loadItems()
      });
    }
  }
}
