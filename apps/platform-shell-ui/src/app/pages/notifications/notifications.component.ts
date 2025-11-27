import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, CardModule],
  template: `
    <p-card>
      <h1>🔔 الإشعارات</h1>
      <p>قريباً...</p>
    </p-card>
  `
})
export class NotificationsComponent {}
