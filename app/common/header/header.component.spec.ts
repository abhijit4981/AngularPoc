import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { PublisherService } from 'src/app/core/services/publisher.service';
import { of } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  }; 
  let authService: AuthService;
  let commonService: CommonService;
  let publisherService: PublisherService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ HeaderComponent ],
      providers: [ HttpClient, HttpHandler,{ provide: Router, useValue: mockRouter } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    spyOn(component, 'ngOnDestroy').and.callFake(() => console.log('fake ngOnDestroy'));
    fixture.detectChanges();
    authService = TestBed.get(AuthService);
    commonService = TestBed.get(CommonService);
    publisherService = TestBed.get(PublisherService);
  });

  /* it('should create', () => {
    spyOn(authService,'getAuthorizationTokens').and.returnValue(of());
    spyOn(commonService,'getLoggedUserInfo').and.returnValue(of());
    publisherService.notifySsoLoginRedirect(true);
    expect(component).toBeTruthy();
  }); */

  /* it('no token', () => {
    spyOn(authService,'getAuthorizationTokens').and.returnValue(of(null));
    spyOn(commonService,'getLoggedUserInfo').and.returnValue(of({ hasError: true }));
    expect(component).toBeTruthy();
  }); */

  /* it('unsubscribe', () =>{
    spyOn((component as any).authenticationSubscription,'unsubscribe').and.callThrough();
    spyOn((component as any).loginRedirectionSubscription,'unsubscribe').and.callThrough();
    component.ngOnDestroy();
  }); */
});
