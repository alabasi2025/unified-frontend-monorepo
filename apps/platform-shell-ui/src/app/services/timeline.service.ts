import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TimelineEvent {
  id: string;
  type: 'conversation' | 'idea' | 'task' | 'page' | 'note';
  title: string;
  description: string;
  userId: string;
  userName: string;
  entityId: string;
  createdAt: Date;
  metadata?: any;
}

export interface TimelineFilters {
  type?: string;
  period?: 'today' | 'week' | 'month' | 'all';
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  private apiUrl = `${environment.apiUrl}/smart-notebook/timeline`;

  constructor(private http: HttpClient) {}

  getEvents(filters?: TimelineFilters): Observable<{ data: TimelineEvent[], total: number }> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            params = params.set(key, value.toISOString());
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }
    return this.http.get<{ data: TimelineEvent[], total: number }>(this.apiUrl, { params });
  }

  getEventById(id: string): Observable<TimelineEvent> {
    return this.http.get<TimelineEvent>(`${this.apiUrl}/${id}`);
  }

  getStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics`);
  }
}
