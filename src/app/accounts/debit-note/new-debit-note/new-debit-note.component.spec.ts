import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDebitNoteComponent } from './new-debit-note.component';

describe('NewDebitNoteComponent', () => {
  let component: NewDebitNoteComponent;
  let fixture: ComponentFixture<NewDebitNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDebitNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDebitNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
