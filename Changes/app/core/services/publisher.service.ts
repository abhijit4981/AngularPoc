import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  constructor() { }

  private static _signOutRequestSource?: Subject<void>;
  private static get signOutRequestSource(): Subject<void> {
    if (!PublisherService._signOutRequestSource) {
      PublisherService._signOutRequestSource = new Subject<void>();
    }
    return PublisherService._signOutRequestSource;
  }
  static get signOutRequest$() { return PublisherService.signOutRequestSource.asObservable(); }

  private static _isAuthChangedSource?: Subject<boolean>;
  private static get isAuthChangedSource(): Subject<boolean> {
    if (!PublisherService._isAuthChangedSource) {
      PublisherService._isAuthChangedSource = new Subject<boolean>();
    }
    return PublisherService._isAuthChangedSource;
  }
  static get isAuthChanged$() { return PublisherService.isAuthChangedSource.asObservable(); }

  private static _isSsoLoginRedirect?: Subject<boolean>;
  private static get isSsoLoginRedirect(): Subject<boolean> {
    if (!PublisherService._isSsoLoginRedirect) {
      PublisherService._isSsoLoginRedirect = new Subject<boolean>();
    }
    return PublisherService._isSsoLoginRedirect;
  }
  static get isLoginRedirected$() { return PublisherService.isSsoLoginRedirect.asObservable(); }
  
  private static _isConfigLoadedSource?: Subject<boolean>;
  private static get isConfigLoadedSource(): Subject<boolean> {
    if (!PublisherService._isConfigLoadedSource) {
      PublisherService._isConfigLoadedSource = new Subject<boolean>();
    }
    return PublisherService._isConfigLoadedSource;
  }
  static get isConfigLoaded$() { return PublisherService.isConfigLoadedSource.asObservable(); }

  private static _isAllTypeGroupsLoaded?: Subject<boolean>;
  private static get isAllTypeGroupsLoaded(): Subject<boolean> {
    if (!PublisherService._isAllTypeGroupsLoaded) {
      PublisherService._isAllTypeGroupsLoaded = new Subject<boolean>();
    }
    return PublisherService._isAllTypeGroupsLoaded;
  }
  static get isAllTypeGroups$() { return PublisherService.isAllTypeGroupsLoaded.asObservable(); }

  private static _isAllTypeRefsLoaded?: Subject<boolean>;
  private static get isAllTypeRefsLoaded(): Subject<boolean> {
    if (!PublisherService._isAllTypeRefsLoaded) {
      PublisherService._isAllTypeRefsLoaded = new Subject<boolean>();
    }
    return PublisherService._isAllTypeRefsLoaded;
  }
  static get isAllTypeRefs$() { return PublisherService.isAllTypeRefsLoaded.asObservable(); }

  private static _isAllLocationsLoaded?: Subject<boolean>;
  private static get isAllLocationsLoaded(): Subject<boolean> {
    if (!PublisherService._isAllLocationsLoaded) {
      PublisherService._isAllLocationsLoaded = new Subject<boolean>();
    }
    return PublisherService._isAllLocationsLoaded;
  }
  static get isAllLocations$() { return PublisherService.isAllLocationsLoaded.asObservable(); }

  private static _isPopupModalOpened?: Subject<void>;
  private static get isPopupModalOpened(): Subject<void> {
    if (!PublisherService._isPopupModalOpened) {
      PublisherService._isPopupModalOpened = new Subject<void>();
    }
    return PublisherService._isPopupModalOpened;
  }
  static get isPopModalOpen$() { return PublisherService.isPopupModalOpened.asObservable(); }

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
