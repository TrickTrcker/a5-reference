import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBankdepositeComponent } from './view-bankdeposite.component';

describe('ViewBankdepositeComponent', () => {
  let component: ViewBankdepositeComponent;
  let fixture: ComponentFixture<ViewBankdepositeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBankdepositeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBankdepositeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
