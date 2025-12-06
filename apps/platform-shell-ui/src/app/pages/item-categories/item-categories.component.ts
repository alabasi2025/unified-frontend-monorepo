import { Component, OnInit } from '@angular/core';
import { ItemCategoriesService } from '../../services/item-categories.service';
import { ItemCategory, CreateItemCategory } from '../../models/item-category.model';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-item-categories',
  templateUrl: './item-categories.component.html',
  styleUrls: ['./item-categories.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class ItemCategoriesComponent implements OnInit {
  categories: ItemCategory[] = [];
  selectedCategory: ItemCategory | null = null;
  categoryDialog: boolean = false;
  isEditMode: boolean = false;
  newCategory: CreateItemCategory = { name: '', description: '', isActive: true };

  constructor(
    private itemCategoriesService: ItemCategoriesService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.itemCategoriesService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في تحميل الأصناف' });
        console.error(err);
      }
    });
  }

  openNew(): void {
    this.newCategory = { name: '', description: '', isActive: true };
    this.selectedCategory = null;
    this.isEditMode = false;
    this.categoryDialog = true;
  }

  editCategory(category: ItemCategory): void {
    this.selectedCategory = { ...category };
    this.newCategory = { name: category.name, description: category.description, isActive: category.isActive };
    this.isEditMode = true;
    this.categoryDialog = true;
  }

  hideDialog(): void {
    this.categoryDialog = false;
    this.selectedCategory = null;
  }

  saveCategory(): void {
    if (this.isEditMode && this.selectedCategory) {
      this.itemCategoriesService.updateCategory(this.selectedCategory.id, this.newCategory).subscribe({
        next: (updatedCategory) => {
          const index = this.categories.findIndex(c => c.id === updatedCategory.id);
          if (index !== -1) {
            this.categories[index] = updatedCategory;
          }
          this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم تحديث الصنف بنجاح' });
          this.hideDialog();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في تحديث الصنف' });
          console.error(err);
        }
      });
    } else {
      this.itemCategoriesService.createCategory(this.newCategory).subscribe({
        next: (createdCategory) => {
          this.categories.push(createdCategory);
          this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم إنشاء الصنف بنجاح' });
          this.hideDialog();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في إنشاء الصنف' });
          console.error(err);
        }
      });
    }
  }

  deleteCategory(category: ItemCategory): void {
    if (confirm(`هل أنت متأكد من حذف الصنف: ${category.name}؟`)) {
      this.itemCategoriesService.deleteCategory(category.id).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== category.id);
          this.messageService.add({ severity: 'success', summary: 'نجاح', detail: 'تم حذف الصنف بنجاح' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في حذف الصنف' });
          console.error(err);
        }
      });
    }
  }
}
