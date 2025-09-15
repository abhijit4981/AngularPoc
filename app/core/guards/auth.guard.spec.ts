import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { DosimetryApiService } from '../api/dosimetry-api.service';
import { PublisherService } from '../services/publisher.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockDosimetryApiService: jasmine.SpyObj<DosimetryApiService>;
  let mockPublisherService: jasmine.SpyObj<PublisherService>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const apiSpy = jasmine.createSpyObj('DosimetryApiService', [], {
      Login: { REDIRECT_TO_LOGIN_URL: 'http://test-login.com' }
    });
    const publisherSpy = jasmine.createSpyObj('PublisherService', ['notifySsoLoginRedirect']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: DosimetryApiService, useValue: apiSpy },
        { provide: PublisherService, useValue: publisherSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockDosimetryApiService = TestBed.inject(DosimetryApiService) as jasmine.SpyObj<DosimetryApiService>;
    mockPublisherService = TestBed.inject(PublisherService) as jasmine.SpyObj<PublisherService>;

    mockRoute = new ActivatedRouteSnapshot();
    mockState = { url: '/test' } as RouterStateSnapshot;

    // Mock window.location.href
    spyOnProperty(window, 'location', 'get').and.returnValue({
      href: ''
    } as any);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true when access token is present in query params', () => {
      mockRoute.queryParams = { 'access-token': 'test-token' };
      
      const result = guard.canActivate(mockRoute, mockState);
      
      expect(result).toBe(true);
    });

    it('should return true when no access token but user is authenticated', () => {
      mockRoute.queryParams = {};
      mockAuthService.isAuthenticated.and.returnValue(true);
      
      const result = guard.canActivate(mockRoute, mockState);
      
      expect(result).toBe(true);
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });

    it('should return false and redirect when no access token and user is not authenticated', () => {
      mockRoute.queryParams = {};
      mockAuthService.isAuthenticated.and.returnValue(false);
      
      const locationSpy = jasmine.createSpyObj('Location', ['href']);
      spyOnProperty(window, 'location', 'get').and.returnValue(locationSpy);
      
      const result = guard.canActivate(mockRoute, mockState);
      
      expect(result).toBe(false);
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
      expect(mockPublisherService.notifySsoLoginRedirect).toHaveBeenCalledWith(true);
      expect(locationSpy.href).toBe('http://test-login.com');
    });

    it('should handle null access token', () => {
      mockRoute.queryParams = { 'access-token': null };
      mockAuthService.isAuthenticated.and.returnValue(true);
      
      const result = guard.canActivate(mockRoute, mockState);
      
      expect(result).toBe(true);
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });

    it('should handle undefined access token', () => {
      mockRoute.queryParams = { 'access-token': undefined };
      mockAuthService.isAuthenticated.and.returnValue(false);
      
      const locationSpy = jasmine.createSpyObj('Location', ['href']);
      spyOnProperty(window, 'location', 'get').and.returnValue(locationSpy);
      
      const result = guard.canActivate(mockRoute, mockState);
      
      expect(result).toBe(false);
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
      expect(mockPublisherService.notifySsoLoginRedirect).toHaveBeenCalledWith(true);
      expect(locationSpy.href).toBe('http://test-login.com');
    });

    it('should return true when access token is empty string', () => {
      mockRoute.queryParams = { 'access-token': '' };
      
      const result = guard.canActivate(mockRoute, mockState);
      
      expect(result).toBe(true);
    });
  });
});
