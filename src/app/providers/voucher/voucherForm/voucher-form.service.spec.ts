import { TestBed } from '@angular/core/testing';

import { VoucherFormService } from './voucher-form.service';

describe('VoucherFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VoucherFormService = TestBed.get(VoucherFormService);
    expect(service).toBeTruthy();
  });
});
