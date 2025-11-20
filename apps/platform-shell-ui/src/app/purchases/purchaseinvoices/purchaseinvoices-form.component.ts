import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-purchaseinvoices-form',
  template: '<div><h2>PurchaseInvoice Form</h2></div>'
})
export class PurchaseInvoicesFormComponent {}
