import { TestBed } from '@angular/core/testing';

import { PublisherService } from './publisher.service';

describe('PublisherService', () => {
  let service: PublisherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(PublisherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /* it('should emit sign out request', (done) => {
    service.signOutRequest$.subscribe(() => {
      expect(true).toBeTruthy();
      done();
    });
    service.notifySignOutRequest();
  }); */

  /* it('should emit auth change notifications', (done) => {
    service.isAuthChanged$.subscribe((isAuthenticated: boolean) => {
      expect(isAuthenticated).toBe(true);
      done();
    });
    service.notifyAuth(true);
  }); */

  /* it('should emit config loaded notifications', (done) => {
    service.isConfigLoaded$.subscribe((isLoaded: boolean) => {
      expect(isLoaded).toBe(true);
      done();
    });
    service.notifyConfig(true);
  }); */

  /* it('should emit SSO login redirect notifications', (done) => {
    service.isLoginRedirected$.subscribe((isRedirect: boolean) => {
      expect(isRedirect).toBe(false);
      done();
    });
    service.notifySsoLoginRedirect(false);
  }); */

  /* it('should emit type groups loaded notifications', (done) => {
    service.isAllTypeGroups$.subscribe((isLoaded: boolean) => {
      expect(isLoaded).toBe(true);
      done();
    });
    service.notifyAllTypeGroups(true);
  }); */

  /* it('should emit type refs loaded notifications', (done) => {
    service.isAllTypeRefs$.subscribe((isLoaded: boolean) => {
      expect(isLoaded).toBe(true);
      done();
    });
    service.notifyAllTypeRefs(true);
  }); */

  /* it('should emit locations loaded notifications', (done) => {
    service.isAllLocations$.subscribe((isLoaded: boolean) => {
      expect(isLoaded).toBe(true);
      done();
    });
    service.notifyAllLocations(true);
  }); */

  /* it('should emit popup modal opened notifications', (done) => {
    service.isPopModalOpen$.subscribe(() => {
      expect(true).toBeTruthy();
      done();
    });
    service.notifyPopupModalOpen();
  }); */
});
