import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { HttpService } from '../../core/services/http/http.service';
import { DosimetryApiService as DmApi } from '../../core/api/dosimetry-api.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpSpy: jasmine.SpyObj<HttpService>;
  let apiStub: Partial<DmApi>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpService', ['get', 'post', 'put']);
    apiStub = {
      Dm: {
        GET_ALL_DASHBOARD_COUNT_URL: '/dashboard/counts',
        GET_REJECT_PARTICIPANT_RECORDLIST_URL: '/reject/participant',
        GET_REJECT_EDR_RECORDLIST_URL: '/reject/edr',
        GET_REJECT_PERSONNEL_RECORDLIST_URL: '/reject/personnel',
        GET_PARTICIPANT_REJECTION_DETAILS_URL: '/participant/details',
        SAVE_PARTICIPANT_REJECTION_DETAILS_URL: '/participant/save',
        GET_ALL_ACCOUNTS_URL: '/accounts',
        GET_EDR_REJECTION_DETAILS_URL: '/edr/details',
        SAVE_EDR_REJECTION_DETAILS_URL: '/edr/save',
        GET_FLAG_PERSONNEL_DETAILS_URL: '/person/details',
        SAVE_FLAG_PERSONNEL_DETAILS_URL: '/person/save',
      } as any
    };

    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        { provide: HttpService, useValue: httpSpy },
        { provide: DmApi, useValue: apiStub }
      ]
    });

    service = TestBed.inject(DashboardService);

    httpSpy.get.and.returnValue(of([] as any[]));
    httpSpy.post.and.returnValue(of([] as any[]));
    httpSpy.put.and.returnValue(of([] as any[]));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllCounts should call http.get with correct URL', () => {
    service.getAllCounts().subscribe();
    expect(httpSpy.get).toHaveBeenCalledWith('/dashboard/counts');
  });

  it('getRecordListParticipant should call http.get with correct URL', () => {
    service.getRecordListParticipant().subscribe();
    expect(httpSpy.get).toHaveBeenCalledWith('/reject/participant');
  });

  it('getRecordListEDR should call http.get with correct URL', () => {
    service.getRecordListEDR().subscribe();
    expect(httpSpy.get).toHaveBeenCalledWith('/reject/edr');
  });

  it('getRecordListPersonnel should call http.get with correct URL', () => {
    service.getRecordListPersonnel().subscribe();
    expect(httpSpy.get).toHaveBeenCalledWith('/reject/personnel');
  });

  it('getParticipantRejectionDetails should call http.get with correct URL and id', () => {
    service.getParticipantRejectionDetails(123).subscribe();
    expect(httpSpy.get).toHaveBeenCalledWith('/participant/details?participantid=123');
  });

  it('saveParticipantRejectionDetails should call http.put with correct URL and body', () => {
    const data = { foo: 'bar' };
    service.saveParticipantRejectionDetails(data).subscribe();
    expect(httpSpy.put).toHaveBeenCalledWith('/participant/save', data);
  });

  it('getAllAccounts should call http.get with correct URL', () => {
    service.getAllAccounts().subscribe();
    expect(httpSpy.get).toHaveBeenCalledWith('/accounts');
  });

  it('getEDRRejectionDetails should call http.get with correct URL and id', () => {
    service.getEDRRejectionDetails(456).subscribe();
    expect(httpSpy.get).toHaveBeenCalledWith('/edr/details?edr_id=456');
  });

  it('saveEDRRejectionDetails should call http.put with correct URL and body', () => {
    const data = { edr: 'test' };
    service.saveEDRRejectionDetails(data).subscribe();
    expect(httpSpy.put).toHaveBeenCalledWith('/edr/save', data);
  });

  it('getPersonnelFlagDetails should call http.get with correct URL and id', () => {
    service.getPersonnelFlagDetails(789).subscribe();
    expect(httpSpy.get).toHaveBeenCalledWith('/person/details?personId=789');
  });

  it('savePersonnelFlagDetails should call http.post with correct URL and body', () => {
    const data = { name: 'John' };
    service.savePersonnelFlagDetails(data).subscribe();
    expect(httpSpy.post).toHaveBeenCalledWith('/person/save', data);
  });
});
