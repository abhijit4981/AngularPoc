import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { DosimetryApiService } from './dosimetry-api.service';

describe('DosimetryApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: DosimetryApiService = TestBed.get(DosimetryApiService);
    expect(service).toBeTruthy();
  });
});
