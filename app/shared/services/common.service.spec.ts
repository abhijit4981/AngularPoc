import { TestBed } from '@angular/core/testing';
import { CommonService } from './common.service';
import { HttpService } from 'src/app/core/services/http/http.service';
import { DosimetryApiService as DMApi } from 'src/app/core/api/dosimetry-api.service';
import { of } from 'rxjs';

describe('CommonService', () => {
  let service: CommonService;
  let httpSpy: jasmine.SpyObj<HttpService>;
  let apiStub: Partial<DMApi>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpService', ['get']);

    apiStub = {
      Dm: {
        GET_ALL_LOCATIONS_URL: '/api/locations',
        GET_ALL_TYPEGROUPS_URL: '/api/typegroups',
        GET_ALL_TYPEREFS_URL: '/api/typerefs',
        GET_LOGGED_USER_DETAILS_URL: '/api/userinfo',
        GET_JOB_PROCESS_URL: '/api/jobprocess'
      }
    } as any;

    TestBed.configureTestingModule({
      providers: [
        CommonService,
        { provide: HttpService, useValue: httpSpy },
        { provide: DMApi, useValue: apiStub }
      ]
    });

    service = TestBed.inject(CommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http.get with locations URL', () => {
    const mockResponse = of([{ id: 1 }]) as any;
    httpSpy.get.and.returnValue(mockResponse);

    const result = service.getAllLocations();

    expect(httpSpy.get).toHaveBeenCalledWith('/api/locations');
    expect(result).toBe(mockResponse);
  });

  it('should call http.get with type groups URL', () => {
    const mockResponse = of([{ id: 'group' }]) as any;
    httpSpy.get.and.returnValue(mockResponse);

    const result = service.getAllTypeGroups();

    expect(httpSpy.get).toHaveBeenCalledWith('/api/typegroups');
    expect(result).toBe(mockResponse);
  });

  it('should call http.get with type refs URL', () => {
    const mockResponse = of([{ id: 'ref' }]) as any;
    httpSpy.get.and.returnValue(mockResponse);

    const result = service.getAllTypeRefs();

    expect(httpSpy.get).toHaveBeenCalledWith('/api/typerefs');
    expect(result).toBe(mockResponse);
  });

  it('should call http.get with logged user details URL', () => {
    const mockResponse = of({ name: 'John' }) as any;
    httpSpy.get.and.returnValue(mockResponse);

    const result = service.getLoggedUserInfo();

    expect(httpSpy.get).toHaveBeenCalledWith('/api/userinfo');
    expect(result).toBe(mockResponse);
  });

  it('should call http.get with job process URL', () => {
    const mockResponse = of({ job: 'done' }) as any;
    httpSpy.get.and.returnValue(mockResponse);

    const result = service.stgEdrParticipantDateProcess();

    expect(httpSpy.get).toHaveBeenCalledWith('/api/jobprocess');
    expect(result).toBe(mockResponse);
  });
});
