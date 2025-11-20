import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card.component';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [CommonModule, CardComponent, ChartModule],
  template: `
    <app-card header="الإيرادات الشهرية">
      <p-chart type="line" [data]="chartData" [options]="chartOptions" height="300px"></p-chart>
    </app-card>
  `
})
export class RevenueChartComponent implements OnInit {
  chartData: any;
  chartOptions: any;

  ngOnInit() {
    this.chartData = {
      labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
      datasets: [
        {
          label: 'الإيرادات',
          data: [650000, 590000, 800000, 810000, 560000, 850000],
          fill: true,
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: any) => value.toLocaleString('ar-SA') + ' ر.س'
          }
        }
      }
    };
  }
}
