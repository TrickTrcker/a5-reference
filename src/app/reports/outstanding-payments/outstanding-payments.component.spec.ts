import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutstandingPaymentsComponent } from './outstanding-payments.component';

describe('OutstandingPaymentsComponent', () => {
  let component: OutstandingPaymentsComponent;
  let fixture: ComponentFixture<OutstandingPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutstandingPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutstandingPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
