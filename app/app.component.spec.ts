import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { Location } from '@angular/common';
import { AppComponent } from './app.component';
import { CommonService } from './shared/services/common.service';
import { PublisherService } from './core/services/publisher.service';
import { AuthService } from './core/services/auth.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let commonServiceSpy: jasmine.SpyObj<CommonService>;
  let publisherSpy: jasmine.SpyObj<PublisherService>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let locationSpy: jasmine.SpyObj<Location>;
  let routeSubject: Subject<any>;

  beforeEach(async () => {
    commonServiceSpy = jasmine.createSpyObj('CommonService', ['getAllLocations', 'getAllTypeGroups', 'getAllTypeRefs']);
    publisherSpy = jasmine.createSpyObj('PublisherService', ['notifyAuth', 'notifyAllLocations', 'notifyAllTypeGroups', 'notifyAllTypeRefs', 'notifySignOutRequest', 'notifyPopupModalOpen']);
    authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'notifyUserAction'], { userActionOccured: new Subject<void>() });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    locationSpy = jasmine.createSpyObj('Location', ['path']);
    routeSubject = new Subject();

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: PublisherService, useValue: publisherSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ActivatedRoute, useValue: { queryParamMap: routeSubject.asObservable() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should call notifyUserAction on resetTimer', () => {
    component.resetTimer();
    expect(authSpy.notifyUserAction).toHaveBeenCalled();
  });

  it('should handle /logout?manual=false path', () => {
    authSpy.isAuthenticated.and.returnValue(false);
    locationSpy.path.and.returnValue('/logout?manual=false');
    component.ngOnInit();
    expect(publisherSpy.notifyAuth).toHaveBeenCalledWith(false);
  });

  it('should handle access-token in query params', fakeAsync(() => {
    authSpy.isAuthenticated.and.returnValue(false);
    locationSpy.path.and.returnValue('/');
    component.ngOnInit();

    routeSubject.next(new Map([['access-token', 'abc123']]));
    tick();

    expect(sessionStorage.getItem('Access_Token')).toBe('abc123');
    expect(publisherSpy.notifyAuth).toHaveBeenCalledWith(true);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['dashboard']);
  }));

  it('should call getAllMasterData if authenticated', fakeAsync(() => {
    authSpy.isAuthenticated.and.returnValue(true);
    locationSpy.path.and.returnValue('/');
    spyOn(component, 'getAllMasterData');
    component.ngOnInit();
    tick();
    expect(component.getAllMasterData).toHaveBeenCalled();
  }));

  it('should populate locations and notify publisher', () => {
    const mockData = [{ isotracLocationId: '123', locationName: 'Lab', seriesValue: 'A' }];
    commonServiceSpy.getAllLocations.and.returnValue(of(mockData));
    component.getAllLocationMsterData();
    expect(component.allLocationMasterData.length).toBe(1);
    expect(publisherSpy.notifyAllLocations).toHaveBeenCalledWith(true);
  });

  it('should populate type groups and notify publisher', () => {
    const mockGroups = [{ id: 1 }];
    commonServiceSpy.getAllTypeGroups.and.returnValue(of(mockGroups));
    component.getAllTypeGroupsMasterData();
    expect(component.allTypeGroupMasterData).toEqual(mockGroups);
    expect(publisherSpy.notifyAllTypeGroups).toHaveBeenCalledWith(true);
  });

  it('should populate type refs with legacy label and notify publisher', () => {
    const mockRefs = [{ description: 'desc', legacyCode: '001' }];
    commonServiceSpy.getAllTypeRefs.and.returnValue(of(mockRefs));
    component.getAllTypeRefsMasterData();
    expect(component.allTypeRefMasterData[0]['legacyLabelForDropdown']).toContain('desc - 001');
    expect(publisherSpy.notifyAllTypeRefs).toHaveBeenCalledWith(true);
  });

 it('should perform logout when idle timer completes', fakeAsync(() => {
  authSpy.isAuthenticated.and.returnValue(true);
  locationSpy.path.and.returnValue('/');

  // run ngOnInit → this calls performResetTimer internally
  component.ngOnInit();

  // fast forward idle timer to completion
  tick(30 * 60 * 1000); // or smaller if you mock endTime

  expect(routerSpy.navigate).toHaveBeenCalledWith(['/logout'], { queryParams: { manual: false } });
  expect(publisherSpy.notifySignOutRequest).toHaveBeenCalled();
  expect(publisherSpy.notifyAuth).toHaveBeenCalledWith(false);
  expect(publisherSpy.notifyPopupModalOpen).toHaveBeenCalled();
}));


  it('should cleanup subscriptions on destroy', () => {
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
});
