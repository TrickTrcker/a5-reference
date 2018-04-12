import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVendorAdvanceComponent } from './view-vendor-advance.component';

describe('ViewVendorAdvanceComponent', () => {
  let component: ViewVendorAdvanceComponent;
  let fixture: ComponentFixture<ViewVendorAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewVendorAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVendorAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
