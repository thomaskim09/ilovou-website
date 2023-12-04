import { TestBed } from '@angular/core/testing';

import { HintService } from './hint.service';

describe('HintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HintService = TestBed.get(HintService);
    expect(service).toBeTruthy();
  });
});
