import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ManageTablesService } from './manage-tables.service';

describe('ManageTablesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: ManageTablesService = TestBed.get(ManageTablesService);
    expect(service).toBeTruthy();
  });
});
