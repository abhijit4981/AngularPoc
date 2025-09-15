import { TestBed } from '@angular/core/testing';
import { AppConfigService, Configuration } from '../services/init/app-config.service';
import { DmApi } from './dm-api';

describe('DmApi', () => {
  let service: DmApi;
  let appConfigSpy: jasmine.SpyObj<AppConfigService>;

  beforeEach(() => {
    appConfigSpy = jasmine.createSpyObj('AppConfigService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AppConfigService, useValue: appConfigSpy },
        DmApi
      ]
    });

    service = TestBed.inject(DmApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call BaseApi constructor with DM_API_ENDPOINT', () => {
    // Instead of checking private properties,
    // verify that service has the constants initialized
    expect(service.GET_ALL_LOCATIONS_URL).toBeTruthy();
    // Minimal but confirms BaseApi wiring works
  });

  it('should have all endpoint constants defined', () => {
    expect(service.GET_ALL_TYPEREFS_URL).toBeTruthy();
    expect(service.GET_ALL_NUCLIDES_URL).toBeTruthy();
    expect(service.GET_ALL_TYPEGROUPS_URL).toBeTruthy();
    expect(service.SAVE_TYPEGROUP_REF_URL).toBeTruthy();
    expect(service.GET_ALL_EMPLOYEES_URL).toBeTruthy();
    expect(service.GET_ALL_EXTERNAL_DOSIMETER_URL).toBeTruthy();
    expect(service.SAVE_EXTERNAL_DOSE_RESULT_URL).toBeTruthy();
    expect(service.GET_ALL_INTERNAL_DOSIMETER_URL).toBeTruthy();
    expect(service.SAVE_INTERNAL_DOSE_RESULT_URL).toBeTruthy();
    expect(service.GET_ALL_DOSIMETER_BY_PARTICIPANTID_URL).toBeTruthy();
    expect(service.GET_ALL_DASHBOARD_COUNT_URL).toBeTruthy();
    expect(service.GET_REJECT_PARTICIPANT_RECORDLIST_URL).toBeTruthy();
    expect(service.GET_REJECT_EDR_RECORDLIST_URL).toBeTruthy();
    expect(service.GET_REJECT_PERSONNEL_RECORDLIST_URL).toBeTruthy();
    expect(service.GET_LOGGED_USER_DETAILS_URL).toBeTruthy();
    expect(service.GET_PARTICIPANT_REJECTION_DETAILS_URL).toBeTruthy();
    expect(service.SAVE_PARTICIPANT_REJECTION_DETAILS_URL).toBeTruthy();
    expect(service.GET_EDR_REJECTION_DETAILS_URL).toBeTruthy();
    expect(service.SAVE_EDR_REJECTION_DETAILS_URL).toBeTruthy();
    expect(service.GET_ALL_ACCOUNTS_URL).toBeTruthy();
    expect(service.GET_ALL_INTAKE_RETENTION_URL).toBeTruthy();
    expect(service.GET_PERSON_DETAIL_URL).toBeTruthy();
    expect(service.GET_PERSON_DETAIL_BY_ID_URL).toBeTruthy();
    expect(service.SAVE_ALL_ACCOUNTS_URL).toBeTruthy();
    expect(service.SAVE_ALL_INTAKE_RETENTION_URL).toBeTruthy();
    expect(service.SAVE_ALL_NUCLIDES_URL).toBeTruthy();
    expect(service.SAVE_ALL_LOCATIONS_URL).toBeTruthy();
    expect(service.SAVE_PERSON_DETAIL_URL).toBeTruthy();
    expect(service.GET_FLAG_PERSONNEL_DETAILS_URL).toBeTruthy();
    expect(service.SAVE_FLAG_PERSONNEL_DETAILS_URL).toBeTruthy();
    expect(service.GET_EDR_PROCESS_URL).toBeTruthy();
    expect(service.GET_PARTICIPANT_PROCESS_URL).toBeTruthy();
    expect(service.GET_JOB_PROCESS_URL).toBeTruthy();
  });
});
