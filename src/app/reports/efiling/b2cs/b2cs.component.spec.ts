import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2csComponent } from './b2cs.component';

describe('B2csComponent', () => {
  let component: B2csComponent;
  let fixture: ComponentFixture<B2csComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2csComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2csComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
