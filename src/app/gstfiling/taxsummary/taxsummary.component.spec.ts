import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxsummaryComponent } from './taxsummary.component';

describe('TaxsummaryComponent', () => {
  let component: TaxsummaryComponent;
  let fixture: ComponentFixture<TaxsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
