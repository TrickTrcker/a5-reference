import { TestBed, inject } from '@angular/core/testing';

import { ProductallService } from './productall.service';

describe('ProductallService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductallService]
    });
  });

  it('should ...', inject([ProductallService], (service: ProductallService) => {
    expect(service).toBeTruthy();
  }));
});
