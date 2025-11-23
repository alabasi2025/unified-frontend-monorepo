import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SearchResult {
  id: string;
  type: 'conversation' | 'idea' | 'task' | 'page' | 'note';
  title: string;
  content: string;
  excerpt: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;
}

export interface SearchFilters {
  query: string;
  types?: string[];
  tags?: string[];
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalSearchService {
  private apiUrl = `${environment.apiUrl}/smart-notebook/search`;

  constructor(private http: HttpClient) {}

  search(filters: SearchFilters): Observable<{ data: SearchResult[], total: number }> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      const value = (filters as any)[key];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params = params.set(key, value.join(','));
        } else if (value instanceof Date) {
          params = params.set(key, value.toISOString());
        } else {
          params = params.set(key, value.toString());
        }
      }
    });
    return this.http.get<{ data: SearchResult[], total: number }>(this.apiUrl, { params });
  }

  getSuggestions(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/suggestions`, {
      params: { query }
    });
  }

  getRecentSearches(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/recent`);
  }
}
