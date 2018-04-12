import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillRegisterComponent } from './bill-register.component';

describe('BillRegisterComponent', () => {
  let component: BillRegisterComponent;
  let fixture: ComponentFixture<BillRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
