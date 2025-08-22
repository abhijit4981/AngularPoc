import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { PublisherService } from 'src/app/core/services/publisher.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'qnr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  /***************Properties-Start***************/
  authenticated: boolean = false;
  loginRedirected: boolean = false;
  userInfo: User;
  //variable for subscribing publisher notification
  private authenticationSubscription: Subscription = null;
  private loginRedirectionSubscription: Subscription = null;
  /***************Properties-End***************/  

  /***************Constructor-Start***************/
  constructor(
    private commonService: CommonService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authenticated = this.authService.isAuthenticated();
    if(this.authenticated) {
      this.getLoggedUserInfo();
    }
    this.authenticationSubscription = PublisherService.isAuthChanged$.subscribe(
      authenticated => this.onAuthenticationChange(authenticated)
    );
    this.loginRedirectionSubscription = PublisherService.isLoginRedirected$.subscribe(
      isLoginRedirect => { this.loginRedirected = isLoginRedirect; }
    );
  }

  ngOnDestroy() {
    if(this.authenticationSubscription !== null) this.authenticationSubscription.unsubscribe();
    if(this.loginRedirectionSubscription !== null) this.loginRedirectionSubscription.unsubscribe();
  }
  /***************Constructor-End***************/

  /******************Component Methods-Start******************/  
  private getLoggedUserInfo() {
    this.commonService.getLoggedUserInfo()
      .subscribe((data: User) => {
        this.userInfo = data;
      });
  }  

  private onAuthenticationChange(authenticated: boolean) {
    this.authenticated = authenticated;
    if(this.authenticated) {
      this.getLoggedUserInfo();
    }
  }
  /******************Component Methods-End******************/  

}
