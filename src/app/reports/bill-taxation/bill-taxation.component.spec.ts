import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillTaxationComponent } from './bill-taxation.component';

describe('BillTaxationComponent', () => {
  let component: BillTaxationComponent;
  let fixture: ComponentFixture<BillTaxationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillTaxationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillTaxationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
