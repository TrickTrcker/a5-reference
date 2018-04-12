import { TestBed, inject } from '@angular/core/testing';

import { JournalsService } from './journals.service';

describe('JournalsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JournalsService]
    });
  });

  it('should ...', inject([JournalsService], (service: JournalsService) => {
    expect(service).toBeTruthy();
  }));
});
