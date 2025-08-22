import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { RecordMaintenanceService } from './record-maintenance.service';

describe('RecordMaintenanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: RecordMaintenanceService = TestBed.get(RecordMaintenanceService);
    expect(service).toBeTruthy();
  });
});
