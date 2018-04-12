import { TestBed, inject } from '@angular/core/testing';

import { OrganizationSettingsService } from './organization-settings.service';

describe('OrganizationSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrganizationSettingsService]
    });
  });

  it('should ...', inject([OrganizationSettingsService], (service: OrganizationSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
