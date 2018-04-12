import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CdnrComponent } from './cdnr.component';

describe('CdnrComponent', () => {
  let component: CdnrComponent;
  let fixture: ComponentFixture<CdnrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CdnrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CdnrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
