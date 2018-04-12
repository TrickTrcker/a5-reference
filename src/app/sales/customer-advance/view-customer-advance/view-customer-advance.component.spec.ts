import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerAdvanceComponent } from './view-customer-advance.component';

describe('ViewCustomerAdvanceComponent', () => {
  let component: ViewCustomerAdvanceComponent;
  let fixture: ComponentFixture<ViewCustomerAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCustomerAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomerAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
