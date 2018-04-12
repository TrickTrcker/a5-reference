import { TestBed, inject } from '@angular/core/testing';

import { ReportService } from './reports.service';

describe('TrialbalanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportService]
    });
  });

  it('should ...', inject([ReportService], (service: ReportService) => {
    expect(service).toBeTruthy();
  }));
});
