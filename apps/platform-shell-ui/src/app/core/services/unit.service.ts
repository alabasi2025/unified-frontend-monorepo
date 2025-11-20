import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface Unit {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  type: string;
  holdingId: string;
  parentUnitId?: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class UnitService extends BaseCrudService<Unit> {
  protected endpoint = '/units';
  constructor(api: ApiService) { super(api); }
}
