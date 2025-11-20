import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: any;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService
  ) {
    this.checkAuthStatus();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        this.setSession(response);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    this.storage.remove('accessToken');
    this.storage.remove('refreshToken');
    this.storage.remove('user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.storage.get('refreshToken');
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  getAccessToken(): string | null {
    return this.storage.get('accessToken');
  }

  getRefreshToken(): string | null {
    return this.storage.get('refreshToken');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions?.includes(permission) || false;
  }

  private setSession(authResult: LoginResponse): void {
    this.storage.set('accessToken', authResult.accessToken);
    this.storage.set('refreshToken', authResult.refreshToken);
    this.storage.set('user', JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
  }

  private checkAuthStatus(): void {
    const token = this.getAccessToken();
    const userStr = this.storage.get('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (e) {
        this.logout();
      }
    }
  }
}
