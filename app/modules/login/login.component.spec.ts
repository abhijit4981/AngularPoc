import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { LoginComponent } from './login.component';
import { DosimetryApiService as DMApi } from '../../core/api/dosimetry-api.service';
import { PublisherService } from 'src/app/core/services/publisher.service';
import { MessageService } from 'src/app/core/services/message.service';
import { AuthService } from 'src/app/core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let publisherService: PublisherService;
  let signOutSubject: Subject<any>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['signOut']);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['success']);
    signOutSubject = new Subject<any>();

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: { queryParamMap: of(new Map([['manual', null]])) } 
        },
        { provide: DMApi, useValue: { Login: { REDIRECT_TO_LOGIN_URL: '/mock-login' } } },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { 
          provide: PublisherService, 
          useValue: { signOutRequest$: signOutSubject.asObservable() } 
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    publisherService = TestBed.inject(PublisherService);
    fixture.detectChanges();
  });

  it('should create and set loginRedirectUrl from DMApi', () => {
    expect(component).toBeTruthy();
    expect(component.loginRedirectUrl).toBe('/mock-login');
  });

  it('should call signOut when queryParam manual is true', () => {
    const route = TestBed.inject(ActivatedRoute);
    (route as any).queryParamMap = of(new Map([['manual', 'true']]));

    spyOn<any>(component, 'signOut').and.callThrough();
    component.ngOnInit();

    expect(component['signOut']).toHaveBeenCalledWith('true');
  });

  it('should subscribe to signOutRequest$ and call signOut("false")', () => {
    spyOn<any>(component, 'signOut').and.callThrough();
    component.ngOnInit();

    signOutSubject.next({});
    expect(component['signOut']).toHaveBeenCalledWith('false');
  });

  it('should unsubscribe on ngOnDestroy', () => {
    component.ngOnInit();
    const unsubscribeSpy = spyOn(component['signOutRequestSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should sign out with manual=true and show success message', (done) => {
    component['signOut']('true');

    setTimeout(() => {
      expect(messageServiceSpy.success).toHaveBeenCalledWith('Successfully logout.');
      expect(authServiceSpy.signOut).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('should sign out with manual=false and not call success', () => {
    component['signOut']('false');
    expect(messageServiceSpy.success).not.toHaveBeenCalled();
    expect(authServiceSpy.signOut).toHaveBeenCalled();
  });
});
