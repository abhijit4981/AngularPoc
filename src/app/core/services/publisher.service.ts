import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  private signOutRequestSource = new Subject<void>();
  private isAuthChangedSource = new Subject<boolean>();
  private isSsoLoginRedirect = new Subject<boolean>();
  private isConfigLoadedSource = new Subject<boolean>();
  private isAllTypeGroupsLoaded = new Subject<boolean>();
  private isAllTypeRefsLoaded = new Subject<boolean>();
  private isAllLocationsLoaded = new Subject<boolean>();
  private isPopupModalOpened = new Subject<void>();

  constructor() {}

  get signOutRequest$(): Observable<void> {
    return this.signOutRequestSource.asObservable();
  }

  get isAuthChanged$(): Observable<boolean> {
    return this.isAuthChangedSource.asObservable();
  }

  get isLoginRedirected$(): Observable<boolean> {
    return this.isSsoLoginRedirect.asObservable();
  }

  get isConfigLoaded$(): Observable<boolean> {
    return this.isConfigLoadedSource.asObservable();
  }

  get isAllTypeGroups$(): Observable<boolean> {
    return this.isAllTypeGroupsLoaded.asObservable();
  }

  get isAllTypeRefs$(): Observable<boolean> {
    return this.isAllTypeRefsLoaded.asObservable();
  }

  get isAllLocations$(): Observable<boolean> {
    return this.isAllLocationsLoaded.asObservable();
  }

  get isPopModalOpen$(): Observable<void> {
    return this.isPopupModalOpened.asObservable();
  }

  notifySignOutRequest() {
    this.signOutRequestSource.next();
  }

  notifyConfig(isLoaded: boolean) {
    this.isConfigLoadedSource.next(isLoaded);
  }

  notifyAuth(isAuthenticated: boolean) {
    this.isAuthChangedSource.next(isAuthenticated);
  }

  notifySsoLoginRedirect(isLoginRedirect: boolean) {
    this.isSsoLoginRedirect.next(isLoginRedirect);
  }

  notifyAllTypeGroups(isLoaded: boolean) {
    this.isAllTypeGroupsLoaded.next(isLoaded);
  }

  notifyAllTypeRefs(isLoaded: boolean) {
    this.isAllTypeRefsLoaded.next(isLoaded);
  }

  notifyAllLocations(isLoaded: boolean) {
    this.isAllLocationsLoaded.next(isLoaded);
  }

  notifyPopupModalOpen() {
    this.isPopupModalOpened.next();
  }
}
