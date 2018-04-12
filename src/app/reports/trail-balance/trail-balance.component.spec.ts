import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailBalanceComponent } from './trail-balance.component';

describe('TrailBalanceComponent', () => {
  let component: TrailBalanceComponent;
  let fixture: ComponentFixture<TrailBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
