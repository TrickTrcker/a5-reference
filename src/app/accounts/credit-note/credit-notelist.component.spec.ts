import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditNotelistComponent } from './credit-notelist.component';

describe('CreditNotelistComponent', () => {
  let component: CreditNotelistComponent;
  let fixture: ComponentFixture<CreditNotelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditNotelistComponent ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(CreditNotelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
