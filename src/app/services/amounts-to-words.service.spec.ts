import { TestBed, inject } from '@angular/core/testing';

import { AmountsToWordsService } from './amounts-to-words.service';

describe('AmountsToWordsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmountsToWordsService]
    });
  });

  it('should be created', inject([AmountsToWordsService], (service: AmountsToWordsService) => {
    expect(service).toBeTruthy();
  }));
});
