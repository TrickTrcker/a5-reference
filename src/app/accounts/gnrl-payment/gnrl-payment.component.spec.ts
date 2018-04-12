import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GnrlPaymentComponent } from './gnrl-payment.component';

describe('GnrlPaymentComponent', () => {
  let component: GnrlPaymentComponent;
  let fixture: ComponentFixture<GnrlPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GnrlPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GnrlPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
