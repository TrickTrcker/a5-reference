import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAdvanceComponent } from './vendor-advance.component';

describe('VendorAdvanceComponent', () => {
  let component: VendorAdvanceComponent;
  let fixture: ComponentFixture<VendorAdvanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorAdvanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
