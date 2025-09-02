import { TestBed } from '@angular/core/testing';

import { LoginApi } from './login-api';
import { AppConfigService, Configuration } from '../services/init/app-config.service';

describe('LoginApi', () => {
  let service: LoginApi;
  let mockAppConfig: jasmine.SpyObj<AppConfigService>;

  beforeEach(() => {
    const appConfigSpy = jasmine.createSpyObj('AppConfigService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        LoginApi,
        { provide: AppConfigService, useValue: appConfigSpy }
      ]
    });

    mockAppConfig = TestBed.inject(AppConfigService) as jasmine.SpyObj<AppConfigService>;
  });

  it('should be created', () => {
    mockAppConfig.get.and.returnValue('https://login-api.example.com');
    service = TestBed.inject(LoginApi);
    expect(service).toBeTruthy();
  });

  it('should extend BaseApi', () => {
    mockAppConfig.get.and.returnValue('https://login-api.example.com');
    service = TestBed.inject(LoginApi);
    expect(service.endpoint).toBeDefined();
  });

  it('should initialize with correct configuration', () => {
    mockAppConfig.get.and.returnValue('https://login-api.example.com');
    service = TestBed.inject(LoginApi);
    
    expect(mockAppConfig.get).toHaveBeenCalledWith(Configuration.LOGIN_API_ENDPOINT);
    expect(service.endpoint).toBe('https://login-api.example.com');
  });

  it('should have REDIRECT_TO_LOGIN_URL property', () => {
    mockAppConfig.get.and.returnValue('https://login-api.example.com');
    service = TestBed.inject(LoginApi);
    
    expect(service.REDIRECT_TO_LOGIN_URL).toBeDefined();
    expect(service.REDIRECT_TO_LOGIN_URL).toBe('https://login-api.example.com');
  });

  it('should call reset method during construction', () => {
    mockAppConfig.get.and.returnValue('https://login-api.example.com');
    
    // Spy on the reset method before creating the service
    spyOn(LoginApi.prototype, 'reset').and.callThrough();
    
    service = TestBed.inject(LoginApi);
    
    expect(LoginApi.prototype.reset).toHaveBeenCalledWith(service);
  });

  it('should process URL properties with endpoint', () => {
    mockAppConfig.get.and.returnValue('https://login-api.example.com');
    service = TestBed.inject(LoginApi);
    
    // The REDIRECT_TO_LOGIN_URL should be processed to include the endpoint
    expect(service.REDIRECT_TO_LOGIN_URL).toBe('https://login-api.example.com');
  });

  it('should work with different endpoint configurations', () => {
    mockAppConfig.get.and.returnValue('https://different-login-api.com');
    service = TestBed.inject(LoginApi);
    
    expect(service.endpoint).toBe('https://different-login-api.com');
  });

  it('should handle empty endpoint configuration', () => {
    mockAppConfig.get.and.returnValue('');
    service = TestBed.inject(LoginApi);
    
    expect(service.endpoint).toBe('');
  });

  it('should be injectable as singleton', () => {
    mockAppConfig.get.and.returnValue('https://login-api.example.com');
    
    const service1 = TestBed.inject(LoginApi);
    const service2 = TestBed.inject(LoginApi);
    
    expect(service1).toBe(service2);
  });
});