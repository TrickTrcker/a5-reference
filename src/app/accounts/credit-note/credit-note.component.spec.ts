import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNoteComponent } from './credit-note.component';

describe('CreditNoteComponent', () => {
  let component: CreditNoteComponent;
  let fixture: ComponentFixture<CreditNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditNoteComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(CreditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
