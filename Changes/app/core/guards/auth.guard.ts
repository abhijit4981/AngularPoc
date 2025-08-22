import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DosimetryApiService as DMApi } from '../../core/api/dosimetry-api.service';
import { PublisherService } from '../services/publisher.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  /***************Constructor- Start***************/
  constructor(
    private authService: AuthService,
    private api: DMApi,
  ) {

  }
  /***************Constructor- End***************/

  /******************Implementation Methods- Start******************/
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let accessToken = next.queryParams['access-token'];
    
    if(accessToken===null || accessToken===undefined) {
      if(this.authService.isAuthenticated()) {
        return true;
      } else {
        PublisherService.notifySsoLoginRedirect(true);
        window.location.href = this.api.Login.REDIRECT_TO_LOGIN_URL;
        return false;  
      }
    } else {
      return true;
    }
  }

  /******************Implementation Methods- End******************/
}
