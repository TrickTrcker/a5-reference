import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAdvanceComponent } from './customer-advance.component';

describe('CustomerAdvanceComponent', () => {
  let component: CustomerAdvanceComponent;
  let fixture: ComponentFixture<CustomerAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
