import { Component, OnInit } from '@angular/core';
import { SuppliersService } from '../../../../services/accounting/suppliers.service';
import { 
  CreateSupplierDto, 
  UpdateSupplierDto, 
  SupplierResponseDto 
} from '@semop/contracts';

/**
 * PHASE: Sprint 2 - Accounting Cycle
 * Date: 2025-12-08
 * Author: Manus AI
 * Description: Suppliers Component for managing supplier data
 */
@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  items: SupplierResponseDto[] = [];
  selectedItem: SupplierResponseDto | null = null;
  isLoading = false;
  isEditing = false;

  constructor(private suppliersService: SuppliersService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.isLoading = true;
    this.suppliersService.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.isLoading = false;
      }
    });
  }

  onEdit(item: SupplierResponseDto): void {
    this.selectedItem = item;
    this.isEditing = true;
  }

  onDelete(id: string): void {
    if (confirm('هل أنت متأكد من حذف هذا المورد؟')) {
      this.suppliersService.delete(id).subscribe({
        next: () => {
          this.loadItems();
        },
        error: (error) => {
          console.error('Error deleting supplier:', error);
        }
      });
    }
  }

  onSave(dto: CreateSupplierDto | UpdateSupplierDto): void {
    if (this.isEditing && this.selectedItem) {
      this.suppliersService.update(this.selectedItem.id, dto as UpdateSupplierDto).subscribe({
        next: () => {
          this.loadItems();
          this.isEditing = false;
          this.selectedItem = null;
        },
        error: (error) => {
          console.error('Error updating supplier:', error);
        }
      });
    } else {
      this.suppliersService.create(dto as CreateSupplierDto).subscribe({
        next: () => {
          this.loadItems();
        },
        error: (error) => {
          console.error('Error creating supplier:', error);
        }
      });
    }
  }
}
