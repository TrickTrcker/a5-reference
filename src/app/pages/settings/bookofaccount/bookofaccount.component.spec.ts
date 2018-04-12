import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookofaccountComponent } from './bookofaccount.component';

describe('BookofaccountComponent', () => {
  let component: BookofaccountComponent;
  let fixture: ComponentFixture<BookofaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookofaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookofaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
