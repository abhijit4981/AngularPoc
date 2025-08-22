import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { PublisherService } from './publisher.service';

describe('PublisherService', () => {
  let service: PublisherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublisherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should notify sign out request', () => {
    let signOutRequested = false;
    PublisherService.signOutRequest$.subscribe(() => signOutRequested = true);
    PublisherService.notifySignOutRequest();
    expect(signOutRequested).toBeTruthy();
  });

  it('should notify config loaded', () => {
    let configLoaded = false;
    let receivedValue = false;
    PublisherService.isConfigLoaded$.subscribe((value) => {
      configLoaded = true;
      receivedValue = value;
    });
    PublisherService.notifyConfig(true);
    expect(configLoaded).toBeTruthy();
    expect(receivedValue).toBeTruthy();
  });

  it('should notify auth change', () => {
    let authChanged = false;
    let receivedValue = false;
    PublisherService.isAuthChanged$.subscribe((value) => {
      authChanged = true;
      receivedValue = value;
    });
    PublisherService.notifyAuth(true);
    expect(authChanged).toBeTruthy();
    expect(receivedValue).toBeTruthy();
  });

  it('should notify SSO login redirect', () => {
    let ssoRedirected = false;
    let receivedValue = false;
    PublisherService.isLoginRedirected$.subscribe((value) => {
      ssoRedirected = true;
      receivedValue = value;
    });
    PublisherService.notifySsoLoginRedirect(true);
    expect(ssoRedirected).toBeTruthy();
    expect(receivedValue).toBeTruthy();
  });

  it('should notify all type groups loaded', () => {
    let typeGroupsLoaded = false;
    let receivedValue = false;
    PublisherService.isAllTypeGroups$.subscribe((value) => {
      typeGroupsLoaded = true;
      receivedValue = value;
    });
    PublisherService.notifyAllTypeGroups(true);
    expect(typeGroupsLoaded).toBeTruthy();
    expect(receivedValue).toBeTruthy();
  });

  it('should notify all type refs loaded', () => {
    let typeRefsLoaded = false;
    let receivedValue = false;
    PublisherService.isAllTypeRefs$.subscribe((value) => {
      typeRefsLoaded = true;
      receivedValue = value;
    });
    PublisherService.notifyAllTypeRefs(true);
    expect(typeRefsLoaded).toBeTruthy();
    expect(receivedValue).toBeTruthy();
  });

  it('should notify all locations loaded', () => {
    let locationsLoaded = false;
    let receivedValue = false;
    PublisherService.isAllLocations$.subscribe((value) => {
      locationsLoaded = true;
      receivedValue = value;
    });
    PublisherService.notifyAllLocations(true);
    expect(locationsLoaded).toBeTruthy();
    expect(receivedValue).toBeTruthy();
  });

  it('should notify popup modal open', () => {
    let modalOpened = false;
    PublisherService.isPopModalOpen$.subscribe(() => modalOpened = true);
    PublisherService.notifyPopupModalOpen();
    expect(modalOpened).toBeTruthy();
  });

  it('should have observable properties', () => {
    expect(PublisherService.signOutRequest$).toBeDefined();
    expect(PublisherService.isAuthChanged$).toBeDefined();
    expect(PublisherService.isLoginRedirected$).toBeDefined();
    expect(PublisherService.isConfigLoaded$).toBeDefined();
    expect(PublisherService.isAllTypeGroups$).toBeDefined();
    expect(PublisherService.isAllTypeRefs$).toBeDefined();
    expect(PublisherService.isAllLocations$).toBeDefined();
    expect(PublisherService.isPopModalOpen$).toBeDefined();
  });
});
