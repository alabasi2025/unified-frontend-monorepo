import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-quotations-form',
  template: '<div><h2>Quotation Form</h2></div>'
})
export class QuotationsFormComponent {}
