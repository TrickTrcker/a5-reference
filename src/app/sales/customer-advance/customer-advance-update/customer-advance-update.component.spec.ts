import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAdvanceUpdateComponent } from './customer-advance-update.component';

describe('CustomerAdvanceUpdateComponent', () => {
  let component: CustomerAdvanceUpdateComponent;
  let fixture: ComponentFixture<CustomerAdvanceUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAdvanceUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAdvanceUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
