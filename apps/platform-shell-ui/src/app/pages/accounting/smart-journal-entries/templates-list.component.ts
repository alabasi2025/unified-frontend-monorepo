// PHASE-15: Smart Journal Entries - Templates List Component
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SmartJournalEntriesService } from './smart-journal-entries.service';

@Component({
  selector: 'app-templates-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold mb-6">قوالب القيود الذكية</h2>

        <div *ngIf="loading" class="text-center py-8">
          <p>جاري التحميل...</p>
        </div>

        <div *ngIf="!loading && templates.length === 0" class="text-center py-8">
          <p class="text-gray-500">لا توجد قوالب</p>
        </div>

        <div *ngIf="!loading && templates.length > 0" class="space-y-4">
          <div
            *ngFor="let template of templates"
            class="border rounded p-4 hover:bg-gray-50"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold text-lg">{{ template.nameAr }}</h3>
                <p class="text-sm text-gray-600">{{ template.code }}</p>
              </div>
              <span
                class="px-3 py-1 rounded text-sm"
                [ngClass]="{
                  'bg-green-100 text-green-800': template.isActive,
                  'bg-gray-100 text-gray-800': !template.isActive
                }"
              >
                {{ template.isActive ? 'نشط' : 'غير نشط' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TemplatesListComponent implements OnInit {
  templates: any[] = [];
  loading = false;

  constructor(
    private service: SmartJournalEntriesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTemplates();
  }

  loadTemplates() {
    this.loading = true;
    this.service.getTemplates().subscribe({
      next: (data) => {
        this.templates = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
