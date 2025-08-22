import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';

import { CommonService } from './shared/services/common.service';
import { PublisherService } from './core/services/publisher.service';
import { Location as LocationModel } from './shared/models/location'
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { Subject, Subscription, timer } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { MessageService } from './core/services/message.service';

@Component({
  selector: 'qnr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  /***************Properties-Start***************/
  title = 'dosimetry';
  public allLocationMasterData: Array<object> = [];
  public allTypeGroupMasterData: Array<object> = [];
  public allTypeRefMasterData: Array<object> = [];
  authenticated: boolean = false;
  endTime = 30;
  //timer subscription variable
  unsubscribe$: Subject<void> = new Subject();
  timerSubscription: Subscription;
  /***************Properties-End***************/

  /***************Constructor-Start***************/
  constructor(
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService,
  ) { }

  @HostListener('document:keyup', ['$event'])
  @HostListener('document:click', ['$event'])
  resetTimer() {
    this.authService.notifyUserAction();
  }

  ngOnInit() {
    this.authenticated = this.authService.isAuthenticated();
    let currentUrl = this.location.path();
    if (currentUrl == '/logout?manual=false') {
      PublisherService.notifyAuth(false);
    }

    this.route.queryParamMap.subscribe(queryParams => {
      let accessToken = queryParams.get('access-token');
      if (accessToken !== null) {
        sessionStorage.setItem('Access_Token', accessToken);
        PublisherService.notifyAuth(true);
        this.getAllMasterData();
        return this.router.navigate(['dashboard']);
      }
    });
    if (this.authenticated && (currentUrl != '/logout' && currentUrl != '/unauthorized' && currentUrl != '/error')) {
      setTimeout(() => {
        this.getAllMasterData();
      }, 0);
    }

    //count user idle time
    this.performResetTimer();
    this.authService.userActionOccured.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
      this.performResetTimer();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  /***************Constructor-End***************/

  /******************Component Methods-Start******************/
  public getAllMasterData() {
    //get all locations which wil be shared with other component
    this.getAllLocationMsterData();

    //get all type groups
    this.getAllTypeGroupsMasterData();  

    //get all active type refs
    this.getAllTypeRefsMasterData();
  }

  //get all location master data
  public getAllLocationMsterData() {
    this.commonService.getAllLocations().subscribe((data: LocationModel[]) => {
      data.forEach((locationObj, index) => {
        data[index].locationNameForDropdown = locationObj.isotracLocationId + ' - ' + locationObj.locationName;
        data[index].locationNameForDropdownWithSeries = locationObj.seriesValue + ' - ' + locationObj.locationName + ' - ' + locationObj.isotracLocationId;
      });
      this.allLocationMasterData = data;
      PublisherService.notifyAllLocations(true); //send true flag when subscription event triggered
    });
  }

  //get all type groups master data
  public getAllTypeGroupsMasterData() {
    this.commonService.getAllTypeGroups().subscribe((data: Array<object>) => {
      this.allTypeGroupMasterData = data;
      PublisherService.notifyAllTypeGroups(true); //send true flag when subscription event triggered
    });
  }

  //get all type refs master data
  public getAllTypeRefsMasterData() {
    this.commonService.getAllTypeRefs().subscribe((data: Array<object>) => {
      data.forEach((typeRefObj, index) => {
        data[index]['legacyLabelForDropdown'] = typeRefObj['description'] + ' - ' + typeRefObj['legacyCode'];
      });
      this.allTypeRefMasterData = data;
      PublisherService.notifyAllTypeRefs(true); //send true flag when subscription event triggered 
    });
  }

  private performResetTimer(endTime: number = this.endTime) {
    const interval = 1000;
    const duration = endTime * 60;
    this.timerSubscription = timer(0, interval).pipe(
      take(duration)
    ).subscribe(value =>
      this.render((duration - +value) * interval),
      err => { },
      () => {
        this.router.navigate(['/logout'], { queryParams: { manual: false } });
        PublisherService.notifySignOutRequest();
        PublisherService.notifyAuth(false);
        PublisherService.notifyPopupModalOpen();
      }
    )
  }

  private render(count) {
  }

  /******************Component Methods-End******************/
}
