import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card.component';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  imports: [CommonModule, CardComponent, ChartModule],
  template: `
    <app-card header="توزيع المصروفات">
      <p-chart type="doughnut" [data]="chartData" [options]="chartOptions" height="300px"></p-chart>
    </app-card>
  `
})
export class ExpenseChartComponent implements OnInit {
  chartData: any;
  chartOptions: any;

  ngOnInit() {
    this.chartData = {
      labels: ['الرواتب', 'المشتريات', 'التشغيل', 'التسويق', 'أخرى'],
      datasets: [
        {
          data: [45, 25, 15, 10, 5],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC']
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };
  }
}
