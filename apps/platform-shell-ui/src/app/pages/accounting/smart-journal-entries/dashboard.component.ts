// PHASE-15: Smart Journal Entries - Dashboard Component
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SmartJournalEntriesService } from './smart-journal-entries.service';
import { SmartJournalEntryStatsDto } from '@semop/contracts';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-smart-journal-entries-dashboard',
  standalone: true,
  imports: [CommonModule],
  providers: [SmartJournalEntriesService],
	  template: `
11	    <div class="container mx-auto p-4">
12	      <div class="bg-white rounded-lg shadow p-6">
13	        <h1 class="text-3xl font-bold mb-6">القيود الذكية</h1>
14	        
15	        <div *ngIf="stats$ | async as stats" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
16	          <div class="bg-blue-50 p-6 rounded-lg">
17	            <h3 class="text-lg font-semibold mb-2">إجمالي القوالب</h3>
18	            <p class="text-3xl font-bold text-blue-600">{{ stats.totalTemplates }}</p>
19	          </div>
20	          
21	          <div class="bg-green-50 p-6 rounded-lg">
22	            <h3 class="text-lg font-semibold mb-2">القيود الآلية</h3>
23	            <p class="text-3xl font-bold text-green-600">{{ stats.totalAutomatedEntries }}</p>
24	          </div>
25	          
26	          <div class="bg-red-50 p-6 rounded-lg">
27	            <h3 class="text-lg font-semibold mb-2">تجاوز يدوي</h3>
28	            <p class="text-3xl font-bold text-red-600">{{ stats.totalManualOverrides }}</p>
29	          </div>
30	
31	          <div class="bg-purple-50 p-6 rounded-lg">
32	            <h3 class="text-lg font-semibold mb-2">معدل النجاح</h3>
33	            <p class="text-3xl font-bold text-purple-600">{{ stats.learningSuccessRate }}%</p>
34	            <p class="text-sm text-gray-500 mt-1">آخر تحديث: {{ stats.lastLearningUpdate | date: 'short' }}</p>
35	          </div>
36	        </div>
37	
38	        <div *ngIf="!(stats$ | async)" class="text-center p-8">
39	          <p class="text-gray-500">جاري تحميل الإحصائيات...</p>
40	        </div>   class="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
export class DashboardComponent implements OnInit {
  stats$: Observable<SmartJournalEntryStatsDto | null> = of(null);

  constructor(
    private router: Router,
    private smartEntryService: SmartJournalEntriesService
  ) {}

  ngOnInit(): void {
    this.stats$ = this.smartEntryService.getStats().pipe(
      catchError(error => {
        console.error('Error fetching smart journal entry stats:', error);
        // Handle error gracefully, perhaps return a default/empty stats object
        return of({
          totalTemplates: 0,
          totalAutomatedEntries: 0,
          totalManualOverrides: 0,
          learningSuccessRate: 0,
          lastLearningUpdate: new Date(0),
        } as SmartJournalEntryStatsDto);
      })
    );
  }

  navigateToCreate() {
    this.router.navigate(['/accounting/smart-journal-entries/create']);
  }

  navigateToTemplates() {
    this.router.navigate(['/accounting/smart-journal-entries/templates']);
  }
}
