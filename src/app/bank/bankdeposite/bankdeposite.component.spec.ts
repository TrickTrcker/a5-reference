import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankdepositeComponent } from './bankdeposite.component';

describe('BankdepositeComponent', () => {
  let component: BankdepositeComponent;
  let fixture: ComponentFixture<BankdepositeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankdepositeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankdepositeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
