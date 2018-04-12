import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceRegisterComponent } from './invoice-register.component';

describe('InvoiceRegisterComponent', () => {
  let component: InvoiceRegisterComponent;
  let fixture: ComponentFixture<InvoiceRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
