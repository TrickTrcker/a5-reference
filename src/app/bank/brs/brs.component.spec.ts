import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BRSComponent } from './brs.component';

describe('BRSComponent', () => {
  let component: BRSComponent;
  let fixture: ComponentFixture<BRSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BRSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BRSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
