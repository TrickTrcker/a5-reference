import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbankComponent } from './addbank.component';

describe('AddbankComponent', () => {
  let component: AddbankComponent;
  let fixture: ComponentFixture<AddbankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddbankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
