import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface CostCenter {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  parentCostCenterId?: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class CostCenterService extends BaseCrudService<CostCenter> {
  protected endpoint = '/cost-centers';
  constructor(api: ApiService) { super(api); }
}
