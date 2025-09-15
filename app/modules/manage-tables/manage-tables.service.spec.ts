import { TestBed } from '@angular/core/testing';
import { ManageTablesService } from './manage-tables.service';
import { HttpService } from 'src/app/core/services/http/http.service';
import { DosimetryApiService } from 'src/app/core/api/dosimetry-api.service';

describe('ManageTablesService', () => {
  let service: ManageTablesService;
  let httpSpy: jasmine.SpyObj<HttpService>;
  let apiMock: any;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpService', ['get', 'post']);
    apiMock = {
      Dm: {
        SAVE_TYPEGROUP_REF_URL: '/saveTypeGroup',
        GET_ALL_ACCOUNTS_URL: '/getAllAccounts',
        GET_ALL_INTAKE_RETENTION_URL: '/getAllIntakeRetention',
        GET_ALL_NUCLIDES_URL: '/getAllNuclides',
        GET_PERSON_DETAIL_URL: '/getPersonDetail',
        GET_PERSON_DETAIL_BY_ID_URL: '/getPersonDetailById',
        SAVE_ALL_ACCOUNTS_URL: '/saveAllAccounts',
        SAVE_ALL_INTAKE_RETENTION_URL: '/saveAllIntakeRetention',
        SAVE_ALL_NUCLIDES_URL: '/saveAllNuclides',
        SAVE_ALL_LOCATIONS_URL: '/saveAllLocations',
        SAVE_PERSON_DETAIL_URL: '/savePersonDetail',
      }
    };

    TestBed.configureTestingModule({
      providers: [
        ManageTablesService,
        { provide: HttpService, useValue: httpSpy },
        { provide: DosimetryApiService, useValue: apiMock }
      ]
    });

    service = TestBed.inject(ManageTablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call updateTypeGroup with correct params', () => {
    const payload = { id: 1 };
    service.updateTypeGroup(payload);
    expect(httpSpy.post).toHaveBeenCalledWith(apiMock.Dm.SAVE_TYPEGROUP_REF_URL, JSON.stringify(payload), null);
  });

  it('should call getAllAccounts', () => {
    service.getAllAccounts();
    expect(httpSpy.get).toHaveBeenCalledWith(apiMock.Dm.GET_ALL_ACCOUNTS_URL);
  });

  it('should call getAllIntakeRetention', () => {
    service.getAllIntakeRetention();
    expect(httpSpy.get).toHaveBeenCalledWith(apiMock.Dm.GET_ALL_INTAKE_RETENTION_URL);
  });

  it('should call getAllRadionuclides', () => {
    service.getAllRadionuclides();
    expect(httpSpy.get).toHaveBeenCalledWith(apiMock.Dm.GET_ALL_NUCLIDES_URL);
  });

  it('should return [] when getPersonData called with empty string', (done) => {
    service.getPersonData('   ').subscribe(result => {
      expect(result).toEqual([]);
      done();
    });
  });

  it('should call getPersonData when criteria provided', () => {
    service.getPersonData('abc');
    expect(httpSpy.get).toHaveBeenCalledWith(apiMock.Dm.GET_PERSON_DETAIL_URL + '?searchVal=abc');
  });

  it('should call getPersonDataByID with correct param', () => {
    service.getPersonDataByID(123);
    expect(httpSpy.get).toHaveBeenCalledWith(apiMock.Dm.GET_PERSON_DETAIL_BY_ID_URL + '?personId=123');
  });

  it('should call saveAllAccounts', () => {
    const accounts = [{ id: 1 }];
    service.saveAllAccounts(accounts);
    expect(httpSpy.post).toHaveBeenCalledWith(apiMock.Dm.SAVE_ALL_ACCOUNTS_URL, accounts);
  });

  it('should call saveAllIntakeRetention', () => {
    const data = { val: 1 };
    service.saveAllIntakeRetention(data);
    expect(httpSpy.post).toHaveBeenCalledWith(apiMock.Dm.SAVE_ALL_INTAKE_RETENTION_URL, data);
  });

  it('should call saveAllRadionuclides', () => {
    const data = { val: 2 };
    service.saveAllRadionuclides(data);
    expect(httpSpy.post).toHaveBeenCalledWith(apiMock.Dm.SAVE_ALL_NUCLIDES_URL, data);
  });

  it('should call saveAllLocation', () => {
    const data = { val: 3 };
    service.saveAllLocation(data);
    expect(httpSpy.post).toHaveBeenCalledWith(apiMock.Dm.SAVE_ALL_LOCATIONS_URL, data);
  });

  it('should call savePersonDetails', () => {
    const person = { name: 'John' };
    service.savePersonDetails(person);
    expect(httpSpy.post).toHaveBeenCalledWith(apiMock.Dm.SAVE_PERSON_DETAIL_URL, person);
  });
});
