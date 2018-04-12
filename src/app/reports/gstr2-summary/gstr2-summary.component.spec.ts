import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Gstr2SummaryComponent } from './gstr2-summary.component';

describe('Gstr2SummaryComponent', () => {
  let component: Gstr2SummaryComponent;
  let fixture: ComponentFixture<Gstr2SummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Gstr2SummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Gstr2SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
