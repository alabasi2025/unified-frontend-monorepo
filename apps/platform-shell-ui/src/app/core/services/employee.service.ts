import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId: string;
  positionId: string;
  hireDate: string;
  status: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class EmployeeService extends BaseCrudService<Employee> {
  protected endpoint = '/employees';
  constructor(api: ApiService) { super(api); }
}
