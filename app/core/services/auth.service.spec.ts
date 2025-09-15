import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpService } from './http/http.service';
import { DosimetryApiService } from '../api/dosimetry-api.service';
import { PublisherService } from './publisher.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let mockHttpService: jasmine.SpyObj<HttpService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDosimetryApiService: jasmine.SpyObj<DosimetryApiService>;
  let mockPublisherService: jasmine.SpyObj<PublisherService>;

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpService', ['get', 'post']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const apiSpy = jasmine.createSpyObj('DosimetryApiService', [], {
      Login: { REDIRECT_TO_LOGIN_URL: 'http://test-login.com' }
    });
    const publisherSpy = jasmine.createSpyObj('PublisherService', ['notifyAuth', 'notifySsoLoginRedirect']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpService, useValue: httpSpy },
        { provide: Router, useValue: routerSpy },
        { provide: DosimetryApiService, useValue: apiSpy },
        { provide: PublisherService, useValue: publisherSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    mockHttpService = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockDosimetryApiService = TestBed.inject(DosimetryApiService) as jasmine.SpyObj<DosimetryApiService>;
    mockPublisherService = TestBed.inject(PublisherService) as jasmine.SpyObj<PublisherService>;
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('userActionOccured', () => {
    it('should return an observable', () => {
      expect(service.userActionOccured).toBeTruthy();
      expect(typeof service.userActionOccured.subscribe).toBe('function');
    });

    it('should emit when notifyUserAction is called', () => {
      let emitted = false;
      service.userActionOccured.subscribe(() => {
        emitted = true;
      });
      
      service.notifyUserAction();
      expect(emitted).toBe(true);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true in development mode', () => {
      const originalProduction = environment.production;
      environment.production = false;
      
      expect(service.isAuthenticated()).toBe(true);
      
      environment.production = originalProduction;
    });

    it('should return true when access token exists in production', () => {
      const originalProduction = environment.production;
      environment.production = true;
      sessionStorage.setItem('Access_Token', 'test-token');
      
      expect(service.isAuthenticated()).toBe(true);
      
      environment.production = originalProduction;
    });

    it('should return false when no access token in production', () => {
      const originalProduction = environment.production;
      environment.production = true;
      sessionStorage.removeItem('Access_Token');
      
      expect(service.isAuthenticated()).toBe(false);
      
      environment.production = originalProduction;
    });
  });

  describe('getAuthorizationTokens', () => {
    it('should return empty access-token when no token in session storage', () => {
      sessionStorage.removeItem('Access_Token');
      const tokens = service.getAuthorizationTokens();
      expect(tokens['access-token']).toBe('');
    });

    it('should return access-token from session storage when available', () => {
      const testToken = 'test-access-token';
      sessionStorage.setItem('Access_Token', testToken);
      const tokens = service.getAuthorizationTokens();
      expect(tokens['access-token']).toBe(testToken);
    });
  });

  describe('notifyUserAction', () => {
    it('should trigger user action subject', () => {
      spyOn(service._userActionOccured, 'next');
      service.notifyUserAction();
      expect(service._userActionOccured.next).toHaveBeenCalled();
    });
  });

  describe('signOut', () => {
    it('should clear session storage and notify publisher', () => {
      sessionStorage.setItem('test', 'value');
      service.signOut();
      
      expect(sessionStorage.length).toBe(0);
      expect(mockPublisherService.notifyAuth).toHaveBeenCalledWith(false);
    });
  });
});
