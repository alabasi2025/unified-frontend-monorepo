import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail?: string;
  life?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notification$ = this.notificationSubject.asObservable();

  success(summary: string, detail?: string, life: number = 3000): void {
    this.show({ severity: 'success', summary, detail, life });
  }

  info(summary: string, detail?: string, life: number = 3000): void {
    this.show({ severity: 'info', summary, detail, life });
  }

  warn(summary: string, detail?: string, life: number = 3000): void {
    this.show({ severity: 'warn', summary, detail, life });
  }

  error(summary: string, detail?: string, life: number = 5000): void {
    this.show({ severity: 'error', summary, detail, life });
  }

  private show(notification: Notification): void {
    this.notificationSubject.next(notification);
  }
}
