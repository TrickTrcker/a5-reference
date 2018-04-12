import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankwithdrawComponent } from './bankwithdraw.component';

describe('BankwithdrawComponent', () => {
  let component: BankwithdrawComponent;
  let fixture: ComponentFixture<BankwithdrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankwithdrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankwithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
