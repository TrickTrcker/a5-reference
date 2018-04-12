import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitnoteRegisterComponent } from './debitnote-register.component';

describe('DebitnoteRegisterComponent', () => {
  let component: DebitnoteRegisterComponent;
  let fixture: ComponentFixture<DebitnoteRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebitnoteRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitnoteRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
