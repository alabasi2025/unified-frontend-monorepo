import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-financialreports-detail',
  template: '<div><h2>FinancialReport Detail</h2></div>'
})
export class FinancialReportsDetailComponent {}
