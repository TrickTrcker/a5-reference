import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerTrialBalanceComponent } from './ledger-trial-balance.component';

describe('LedgerTrialBalanceComponent', () => {
  let component: LedgerTrialBalanceComponent;
  let fixture: ComponentFixture<LedgerTrialBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerTrialBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerTrialBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
