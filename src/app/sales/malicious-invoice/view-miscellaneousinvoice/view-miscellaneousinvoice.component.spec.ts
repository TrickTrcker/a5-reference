import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMiscellaneousinvoiceComponent } from './view-miscellaneousinvoice.component';

describe('ViewMiscellaneousinvoiceComponent', () => {
  let component: ViewMiscellaneousinvoiceComponent;
  let fixture: ComponentFixture<ViewMiscellaneousinvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMiscellaneousinvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMiscellaneousinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
