import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeradvanceAddeditComponent } from './customeradvance-addedit.component';

describe('CustomeradvanceAddeditComponent', () => {
  let component: CustomeradvanceAddeditComponent;
  let fixture: ComponentFixture<CustomeradvanceAddeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomeradvanceAddeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomeradvanceAddeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
