import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PageHeaderComponent } from '../../shared';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, ButtonModule, PageHeaderComponent],
  template: `
    <app-page-header [title]="isEditMode ? 'تعديل المستخدمون' : 'إضافة المستخدمون'" [showBackButton]="true" [backRoute]="'/users'"></app-page-header>
    <p-card>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="field"><label>name</label><input pInputText formControlName="name" class="w-full" /></div>\n<div class="field"><label>email</label><input pInputText formControlName="email" class="w-full" /></div>\n<div class="field"><label>password</label><input pInputText formControlName="password" class="w-full" /></div>\n<div class="field"><label>roleId</label><input pInputText formControlName="roleId" class="w-full" /></div>\n<div class="field"><label>status</label><input pInputText formControlName="status" class="w-full" /></div>
        <div class="flex gap-2">
          <button pButton type="submit" label="حفظ" [loading]="loading" [disabled]="form.invalid"></button>
          <button pButton type="button" label="إلغاء" class="p-button-secondary" (click)="onCancel()"></button>
        </div>
      </form>
    </p-card>
  `
})
export class UsersFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEditMode = false;
  itemId: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {}
  
  ngOnInit() {
    this.itemId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.itemId;
    this.form = this.fb.group({name: ['', Validators.required], email: ['', Validators.required], password: ['', Validators.required], roleId: ['', Validators.required], status: ['', Validators.required]});
    if (this.isEditMode && this.itemId) this.loadData(this.itemId);
  }

  loadData(id: string) { /* Load data */ }
  
  async onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    try {
      // Save data
      this.router.navigate(['/users']);
    } finally {
      this.loading = false;
    }
  }

  onCancel() { this.router.navigate(['/users']); }
}
