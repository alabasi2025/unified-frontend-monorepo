import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface Warehouse {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  location?: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class WarehouseService extends BaseCrudService<Warehouse> {
  protected endpoint = '/warehouses';
  constructor(api: ApiService) { super(api); }
}
