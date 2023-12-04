import { TestBed } from '@angular/core/testing';

import { ReservationFormService } from './reservation-form.service';

describe('ReservationFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReservationFormService = TestBed.get(ReservationFormService);
    expect(service).toBeTruthy();
  });
});
