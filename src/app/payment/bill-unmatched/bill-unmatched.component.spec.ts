import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillUnmatchedComponent } from './bill-unmatched.component';

describe('BillUnmatchedComponent', () => {
  let component: BillUnmatchedComponent;
  let fixture: ComponentFixture<BillUnmatchedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillUnmatchedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillUnmatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
