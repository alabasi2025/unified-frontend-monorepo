import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
  reason?: string;
}

@Injectable({ providedIn: 'root' })
export class LeaveRequestService extends BaseCrudService<LeaveRequest> {
  protected endpoint = '/leave-requests';
  
  constructor(api: ApiService) { super(api); }

  approve(id: string): Observable<LeaveRequest> {
    return this.api.post<LeaveRequest>(`${this.endpoint}/${id}/approve`, {});
  }

  reject(id: string, reason: string): Observable<LeaveRequest> {
    return this.api.post<LeaveRequest>(`${this.endpoint}/${id}/reject`, { reason });
  }
}
