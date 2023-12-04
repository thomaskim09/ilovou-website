import { TestBed } from '@angular/core/testing';

import { MenuFormService } from './menu-form.service';

describe('MenuFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MenuFormService = TestBed.get(MenuFormService);
    expect(service).toBeTruthy();
  });
});
