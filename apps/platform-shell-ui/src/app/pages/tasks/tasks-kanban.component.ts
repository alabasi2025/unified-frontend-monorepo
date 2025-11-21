import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  assigneeAvatar?: string;
  dueDate: Date;
  progress: number;
  tags: string[];
}

@Component({
  selector: 'app-tasks-kanban',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    ProgressBarModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <div class="kanban-container">
      <p-toast></p-toast>

      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="pi pi-th-large"></i>
          </div>
          <div class="header-text">
            <h1>لوحة كانبان</h1>
            <p>إدارة المهام بطريقة مرئية</p>
          </div>
        </div>
        <div class="header-actions">
          <button
            pButton
            label="عرض القائمة"
            icon="pi pi-list"
            class="p-button-outlined"
            routerLink="/tasks"
          ></button>
        </div>
      </div>

      <!-- Kanban Board -->
      <div class="kanban-board">
        <!-- TODO Column -->
        <div class="kanban-column todo">
          <div class="column-header">
            <h3>
              <i class="pi pi-circle"></i>
              قيد الانتظار
            </h3>
            <span class="task-count">{{ getTasks('todo').length }}</span>
          </div>
          <div class="column-content">
            <div
              *ngFor="let task of getTasks('todo')"
              class="task-card"
              [class.priority-urgent]="task.priority === 'urgent'"
              [class.priority-high]="task.priority === 'high'"
            >
              <div class="task-header">
                <h4>{{ task.title }}</h4>
                <p-tag
                  [value]="getPriorityLabel(task.priority)"
                  [severity]="getPrioritySeverity(task.priority)"
                  styleClass="task-priority"
                ></p-tag>
              </div>

              <p class="task-description">{{ task.description }}</p>

              <div class="task-tags">
                <span *ngFor="let tag of task.tags" class="tag">{{ tag }}</span>
              </div>

              <div class="task-progress">
                <p-progressBar
                  [value]="task.progress"
                  [showValue]="false"
                ></p-progressBar>
                <span class="progress-text">{{ task.progress }}%</span>
              </div>

              <div class="task-footer">
                <div class="assignee">
                  <p-avatar
                    [label]="task.assigneeAvatar"
                    shape="circle"
                    size="small"
                    [style]="{
                      'background-color': '#667eea',
                      color: '#fff',
                      'font-size': '0.75rem'
                    }"
                  ></p-avatar>
                  <span>{{ task.assignee }}</span>
                </div>
                <div class="due-date" [class.overdue]="isOverdue(task.dueDate)">
                  <i class="pi pi-calendar"></i>
                  <span>{{ task.dueDate | date : 'short' }}</span>
                </div>
              </div>

              <div class="task-actions">
                <button
                  pButton
                  icon="pi pi-arrow-left"
                  class="p-button-rounded p-button-text p-button-sm"
                  (click)="moveTask(task, 'in-progress')"
                  pTooltip="نقل إلى قيد التنفيذ"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <!-- IN PROGRESS Column -->
        <div class="kanban-column in-progress">
          <div class="column-header">
            <h3>
              <i class="pi pi-play"></i>
              قيد التنفيذ
            </h3>
            <span class="task-count">{{ getTasks('in-progress').length }}</span>
          </div>
          <div class="column-content">
            <div
              *ngFor="let task of getTasks('in-progress')"
              class="task-card"
              [class.priority-urgent]="task.priority === 'urgent'"
              [class.priority-high]="task.priority === 'high'"
            >
              <div class="task-header">
                <h4>{{ task.title }}</h4>
                <p-tag
                  [value]="getPriorityLabel(task.priority)"
                  [severity]="getPrioritySeverity(task.priority)"
                  styleClass="task-priority"
                ></p-tag>
              </div>

              <p class="task-description">{{ task.description }}</p>

              <div class="task-tags">
                <span *ngFor="let tag of task.tags" class="tag">{{ tag }}</span>
              </div>

              <div class="task-progress">
                <p-progressBar
                  [value]="task.progress"
                  [showValue]="false"
                ></p-progressBar>
                <span class="progress-text">{{ task.progress }}%</span>
              </div>

              <div class="task-footer">
                <div class="assignee">
                  <p-avatar
                    [label]="task.assigneeAvatar"
                    shape="circle"
                    size="small"
                    [style]="{
                      'background-color': '#667eea',
                      color: '#fff',
                      'font-size': '0.75rem'
                    }"
                  ></p-avatar>
                  <span>{{ task.assignee }}</span>
                </div>
                <div class="due-date" [class.overdue]="isOverdue(task.dueDate)">
                  <i class="pi pi-calendar"></i>
                  <span>{{ task.dueDate | date : 'short' }}</span>
                </div>
              </div>

              <div class="task-actions">
                <button
                  pButton
                  icon="pi pi-arrow-right"
                  class="p-button-rounded p-button-text p-button-sm"
                  (click)="moveTask(task, 'todo')"
                  pTooltip="إرجاع إلى الانتظار"
                ></button>
                <button
                  pButton
                  icon="pi pi-arrow-left"
                  class="p-button-rounded p-button-text p-button-sm"
                  (click)="moveTask(task, 'review')"
                  pTooltip="نقل إلى المراجعة"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <!-- REVIEW Column -->
        <div class="kanban-column review">
          <div class="column-header">
            <h3>
              <i class="pi pi-eye"></i>
              قيد المراجعة
            </h3>
            <span class="task-count">{{ getTasks('review').length }}</span>
          </div>
          <div class="column-content">
            <div
              *ngFor="let task of getTasks('review')"
              class="task-card"
              [class.priority-urgent]="task.priority === 'urgent'"
              [class.priority-high]="task.priority === 'high'"
            >
              <div class="task-header">
                <h4>{{ task.title }}</h4>
                <p-tag
                  [value]="getPriorityLabel(task.priority)"
                  [severity]="getPrioritySeverity(task.priority)"
                  styleClass="task-priority"
                ></p-tag>
              </div>

              <p class="task-description">{{ task.description }}</p>

              <div class="task-tags">
                <span *ngFor="let tag of task.tags" class="tag">{{ tag }}</span>
              </div>

              <div class="task-progress">
                <p-progressBar
                  [value]="task.progress"
                  [showValue]="false"
                ></p-progressBar>
                <span class="progress-text">{{ task.progress }}%</span>
              </div>

              <div class="task-footer">
                <div class="assignee">
                  <p-avatar
                    [label]="task.assigneeAvatar"
                    shape="circle"
                    size="small"
                    [style]="{
                      'background-color': '#667eea',
                      color: '#fff',
                      'font-size': '0.75rem'
                    }"
                  ></p-avatar>
                  <span>{{ task.assignee }}</span>
                </div>
                <div class="due-date" [class.overdue]="isOverdue(task.dueDate)">
                  <i class="pi pi-calendar"></i>
                  <span>{{ task.dueDate | date : 'short' }}</span>
                </div>
              </div>

              <div class="task-actions">
                <button
                  pButton
                  icon="pi pi-arrow-right"
                  class="p-button-rounded p-button-text p-button-sm"
                  (click)="moveTask(task, 'in-progress')"
                  pTooltip="إرجاع إلى التنفيذ"
                ></button>
                <button
                  pButton
                  icon="pi pi-check"
                  class="p-button-rounded p-button-text p-button-success p-button-sm"
                  (click)="moveTask(task, 'done')"
                  pTooltip="إكمال المهمة"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <!-- DONE Column -->
        <div class="kanban-column done">
          <div class="column-header">
            <h3>
              <i class="pi pi-check"></i>
              مكتملة
            </h3>
            <span class="task-count">{{ getTasks('done').length }}</span>
          </div>
          <div class="column-content">
            <div *ngFor="let task of getTasks('done')" class="task-card completed">
              <div class="task-header">
                <h4>{{ task.title }}</h4>
                <i class="pi pi-check-circle completion-icon"></i>
              </div>

              <p class="task-description">{{ task.description }}</p>

              <div class="task-tags">
                <span *ngFor="let tag of task.tags" class="tag">{{ tag }}</span>
              </div>

              <div class="task-footer">
                <div class="assignee">
                  <p-avatar
                    [label]="task.assigneeAvatar"
                    shape="circle"
                    size="small"
                    [style]="{
                      'background-color': '#43e97b',
                      color: '#fff',
                      'font-size': '0.75rem'
                    }"
                  ></p-avatar>
                  <span>{{ task.assignee }}</span>
                </div>
                <div class="completion-badge">
                  <i class="pi pi-check"></i>
                  <span>100%</span>
                </div>
              </div>

              <div class="task-actions">
                <button
                  pButton
                  icon="pi pi-arrow-right"
                  class="p-button-rounded p-button-text p-button-sm"
                  (click)="moveTask(task, 'review')"
                  pTooltip="إرجاع إلى المراجعة"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .kanban-container {
        padding: 2rem;
        background: #f5f5f5;
        min-height: 100vh;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .header-content {
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .header-icon {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
      }

      .header-text h1 {
        margin: 0;
        font-size: 1.75rem;
        color: #333;
      }

      .header-text p {
        margin: 0.25rem 0 0 0;
        color: #666;
      }

      .kanban-board {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        direction: rtl;
      }

      .kanban-column {
        background: #f8f9fa;
        border-radius: 12px;
        padding: 1rem;
        min-height: 600px;
      }

      .column-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
      }

      .column-header h3 {
        margin: 0;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .kanban-column.todo .column-header {
        border-right: 4px solid #ffd89b;
      }

      .kanban-column.in-progress .column-header {
        border-right: 4px solid #4facfe;
      }

      .kanban-column.review .column-header {
        border-right: 4px solid #a8a8a8;
      }

      .kanban-column.done .column-header {
        border-right: 4px solid #43e97b;
      }

      .task-count {
        background: #667eea;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 600;
      }

      .column-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .task-card {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
        cursor: pointer;
        position: relative;
      }

      .task-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .task-card.priority-urgent {
        border-right: 3px solid #f44336;
      }

      .task-card.priority-high {
        border-right: 3px solid #ff9800;
      }

      .task-card.completed {
        opacity: 0.8;
      }

      .task-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.75rem;
      }

      .task-header h4 {
        margin: 0;
        font-size: 1rem;
        color: #333;
        flex: 1;
      }

      .completion-icon {
        color: #43e97b;
        font-size: 1.25rem;
      }

      .task-description {
        margin: 0 0 0.75rem 0;
        color: #666;
        font-size: 0.875rem;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .task-tags {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 0.75rem;
      }

      .tag {
        background: #e3f2fd;
        color: #1976d2;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
      }

      .task-progress {
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .task-progress :host ::ng-deep .p-progressbar {
        flex: 1;
        height: 6px;
      }

      .progress-text {
        font-size: 0.75rem;
        color: #666;
        font-weight: 600;
        min-width: 40px;
      }

      .task-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 0.75rem;
        border-top: 1px solid #eee;
      }

      .assignee {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: #666;
      }

      .due-date {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.75rem;
        color: #999;
      }

      .due-date.overdue {
        color: #f44336;
        font-weight: 600;
      }

      .completion-badge {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: #43e97b;
        font-size: 0.875rem;
        font-weight: 600;
      }

      .task-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid #eee;
      }

      @media (max-width: 1400px) {
        .kanban-board {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 768px) {
        .kanban-board {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class TasksKanbanComponent implements OnInit {
  tasks: Task[] = [];

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.http.get<Task[]>('/api/tasks').subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تحميل المهام',
        });
      },
    });
  }

  getTasks(status: string): Task[] {
    return this.tasks.filter((task) => task.status === status);
  }

  moveTask(task: Task, newStatus: string) {
    this.http
      .patch(`/api/tasks/${task.id}`, { status: newStatus })
      .subscribe({
        next: () => {
          task.status = newStatus as any;
          this.messageService.add({
            severity: 'success',
            summary: 'نجح',
            detail: 'تم نقل المهمة بنجاح',
          });
        },
        error: (error) => {
          console.error('Error moving task:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل نقل المهمة',
          });
        },
      });
  }

  getPriorityLabel(priority: string): string {
    const labels: any = {
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية',
      urgent: 'عاجلة',
    };
    return labels[priority] || priority;
  }

  getPrioritySeverity(priority: string): string {
    const severities: any = {
      low: 'success',
      medium: 'info',
      high: 'warning',
      urgent: 'danger',
    };
    return severities[priority] || 'info';
  }

  isOverdue(dueDate: Date): boolean {
    return new Date(dueDate) < new Date();
  }
}
