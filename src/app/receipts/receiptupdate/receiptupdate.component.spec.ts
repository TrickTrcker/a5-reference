import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptupdateComponent } from './receiptupdate.component';

describe('ReceiptupdateComponent', () => {
  let component: ReceiptupdateComponent;
  let fixture: ComponentFixture<ReceiptupdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptupdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
