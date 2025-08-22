import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from 'src/app/core/services/http/http.service';
import { DosimetryApiService as DMApi } from '../../core/api/dosimetry-api.service';

import { CommonService } from './common.service';

describe('CommonService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [HttpService, DMApi]
  }));

  it('should be created', () => {
    const service: CommonService = TestBed.get(CommonService);
    expect(service).toBeTruthy();
  });
});
