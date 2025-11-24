import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { TimelineModule } from 'primeng/timeline';
import { TagModule } from 'primeng/tag';

interface NotebookEntry {
  id: string;
  title: string;
  content: string;
  type: 'conversation' | 'idea' | 'task' | 'report';
  createdAt: Date;
  relatedItems: {
    conversations?: number;
    ideas?: number;
    tasks?: number;
  };
}

@Component({
  selector: 'app-living-notebook',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TabViewModule,
    TimelineModule,
    TagModule
  ],
  template: `
    <div class="living-notebook-container">
      <!-- Header -->
      <div class="notebook-header">
        <h1>📓 الدفتر الشامل</h1>
        <p>دليل بناء النظام التلقائي - من المحادثات إلى المهام</p>
        
        <div class="header-actions">
          <button pButton label="تحليل محادثة جديدة" icon="pi pi-comments" 
                  class="p-button-primary" (click)="analyzeNewConversation()"></button>
          <button pButton label="توليد تقرير" icon="pi pi-file" 
                  class="p-button-success" (click)="generateReport()"></button>
        </div>
      </div>

      <!-- Statistics -->
      <div class="statistics-grid">
        <div class="stat-card">
          <i class="pi pi-comments"></i>
          <div class="stat-content">
            <h3>{{ stats.conversations }}</h3>
            <p>محادثة</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="pi pi-lightbulb"></i>
          <div class="stat-content">
            <h3>{{ stats.ideas }}</h3>
            <p>فكرة مستخرجة</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="pi pi-check-square"></i>
          <div class="stat-content">
            <h3>{{ stats.tasks }}</h3>
            <p>مهمة منشأة</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="pi pi-file"></i>
          <div class="stat-content">
            <h3>{{ stats.reports }}</h3>
            <p>تقرير</p>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <p-tabView>
        <!-- Tab 1: Timeline View -->
        <p-tabPanel header="الخط الزمني">
          <div class="timeline-view">
            <p-timeline [value]="timelineEntries" align="alternate">
              <ng-template pTemplate="content" let-entry>
                <p-card>
                  <ng-template pTemplate="header">
                    <div class="entry-header">
                      <h3>{{ entry.title }}</h3>
                      <p-tag [value]="getTypeLabel(entry.type)" 
                             [severity]="getTypeSeverity(entry.type)"></p-tag>
                    </div>
                  </ng-template>
                  
                  <div class="entry-content" [innerHTML]="entry.content"></div>
                  
                  <ng-template pTemplate="footer">
                    <div class="entry-footer">
                      <small>{{ entry.createdAt | date:'medium':'':'ar' }}</small>
                      <div class="related-items">
                        <span *ngIf="entry.relatedItems.conversations">
                          💬 {{ entry.relatedItems.conversations }}
                        </span>
                        <span *ngIf="entry.relatedItems.ideas">
                          💡 {{ entry.relatedItems.ideas }}
                        </span>
                        <span *ngIf="entry.relatedItems.tasks">
                          ✅ {{ entry.relatedItems.tasks }}
                        </span>
                      </div>
                    </div>
                  </ng-template>
                </p-card>
              </ng-template>
            </p-timeline>
          </div>
        </p-tabPanel>

        <!-- Tab 2: Flow View (محادثة → فكرة → مهمة) -->
        <p-tabPanel header="التدفق">
          <div class="flow-view">
            <div class="flow-diagram">
              <div class="flow-step">
                <div class="flow-icon">💬</div>
                <h3>المحادثة</h3>
                <p>نقاش وحوار</p>
                <div class="flow-count">{{ stats.conversations }}</div>
              </div>
              
              <div class="flow-arrow">→</div>
              
              <div class="flow-step">
                <div class="flow-icon">💡</div>
                <h3>الأفكار</h3>
                <p>استخراج تلقائي</p>
                <div class="flow-count">{{ stats.ideas }}</div>
              </div>
              
              <div class="flow-arrow">→</div>
              
              <div class="flow-step">
                <div class="flow-icon">✅</div>
                <h3>المهام</h3>
                <p>تحويل وتنفيذ</p>
                <div class="flow-count">{{ stats.tasks }}</div>
              </div>
              
              <div class="flow-arrow">→</div>
              
              <div class="flow-step">
                <div class="flow-icon">📊</div>
                <h3>التقارير</h3>
                <p>توليد تلقائي</p>
                <div class="flow-count">{{ stats.reports }}</div>
              </div>
            </div>

            <!-- Recent Flows -->
            <div class="recent-flows">
              <h3>آخر التدفقات</h3>
              <div class="flow-list">
                <div *ngFor="let flow of recentFlows" class="flow-item">
                  <div class="flow-item-header">
                    <h4>{{ flow.conversation.title }}</h4>
                    <small>{{ flow.createdAt | date:'short':'':'ar' }}</small>
                  </div>
                  <div class="flow-item-content">
                    <span class="flow-badge">{{ flow.ideasCount }} فكرة</span>
                    <span class="flow-badge">{{ flow.tasksCount }} مهمة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </p-tabPanel>

        <!-- Tab 3: System Build Guide -->
        <p-tabPanel header="دليل البناء">
          <div class="build-guide">
            <h2>📖 دليل بناء النظام</h2>
            <p>هذا الدليل يتم تحديثه تلقائياً مع كل خطوة في بناء النظام</p>
            
            <div class="guide-content" [innerHTML]="buildGuide"></div>
            
            <button pButton label="تحديث الدليل" icon="pi pi-refresh" 
                    (click)="updateBuildGuide()"></button>
          </div>
        </p-tabPanel>

        <!-- Tab 4: Reports -->
        <p-tabPanel header="التقارير">
          <div class="reports-view">
            <div class="reports-actions">
              <button pButton label="تقرير يومي" (click)="generateDailyReport()"></button>
              <button pButton label="تقرير أسبوعي" (click)="generateWeeklyReport()"></button>
              <button pButton label="تقرير شهري" (click)="generateMonthlyReport()"></button>
            </div>

            <div class="reports-list">
              <p-card *ngFor="let report of reports" class="report-card">
                <ng-template pTemplate="header">
                  <h3>{{ report.title }}</h3>
                </ng-template>
                
                <div [innerHTML]="report.content"></div>
                
                <ng-template pTemplate="footer">
                  <div class="report-footer">
                    <small>{{ report.createdAt | date:'medium':'':'ar' }}</small>
                    <button pButton icon="pi pi-download" label="تحميل" 
                            class="p-button-sm"></button>
                  </div>
                </ng-template>
              </p-card>
            </div>
          </div>
        </p-tabPanel>
      </p-tabView>
    </div>
  `,
  styles: [`
    .living-notebook-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .notebook-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .notebook-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: #2c3e50;
    }

    .notebook-header p {
      color: #7f8c8d;
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .statistics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .stat-card i {
      font-size: 2.5rem;
    }

    .stat-content h3 {
      font-size: 2rem;
      margin: 0;
    }

    .stat-content p {
      margin: 0;
      opacity: 0.9;
    }

    .flow-view {
      padding: 2rem 0;
    }

    .flow-diagram {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .flow-step {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      min-width: 150px;
    }

    .flow-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .flow-count {
      font-size: 1.5rem;
      font-weight: bold;
      color: #667eea;
      margin-top: 0.5rem;
    }

    .flow-arrow {
      font-size: 2rem;
      color: #667eea;
      font-weight: bold;
    }

    .recent-flows {
      margin-top: 2rem;
    }

    .flow-list {
      display: grid;
      gap: 1rem;
    }

    .flow-item {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .flow-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .flow-badge {
      background: #e3f2fd;
      color: #1976d2;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      margin-right: 0.5rem;
    }

    .build-guide {
      padding: 2rem;
      background: white;
      border-radius: 10px;
    }

    .guide-content {
      margin: 2rem 0;
      line-height: 1.8;
    }

    .reports-view {
      padding: 1rem 0;
    }

    .reports-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .reports-list {
      display: grid;
      gap: 1.5rem;
    }

    .report-card {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .report-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
    }

    .entry-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .related-items {
      display: flex;
      gap: 1rem;
    }
  `]
})
export class LivingNotebookComponent implements OnInit {
  stats = {
    conversations: 12,
    ideas: 45,
    tasks: 78,
    reports: 8
  };

