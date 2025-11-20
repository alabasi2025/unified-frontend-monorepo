import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export abstract class BaseCrudService<T> {
  protected abstract endpoint: string;

  constructor(protected api: ApiService) {}

  getAll(params?: any): Observable<T[]> {
    return this.api.get<T[]>(this.endpoint, { params });
  }

  getPaginated(page: number, pageSize: number, params?: any): Observable<PaginatedResponse<T>> {
    return this.api.get<PaginatedResponse<T>>(this.endpoint, {
      params: { ...params, page, pageSize }
    });
  }

  getById(id: string): Observable<T> {
    return this.api.get<T>(`${this.endpoint}/${id}`);
  }

  create(data: Partial<T>): Observable<T> {
    return this.api.post<T>(this.endpoint, data);
  }

  update(id: string, data: Partial<T>): Observable<T> {
    return this.api.put<T>(`${this.endpoint}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  count(params?: any): Observable<number> {
    return this.api.get<number>(`${this.endpoint}/count`, { params });
  }
}
