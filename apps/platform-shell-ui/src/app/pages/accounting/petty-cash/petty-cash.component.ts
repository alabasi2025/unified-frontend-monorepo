import { Component, OnInit } from '@angular/core';
import { PettyCashService } from '../../../../services/accounting/petty-cash.service';
import { CreatePettyCashDto, UpdatePettyCashDto, PettyCashResponseDto } from '@semop/contracts';

/** PHASE: Sprint 2 - Accounting Cycle | Date: 2025-12-08 | Author: Manus AI */
@Component({
  selector: 'app-petty-cash',
  templateUrl: './petty-cash.component.html',
  styleUrls: ['./petty-cash.component.scss']
})
export class PettyCashComponent implements OnInit {
  items: PettyCashResponseDto[] = [];
  selectedItem: PettyCashResponseDto | null = null;
  isLoading = false;
  isEditing = false;

  constructor(private service: PettyCashService) {}

  ngOnInit(): void { this.loadItems(); }

  loadItems(): void {
    this.isLoading = true;
    this.service.getAll().subscribe({
      next: (data) => { this.items = data; this.isLoading = false; },
      error: (error) => { console.error('Error:', error); this.isLoading = false; }
    });
  }

  onEdit(item: PettyCashResponseDto): void { this.selectedItem = item; this.isEditing = true; }

  onDelete(id: string): void {
    if (confirm('هل أنت متأكد؟')) {
      this.service.delete(id).subscribe({
        next: () => this.loadItems(),
        error: (error) => console.error('Error:', error)
      });
    }
  }

  onSave(dto: CreatePettyCashDto | UpdatePettyCashDto): void {
    if (this.isEditing && this.selectedItem) {
      this.service.update(this.selectedItem.id, dto as UpdatePettyCashDto).subscribe({
        next: () => { this.loadItems(); this.isEditing = false; this.selectedItem = null; }
      });
    } else {
      this.service.create(dto as CreatePettyCashDto).subscribe({ next: () => this.loadItems() });
    }
  }
}
