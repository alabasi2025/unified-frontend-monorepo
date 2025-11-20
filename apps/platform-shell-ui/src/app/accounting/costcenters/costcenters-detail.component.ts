import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-costcenters-detail',
  template: '<div><h2>CostCenter Detail</h2></div>'
})
export class CostCentersDetailComponent {}
