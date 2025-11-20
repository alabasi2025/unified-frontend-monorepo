import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  workingHours?: number;
}

@Injectable({ providedIn: 'root' })
export class AttendanceService extends BaseCrudService<AttendanceRecord> {
  protected endpoint = '/attendance';
  
  constructor(api: ApiService) { super(api); }

  checkIn(employeeId: string): Observable<AttendanceRecord> {
    return this.api.post<AttendanceRecord>(`${this.endpoint}/check-in`, { employeeId });
  }

  checkOut(id: string): Observable<AttendanceRecord> {
    return this.api.post<AttendanceRecord>(`${this.endpoint}/${id}/check-out`, {});
  }
}
