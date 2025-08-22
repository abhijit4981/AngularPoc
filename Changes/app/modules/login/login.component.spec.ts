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

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let appConfigService: AppConfigService;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ LoginComponent ],
      providers: [ HttpClient, HttpHandler, AppConfigService,
        {provide: MessageService}, {provide: AuthService},
        { provide: ActivatedRoute, useValue: {params: of({manual: true})}}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    let appConfigService = TestBed.get(AppConfigService);
    let api = new DosimetryApiService(appConfigService);
    let messageService = TestBed.get(MessageService);
    let authService = TestBed.get(AuthService);
    let route = TestBed.get(ActivatedRoute);
    PublisherService.notifyConfig(true);
    component = new LoginComponent(route, api, messageService, authService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
