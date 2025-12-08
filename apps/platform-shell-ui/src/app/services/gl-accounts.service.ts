/**
 * PHASE: Sprint 1 - GL Foundation
 * Date: 2025-12-08
 * Author: Manus AI
 * Description: Frontend service for GL Accounts
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateAccountDto,
  UpdateAccountDto,
  AccountResponseDto,
  AccountTreeNodeDto,
} from '@semop/contracts';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GlAccountsService {
  private readonly apiUrl = `${environment.apiUrl}/accounting/gl-accounts`;

  constructor(private http: HttpClient) {}

  create(dto: CreateAccountDto): Observable<AccountResponseDto> {
    return this.http.post<AccountResponseDto>(this.apiUrl, dto);
  }

  findAll(): Observable<AccountResponseDto[]> {
    return this.http.get<AccountResponseDto[]>(this.apiUrl);
  }

  getTree(): Observable<AccountTreeNodeDto[]> {
    return this.http.get<AccountTreeNodeDto[]>(`${this.apiUrl}/tree`);
  }

  search(query: string): Observable<AccountResponseDto[]> {
    return this.http.get<AccountResponseDto[]>(`${this.apiUrl}/search`, {
      params: { q: query },
    });
  }

  findOne(id: string): Observable<AccountResponseDto> {
    return this.http.get<AccountResponseDto>(`${this.apiUrl}/${id}`);
  }

  update(id: string, dto: UpdateAccountDto): Observable<AccountResponseDto> {
    return this.http.put<AccountResponseDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
