import { Injectable } from '@angular/core';
import { HttpService } from './http/http.service';
import { DosimetryApiService as DmApi } from '../api/dosimetry-api.service';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PublisherService } from './publisher.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /***************Properties-Start***************/
  _userActionOccured: Subject<void> = new Subject();
  get userActionOccured(): Observable<void> { return this._userActionOccured.asObservable() };
  /***************Properties-End***************/
  
  /***************Constructor***************/
  constructor(
    private http: HttpService,
    private router: Router,
    private api: DmApi
  ) { }
  /***************Constructor***************/

  /***************Helper Methods***************/
  isAuthenticated() {
    // Development bypass: always return true in development mode
    if (!environment.production) {
      return true;
    }
    
    const tokens = this.getAuthorizationTokens();
    const hasToken = !String.isNullOrEmpty(tokens['access-token']);
    return hasToken;
  }
  
  getAuthorizationTokens() {
    const tokens = {};
    tokens['access-token'] = '';

    const authTokens = sessionStorage.getItem('Access_Token');
    if (authTokens) {
      tokens['access-token'] = authTokens;
    }
    return tokens;
  }

  /*** Check idle time code- start ***/
  notifyUserAction() {
    this._userActionOccured.next();
  }
  /*** Check idle time code- end ***/
  //perform user signout, clear session and send notification for left nav and header
  signOut() {
    sessionStorage.clear();
    PublisherService.notifyAuth(false);
  }
  /***************Helper Methods***************/
}
