import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  constructor() { }

  private static signOutRequestSource = new Subject<void>();
  static signOutRequest$ = PublisherService.signOutRequestSource.asObservable();

  private static isAuthChangedSource = new Subject<boolean>();
  static isAuthChanged$ = PublisherService.isAuthChangedSource.asObservable();

  private static isSsoLoginRedirect = new Subject<boolean>();
  static isLoginRedirected$ = PublisherService.isSsoLoginRedirect.asObservable();
  
  private static isConfigLoadedSource = new Subject<boolean>();
  static isConfigLoaded$ = PublisherService.isConfigLoadedSource.asObservable();

  private static isAllTypeGroupsLoaded = new Subject<boolean>();
  static isAllTypeGroups$ = PublisherService.isAllTypeGroupsLoaded.asObservable();

  private static isAllTypeRefsLoaded = new Subject<boolean>();
  static isAllTypeRefs$ = PublisherService.isAllTypeRefsLoaded.asObservable();

  private static isAllLocationsLoaded = new Subject<boolean>();
  static isAllLocations$ = PublisherService.isAllLocationsLoaded.asObservable();

  private static isPopupModalOpened = new Subject<void>();
  static isPopModalOpen$ = PublisherService.isPopupModalOpened.asObservable();

  static notifySignOutRequest() {
    this.signOutRequestSource.next(undefined);
  }
  
  static notifyConfig(isLoaded: boolean) {
    this.isConfigLoadedSource.next(isLoaded);
  }

  static notifyAuth(isAuthenticated: boolean) {
    this.isAuthChangedSource.next(isAuthenticated);
  }

  static notifySsoLoginRedirect(isLoginRedirect: boolean) {
    this.isSsoLoginRedirect.next(isLoginRedirect);
  }

  static notifyAllTypeGroups(isLoaded: boolean) {
    this.isAllTypeGroupsLoaded.next(isLoaded);
  }

  static notifyAllTypeRefs(isLoaded: boolean) {
    this.isAllTypeRefsLoaded.next(isLoaded);
  }

  static notifyAllLocations(isLoaded: boolean) {
    this.isAllLocationsLoaded.next(isLoaded);
  }
  
  static notifyPopupModalOpen() {
    this.isPopupModalOpened.next(undefined);
  }
}
