import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface Supplier {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  categoryId: string;
  taxNumber?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class SupplierService extends BaseCrudService<Supplier> {
  protected endpoint = '/suppliers';
  constructor(api: ApiService) { super(api); }
}
