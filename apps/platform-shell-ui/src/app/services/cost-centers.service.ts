/**
 * PHASE: Sprint 1 - GL Foundation
 * Date: 2025-12-08
 * Author: Manus AI
 * Description: Frontend service for Cost Centers
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateCostCenterDto,
  UpdateCostCenterDto,
  CostCenterResponseDto,
} from '@semop/contracts';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CostCentersService {
  private readonly apiUrl = `${environment.apiUrl}/accounting/cost-centers`;

  constructor(private http: HttpClient) {}

  create(dto: CreateCostCenterDto): Observable<CostCenterResponseDto> {
    return this.http.post<CostCenterResponseDto>(this.apiUrl, dto);
  }

  findAll(): Observable<CostCenterResponseDto[]> {
    return this.http.get<CostCenterResponseDto[]>(this.apiUrl);
  }

  findOne(id: string): Observable<CostCenterResponseDto> {
    return this.http.get<CostCenterResponseDto>(`${this.apiUrl}/${id}`);
  }

  update(id: string, dto: UpdateCostCenterDto): Observable<CostCenterResponseDto> {
    return this.http.put<CostCenterResponseDto>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
