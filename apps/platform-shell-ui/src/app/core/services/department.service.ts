import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface Department {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  parentDepartmentId?: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class DepartmentService extends BaseCrudService<Department> {
  protected endpoint = '/departments';
  constructor(api: ApiService) { super(api); }
}
