import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ HttpClient, HttpHandler, { provide: Router, useValue: mockRouter } ]
  }));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });
});
