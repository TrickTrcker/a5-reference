import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceipteditComponent } from './receiptedit.component';

describe('ReceipteditComponent', () => {
  let component: ReceipteditComponent;
  let fixture: ComponentFixture<ReceipteditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceipteditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceipteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
