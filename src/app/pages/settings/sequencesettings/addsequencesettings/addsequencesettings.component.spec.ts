import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsequencesettingsComponent } from './addsequencesettings.component';

describe('AddsequencesettingsComponent', () => {
  let component: AddsequencesettingsComponent;
  let fixture: ComponentFixture<AddsequencesettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsequencesettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsequencesettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
