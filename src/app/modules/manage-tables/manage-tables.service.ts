import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http/http.service';
import { DosimetryApiService as DMApi } from '../../core/api/dosimetry-api.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManageTablesService {
  /***************Properties-Start***************/
  /***************Properties-End***************/

  /***************Constructor-Start***************/
  constructor(
    private http: HttpService,
    private api: DMApi
  ) { }
  /***************Constructor-End***************/

  /******************Service Methods-Start******************/
  //update cross references
  public updateTypeGroup(crossReference): Observable<any> {
    return this.http.post(this.api.Dm.SAVE_TYPEGROUP_REF_URL, JSON.stringify(crossReference), null);
  }

  //get all accounts
  public getAllAccounts() {
    return this.http.get(this.api.Dm.GET_ALL_ACCOUNTS_URL);
  }

  //get all intake retention
  public getAllIntakeRetention() {
    return this.http.get(this.api.Dm.GET_ALL_INTAKE_RETENTION_URL);
  }

  //get all nuclides
  public getAllRadionuclides() {
    return this.http.get(this.api.Dm.GET_ALL_NUCLIDES_URL);
  }

  //get person data
  public getPersonData(criteria) {
    if (!criteria.trim()) {
      // if not search term, return empty employee array.
      return of([]);
    }
    return this.http.get(this.api.Dm.GET_PERSON_DETAIL_URL+'?searchVal='+criteria);
  }

  //get person data by id
  public getPersonDataByID(id) {
    return this.http.get(this.api.Dm.GET_PERSON_DETAIL_BY_ID_URL+'?personId='+id);
  }

  //save all accounts
  public saveAllAccounts(accounts) {
    return this.http.post(this.api.Dm.SAVE_ALL_ACCOUNTS_URL, accounts);
  }
  
  //save all intake retention
  public saveAllIntakeRetention(intakeObj) {
    return this.http.post(this.api.Dm.SAVE_ALL_INTAKE_RETENTION_URL, intakeObj);
  }
  
  //save all nuclides
  public saveAllRadionuclides(nuclides) {
    return this.http.post(this.api.Dm.SAVE_ALL_NUCLIDES_URL, nuclides);
  }

  //save all locations
  public saveAllLocation(locations) {
    return this.http.post(this.api.Dm.SAVE_ALL_LOCATIONS_URL, locations);
  }

  //save person details
  public savePersonDetails(person) {
    return this.http.post(this.api.Dm.SAVE_PERSON_DETAIL_URL, person);
  }
  
  /******************Service Methods-End******************/
}
