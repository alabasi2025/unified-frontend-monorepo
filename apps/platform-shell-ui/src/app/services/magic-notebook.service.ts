import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MagicNotebookService {
  private apiUrl = 'http://72.61.111.217:3000/api/magic-notebook';

  constructor(private http: HttpClient) {}

  // Notebooks
  getNotebooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notebooks`);
  }

  createNotebook(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/notebooks`, data);
  }

  updateNotebook(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/notebooks/${id}`, data);
  }

  deleteNotebook(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notebooks/${id}`);
  }

  // Sections
  getSections(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sections`);
  }

  // Pages
  getPages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pages`);
  }

  // Chat Logs
  getChatLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/chat-logs`);
  }

  // Ideas
  getIdeas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ideas`);
  }

  // Tasks
  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tasks`);
  }

  // Reports
  getReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reports`);
  }

  // Archive
  getArchive(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/archive`);
  }

  // Timeline
  getTimeline(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/timeline`);
  }

  // Sticky Notes
  getStickyNotes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sticky-notes`);
  }
}
