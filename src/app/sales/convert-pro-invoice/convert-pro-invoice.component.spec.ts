import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertProInvoiceComponent } from './convert-pro-invoice.component';

describe('ConvertProInvoiceComponent', () => {
  let component: ConvertProInvoiceComponent;
  let fixture: ComponentFixture<ConvertProInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertProInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertProInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
