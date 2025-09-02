import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { DosimetryApiService } from '../../core/api/dosimetry-api.service';
import { AppConfigService } from '../../core/services/init/app-config.service';
import { LoginApi } from '../../core/api/login-api';
import { PublisherService } from '../../core/services/publisher.service';
import { MessageService } from 'src/app/core/services/message.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let appConfigService: AppConfigService;
  let publisherService: PublisherService;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule, ToastrModule.forRoot(), BrowserAnimationsModule ],
      declarations: [ LoginComponent ],
      providers: [ HttpClient, HttpHandler, AppConfigService, PublisherService,
        {provide: MessageService}, {provide: AuthService},
        { provide: ActivatedRoute, useValue: {params: of({manual: true})}}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    let appConfigService = TestBed.get(AppConfigService);
    publisherService = TestBed.get(PublisherService);
    let api = new DosimetryApiService(appConfigService, publisherService);
    let messageService = TestBed.get(MessageService);
    let authService = TestBed.get(AuthService);
    let route = TestBed.get(ActivatedRoute);
    publisherService.notifyConfig(true);
    component = new LoginComponent(route, api, messageService, authService, publisherService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* it('should initialize with login redirect URL', () => {
    expect(component.loginRedirectUrl).toBeDefined();
  }); */
});
