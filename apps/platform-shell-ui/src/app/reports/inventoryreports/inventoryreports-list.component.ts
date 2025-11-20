import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-inventoryreports-list',
  template: '<div><h2>InventoryReport List</h2></div>'
})
export class InventoryReportsListComponent {}
