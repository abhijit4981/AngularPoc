import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DosimetryApiService as DMApi } from '../../core/api/dosimetry-api.service';
import { PublisherService } from '../services/publisher.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let route = ActivatedRouteSnapshot;
  let state = RouterStateSnapshot;
  let authService = AuthService;
  let api = DMApi;
  let router = Router;
  let spy: any;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard, HttpClient, HttpHandler,
        { provide: Router, useValue: mockRouter }, DMApi, AuthService 
      ]
    });

    authService = TestBed.get(AuthService);
    router = TestBed.get(Router);
    authGuard = TestBed.get(AuthGuard);
  });

  it('should ...', () => {
    expect(authGuard).toBeTruthy();
  });
  
});
