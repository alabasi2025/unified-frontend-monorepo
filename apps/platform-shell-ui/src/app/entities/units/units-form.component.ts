import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PageHeaderComponent } from '../../../shared/components/page-header.component';

@Component({
  selector: 'app-units-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, ButtonModule, PageHeaderComponent],
  template: `
    <app-page-header [title]="isEditMode ? 'تعديل الوحدات' : 'إضافة الوحدات'" [showBackButton]="true" [backRoute]="'/entities/units'"></app-page-header>
    <p-card>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="field"><label>code</label><input pInputText formControlName="code" class="w-full" /></div>\n<div class="field"><label>nameAr</label><input pInputText formControlName="nameAr" class="w-full" /></div>\n<div class="field"><label>nameEn</label><input pInputText formControlName="nameEn" class="w-full" /></div>\n<div class="field"><label>holdingId</label><input pInputText formControlName="holdingId" class="w-full" /></div>\n<div class="field"><label>description</label><input pInputText formControlName="description" class="w-full" /></div>\n<div class="field"><label>status</label><input pInputText formControlName="status" class="w-full" /></div>
        <div class="flex gap-2">
          <button pButton type="submit" label="حفظ" [loading]="loading" [disabled]="form.invalid"></button>
          <button pButton type="button" label="إلغاء" class="p-button-secondary" (click)="onCancel()"></button>
        </div>
      </form>
    </p-card>
  `
})
export class UnitsFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEditMode = false;
  itemId: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {}
  
  ngOnInit() {
    this.itemId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.itemId;
    this.form = this.fb.group({code: ['', Validators.required], nameAr: ['', Validators.required], nameEn: ['', Validators.required], holdingId: ['', Validators.required], description: ['', Validators.required], status: ['', Validators.required]});
    if (this.isEditMode && this.itemId) this.loadData(this.itemId);
  }

  loadData(id: string) { /* Load data */ }
  
  async onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    try {
      // Save data
      this.router.navigate(['/entities/units']);
    } finally {
      this.loading = false;
    }
  }

  onCancel() { this.router.navigate(['/entities/units']); }
}
