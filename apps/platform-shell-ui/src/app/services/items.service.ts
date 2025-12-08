import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Item {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private apiUrl = `${environment.apiUrl}/items`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }

  getById(id: string): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`);
  }

  search(term: string): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/search?term=${term}`);
  }
}
