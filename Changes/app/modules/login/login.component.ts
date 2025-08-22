import { Component, OnInit, OnDestroy } from '@angular/core';
import { DosimetryApiService as DMApi } from '../../core/api/dosimetry-api.service';
import { ActivatedRoute } from '@angular/router';
import { PublisherService } from 'src/app/core/services/publisher.service';
import { MessageService } from 'src/app/core/services/message.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'qnr-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']  
})
export class LoginComponent implements OnInit, OnDestroy {
  /***************Properties-Start***************/
  public loginRedirectUrl: string = '';
  private signOutRequestSubscription: Subscription = null;
  /***************Properties-End***************/

  /***************Constructor-Start***************/
  constructor(
    private route: ActivatedRoute,
    private api: DMApi,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.loginRedirectUrl = this.api.Login.REDIRECT_TO_LOGIN_URL;
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      let logoutManually = queryParams.get('manual');
      if(logoutManually !== null) {
        this.signOut(logoutManually);
      }
    });

    this.signOutRequestSubscription = PublisherService.signOutRequest$.subscribe(request => {
      this.signOut('false');
    });
  }

  ngOnDestroy() {
    if(this.signOutRequestSubscription !== null) this.signOutRequestSubscription.unsubscribe();
  }
  /***************Constructor-End***************/

  private signOut(logoutManual: string) {
    if(logoutManual=='true') {
      setTimeout(() => this.messageService.success('Successfully logout.'));
    }
    this.authService.signOut();
  }
}
