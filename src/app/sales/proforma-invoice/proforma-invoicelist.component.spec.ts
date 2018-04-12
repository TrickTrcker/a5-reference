import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { proformaInvoicelistComponent } from './proforma-invoice.component';

describe('proformaInvoicelistComponent', () => {
  let component: proformaInvoicelistComponent;
  let fixture: ComponentFixture<proformaInvoicelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ proformaInvoicelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(proformaInvoicelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
