import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { RecordMaintenanceService } from './record-maintenance.service';

describe('RecordMaintenanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: RecordMaintenanceService = TestBed.get(RecordMaintenanceService);
    expect(service).toBeTruthy();
  });
});
