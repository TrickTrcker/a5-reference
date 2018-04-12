import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceTaxationComponent } from './invoice-taxation.component';

describe('InvoiceTaxationComponent', () => {
  let component: InvoiceTaxationComponent;
  let fixture: ComponentFixture<InvoiceTaxationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceTaxationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceTaxationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
