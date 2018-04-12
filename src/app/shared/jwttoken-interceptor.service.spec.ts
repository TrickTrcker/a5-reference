import { TestBed, inject } from '@angular/core/testing';

import { JWTTokenInterceptorService } from './jwttoken-interceptor.service';

describe('JWTTokenInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JWTTokenInterceptorService]
    });
  });

  it('should ...', inject([JWTTokenInterceptorService], (service: JWTTokenInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
