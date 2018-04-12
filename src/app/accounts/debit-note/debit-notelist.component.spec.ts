import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitNotelistComponent } from './debit-notelist.component';

describe('DebitNotelistComponent', () => {
  let component: DebitNotelistComponent;
  let fixture: ComponentFixture<DebitNotelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebitNotelistComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DebitNotelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
