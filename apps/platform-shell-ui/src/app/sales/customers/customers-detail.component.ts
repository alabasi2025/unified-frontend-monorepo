import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-customers-detail',
  template: '<div><h2>Customer Detail</h2></div>'
})
export class CustomersDetailComponent {}
