import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-salesinvoices-form',
  template: '<div><h2>SalesInvoice Form</h2></div>'
})
export class SalesInvoicesFormComponent {}
