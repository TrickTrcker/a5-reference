import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInvoiceComponent } from './add-edit-invoice.component';

describe('AddEditInvoiceComponent', () => {
  let component: AddEditInvoiceComponent;
  let fixture: ComponentFixture<AddEditInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
