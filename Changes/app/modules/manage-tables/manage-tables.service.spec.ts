import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ManageTablesService } from './manage-tables.service';

describe('ManageTablesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule]
  }));

  it('should be created', () => {
    const service: ManageTablesService = TestBed.get(ManageTablesService);
    expect(service).toBeTruthy();
  });
});
