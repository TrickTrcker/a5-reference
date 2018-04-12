import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bComponent } from './b2b.component';

describe('B2bComponent', () => {
  let component: B2bComponent;
  let fixture: ComponentFixture<B2bComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2bComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
