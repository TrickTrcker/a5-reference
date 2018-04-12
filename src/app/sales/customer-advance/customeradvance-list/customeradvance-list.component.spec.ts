import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeradvanceListComponent } from './customeradvance-list.component';

describe('CustomeradvanceListComponent', () => {
  let component: CustomeradvanceListComponent;
  let fixture: ComponentFixture<CustomeradvanceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomeradvanceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomeradvanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
