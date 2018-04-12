import { TestBed, inject } from '@angular/core/testing';

import { CommonHttpService } from './common-http.service';

describe('CommonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonHttpService]
    });
  });

  it('should ...', inject([CommonHttpService], (service: CommonHttpService) => {
    expect(service).toBeTruthy();
  }));
});
