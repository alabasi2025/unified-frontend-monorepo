import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  constructor(private storage: StorageService) {}

  setAccessToken(token: string): void {
    this.storage.set(this.ACCESS_TOKEN_KEY, token);
  }

  getAccessToken(): string | null {
    return this.storage.get(this.ACCESS_TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    this.storage.set(this.REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return this.storage.get(this.REFRESH_TOKEN_KEY);
  }

  removeTokens(): void {
    this.storage.remove(this.ACCESS_TOKEN_KEY);
    this.storage.remove(this.REFRESH_TOKEN_KEY);
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload.exp) return true;
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate < new Date();
    } catch (e) {
      return true;
    }
  }

  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }
}
