import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankdepositelistComponent } from './bankdepositelist.component';

describe('BankdepositelistComponent', () => {
  let component: BankdepositelistComponent;
  let fixture: ComponentFixture<BankdepositelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankdepositelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankdepositelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
