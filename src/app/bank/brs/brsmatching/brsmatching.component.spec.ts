import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BRSMatchingComponent } from './brsmatching.component';

describe('BRSComponent', () => {
  let component: BRSMatchingComponent;
  let fixture: ComponentFixture<BRSMatchingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BRSMatchingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BRSMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
