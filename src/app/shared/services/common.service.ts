import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { DosimetryApiService as DMApi } from '../../core/api/dosimetry-api.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  /***************Properties-Start***************/
  private allLocation: any;
  private allTypeGroup: any;
  private allTypeRef: any;
  private loggedUserInfo: any;
  /***************Properties-End***************/

  /***************Constructor-start***************/
  constructor(
    private http: HttpService,
    private api: DMApi,
  ) { }
 /***************Constructor-End***************/

  /******************Service Methods-Start******************/
  /**
   * Get all locations
   * @returns 'allLocation' all location json data
   */
  public getAllLocations() {
    this.allLocation = this.http.get(this.api.Dm.GET_ALL_LOCATIONS_URL);
    return this.allLocation;
  }

  /**
   * Get all type groups
   * @returns 'allTypeGroup' all type group json data
   */
  public getAllTypeGroups() {
    this.allTypeGroup = this.http.get(this.api.Dm.GET_ALL_TYPEGROUPS_URL);
    return this.allTypeGroup;
  }

  /**
   * Get all type groups
   * @returns 'allTypeRefs' all type refs json data
   */
  public getAllTypeRefs() {
    this.allTypeRef = this.http.get(this.api.Dm.GET_ALL_TYPEREFS_URL);
    return this.allTypeRef;
  }

  // Get logged user info
  public getLoggedUserInfo() {
    this.loggedUserInfo = this.http.get(this.api.Dm.GET_LOGGED_USER_DETAILS_URL);
    return this.loggedUserInfo;
  }

  // Process stg EDR and participant data
  public stgEdrParticipantDateProcess(): Observable<any> {
    //let edrProcessResponse = this.http.get(this.api.Dm.GET_EDR_PROCESS_URL);
    //let participantProcessResponse = this.http.get(this.api.Dm.GET_PARTICIPANT_PROCESS_URL);
    //return forkJoin([edrProcessResponse, participantProcessResponse]);

    let jobProcessResponse = this.http.get(this.api.Dm.GET_JOB_PROCESS_URL);
    return jobProcessResponse;
  }
  /******************Service Methods-End******************/
  
}
