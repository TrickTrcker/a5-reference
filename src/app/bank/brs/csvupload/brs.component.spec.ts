import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BRSUploadComponent } from './brsupload.component';

describe('BRSComponent', () => {
  let component: BRSUploadComponent;
  let fixture: ComponentFixture<BRSUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BRSUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BRSUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
