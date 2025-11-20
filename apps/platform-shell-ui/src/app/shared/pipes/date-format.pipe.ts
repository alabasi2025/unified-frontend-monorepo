import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date | null, format: string = 'short'): string {
    if (!value) return '';
    
    const date = typeof value === 'string' ? new Date(value) : value;
    
    switch (format) {
      case 'short':
        return date.toLocaleDateString('ar-EG');
      case 'long':
        return date.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      case 'time':
        return date.toLocaleTimeString('ar-EG');
      case 'datetime':
        return `${date.toLocaleDateString('ar-EG')} ${date.toLocaleTimeString('ar-EG')}`;
      default:
        return date.toLocaleDateString('ar-EG');
    }
  }
}
