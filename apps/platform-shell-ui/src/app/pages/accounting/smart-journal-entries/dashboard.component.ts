// PHASE-15: Smart Journal Entries - Dashboard Component
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-smart-journal-entries-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="bg-white rounded-lg shadow p-6">
        <h1 class="text-3xl font-bold mb-6">القيود الذكية</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="bg-blue-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold mb-2">القوالب</h3>
            <p class="text-3xl font-bold text-blue-600">0</p>
          </div>
          
          <div class="bg-green-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold mb-2">القيود المنشأة</h3>
            <p class="text-3xl font-bold text-green-600">0</p>
          </div>
          
          <div class="bg-purple-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold mb-2">معدل الدقة</h3>
            <p class="text-3xl font-bold text-purple-600">0%</p>
          </div>
        </div>

        <div class="space-y-4">
          <button
            class="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            (click)="navigateToCreate()"
          >
            إنشاء قيد ذكي جديد
          </button>
          
          <button
            class="w-full md:w-auto px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 md:mr-2"
            (click)="navigateToTemplates()"
          >
            إدارة القوالب
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  constructor(private router: Router) {}

  navigateToCreate() {
    this.router.navigate(['/accounting/smart-journal-entries/create']);
  }

  navigateToTemplates() {
    this.router.navigate(['/accounting/smart-journal-entries/templates']);
  }
}
