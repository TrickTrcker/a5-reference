import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCnoteComponent } from './view-cnote.component';

describe('ViewCnoteComponent', () => {
  let component: ViewCnoteComponent;
  let fixture: ComponentFixture<ViewCnoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCnoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
