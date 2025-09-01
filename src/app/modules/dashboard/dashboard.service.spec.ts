import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';

describe('DashboardService', () => {
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ HttpClient, HttpHandler, { provide: Router, useValue: mockRouter}]
  }));

  it('should be created', () => {
    const service: DashboardService = TestBed.get(DashboardService);
    expect(service).toBeTruthy();
  });
});
