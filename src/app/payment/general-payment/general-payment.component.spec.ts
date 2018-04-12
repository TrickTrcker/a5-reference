import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralPaymentComponent } from './general-payment.component';

describe('GeneralPaymentComponent', () => {
  let component: GeneralPaymentComponent;
  let fixture: ComponentFixture<GeneralPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
