import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankwithdrawlistComponent } from './bankwithdrawlist.component';

describe('BankwithdrawlistComponent', () => {
  let component: BankwithdrawlistComponent;
  let fixture: ComponentFixture<BankwithdrawlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankwithdrawlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankwithdrawlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
