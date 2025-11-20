import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // GET overloads
  get<T>(endpoint: string, options?: ApiRequestOptions): Observable<T>;
  get(endpoint: string, options: { responseType: 'arraybuffer' } & ApiRequestOptions): Observable<ArrayBuffer>;
  get(endpoint: string, options: { responseType: 'blob' } & ApiRequestOptions): Observable<Blob>;
  get(endpoint: string, options: { responseType: 'text' } & ApiRequestOptions): Observable<string>;
  get(endpoint: string, options?: any): Observable<any> {
    return this.http.get(`${this.baseUrl}${endpoint}`, options);
  }

  // POST overloads
  post<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T>;
  post(endpoint: string, body: any, options: { responseType: 'arraybuffer' } & ApiRequestOptions): Observable<ArrayBuffer>;
  post(endpoint: string, body: any, options: { responseType: 'blob' } & ApiRequestOptions): Observable<Blob>;
  post(endpoint: string, body: any, options: { responseType: 'text' } & ApiRequestOptions): Observable<string>;
  post(endpoint: string, body: any, options?: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${endpoint}`, body, options);
  }

  // PUT overloads
  put<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T>;
  put(endpoint: string, body: any, options: { responseType: 'arraybuffer' } & ApiRequestOptions): Observable<ArrayBuffer>;
  put(endpoint: string, body: any, options: { responseType: 'blob' } & ApiRequestOptions): Observable<Blob>;
  put(endpoint: string, body: any, options: { responseType: 'text' } & ApiRequestOptions): Observable<string>;
  put(endpoint: string, body: any, options?: any): Observable<any> {
    return this.http.put(`${this.baseUrl}${endpoint}`, body, options);
  }

  // PATCH overloads
  patch<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T>;
  patch(endpoint: string, body: any, options: { responseType: 'arraybuffer' } & ApiRequestOptions): Observable<ArrayBuffer>;
  patch(endpoint: string, body: any, options: { responseType: 'blob' } & ApiRequestOptions): Observable<Blob>;
  patch(endpoint: string, body: any, options: { responseType: 'text' } & ApiRequestOptions): Observable<string>;
  patch(endpoint: string, body: any, options?: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}${endpoint}`, body, options);
  }

  // DELETE overloads
  delete<T>(endpoint: string, options?: ApiRequestOptions): Observable<T>;
  delete(endpoint: string, options: { responseType: 'arraybuffer' } & ApiRequestOptions): Observable<ArrayBuffer>;
  delete(endpoint: string, options: { responseType: 'blob' } & ApiRequestOptions): Observable<Blob>;
  delete(endpoint: string, options: { responseType: 'text' } & ApiRequestOptions): Observable<string>;
  delete(endpoint: string, options?: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}${endpoint}`, options);
  }
}
