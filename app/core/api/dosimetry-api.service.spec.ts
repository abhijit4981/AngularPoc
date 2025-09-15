import { TestBed } from '@angular/core/testing';
import { DosimetryApiService } from './dosimetry-api.service';
import { AppConfigService } from '../services/init/app-config.service';
import { PublisherService } from '../services/publisher.service';
import { Subject } from 'rxjs';
import { LoginApi } from './login-api';
import { DmApi } from './dm-api';

describe('DosimetryApiService', () => {
  let service: DosimetryApiService;
  let publisherService: PublisherService;
  let isConfigLoaded$: Subject<boolean>;
  let mockAppConfig: jasmine.SpyObj<AppConfigService>;

  beforeEach(() => {
    isConfigLoaded$ = new Subject<boolean>();
    mockAppConfig = jasmine.createSpyObj('AppConfigService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        DosimetryApiService,
        { provide: AppConfigService, useValue: mockAppConfig },
        {
          provide: PublisherService,
          useValue: {
            isConfigLoaded$: isConfigLoaded$.asObservable(),
            notifyConfig: jasmine.createSpy('notifyConfig')
          }
        }
      ]
    });

    service = TestBed.inject(DosimetryApiService);
    publisherService = TestBed.inject(PublisherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not initialize Login and Dm if config not loaded', () => {
    expect(service.Login).toBeUndefined();
    expect(service.Dm).toBeUndefined();
  });

  it('should initialize Login and Dm when config is loaded', () => {
    isConfigLoaded$.next(true);

    expect(service.Login).toBeInstanceOf(LoginApi);
    expect(service.Dm).toBeInstanceOf(DmApi);
  });

  it('should not reinitialize if config loaded is false', () => {
    isConfigLoaded$.next(false);

    expect(service.Login).toBeUndefined();
    expect(service.Dm).toBeUndefined();
  });
});
