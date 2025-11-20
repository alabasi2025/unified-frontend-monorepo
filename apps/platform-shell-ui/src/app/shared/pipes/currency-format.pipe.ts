import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | null, currency: string = 'SAR', showSymbol: boolean = true): string {
    if (value === null || value === undefined) return '';
    
    const formatted = new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
    
    return showSymbol ? formatted : formatted.replace(/[^\d,.-]/g, '').trim();
  }
}
