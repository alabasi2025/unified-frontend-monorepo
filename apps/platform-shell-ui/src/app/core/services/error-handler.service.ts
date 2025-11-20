import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  constructor(private notification: NotificationService) {}

  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else if (error instanceof Error) {
      this.handleClientError(error);
    } else {
      this.handleUnknownError(error);
    }
  }

  private handleHttpError(error: HttpErrorResponse): void {
    let message = 'An error occurred';
    
    if (error.status === 0) {
      message = 'No internet connection';
    } else if (error.status === 400) {
      message = error.error?.message || 'Bad request';
    } else if (error.status === 401) {
      message = 'Unauthorized. Please login again.';
    } else if (error.status === 403) {
      message = 'Access denied';
    } else if (error.status === 404) {
      message = 'Resource not found';
    } else if (error.status === 500) {
      message = 'Internal server error';
    } else {
      message = error.error?.message || error.message || 'An error occurred';
    }

    this.notification.error('Error', message);
    console.error('HTTP Error:', error);
  }

  private handleClientError(error: Error): void {
    this.notification.error('Error', error.message);
    console.error('Client Error:', error);
  }

  private handleUnknownError(error: any): void {
    this.notification.error('Error', 'An unknown error occurred');
    console.error('Unknown Error:', error);
  }
}
