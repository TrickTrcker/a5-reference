import { TestBed, inject } from '@angular/core/testing';

import { ConvertProformaToInvoiceService } from './convert-proforma-to-invoice.service';

describe('ConvertProformaToInvoiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConvertProformaToInvoiceService]
    });
  });

  it('should be created', inject([ConvertProformaToInvoiceService], (service: ConvertProformaToInvoiceService) => {
    expect(service).toBeTruthy();
  }));
});
