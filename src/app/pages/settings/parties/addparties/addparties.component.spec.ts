import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpartiesComponent } from './addparties.component';

describe('AddpartiesComponent', () => {
  let component: AddpartiesComponent;
  let fixture: ComponentFixture<AddpartiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpartiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpartiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
