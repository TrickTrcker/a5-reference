import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBankwithdrawComponent } from './view-bankwithdraw.component';

describe('ViewBankwithdrawComponent', () => {
  let component: ViewBankwithdrawComponent;
  let fixture: ComponentFixture<ViewBankwithdrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBankwithdrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBankwithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
