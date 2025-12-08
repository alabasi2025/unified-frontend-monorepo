import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalesInvoicesService } from '../../../services/accounting/sales-invoices.service';
import { CreateSalesInvoiceDTO, UpdateSalesInvoiceDTO, SalesInvoiceResponseDTO } from '@semop/contracts';

/** PHASE: Sprint 2 - Accounting Cycle | Date: 2025-12-08 | Author: Manus AI */
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-sales-invoices',
  templateUrl: './sales-invoices.component.html',
  styleUrls: ['./sales-invoices.component.scss']
})
export class SalesInvoicesComponent implements OnInit {
  items: SalesInvoiceResponseDTO[] = [];
  selectedItem: SalesInvoiceResponseDTO | null = null;
  isLoading = false;
  isEditing = false;

  constructor(private service: SalesInvoicesService) {}

  ngOnInit(): void { this.loadItems(); }

  loadItems(): void {
    this.isLoading = true;
    this.service.getAll().subscribe({
      next: (data) => { this.items = data; this.isLoading = false; },
      error: (error) => { console.error('Error:', error); this.isLoading = false; }
    });
  }

  onEdit(item: SalesInvoiceResponseDTO): void { this.selectedItem = item; this.isEditing = true; }

  onDelete(id: string): void {
    if (confirm('هل أنت متأكد؟')) {
      this.service.delete(id).subscribe({
        next: () => this.loadItems(),
        error: (error) => console.error('Error:', error)
      });
    }
  }

  onSave(dto: CreateSalesInvoiceDTO | UpdateSalesInvoiceDTO): void {
    if (this.isEditing && this.selectedItem) {
      this.service.update(this.selectedItem.id, dto as UpdateSalesInvoiceDTO).subscribe({
        next: () => { this.loadItems(); this.isEditing = false; this.selectedItem = null; }
      });
    } else {
      this.service.create(dto as CreateSalesInvoiceDTO).subscribe({ next: () => this.loadItems() });
    }
  }
}
