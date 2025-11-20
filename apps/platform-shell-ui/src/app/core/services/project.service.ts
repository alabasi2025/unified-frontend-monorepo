import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface Project {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  type: string;
  unitId: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProjectService extends BaseCrudService<Project> {
  protected endpoint = '/projects';
  constructor(api: ApiService) { super(api); }
}
