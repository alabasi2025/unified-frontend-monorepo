import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  get apiUrl(): string {
    return environment.apiUrl;
  }

  get production(): boolean {
    return environment.production;
  }

  get appName(): string {
    return 'SEMOP';
  }

  get appVersion(): string {
    return '0.6.0';
  }

  get dateFormat(): string {
    return 'dd/MM/yyyy';
  }

  get timeFormat(): string {
    return 'HH:mm:ss';
  }

  get dateTimeFormat(): string {
    return 'dd/MM/yyyy HH:mm:ss';
  }

  get currency(): string {
    return 'SAR';
  }

  get locale(): string {
    return 'ar-SA';
  }

  get pageSize(): number {
    return 10;
  }

  get pageSizeOptions(): number[] {
    return [10, 25, 50, 100];
  }
}
