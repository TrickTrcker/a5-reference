import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendoradvanceUpdateComponent } from './vendoradvance-update.component';

describe('VendoradvanceUpdateComponent', () => {
  let component: VendoradvanceUpdateComponent;
  let fixture: ComponentFixture<VendoradvanceUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendoradvanceUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendoradvanceUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
