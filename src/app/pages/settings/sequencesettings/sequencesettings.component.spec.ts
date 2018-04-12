import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SequencesettingsComponent } from './sequencesettings.component';

describe('SequencesettingsComponent', () => {
  let component: SequencesettingsComponent;
  let fixture: ComponentFixture<SequencesettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SequencesettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SequencesettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
