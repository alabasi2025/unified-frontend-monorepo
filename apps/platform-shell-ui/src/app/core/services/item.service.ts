import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCrudService } from './base-crud.service';
import { ApiService } from './api.service';

export interface Item {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  type: string;
  categoryId: string;
  unitOfMeasure: string;
  costPrice?: number;
  sellingPrice?: number;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class ItemService extends BaseCrudService<Item> {
  protected endpoint = '/items';
  
  constructor(api: ApiService) { super(api); }

  getStock(id: string): Observable<any> {
    return this.api.get(`${this.endpoint}/${id}/stock`);
  }
}
