import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  constructor() { }

  private static _signOutRequestSource?: Subject<void>;
  private static get signOutRequestSource(): Subject<void> {
    if (!this._signOutRequestSource) {
      this._signOutRequestSource = new Subject<void>();
    }
    return this._signOutRequestSource;
  }

  private static _isAuthChangedSource?: Subject<boolean>;
  private static get isAuthChangedSource(): Subject<boolean> {
    if (!this._isAuthChangedSource) {
      this._isAuthChangedSource = new Subject<boolean>();
    }
    return this._isAuthChangedSource;
  }

  private static _isSsoLoginRedirect?: Subject<boolean>;
  private static get isSsoLoginRedirect(): Subject<boolean> {
    if (!this._isSsoLoginRedirect) {
      this._isSsoLoginRedirect = new Subject<boolean>();
    }
    return this._isSsoLoginRedirect;
  }
  
  private static _isConfigLoadedSource?: Subject<boolean>;
  private static get isConfigLoadedSource(): Subject<boolean> {
    if (!this._isConfigLoadedSource) {
      this._isConfigLoadedSource = new Subject<boolean>();
    }
    return this._isConfigLoadedSource;
  }

  private static _isAllTypeGroupsLoaded?: Subject<boolean>;
  private static get isAllTypeGroupsLoaded(): Subject<boolean> {
    if (!this._isAllTypeGroupsLoaded) {
      this._isAllTypeGroupsLoaded = new Subject<boolean>();
    }
    return this._isAllTypeGroupsLoaded;
  }

  private static _isAllTypeRefsLoaded?: Subject<boolean>;
  private static get isAllTypeRefsLoaded(): Subject<boolean> {
    if (!this._isAllTypeRefsLoaded) {
      this._isAllTypeRefsLoaded = new Subject<boolean>();
    }
    return this._isAllTypeRefsLoaded;
  }

  private static _isAllLocationsLoaded?: Subject<boolean>;
  private static get isAllLocationsLoaded(): Subject<boolean> {
    if (!this._isAllLocationsLoaded) {
      this._isAllLocationsLoaded = new Subject<boolean>();
    }
    return this._isAllLocationsLoaded;
  }

  private static _isPopupModalOpened?: Subject<void>;
  private static get isPopupModalOpened(): Subject<void> {
    if (!this._isPopupModalOpened) {
      this._isPopupModalOpened = new Subject<void>();
    }
    return this._isPopupModalOpened;
  }

  static get signOutRequest$(): Observable<void> {
    return PublisherService.signOutRequestSource.asObservable();
  }

  static get isAuthChanged$(): Observable<boolean> {
    return PublisherService.isAuthChangedSource.asObservable();
  }

  static get isLoginRedirected$(): Observable<boolean> {
    return PublisherService.isSsoLoginRedirect.asObservable();
  }

  static get isConfigLoaded$(): Observable<boolean> {
    return PublisherService.isConfigLoadedSource.asObservable();
  }

  static get isAllTypeGroups$(): Observable<boolean> {
    return PublisherService.isAllTypeGroupsLoaded.asObservable();
  }

  static get isAllTypeRefs$(): Observable<boolean> {
    return PublisherService.isAllTypeRefsLoaded.asObservable();
  }

  static get isAllLocations$(): Observable<boolean> {
    return PublisherService.isAllLocationsLoaded.asObservable();
  }

  static get isPopModalOpen$(): Observable<void> {
    return PublisherService.isPopupModalOpened.asObservable();
  }

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