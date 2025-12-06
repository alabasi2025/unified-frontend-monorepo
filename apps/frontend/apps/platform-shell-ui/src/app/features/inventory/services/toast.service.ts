import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  /**
   * TODO: Replace with PrimeNG MessageService.add({ severity: 'success', summary: 'Success', detail: message });
   */
  success(message: string, summary: string = 'Success'): void {
    console.log(`[Toast Success] ${summary}: ${message}`);
    this.show('success', summary, message);
  }

  /**
   * TODO: Replace with PrimeNG MessageService.add({ severity: 'error', summary: 'Error', detail: message });
   */
  error(message: string, summary: string = 'Error'): void {
    console.error(`[Toast Error] ${summary}: ${message}`);
    this.show('error', summary, message);
  }

  /**
   * TODO: Replace with PrimeNG MessageService.add({ severity: 'warn', summary: 'Warning', detail: message });
   */
  warning(message: string, summary: string = 'Warning'): void {
    console.warn(`[Toast Warning] ${summary}: ${message}`);
    this.show('warn', summary, message);
  }

  /**
   * TODO: Replace with PrimeNG MessageService.add({ severity: 'info', summary: 'Info', detail: message });
   */
  info(message: string, summary: string = 'Info'): void {
    console.log(`[Toast Info] ${summary}: ${message}`);
    this.show('info', summary, message);
  }

  /**
   * TODO: Implement actual PrimeNG Toast display logic here.
   * This is a temporary implementation using console.log.
   */
  show(severity: 'success' | 'error' | 'warn' | 'info', summary: string, detail: string): void {
    // Temporary implementation
    console.log(`[Toast] Severity: ${severity}, Summary: ${summary}, Detail: ${detail}`);
  }
}
