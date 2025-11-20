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

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UserPreferences {
  language?: string;
  theme?: string;
  notifications?: boolean;
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

  register(data: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap(response => {
        this.setSession(response);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/reset-password`, { token, password });
  }

  updateProfile(data: UpdateProfileRequest): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/auth/profile`, data).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        this.storage.set('user', JSON.stringify(user));
      })
    );
  }

  changePassword(data: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/change-password`, data);
  }

  updatePreferences(preferences: UserPreferences): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/auth/preferences`, preferences);
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
