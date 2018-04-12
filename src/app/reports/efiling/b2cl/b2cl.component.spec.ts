import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2clComponent } from './b2cl.component';

describe('B2clComponent', () => {
  let component: B2clComponent;
  let fixture: ComponentFixture<B2clComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2clComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2clComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
