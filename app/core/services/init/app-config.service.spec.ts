import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { AppConfigService, Configuration } from './app-config.service';
import { HttpService } from '../http/http.service';
import { PublisherService } from '../publisher.service';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;
  let publisherServiceSpy: jasmine.SpyObj<PublisherService>;

  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj('HttpService', ['post']);
    publisherServiceSpy = jasmine.createSpyObj('PublisherService', ['notifyConfig']);

    TestBed.configureTestingModule({
      providers: [
        AppConfigService,
        { provide: HttpService, useValue: httpServiceSpy },
        { provide: PublisherService, useValue: publisherServiceSpy }
      ]
    });

    service = TestBed.inject(AppConfigService);
  });

  it('should return empty string if config is null', () => {
    expect(service.get(Configuration.API_KEY)).toBe('');
  });

  it('should return value from config when set', () => {
    (service as any).config = {
      apiKey: 'abc123',
      dmApiEndPoint: 'http://test-api',
      loginApiEndPoint: 'http://test-login'
    };
    expect(service.get(Configuration.API_KEY)).toBe('abc123');
    expect(service.get(Configuration.DM_API_ENDPOINT)).toBe('http://test-api');
    expect(service.get(Configuration.LOGIN_API_ENDPOINT)).toBe('http://test-login');
  });

  it('should load config successfully', async () => {
    const mockResponse = {
      apiKey: 'live-api-key',
      apiUrl: 'http://real-api',
      appLoginUrl: 'http://real-login'
    };
    httpServiceSpy.post.and.returnValue(
    of({
      apiKey: 'live-api-key',
      apiUrl: 'http://real-api',
      appLoginUrl: 'http://real-login'
    }) as unknown as Observable<any>
  );

    await service.load();

    expect((service as any).config).toEqual({
      apiKey: 'live-api-key',
      dmApiEndPoint: 'http://real-api',
      loginApiEndPoint: 'http://real-login'
    });
    expect(publisherServiceSpy.notifyConfig).toHaveBeenCalledWith(true);
  });

  it('should fallback to defaults when http.post errors (catchError path)', async () => {
    httpServiceSpy.post.and.returnValue(throwError(() => new Error('Network error')));

    await service.load();

    expect((service as any).config).toEqual({
      apiKey: 'dev-api-key',
      dmApiEndPoint: 'http://localhost:3000/api',
      loginApiEndPoint: 'http://localhost:4200/login'
    });
    expect(publisherServiceSpy.notifyConfig).toHaveBeenCalledWith(true);
  });

  it('should resolve with defaults when subscribe error is triggered (error callback)', async () => {
    // simulate Observable that immediately errors in subscribe
    httpServiceSpy.post.and.returnValue({
      pipe: () => ({
        subscribe: ({ error }) => error('Critical error')
      })
    } as any);

    await service.load();

    expect((service as any).config).toEqual({
      apiKey: 'dev-api-key',
      dmApiEndPoint: 'http://localhost:3000/api',
      loginApiEndPoint: 'http://localhost:4200/login'
    });
    expect(publisherServiceSpy.notifyConfig).toHaveBeenCalledWith(true);
  });
});
