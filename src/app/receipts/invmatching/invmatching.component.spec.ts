import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvmatchingComponent } from './invmatching.component';

describe('InvmatchingComponent', () => {
  let component: InvmatchingComponent;
  let fixture: ComponentFixture<InvmatchingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvmatchingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvmatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
