import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-suppliers-form',
  template: '<div><h2>Supplier Form</h2></div>'
})
export class SuppliersFormComponent {}
