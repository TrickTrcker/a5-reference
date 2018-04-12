import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJournalsComponent } from './view-journals.component';

describe('ViewJournalsComponent', () => {
  let component: ViewJournalsComponent;
  let fixture: ComponentFixture<ViewJournalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewJournalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewJournalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
