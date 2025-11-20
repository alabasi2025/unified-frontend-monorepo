import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Error getting from localStorage', e);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage', e);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Error clearing localStorage', e);
    }
  }

  setSession(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch (e) {
      console.error('Error saving to sessionStorage', e);
    }
  }

  getSession(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      console.error('Error getting from sessionStorage', e);
      return null;
    }
  }

  removeSession(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from sessionStorage', e);
    }
  }

  clearSession(): void {
    try {
      sessionStorage.clear();
    } catch (e) {
      console.error('Error clearing sessionStorage', e);
    }
  }
}
