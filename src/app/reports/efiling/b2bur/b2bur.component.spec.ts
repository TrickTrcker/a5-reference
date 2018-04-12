import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2burComponent } from './b2bur.component';

describe('B2burComponent', () => {
  let component: B2burComponent;
  let fixture: ComponentFixture<B2burComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2burComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2burComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
