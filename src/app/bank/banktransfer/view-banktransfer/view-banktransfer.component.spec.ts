import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBanktransferComponent } from './view-banktransfer.component';

describe('ViewBanktransferComponent', () => {
  let component: ViewBanktransferComponent;
  let fixture: ComponentFixture<ViewBanktransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBanktransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBanktransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
