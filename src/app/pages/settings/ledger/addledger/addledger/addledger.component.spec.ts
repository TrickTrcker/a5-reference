import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddledgerComponent } from './addledger.component';

describe('AddledgerComponent', () => {
  let component: AddledgerComponent;
  let fixture: ComponentFixture<AddledgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddledgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddledgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
