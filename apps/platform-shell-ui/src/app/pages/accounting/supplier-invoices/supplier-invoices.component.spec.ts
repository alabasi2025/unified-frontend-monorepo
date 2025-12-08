import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplierInvoicesComponent } from './supplier-invoices.component';

describe('SupplierInvoicesComponent', () => {
  let component: SupplierInvoicesComponent;
  let fixture: ComponentFixture<SupplierInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierInvoicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
