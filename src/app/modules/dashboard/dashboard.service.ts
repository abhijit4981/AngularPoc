import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http/http.service';
import { Observable, of } from 'rxjs';


import { DosimetryApiService as DmApi } from '../../core/api/dosimetry-api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  /***************Properties-Start***************/
  /***************Properties-End***************/

  /***************Constructor-Start***************/
  constructor(
    private http: HttpService,
    private api: DmApi,
  ) { }
  /***************Constructor-End***************/

  /******************Service Methods-Start******************/

  //get all counts
  public getAllCounts() {
    return this.http.get(this.api.Dm.GET_ALL_DASHBOARD_COUNT_URL);
  }

  //Rejected record list of Participant
  public getRecordListParticipant() {
    return this.http.get(this.api.Dm.GET_REJECT_PARTICIPANT_RECORDLIST_URL);
  }

  //Rejected record list of External Dose Result
  public getRecordListEDR() {
    return this.http.get(this.api.Dm.GET_REJECT_EDR_RECORDLIST_URL);
  }

  //Rejected record list of personnel
  public getRecordListPersonnel() {
    return this.http.get(this.api.Dm.GET_REJECT_PERSONNEL_RECORDLIST_URL);
  }

  //get Participant rejection details
  public getParticipantRejectionDetails(participantID) {
    return this.http.get(this.api.Dm.GET_PARTICIPANT_REJECTION_DETAILS_URL+'?participantid='+participantID);
  }

  //save Participant rejection details
  public saveParticipantRejectionDetails(data) {
    return this.http.put(this.api.Dm.SAVE_PARTICIPANT_REJECTION_DETAILS_URL, data);
  }

   //get All accounts
   public getAllAccounts() {
    return this.http.get(this.api.Dm.GET_ALL_ACCOUNTS_URL);
  }

   //get EDR rejection details
   public getEDRRejectionDetails(stageExtDoseResultNum) {
    return this.http.get(this.api.Dm.GET_EDR_REJECTION_DETAILS_URL+'?edr_id='+stageExtDoseResultNum);
  }

  //save EDR rejection details
  public saveEDRRejectionDetails(data) {
    return this.http.put(this.api.Dm.SAVE_EDR_REJECTION_DETAILS_URL, data);
  }

  //get Personnel Flag/rejection details
  public getPersonnelFlagDetails(personNum) {
    return this.http.get(this.api.Dm.GET_FLAG_PERSONNEL_DETAILS_URL +'?personId='+personNum);
  }
  
//Save Personnel Flag/rejection details
  public savePersonnelFlagDetails(data) {
    return this.http.post(this.api.Dm.SAVE_FLAG_PERSONNEL_DETAILS_URL, data);
  }

  /******************Service Methods-End******************/
}
