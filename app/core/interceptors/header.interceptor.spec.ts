import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpHeaders, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { HeaderInterceptor } from './header.interceptor';
import { AuthService } from '../services/auth.service';

describe('HeaderInterceptor', () => {
  let interceptor: HeaderInterceptor;
  let authService: jasmine.SpyObj<AuthService>;
  let httpHandler: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getAuthorizationTokens']);
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        HeaderInterceptor,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: HttpHandler, useValue: httpHandlerSpy }
      ]
    });

    interceptor = TestBed.inject(HeaderInterceptor);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    httpHandler = TestBed.inject(HttpHandler) as jasmine.SpyObj<HttpHandler>;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  describe('intercept', () => {
    it('should add default headers to request', () => {
      const mockRequest = new HttpRequest('GET', '/api/test');
      const mockResponse = new HttpResponse({ body: {} });
      
      authService.getAuthorizationTokens.and.returnValue({});
      httpHandler.handle.and.returnValue(of(mockResponse));

      interceptor.intercept(mockRequest, httpHandler);

      expect(httpHandler.handle).toHaveBeenCalled();
      const capturedRequest = httpHandler.handle.calls.first().args[0];
      
      expect(capturedRequest.headers.get('Content-Type')).toBe('application/json');
      expect(capturedRequest.headers.get('Accept')).toBe('application/json');
      expect(capturedRequest.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('should add access token to headers when available', () => {
      const mockRequest = new HttpRequest('GET', '/api/test');
      const mockResponse = new HttpResponse({ body: {} });
      const mockTokens = { 'access-token': 'test-token-123' };
      
      authService.getAuthorizationTokens.and.returnValue(mockTokens);
      httpHandler.handle.and.returnValue(of(mockResponse));

      interceptor.intercept(mockRequest, httpHandler);

      const capturedRequest = httpHandler.handle.calls.first().args[0];
      expect(capturedRequest.headers.get('access-token')).toBe('test-token-123');
    });

    it('should not add access token when not available', () => {
      const mockRequest = new HttpRequest('GET', '/api/test');
      const mockResponse = new HttpResponse({ body: {} });
      
      authService.getAuthorizationTokens.and.returnValue({});
      httpHandler.handle.and.returnValue(of(mockResponse));

      interceptor.intercept(mockRequest, httpHandler);

      const capturedRequest = httpHandler.handle.calls.first().args[0];
      expect(capturedRequest.headers.get('access-token')).toBeNull();
    });

    it('should preserve existing headers from original request', () => {
      const existingHeaders = new HttpHeaders({
        'Custom-Header': 'custom-value',
        'Another-Header': 'another-value'
      });
      const mockRequest = new HttpRequest('GET', '/api/test', null, { headers: existingHeaders });
      const mockResponse = new HttpResponse({ body: {} });
      
      authService.getAuthorizationTokens.and.returnValue({});
      httpHandler.handle.and.returnValue(of(mockResponse));

      interceptor.intercept(mockRequest, httpHandler);

      const capturedRequest = httpHandler.handle.calls.first().args[0];
      expect(capturedRequest.headers.get('Custom-Header')).toBe('custom-value');
      expect(capturedRequest.headers.get('Another-Header')).toBe('another-value');
    });

    it('should handle requests with empty headers', () => {
      const mockRequest = new HttpRequest('GET', '/api/test');
      const mockResponse = new HttpResponse({ body: {} });
      
      authService.getAuthorizationTokens.and.returnValue({});
      httpHandler.handle.and.returnValue(of(mockResponse));

      expect(() => {
        interceptor.intercept(mockRequest, httpHandler);
      }).not.toThrow();

      expect(httpHandler.handle).toHaveBeenCalled();
    });

    it('should handle POST requests correctly', () => {
      const mockRequest = new HttpRequest('POST', '/api/test', { data: 'test' });
      const mockResponse = new HttpResponse({ body: {} });
      
      authService.getAuthorizationTokens.and.returnValue({ 'access-token': 'post-token' });
      httpHandler.handle.and.returnValue(of(mockResponse));

      interceptor.intercept(mockRequest, httpHandler);

      const capturedRequest = httpHandler.handle.calls.first().args[0];
      expect(capturedRequest.method).toBe('POST');
      expect(capturedRequest.headers.get('access-token')).toBe('post-token');
      expect(capturedRequest.headers.get('Content-Type')).toBe('application/json');
    });

    it('should handle tap operators correctly', () => {
      const mockRequest = new HttpRequest('GET', '/api/test');
      const mockResponse = new HttpResponse({ body: { success: true } });
      
      authService.getAuthorizationTokens.and.returnValue({});
      httpHandler.handle.and.returnValue(of(mockResponse));

      const result = interceptor.intercept(mockRequest, httpHandler);
      
      result.subscribe(response => {
        expect(response).toBe(mockResponse);
      });

      expect(httpHandler.handle).toHaveBeenCalled();
    });
  });

  describe('getHttpRequestHeaders', () => {
    it('should create headers with default values', () => {
      const emptyHeaders = new HttpHeaders();
      authService.getAuthorizationTokens.and.returnValue({});

      const result = interceptor['getHttpRequestHeaders'](emptyHeaders);

      expect(result['Content-Type']).toBe('application/json');
      expect(result['Accept']).toBe('application/json');
      expect(result['Access-Control-Allow-Origin']).toBe('*');
    });

    it('should include access token when available', () => {
      const emptyHeaders = new HttpHeaders();
      authService.getAuthorizationTokens.and.returnValue({ 'access-token': 'private-token' });

      const result = interceptor['getHttpRequestHeaders'](emptyHeaders);

      expect(result['access-token']).toBe('private-token');
    });

    it('should merge existing headers', () => {
      const existingHeaders = new HttpHeaders()
        .set('Authorization', 'Bearer token')
        .set('Custom-ID', '12345');
      authService.getAuthorizationTokens.and.returnValue({});

      const result = interceptor['getHttpRequestHeaders'](existingHeaders);

      expect(result['Authorization']).toBe('Bearer token');
      expect(result['Custom-ID']).toBe('12345');
      expect(result['Content-Type']).toBe('application/json');
    });

    it('should handle headers without access token', () => {
      const emptyHeaders = new HttpHeaders();
      authService.getAuthorizationTokens.and.returnValue({ 'refresh-token': 'refresh123' });

      const result = interceptor['getHttpRequestHeaders'](emptyHeaders);

      expect(result['access-token']).toBeUndefined();
      expect(result['Content-Type']).toBe('application/json');
    });
  });
});