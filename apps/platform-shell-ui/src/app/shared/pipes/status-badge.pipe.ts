import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusBadge',
  standalone: true
})
export class StatusBadgePipe implements PipeTransform {
  transform(status: string): { label: string; severity: string } {
    const statusMap: Record<string, { label: string; severity: string }> = {
      'ACTIVE': { label: 'نشط', severity: 'success' },
      'INACTIVE': { label: 'غير نشط', severity: 'danger' },
      'PENDING': { label: 'قيد الانتظار', severity: 'warning' },
      'APPROVED': { label: 'معتمد', severity: 'success' },
      'REJECTED': { label: 'مرفوض', severity: 'danger' },
      'DRAFT': { label: 'مسودة', severity: 'info' },
      'COMPLETED': { label: 'مكتمل', severity: 'success' },
      'CANCELLED': { label: 'ملغي', severity: 'danger' }
    };
    
    return statusMap[status] || { label: status, severity: 'info' };
  }
}
