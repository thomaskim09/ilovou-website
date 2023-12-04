import { TestBed } from '@angular/core/testing';

import { ProfileFormService } from './profile-form.service';

describe('ProfileFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileFormService = TestBed.get(ProfileFormService);
    expect(service).toBeTruthy();
  });
});
