import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDnoteComponent } from './view-dnote.component';

describe('ViewDnoteComponent', () => {
  let component: ViewDnoteComponent;
  let fixture: ComponentFixture<ViewDnoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDnoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
