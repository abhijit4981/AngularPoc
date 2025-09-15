import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { CommonService } from 'src/app/shared/services/common.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { PublisherService } from 'src/app/core/services/publisher.service';
import { of, Subject } from 'rxjs';
import { User } from 'src/app/shared/models/user';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  let mockCommonService: jasmine.SpyObj<CommonService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let publisherService: Partial<PublisherService>;

  let authChanged$ = new Subject<boolean>();
  let loginRedirected$ = new Subject<boolean>();

  beforeEach(async () => {
    mockCommonService = jasmine.createSpyObj('CommonService', ['getLoggedUserInfo']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    publisherService = {
      isAuthChanged$: authChanged$.asObservable(),
      isLoginRedirected$: loginRedirected$.asObservable()
    };

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: CommonService, useValue: mockCommonService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: PublisherService, useValue: publisherService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set authenticated true and fetch user info if authenticated initially', () => {
    const mockUser: User = { id: 1, name: 'Test User' } as unknown as User;
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockCommonService.getLoggedUserInfo.and.returnValue(of(mockUser));

    fixture.detectChanges(); // triggers ngOnInit

    expect(component.authenticated).toBeTrue();
    expect(mockCommonService.getLoggedUserInfo).toHaveBeenCalled();
    expect(component.userInfo).toEqual(mockUser);
  });

  it('should set authenticated false if not authenticated initially', () => {
    mockAuthService.isAuthenticated.and.returnValue(false);
    fixture.detectChanges();

    expect(component.authenticated).toBeFalse();
    expect(mockCommonService.getLoggedUserInfo).not.toHaveBeenCalled();
  });

  it('should update authenticated and fetch user info on authentication change', () => {
    const mockUser: User = { id: 2, name: 'Changed User' } as unknown as User;
    mockAuthService.isAuthenticated.and.returnValue(false);
    mockCommonService.getLoggedUserInfo.and.returnValue(of(mockUser));

    fixture.detectChanges(); // init first
    authChanged$.next(true); // simulate auth change

    expect(component.authenticated).toBeTrue();
    expect(component.userInfo).toEqual(mockUser);
  });

  it('should set loginRedirected on loginRedirection change', () => {
    mockAuthService.isAuthenticated.and.returnValue(false);

    fixture.detectChanges();
    loginRedirected$.next(true);

    expect(component.loginRedirected).toBeTrue();
  });

  it('should unsubscribe on destroy', () => {
    mockAuthService.isAuthenticated.and.returnValue(false);
    fixture.detectChanges();

    const unsubAuthSpy = spyOn(component['authenticationSubscription'], 'unsubscribe').and.callThrough();
    const unsubLoginSpy = spyOn(component['loginRedirectionSubscription'], 'unsubscribe').and.callThrough();

    component.ngOnDestroy();

    expect(unsubAuthSpy).toHaveBeenCalled();
    expect(unsubLoginSpy).toHaveBeenCalled();
  });
});
