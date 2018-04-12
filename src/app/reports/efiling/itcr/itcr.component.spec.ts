import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItcrComponent } from './itcr.component';

describe('ItcrComponent', () => {
  let component: ItcrComponent;
  let fixture: ComponentFixture<ItcrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItcrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItcrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
