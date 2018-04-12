import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerviewComponent } from './ledgerview.component';

describe('LedgerviewComponent', () => {
  let component: LedgerviewComponent;
  let fixture: ComponentFixture<LedgerviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
