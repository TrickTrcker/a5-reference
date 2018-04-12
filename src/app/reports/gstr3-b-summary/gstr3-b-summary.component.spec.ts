import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Gstr3BSummaryComponent } from './gstr3-b-summary.component';

describe('Gstr3BSummaryComponent', () => {
  let component: Gstr3BSummaryComponent;
  let fixture: ComponentFixture<Gstr3BSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Gstr3BSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Gstr3BSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
