import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from 'src/app/core/services/http/http.service';
import { DosimetryApiService as DMApi } from '../../core/api/dosimetry-api.service';
import { of } from 'rxjs';

import { CommonService } from './common.service';

describe('CommonService', () => {
  let service: CommonService;
  let httpService: HttpService;
  let dmApi: DMApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HttpService, DMApi]
    });
    
    service = TestBed.get(CommonService);
    httpService = TestBed.get(HttpService);
    dmApi = TestBed.get(DMApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /* it('should call getAllLocations', () => {
    const mockResponse = [{ id: 1, name: 'Location 1' }];
    spyOn(httpService, 'get').and.returnValue(of(mockResponse));
    
    const result = service.getAllLocations();
    expect(httpService.get).toHaveBeenCalledWith(dmApi.Dm.GET_ALL_LOCATIONS_URL);
    expect(result).toBeDefined();
  }); */

  /* it('should call getAllTypeGroups', () => {
    const mockResponse = [{ id: 1, name: 'Type Group 1' }];
    spyOn(httpService, 'get').and.returnValue(of(mockResponse));
    
    const result = service.getAllTypeGroups();
    expect(httpService.get).toHaveBeenCalledWith(dmApi.Dm.GET_ALL_TYPEGROUPS_URL);
    expect(result).toBeDefined();
  }); */

  /* it('should call getAllTypeRefs', () => {
    const mockResponse = [{ id: 1, name: 'Type Ref 1' }];
    spyOn(httpService, 'get').and.returnValue(of(mockResponse));
    
    const result = service.getAllTypeRefs();
    expect(httpService.get).toHaveBeenCalledWith(dmApi.Dm.GET_ALL_TYPEREFS_URL);
    expect(result).toBeDefined();
  }); */

  /* it('should call getLoggedUserInfo', () => {
    const mockResponse = [{ id: 1, username: 'testuser' }];
    spyOn(httpService, 'get').and.returnValue(of(mockResponse));
    
    const result = service.getLoggedUserInfo();
    expect(httpService.get).toHaveBeenCalledWith(dmApi.Dm.GET_LOGGED_USER_DETAILS_URL);
    expect(result).toBeDefined();
  }); */

  /* it('should call stgEdrParticipantDateProcess', () => {
    const mockResponse = [{ status: 'success' }];
    spyOn(httpService, 'get').and.returnValue(of(mockResponse));
    
    const result = service.stgEdrParticipantDateProcess();
    expect(httpService.get).toHaveBeenCalledWith(dmApi.Dm.GET_JOB_PROCESS_URL);
    expect(result).toBeDefined();
  }); */
});
