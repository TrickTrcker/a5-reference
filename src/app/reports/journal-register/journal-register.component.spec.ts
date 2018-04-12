import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalRegisterComponent } from './journal-register.component';

describe('JournalRegisterComponent', () => {
  let component: JournalRegisterComponent;
  let fixture: ComponentFixture<JournalRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JournalRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
