import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Gstr1SummaryComponent } from './gstr1-summary.component';

describe('Gstr1SummaryComponent', () => {
  let component: Gstr1SummaryComponent;
  let fixture: ComponentFixture<Gstr1SummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Gstr1SummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Gstr1SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
