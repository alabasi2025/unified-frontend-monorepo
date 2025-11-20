import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  roles: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private endpoint = '/users';

  constructor(private api: ApiService) {}

  getAll(params?: any): Observable<User[]> {
    return this.api.get<User[]>(this.endpoint, { params });
  }

  getById(id: string): Observable<User> {
    return this.api.get<User>(`${this.endpoint}/${id}`);
  }

  create(data: any): Observable<User> {
    return this.api.post<User>(this.endpoint, data);
  }

  update(id: string, data: any): Observable<User> {
    return this.api.put<User>(`${this.endpoint}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  changePassword(id: string, oldPassword: string, newPassword: string): Observable<void> {
    return this.api.post<void>(`${this.endpoint}/${id}/change-password`, {
      oldPassword,
      newPassword
    });
  }

  resetPassword(id: string, newPassword: string): Observable<void> {
    return this.api.post<void>(`${this.endpoint}/${id}/reset-password`, {
      newPassword
    });
  }
}
