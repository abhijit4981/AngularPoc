import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RecordMaintenanceService } from './record-maintenance.service';
import { HttpService } from 'src/app/core/services/http/http.service';
import { DosimetryApiService } from './../../core/api/dosimetry-api.service';

describe('RecordMaintenanceService', () => {
  let service: RecordMaintenanceService;
  let mockHttpService: jasmine.SpyObj<HttpService>;
  let mockDosimetryApiService: jasmine.SpyObj<DosimetryApiService>;

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpService', ['get', 'post']);
    const apiSpy = jasmine.createSpyObj('DosimetryApiService', [], {
      Dm: {
        GET_ALL_EMPLOYEES_URL: '/api/employees',
        GET_ALL_EXTERNAL_DOSIMETER_URL: '/api/external-dosimeter',
        SAVE_EXTERNAL_DOSE_RESULT_URL: '/api/save-external',
        GET_ALL_INTERNAL_DOSIMETER_URL: '/api/internal-dosimeter',
        SAVE_INTERNAL_DOSE_RESULT_URL: '/api/save-internal',
        GET_ALL_NUCLIDES_URL: '/api/nuclides',
        GET_ALL_DOSIMETER_BY_PARTICIPANTID_URL: '/api/dosimeter-participant',
        GET_ALL_ACCOUNTS_URL: '/api/accounts'
      }
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RecordMaintenanceService,
        { provide: HttpService, useValue: httpSpy },
        { provide: DosimetryApiService, useValue: apiSpy }
      ]
    });

    service = TestBed.inject(RecordMaintenanceService);
    mockHttpService = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
    mockDosimetryApiService = TestBed.inject(DosimetryApiService) as jasmine.SpyObj<DosimetryApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllEmployees', () => {
    it('should return empty array for empty search term', () => {
      const result = service.getAllEmployees('', 'employee');
      
      result.subscribe(data => {
        expect(data).toEqual([]);
      });
    });

    it('should return empty array for whitespace search term', () => {
      const result = service.getAllEmployees('   ', 'employee');
      
      result.subscribe(data => {
        expect(data).toEqual([]);
      });
    });

    it('should call http.get with correct URL when search term provided', () => {
      const searchTerm = 'john';
      const type = 'employee';
      const mockResponse = [{ id: 1, name: 'John Doe' }];
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getAllEmployees(searchTerm, type).subscribe(result => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('/api/employees?searchVal=john&type=employee');
    });
  });

  describe('getAllExternalDoseResults', () => {
    it('should call http.get with correct URL parameters', () => {
      const mockResponse = [{ id: 1, dose: 100 }];
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getAllExternalDoseResults(true, 'P123', 'E456', '2023-01-01').subscribe(result => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith(
        '/api/external-dosimeter?isPerson=true&participantNum=P123&personNum=E456&startDate=2023-01-01'
      );
    });

    it('should handle false isPerson parameter', () => {
      const mockResponse = [];
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getAllExternalDoseResults(false, 'P456', 'E789', '2023-02-01');

      expect(mockHttpService.get).toHaveBeenCalledWith(
        '/api/external-dosimeter?isPerson=false&participantNum=P456&personNum=E789&startDate=2023-02-01'
      );
    });
  });

  describe('updateExternalDoseResult', () => {
    it('should call http.post with correct parameters', () => {
      const mockDoseResult = { id: 1, dose: 150, date: '2023-01-01' };
      const mockResponse = { success: true };
      mockHttpService.post.and.returnValue(of(mockResponse) as any);

      service.updateExternalDoseResult(mockDoseResult).subscribe(result => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith(
        '/api/save-external',
        JSON.stringify(mockDoseResult),
        null
      );
    });
  });

  describe('getAllInternalDoseResults', () => {
    it('should call http.get with correct URL parameters', () => {
      const mockResponse = [{ id: 1, internalDose: 50 }];
      mockHttpService.get.and.returnValue(of(mockResponse));

      service.getAllInternalDoseResults('E123', '2023-01-01').subscribe(result => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith(
        '/api/internal-dosimeter?personNum=E123&sampleDate=2023-01-01'
      );
    });
  });

  describe('updateInternalDoseResult', () => {
    it('should call http.post with correct parameters', () => {
      const mockDoseResult = { id: 2, internalDose: 75, sampleDate: '2023-01-01' };
      const mockResponse = { success: true, id: 2 };
      mockHttpService.post.and.returnValue(of(mockResponse) as any);

      service.updateInternalDoseResult(mockDoseResult).subscribe(result => {
        expect(result).toEqual(mockResponse);
      });

      expect(mockHttpService.post).toHaveBeenCalledWith(
        '/api/save-internal',
        JSON.stringify(mockDoseResult),
        null
      );
    });
  });

  describe('getAllNuclides', () => {
    it('should call http.get with correct URL', () => {
      const mockNuclides = [{ id: 1, name: 'Uranium-238' }, { id: 2, name: 'Cesium-137' }];
      mockHttpService.get.and.returnValue(of(mockNuclides));

      service.getAllNuclides().subscribe(result => {
        expect(result).toEqual(mockNuclides);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('/api/nuclides');
    });
  });

  describe('getAllDosimeterResults', () => {
    it('should call http.get with correct URL including participant ID', () => {
      const participantId = 123;
      const mockResults = [{ id: 1, dose: 200, participantId: 123 }];
      mockHttpService.get.and.returnValue(of(mockResults));

      service.getAllDosimeterResults(participantId).subscribe(result => {
        expect(result).toEqual(mockResults);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('/api/dosimeter-participant/123');
    });
  });

  describe('getAllAccounts', () => {
    it('should call http.get with correct URL', () => {
      const mockAccounts = [{ id: 1, name: 'Account A' }, { id: 2, name: 'Account B' }];
      mockHttpService.get.and.returnValue(of(mockAccounts));

      service.getAllAccounts().subscribe(result => {
        expect(result).toEqual(mockAccounts);
      });

      expect(mockHttpService.get).toHaveBeenCalledWith('/api/accounts');
    });
  });
});
