import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GnrlReceiptComponent } from './gnrl-receipt.component';

describe('GnrlReceiptComponent', () => {
  let component: GnrlReceiptComponent;
  let fixture: ComponentFixture<GnrlReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GnrlReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GnrlReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
