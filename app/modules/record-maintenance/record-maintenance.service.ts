import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { Observable, of } from 'rxjs';


import { DosimetryApiService as DMApi } from './../../core/api/dosimetry-api.service';

@Injectable({
  providedIn: 'root'
})
export class RecordMaintenanceService {

  /***************Constructor-Start***************/
  constructor(
    private http: HttpService,
    private api: DMApi,
  ) { }
  /***************Constructor-End***************/

  /******************Service Methods-Start******************/
  /**
   * Get all employee list matched with searchTerm
   */
  public getAllEmployees (searchTerm: any, type: string) {
    if (!searchTerm.trim()) {
      // if not search term, return empty employee array.
      return of([]);
    }
    return this.http.get(this.api.Dm.GET_ALL_EMPLOYEES_URL+'?searchVal='+searchTerm+'&type='+type);
     
  }

  /**
   * Get all external dose results matched with empId and startDate params 
   */
  public getAllExternalDoseResults(isPerson: boolean, participantNum: any, empId: any, startDate: any) {
    let getAllEDRUrl = this.api.Dm.GET_ALL_EXTERNAL_DOSIMETER_URL+'?isPerson='+isPerson+'&participantNum='+participantNum+'&personNum='+empId+'&startDate='+startDate;
    return this.http.get(getAllEDRUrl);
  }

  /**
   * Update external dose result
   */
  public updateExternalDoseResult(externalDoseResult): Observable<any> {
    return this.http.post(this.api.Dm.SAVE_EXTERNAL_DOSE_RESULT_URL, JSON.stringify(externalDoseResult), null);
  }

  /**
   * Get all internal dose results matched with isPerson, personParticpantNum and startDate params 
   */
  public getAllInternalDoseResults(empId: any, startDate: any) {
    var getAllIDRUrl = this.api.Dm.GET_ALL_INTERNAL_DOSIMETER_URL+'?personNum='+empId+'&sampleDate='+startDate;
    return this.http.get(getAllIDRUrl);
  }

  /**
   * Update external dose result
   */
  public updateInternalDoseResult(externalDoseResult): Observable<any> {
    return this.http.post(this.api.Dm.SAVE_INTERNAL_DOSE_RESULT_URL, JSON.stringify(externalDoseResult), null);
  }

  /**
   * Get all active nuclide
   */
  public getAllNuclides() {
    return this.http.get(this.api.Dm.GET_ALL_NUCLIDES_URL);
  }

  /**
   * Get all dosimeter results matched with participantId 
   */
  public getAllDosimeterResults(participantId: number) {
    return this.http.get(this.api.Dm.GET_ALL_DOSIMETER_BY_PARTICIPANTID_URL+'/'+participantId);
  }

  //get all accounts
  public getAllAccounts() {
    return this.http.get(this.api.Dm.GET_ALL_ACCOUNTS_URL);
  }

  /******************Service Methods-End******************/

}
