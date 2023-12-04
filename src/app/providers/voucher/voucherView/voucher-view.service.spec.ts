import { TestBed } from '@angular/core/testing';

import { VoucherViewService } from './voucher-view.service';

describe('VoucherViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VoucherViewService = TestBed.get(VoucherViewService);
    expect(service).toBeTruthy();
  });
});
