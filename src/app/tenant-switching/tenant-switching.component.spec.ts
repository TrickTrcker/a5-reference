import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantSwitchingComponent } from './tenant-switching.component';

describe('TenantSwitchingComponent', () => {
  let component: TenantSwitchingComponent;
  let fixture: ComponentFixture<TenantSwitchingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenantSwitchingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantSwitchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
