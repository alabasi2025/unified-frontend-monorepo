import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-sales-chart',
  standalone: true,
  imports: [CommonModule, CardComponent, ChartModule],
  template: `
    <app-card header="مبيعات الأسبوع">
      <p-chart type="bar" [data]="chartData" [options]="chartOptions" height="300px"></p-chart>
    </app-card>
  `
})
export class SalesChartComponent implements OnInit {
  chartData: any;
  chartOptions: any;

  ngOnInit() {
    this.chartData = {
      labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
      datasets: [
        {
          label: 'المبيعات',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: '#42A5F5'
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }
}
