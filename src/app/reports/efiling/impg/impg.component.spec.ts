import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpgComponent } from './impg.component';

describe('ImpgComponent', () => {
  let component: ImpgComponent;
  let fixture: ComponentFixture<ImpgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
