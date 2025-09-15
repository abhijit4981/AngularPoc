import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';
import { LoginComponent } from './modules/login/login.component';
import { UnauthorizedComponent } from './common/unauthorized/unauthorized.component';
import { ErrorComponent } from './common/error/error.component';

describe('AppRoutingModule', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppRoutingModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [
        DashboardComponent,
        PageNotFoundComponent,
        LoginComponent,
        UnauthorizedComponent,
        ErrorComponent
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation();
  });

  it('should navigate to Dashboard', async () => {
    await router.navigate(['dashboard']);
    expect(location.path()).toBe('/dashboard');
  });

  it('should lazy load RecordMaintenance module', async () => {
    const module = await import('./modules/record-maintenance/record-maintenance.module');
    expect(module.RecordMaintenanceModule).toBeDefined();
  });

  it('should lazy load ManageTables module', async () => {
    const module = await import('./modules/manage-tables/manage-tables.module');
    expect(module.ManageTablesModule).toBeDefined();
  });

  it('should navigate to RecordMaintenance route', async () => {
    await router.navigate(['record-maintenance']);
    expect(location.path()).toBe('/record-maintenance');
  });

  it('should navigate to ManageTables route', async () => {
    await router.navigate(['manage-tables']);
    expect(location.path()).toBe('/manage-tables');
  });
});