  timelineEntries: NotebookEntry[] = [];
  recentFlows: any[] = [];
  reports: any[] = [];
  buildGuide = '';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // بيانات تجريبية
    this.timelineEntries = [
      {
        id: '1',
        title: 'جلسة تخطيط نظام Smart Notebook',
        content: '<p>تم مناقشة متطلبات النظام واستخراج 5 أفكار رئيسية</p>',
        type: 'conversation',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        relatedItems: { ideas: 5, tasks: 12 }
      },
      {
        id: '2',
        title: 'فكرة: نظام التسجيل التلقائي',
        content: '<p>تطوير نظام يسجل المحادثات تلقائياً ويستخرج الأفكار</p>',
        type: 'idea',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        relatedItems: { tasks: 3 }
      }
    ];

    this.recentFlows = [
      {
        conversation: { title: 'مراجعة تصميم النظام' },
        ideasCount: 8,
        tasksCount: 15,
        createdAt: new Date()
      }
    ];

    this.buildGuide = this.generateBuildGuide();
  }

  generateBuildGuide(): string {
    return `
      <h3>المرحلة 1: التخطيط والتصميم</h3>
      <ul>
        <li>✅ تحديد المتطلبات الأساسية</li>
        <li>✅ تصميم قاعدة البيانات</li>
        <li>✅ تصميم واجهة المستخدم</li>
      </ul>

      <h3>المرحلة 2: تطوير Backend</h3>
      <ul>
        <li>✅ إنشاء API للمحادثات</li>
        <li>✅ إنشاء API للأفكار</li>
        <li>✅ إنشاء API للمهام</li>
        <li>🔄 تطوير نظام التحليل التلقائي</li>
      </ul>

      <h3>المرحلة 3: تطوير Frontend</h3>
      <ul>
        <li>✅ صفحات الدفتر</li>
        <li>✅ الملصقات</li>
        <li>✅ الخط الزمني</li>
        <li>🔄 الدفتر الشامل</li>
      </ul>

      <h3>المرحلة 4: الاختبار والنشر</h3>
      <ul>
        <li>⏳ اختبار شامل</li>
        <li>⏳ نشر على الإنتاج</li>
      </ul>
    `;
  }

  getTypeLabel(type: string): string {
    const labels: any = {
      conversation: 'محادثة',
      idea: 'فكرة',
      task: 'مهمة',
      report: 'تقرير'
    };
    return labels[type] || type;
  }

  getTypeSeverity(type: string): any {
    const severities: any = {
      conversation: 'info',
      idea: 'warning',
      task: 'success',
      report: 'danger'
    };
    return severities[type] || 'info';
  }

  analyzeNewConversation() {
    alert('سيتم تحليل المحادثة الجديدة...');
  }

  generateReport() {
    alert('سيتم توليد التقرير...');
  }

  updateBuildGuide() {
    this.buildGuide = this.generateBuildGuide();
  }

  generateDailyReport() {
    alert('سيتم توليد التقرير اليومي...');
  }

  generateWeeklyReport() {
    alert('سيتم توليد التقرير الأسبوعي...');
  }

  generateMonthlyReport() {
    alert('سيتم توليد التقرير الشهري...');
  }
}
