import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface DashboardStats {
  ideas: { total: number; new: number; converted: number };
  chats: { total: number; favorite: number; today: number };
  reports: { total: number; published: number; draft: number };
  tasks: { total: number; pending: number; inProgress: number; completed: number };
}

@Component({
  selector: 'app-smart-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>📊 Smart Notebook Dashboard</h1>
        <p class="subtitle">نظرة شاملة على جميع الأنشطة</p>
      </div>

      <!-- Quick Stats -->
      <div class="stats-overview">
        <div class="stat-card ideas">
          <div class="stat-header">
            <h3>💡 بنك الأفكار</h3>
            <button class="btn-view" (click)="navigate('/smart-notebook/ideas')">عرض</button>
          </div>
          <div class="stat-numbers">
            <div class="main-number">{{ stats.ideas.total }}</div>
            <div class="sub-stats">
              <span>🔥 {{ stats.ideas.new }} جديدة</span>
              <span>📦 {{ stats.ideas.converted }} محولة</span>
            </div>
          </div>
        </div>

        <div class="stat-card chats">
          <div class="stat-header">
            <h3>💬 سجل المحادثات</h3>
            <button class="btn-view" (click)="navigate('/smart-notebook/chats')">عرض</button>
          </div>
          <div class="stat-numbers">
            <div class="main-number">{{ stats.chats.total }}</div>
            <div class="sub-stats">
              <span>⭐ {{ stats.chats.favorite }} مميزة</span>
              <span>📅 {{ stats.chats.today }} اليوم</span>
            </div>
          </div>
        </div>

        <div class="stat-card reports">
          <div class="stat-header">
            <h3>📊 مكتبة التقارير</h3>
            <button class="btn-view" (click)="navigate('/smart-notebook/reports')">عرض</button>
          </div>
          <div class="stat-numbers">
            <div class="main-number">{{ stats.reports.total }}</div>
            <div class="sub-stats">
              <span>✅ {{ stats.reports.published }} منشورة</span>
              <span>📝 {{ stats.reports.draft }} مسودات</span>
            </div>
          </div>
        </div>

        <div class="stat-card tasks">
          <div class="stat-header">
            <h3>✅ المهام</h3>
            <button class="btn-view" (click)="navigate('/smart-notebook/tasks')">عرض</button>
          </div>
          <div class="stat-numbers">
            <div class="main-number">{{ stats.tasks.total }}</div>
            <div class="sub-stats">
              <span>⏳ {{ stats.tasks.pending }} انتظار</span>
              <span>🔄 {{ stats.tasks.inProgress }} تنفيذ</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>⚡ إجراءات سريعة</h2>
        <div class="actions-grid">
          <button class="action-btn ideas" (click)="navigate('/smart-notebook/ideas')">
            <span class="action-icon">💡</span>
            <span class="action-label">إضافة فكرة</span>
          </button>
          <button class="action-btn chats" (click)="navigate('/smart-notebook/chats')">
            <span class="action-icon">💬</span>
            <span class="action-label">حفظ محادثة</span>
          </button>
          <button class="action-btn reports" (click)="navigate('/smart-notebook/reports')">
            <span class="action-icon">📊</span>
            <span class="action-label">إنشاء تقرير</span>
          </button>
          <button class="action-btn tasks" (click)="navigate('/smart-notebook/tasks')">
            <span class="action-icon">✅</span>
            <span class="action-label">إضافة مهمة</span>
          </button>
          <button class="action-btn search" (click)="navigate('/smart-notebook/search')">
            <span class="action-icon">🔍</span>
            <span class="action-label">البحث الشامل</span>
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity">
        <h2>🕐 النشاط الأخير</h2>
        <div class="activity-list">
          <div class="activity-item" *ngFor="let activity of recentActivity">
            <div class="activity-icon">{{ activity.icon }}</div>
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
            <div class="activity-type">{{ activity.type }}</div>
          </div>
        </div>
      </div>

      <!-- System Info -->
      <div class="system-info">
        <div class="info-card">
          <h3>📈 الإحصائيات العامة</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">إجمالي العناصر</span>
              <span class="info-value">{{ getTotalItems() }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">العناصر النشطة</span>
              <span class="info-value">{{ getActiveItems() }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">معدل الإنجاز</span>
              <span class="info-value">{{ getCompletionRate() }}%</span>
            </div>
          </div>
        </div>

        <div class="info-card">
          <h3>🎯 التوصيات</h3>
          <ul class="recommendations">
            <li *ngIf="stats.ideas.new > 5">لديك {{ stats.ideas.new }} أفكار جديدة تحتاج مراجعة</li>
            <li *ngIf="stats.tasks.pending > 10">لديك {{ stats.tasks.pending }} مهمة قيد الانتظار</li>
            <li *ngIf="stats.reports.draft > 3">لديك {{ stats.reports.draft }} تقارير مسودة يمكن نشرها</li>
            <li *ngIf="getActiveItems() === 0">ابدأ بإضافة محتوى جديد!</li>
          </ul>
        </div>
      </div>

      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>جاري التحميل...</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      color: #6b7280;
      font-size: 1.125rem;
    }

    .stats-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-top: 4px solid;
    }

    .stat-card.ideas { border-top-color: #ef4444; }
    .stat-card.chats { border-top-color: #3b82f6; }
    .stat-card.reports { border-top-color: #10b981; }
    .stat-card.tasks { border-top-color: #f59e0b; }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .stat-header h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    .btn-view {
      padding: 0.5rem 1rem;
      background: #f3f4f6;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-view:hover {
      background: #e5e7eb;
    }

    .stat-numbers {
      text-align: center;
    }

    .main-number {
      font-size: 3rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .sub-stats {
      display: flex;
      justify-content: center;
      gap: 1rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .quick-actions {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .quick-actions h2 {
      margin: 0 0 1rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1.5rem;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .action-btn.ideas:hover { border-color: #ef4444; }
    .action-btn.chats:hover { border-color: #3b82f6; }
    .action-btn.reports:hover { border-color: #10b981; }
    .action-btn.tasks:hover { border-color: #f59e0b; }

    .action-icon {
      font-size: 2.5rem;
    }

    .action-label {
      font-weight: 600;
      color: #1f2937;
    }

    .recent-activity {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .recent-activity h2 {
      margin: 0 0 1rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }

    .activity-list {
      display: grid;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 8px;
    }

    .activity-icon {
      font-size: 2rem;
    }

    .activity-content {
      flex: 1;
    }

    .activity-title {
      font-weight: 500;
      color: #1f2937;
    }

    .activity-time {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .activity-type {
      padding: 0.25rem 0.75rem;
      background: #dbeafe;
      color: #1e40af;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .system-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .info-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .info-card h3 {
      margin: 0 0 1rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    .info-grid {
      display: grid;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: #f9fafb;
      border-radius: 8px;
    }

    .info-label {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .info-value {
      font-weight: 700;
      color: #1f2937;
      font-size: 1.25rem;
    }

    .recommendations {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .recommendations li {
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      background: #fef3c7;
      border-right: 4px solid #f59e0b;
      border-radius: 8px;
      color: #92400e;
      font-size: 0.875rem;
    }

    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #e5e7eb;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .dashboard-header h1 {
        font-size: 1.75rem;
      }

      .stats-overview {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr 1fr;
      }

      .system-info {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SmartDashboardComponent implements OnInit {
  loading = false;
  
  stats: DashboardStats = {
    ideas: { total: 0, new: 0, converted: 0 },
    chats: { total: 0, favorite: 0, today: 0 },
    reports: { total: 0, published: 0, draft: 0 },
    tasks: { total: 0, pending: 0, inProgress: 0, completed: 0 }
  };

  recentActivity = [
    { icon: '💡', title: 'فكرة جديدة: تحسين نظام الخرائط', time: 'منذ ساعة', type: 'فكرة' },
    { icon: '💬', title: 'محادثة محفوظة: نقاش حول التطوير', time: 'منذ ساعتين', type: 'محادثة' },
    { icon: '✅', title: 'مهمة مكتملة: تحديث التوثيق', time: 'منذ 3 ساعات', type: 'مهمة' },
    { icon: '📊', title: 'تقرير منشور: تقرير الأداء الشهري', time: 'منذ 5 ساعات', type: 'تقرير' }
  ];

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardStats();
  }

  loadDashboardStats() {
    this.loading = true;
    
    // Load all stats in parallel
    Promise.all([
      this.http.get<any[]>(`${this.apiUrl}/api/smart-notebook/ideas`).toPromise(),
      this.http.get<any[]>(`${this.apiUrl}/api/smart-notebook/chat-logs`).toPromise(),
      this.http.get<any[]>(`${this.apiUrl}/api/smart-notebook/reports`).toPromise(),
      this.http.get<any[]>(`${this.apiUrl}/api/smart-notebook/tasks`).toPromise()
    ]).then(([ideas, chats, reports, tasks]) => {
      // Process ideas
      this.stats.ideas.total = ideas?.length || 0;
      this.stats.ideas.new = ideas?.filter((i: any) => i.status === 'NEW').length || 0;
      this.stats.ideas.converted = ideas?.filter((i: any) => i.status === 'CONVERTED').length || 0;

      // Process chats
      this.stats.chats.total = chats?.length || 0;
      this.stats.chats.favorite = chats?.filter((c: any) => c.isFavorite).length || 0;
      const today = new Date().toDateString();
      this.stats.chats.today = chats?.filter((c: any) => 
        new Date(c.createdAt).toDateString() === today
      ).length || 0;

      // Process reports
      this.stats.reports.total = reports?.length || 0;
      this.stats.reports.published = reports?.filter((r: any) => r.isPublished).length || 0;
      this.stats.reports.draft = reports?.filter((r: any) => !r.isPublished).length || 0;

      // Process tasks
      this.stats.tasks.total = tasks?.length || 0;
      this.stats.tasks.pending = tasks?.filter((t: any) => t.status === 'PENDING').length || 0;
      this.stats.tasks.inProgress = tasks?.filter((t: any) => t.status === 'IN_PROGRESS').length || 0;
      this.stats.tasks.completed = tasks?.filter((t: any) => t.status === 'COMPLETED').length || 0;

      this.loading = false;
    }).catch(error => {
      console.error('Error loading dashboard stats:', error);
      this.loading = false;
    });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  getTotalItems(): number {
    return this.stats.ideas.total + this.stats.chats.total + 
           this.stats.reports.total + this.stats.tasks.total;
  }

  getActiveItems(): number {
    return this.stats.ideas.new + this.stats.tasks.pending + 
           this.stats.tasks.inProgress + this.stats.reports.draft;
  }

  getCompletionRate(): number {
    const total = this.stats.tasks.total;
    if (total === 0) return 0;
    return Math.round((this.stats.tasks.completed / total) * 100);
  }
}
