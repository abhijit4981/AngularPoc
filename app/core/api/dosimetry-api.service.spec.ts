import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DosimetryApiService } from './dosimetry-api.service';

describe('DosimetryApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: DosimetryApiService = TestBed.get(DosimetryApiService);
    expect(service).toBeTruthy();
  });
});
