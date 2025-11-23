import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

interface TimelineEvent {
  id: string;
  type: 'conversation' | 'idea' | 'task' | 'page' | 'note';
  title: string;
  description: string;
  user: string;
  timestamp: Date;
  icon: string;
  color: string;
  metadata?: any;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TimelineModule,
    CardModule,
    TagModule
  ],
  template: `
    <div class="timeline-container">
      <div class="header">
        <div class="title-section">
          <h1><i class="pi pi-clock"></i> الخط الزمني</h1>
          <p>تتبع جميع الأنشطة والتغييرات</p>
        </div>
        <div class="filters">
          <select [(ngModel)]="selectedType" (change)="filterEvents()" style="padding: 0.5rem">
            <option *ngFor="let filter of typeFilters" [value]="filter.value">{{ filter.label }}</option>
          </select>
          <select [(ngModel)]="selectedPeriod" (change)="filterEvents()" style="padding: 0.5rem">
            <option *ngFor="let filter of periodFilters" [value]="filter.value">{{ filter.label }}</option>
          </select>
        </div>
      </div>

      <div class="timeline-content">
        <p-timeline [value]="filteredEvents" align="alternate">
          <ng-template pTemplate="content" let-event>
            <p-card [styleClass]="'event-card ' + event.type">
              <ng-template pTemplate="header">
                <div class="event-header">
                  <div class="event-icon" [style.background]="event.color">
                    <i [class]="event.icon"></i>
                  </div>
                  <div class="event-info">
                    <h3>{{ event.title }}</h3>
                    <small>{{ event.timestamp | date:'medium' }}</small>
                  </div>
                </div>
              </ng-template>
              
              <p>{{ event.description }}</p>
              
              <ng-template pTemplate="footer">
                <div class="event-footer">
                  <p-tag [value]="getTypeLabel(event.type)" [severity]="getTypeSeverity(event.type)"></p-tag>
                  <span class="user-info">
                    <i class="pi pi-user"></i> {{ event.user }}
                  </span>
                </div>
              </ng-template>
            </p-card>
          </ng-template>
          
          <ng-template pTemplate="marker" let-event>
            <div class="timeline-marker" [style.background]="event.color">
              <i [class]="event.icon"></i>
            </div>
          </ng-template>
        </p-timeline>
      </div>

      <div class="load-more" *ngIf="hasMore">
        <button pButton label="تحميل المزيد" icon="pi pi-arrow-down" class="p-button-outlined"
                (click)="loadMore()"></button>
      </div>
    </div>
  `,
  styles: [`
    .timeline-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .title-section h1 {
      margin: 0;
      color: #2c3e50;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .title-section p {
      margin: 0.5rem 0 0 0;
      color: #7f8c8d;
    }

    .filters {
      display: flex;
      gap: 1rem;
    }

    .timeline-content {
      margin-top: 2rem;
    }

    ::ng-deep .p-timeline .p-timeline-event-opposite {
      flex: 0;
    }

    ::ng-deep .p-timeline .p-timeline-event-content {
      flex: 1;
    }

    .timeline-marker {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.2rem;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    .event-card {
      margin-bottom: 1rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .event-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    }

    .event-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }

    .event-icon {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.3rem;
    }

    .event-info h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.1rem;
    }

    .event-info small {
      color: #7f8c8d;
    }

    .event-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #ecf0f1;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #7f8c8d;
    }

    .load-more {
      text-align: center;
      margin-top: 2rem;
    }

    /* نوع الحدث */
    .event-card.conversation {
      border-right: 4px solid #3498db;
    }

    .event-card.idea {
      border-right: 4px solid #f39c12;
    }

    .event-card.task {
      border-right: 4px solid #2ecc71;
    }

    .event-card.page {
      border-right: 4px solid #9b59b6;
    }

    .event-card.note {
      border-right: 4px solid #e74c3c;
    }
  `]
})
export class TimelineComponent implements OnInit {
  events: TimelineEvent[] = [];
  filteredEvents: TimelineEvent[] = [];
  selectedType: string = 'all';
  selectedPeriod: string = 'all';
  hasMore: boolean = true;

