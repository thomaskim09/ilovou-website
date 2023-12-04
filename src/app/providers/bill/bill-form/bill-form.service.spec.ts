import { TestBed } from '@angular/core/testing';

import { BillFormService } from './bill-form.service';

describe('BillFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillFormService = TestBed.get(BillFormService);
    expect(service).toBeTruthy();
  });
});
