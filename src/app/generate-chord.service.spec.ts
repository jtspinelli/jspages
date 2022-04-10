import { TestBed } from '@angular/core/testing';

import { GenerateChordService } from './generate-chord.service';

describe('GenerateChordService', () => {
  let service: GenerateChordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateChordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
