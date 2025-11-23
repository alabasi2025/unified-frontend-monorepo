import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NotebookPage {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  sharedWith?: string[];
  version?: number;
}

export interface PageFilters {
  search?: string;
  tags?: string[];
  isPinned?: boolean;
  isArchived?: boolean;
  userId?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotebookPagesService {
  private apiUrl = `${environment.apiUrl}/smart-notebook/pages`;

  constructor(private http: HttpClient) {}

  getPages(filters?: PageFilters): Observable<{ data: NotebookPage[], total: number }> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = (filters as any)[key];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params = params.set(key, value.join(','));
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }
    return this.http.get<{ data: NotebookPage[], total: number }>(this.apiUrl, { params });
  }

  getPageById(id: string): Observable<NotebookPage> {
    return this.http.get<NotebookPage>(`${this.apiUrl}/${id}`);
  }

  createPage(page: Partial<NotebookPage>): Observable<NotebookPage> {
    return this.http.post<NotebookPage>(this.apiUrl, page);
  }

  updatePage(id: string, page: Partial<NotebookPage>): Observable<NotebookPage> {
    return this.http.put<NotebookPage>(`${this.apiUrl}/${id}`, page);
  }

  deletePage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  pinPage(id: string): Observable<NotebookPage> {
    return this.http.patch<NotebookPage>(`${this.apiUrl}/${id}/pin`, {});
  }

  unpinPage(id: string): Observable<NotebookPage> {
    return this.http.patch<NotebookPage>(`${this.apiUrl}/${id}/unpin`, {});
  }

  archivePage(id: string): Observable<NotebookPage> {
    return this.http.patch<NotebookPage>(`${this.apiUrl}/${id}/archive`, {});
  }

  unarchivePage(id: string): Observable<NotebookPage> {
    return this.http.patch<NotebookPage>(`${this.apiUrl}/${id}/unarchive`, {});
  }

  sharePage(id: string, userIds: string[]): Observable<NotebookPage> {
    return this.http.post<NotebookPage>(`${this.apiUrl}/${id}/share`, { userIds });
  }

  exportPage(id: string, format: 'pdf' | 'word' | 'markdown'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/export/${format}`, { responseType: 'blob' });
  }
}
