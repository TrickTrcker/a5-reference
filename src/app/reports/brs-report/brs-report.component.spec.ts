import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrsReportComponent } from './brs-report.component';

describe('BrsReportComponent', () => {
  let component: BrsReportComponent;
  let fixture: ComponentFixture<BrsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
