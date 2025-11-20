import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-salesinvoices-detail',
  template: '<div><h2>SalesInvoice Detail</h2></div>'
})
export class SalesInvoicesDetailComponent {}
