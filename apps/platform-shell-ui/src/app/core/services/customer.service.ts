import { Injectable } from '@angular/core';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface Customer {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  categoryId: string;
  taxNumber?: string;
  phone?: string;
  email?: string;
  creditLimit?: number;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class CustomerService extends BaseCrudService<Customer> {
  protected endpoint = '/customers';
  constructor(api: ApiService) { super(api); }
}
