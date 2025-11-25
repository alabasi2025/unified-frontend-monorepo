import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notebook {
  id: string;
  title: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  title: string;
  notebookId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: string;
  title: string;
  content: string;
  sectionId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotebookService {
  private apiUrl = 'http://72.61.111.217:3000/api/smart-notebook';

  constructor(private http: HttpClient) {}

  // Notebooks
  getNotebooks(): Observable<Notebook[]> {
    return this.http.get<Notebook[]>(`${this.apiUrl}/notebooks`);
  }

  getNotebook(id: string): Observable<Notebook> {
    return this.http.get<Notebook>(`${this.apiUrl}/notebooks/${id}`);
  }

  createNotebook(data: { title: string; description?: string }): Observable<Notebook> {
    return this.http.post<Notebook>(`${this.apiUrl}/notebooks`, data);
  }

  updateNotebook(id: string, data: { title?: string; description?: string }): Observable<Notebook> {
    return this.http.patch<Notebook>(`${this.apiUrl}/notebooks/${id}`, data);
  }

  deleteNotebook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/notebooks/${id}`);
  }

  // Sections
  getSections(notebookId: string): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.apiUrl}/sections?notebookId=${notebookId}`);
  }

  createSection(data: { title: string; notebookId: string }): Observable<Section> {
    return this.http.post<Section>(`${this.apiUrl}/sections`, data);
  }

  // Pages
  getPages(sectionId: string): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.apiUrl}/pages?sectionId=${sectionId}`);
  }

  createPage(data: { title: string; content: string; sectionId: string }): Observable<Page> {
    return this.http.post<Page>(`${this.apiUrl}/pages`, data);
  }
}
