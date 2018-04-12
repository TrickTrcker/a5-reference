import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousinvoiceComponent } from './miscellaneousinvoice.component';

describe('MiscellaneousinvoiceComponent', () => {
  let component: MiscellaneousinvoiceComponent;
  let fixture: ComponentFixture<MiscellaneousinvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiscellaneousinvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscellaneousinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
