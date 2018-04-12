import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExempComponent } from './exemp.component';

describe('ExempComponent', () => {
  let component: ExempComponent;
  let fixture: ComponentFixture<ExempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
