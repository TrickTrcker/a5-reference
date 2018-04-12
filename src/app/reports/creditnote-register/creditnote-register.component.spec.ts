import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditnoteRegisterComponent } from './creditnote-register.component';

describe('CreditnoteRegisterComponent', () => {
  let component: CreditnoteRegisterComponent;
  let fixture: ComponentFixture<CreditnoteRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditnoteRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditnoteRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
