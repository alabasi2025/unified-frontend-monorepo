import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-fiscalyears-form',
  template: '<div><h2>FiscalYear Form</h2></div>'
})
export class FiscalYearsFormComponent {}
