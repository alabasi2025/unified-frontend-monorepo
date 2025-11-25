import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Notebook {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  status: string;
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string;
  sectionsCount?: number;
  pagesCount?: number;
}

export interface CreateNotebookDto {
  title: string;
  description?: string;
  parentId?: string;
}

export interface UpdateNotebookDto {
  title?: string;
  description?: string;
  status?: string;
  isShared?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotebookService {
  private apiUrl = `${environment.apiUrl}/smart-notebook/notebooks`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Notebook[]> {
    return this.http.get<Notebook[]>(this.apiUrl);
  }

  getById(id: string): Observable<Notebook> {
    return this.http.get<Notebook>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateNotebookDto): Observable<Notebook> {
    return this.http.post<Notebook>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateNotebookDto): Observable<Notebook> {
    return this.http.patch<Notebook>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getChildren(parentId: string): Observable<Notebook[]> {
    return this.http.get<Notebook[]>(`${this.apiUrl}/${parentId}/children`);
  }
}
