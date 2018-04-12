import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAddeditComponent } from './book-addedit.component';

describe('BookAddeditComponent', () => {
  let component: BookAddeditComponent;
  let fixture: ComponentFixture<BookAddeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookAddeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookAddeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
