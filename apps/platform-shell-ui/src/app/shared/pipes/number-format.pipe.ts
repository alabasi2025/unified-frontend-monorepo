import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: true
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number | null, decimals: number = 0): string {
    if (value === null || value === undefined) return '';
    
    return new Intl.NumberFormat('ar-SA', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }
}
