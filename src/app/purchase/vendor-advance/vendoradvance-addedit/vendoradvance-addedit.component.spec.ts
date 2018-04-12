import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendoradvanceAddeditComponent } from './vendoradvance-addedit.component';

describe('VendoradvanceAddeditComponent', () => {
  let component: VendoradvanceAddeditComponent;
  let fixture: ComponentFixture<VendoradvanceAddeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendoradvanceAddeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendoradvanceAddeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
