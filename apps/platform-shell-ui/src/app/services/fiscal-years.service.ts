/**
 * PHASE: Sprint 1 - GL Foundation
 * Date: 2025-12-08
 * Author: Manus AI
 * Description: Frontend service for Fiscal Years
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateFiscalYearDto,
  UpdateFiscalYearDto,
  FiscalYearResponseDto,
} from '@semop/contracts';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FiscalYearsService {
  private readonly apiUrl = `${environment.apiUrl}/accounting/fiscal-years`;

  constructor(private http: HttpClient) {}

  create(dto: CreateFiscalYearDto): Observable<FiscalYearResponseDto> {
    return this.http.post<FiscalYearResponseDto>(this.apiUrl, dto);
  }

  findAll(): Observable<FiscalYearResponseDto[]> {
    return this.http.get<FiscalYearResponseDto[]>(this.apiUrl);
  }

  findOne(id: string): Observable<FiscalYearResponseDto> {
    return this.http.get<FiscalYearResponseDto>(`${this.apiUrl}/${id}`);
  }

  update(id: string, dto: UpdateFiscalYearDto): Observable<FiscalYearResponseDto> {
    return this.http.put<FiscalYearResponseDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
