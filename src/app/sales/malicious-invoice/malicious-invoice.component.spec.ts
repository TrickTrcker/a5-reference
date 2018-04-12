import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaliciousInvoiceComponent } from './malicious-invoice.component';

describe('MaliciousInvoiceComponent', () => {
  let component: MaliciousInvoiceComponent;
  let fixture: ComponentFixture<MaliciousInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaliciousInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaliciousInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
