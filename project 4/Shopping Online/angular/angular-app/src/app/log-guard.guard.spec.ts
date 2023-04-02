import { TestBed } from '@angular/core/testing';

import { LogGuardGuard } from './log-guard.guard';

describe('LogGuardGuard', () => {
  let guard: LogGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LogGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