  typeFilters = [
    { label: 'الكل', value: 'all' },
    { label: 'محادثات', value: 'conversation' },
    { label: 'أفكار', value: 'idea' },
    { label: 'مهام', value: 'task' },
    { label: 'صفحات', value: 'page' },
    { label: 'ملصقات', value: 'note' }
  ];

  periodFilters = [
    { label: 'الكل', value: 'all' },
    { label: 'اليوم', value: 'today' },
    { label: 'هذا الأسبوع', value: 'week' },
    { label: 'هذا الشهر', value: 'month' }
  ];

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    // TODO: استدعاء API للحصول على الأحداث
    this.events = [
      {
        id: '1',
        type: 'conversation',
        title: 'محادثة جديدة: تطوير نظام الخرائط',
        description: 'تم إنشاء محادثة جديدة لمناقشة تطوير نظام الخرائط الجغرافية',
        user: 'أحمد محمد',
        timestamp: new Date('2025-11-23T10:30:00'),
        icon: 'pi pi-comments',
        color: '#3498db'
      },
      {
        id: '2',
        type: 'idea',
        title: 'فكرة جديدة: دمج الخرائط مع النظام المحاسبي',
        description: 'تم إضافة فكرة لدمج نظام الخرائط مع النظام المحاسبي لتتبع المصروفات حسب الموقع',
        user: 'سارة علي',
        timestamp: new Date('2025-11-23T09:15:00'),
        icon: 'pi pi-lightbulb',
        color: '#f39c12'
      },
      {
        id: '3',
        type: 'task',
        title: 'مهمة مكتملة: تصميم واجهة الخرائط',
        description: 'تم إكمال تصميم واجهة المستخدم لنظام الخرائط',
        user: 'محمد خالد',
        timestamp: new Date('2025-11-22T16:45:00'),
        icon: 'pi pi-check-circle',
        color: '#2ecc71'
      },
      {
        id: '4',
        type: 'page',
        title: 'صفحة جديدة: خطة التطوير',
        description: 'تم إنشاء صفحة جديدة تحتوي على خطة تطوير نظام الخرائط',
        user: 'فاطمة أحمد',
        timestamp: new Date('2025-11-22T14:20:00'),
        icon: 'pi pi-file',
        color: '#9b59b6'
      },
      {
        id: '5',
        type: 'note',
        title: 'ملصق جديد: تذكير بالاجتماع',
        description: 'تم إضافة ملصق تذكير باجتماع الفريق غداً',
        user: 'عمر حسن',
        timestamp: new Date('2025-11-22T11:00:00'),
        icon: 'pi pi-bookmark',
        color: '#e74c3c'
      }
    ];
    this.filterEvents();
  }

  filterEvents() {
    let filtered = this.events;

    if (this.selectedType !== 'all') {
      filtered = filtered.filter(e => e.type === this.selectedType);
    }

    if (this.selectedPeriod !== 'all') {
      const now = new Date();
      filtered = filtered.filter(e => {
        const eventDate = new Date(e.timestamp);
        switch (this.selectedPeriod) {
          case 'today':
            return eventDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return eventDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return eventDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    this.filteredEvents = filtered;
  }

  getTypeLabel(type: string): string {
    const labels: any = {
      conversation: 'محادثة',
      idea: 'فكرة',
      task: 'مهمة',
      page: 'صفحة',
      note: 'ملصق'
    };
    return labels[type] || type;
  }

  getTypeSeverity(type: string): 'success' | 'info' | 'secondary' | 'warn' | 'danger' | 'contrast' {
    const severities: any = {
      conversation: 'info',
      idea: 'warn',
      task: 'success',
      page: 'secondary',
      note: 'danger'
    };
    return (severities[type] as any) || 'info';
  }

  loadMore() {
    // TODO: استدعاء API لتحميل المزيد من الأحداث
    this.hasMore = false;
  }
}
