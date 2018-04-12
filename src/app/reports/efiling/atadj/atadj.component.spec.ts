import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtadjComponent } from './atadj.component';

describe('AtadjComponent', () => {
  let component: AtadjComponent;
  let fixture: ComponentFixture<AtadjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtadjComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtadjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
