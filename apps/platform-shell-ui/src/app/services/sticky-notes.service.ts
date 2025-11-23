import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StickyNote {
  id: string;
  content: string;
  color: string;
  position?: { x: number, y: number };
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteFilters {
  search?: string;
  color?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StickyNotesService {
  private apiUrl = `${environment.apiUrl}/smart-notebook/sticky-notes`;

  constructor(private http: HttpClient) {}

  getNotes(filters?: NoteFilters): Observable<{ data: StickyNote[], total: number }> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<{ data: StickyNote[], total: number }>(this.apiUrl, { params });
  }

  getNoteById(id: string): Observable<StickyNote> {
    return this.http.get<StickyNote>(`${this.apiUrl}/${id}`);
  }

  createNote(note: Partial<StickyNote>): Observable<StickyNote> {
    return this.http.post<StickyNote>(this.apiUrl, note);
  }

  updateNote(id: string, note: Partial<StickyNote>): Observable<StickyNote> {
    return this.http.put<StickyNote>(`${this.apiUrl}/${id}`, note);
  }

  deleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updatePosition(id: string, position: { x: number, y: number }): Observable<StickyNote> {
    return this.http.patch<StickyNote>(`${this.apiUrl}/${id}/position`, { position });
  }
}
