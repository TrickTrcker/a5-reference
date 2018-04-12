import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { proformaInvoiceAddeditComponent } from './proforma-invoice-addedit.component';

describe('proformaInvoiceAddeditComponent', () => {
  let component: proformaInvoiceAddeditComponent;
  let fixture: ComponentFixture<proformaInvoiceAddeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ proformaInvoiceAddeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(proformaInvoiceAddeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
