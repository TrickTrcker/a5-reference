import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnsumComponent } from './hsnsum.component';

describe('HsnsumComponent', () => {
  let component: HsnsumComponent;
  let fixture: ComponentFixture<HsnsumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsnsumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsnsumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
