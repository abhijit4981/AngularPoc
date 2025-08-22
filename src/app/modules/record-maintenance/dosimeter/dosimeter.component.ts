import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RecordMaintenanceService } from '../record-maintenance.service';
import { Subscription } from 'rxjs';

import { AppComponent } from 'src/app/app.component';
import { PublisherService } from 'src/app/core/services/publisher.service';
import { RecordMaintenanceConstant } from '../record-maintenance.constants';
import { AppUtilService } from 'src/app/core/utils/app-util.service';

@Component({
  selector: 'qnr-dosimeter',
  templateUrl: './dosimeter.component.html',
  styleUrls: ['./dosimeter.component.scss']
})
export class DosimeterComponent implements OnInit, OnDestroy {
  /***************Properties-Start***************/
  @ViewChild("participantSearchForm") participantSearchForm: NgForm;
  @ViewChild('updateDosimeterResultForm') updateDosimeterResultForm: NgForm;
  @ViewChild('participantNumber', { read: ElementRef }) private participantNumberElement: ElementRef;
  formDisabled: boolean = true;
  showDetails: boolean = false;
  searchDosimeterError: boolean = false;
  searchDosimeterErrorMsg: string = '';
  noDosimeterResult: boolean = false;
  participantSearch: any = {};
  selectedDoseimeter: any = '';  
  allLocations: Array<object> = [];
  allTypeRefs: Array<object> = [];
  allDosimeterTypeRefs: Array<object> = [];
  allAccounts: Array<object> = [];
  dosimeterResultObj: Array<object> = [];
  allDosimeterResults: Array<object> = [];
  //variable for subscribing publisher notification
  private subscribeLocationMasterData: Subscription = null;
  private subscribeTypeRefMasterData: Subscription = null;
  /***************Properties-End***************/
  /***************Constructor-Start***************/
  constructor(
    private recordMaintenanceService: RecordMaintenanceService,
    private appComponent: AppComponent
  ) { }

  ngOnInit() {
    this.loadAllLocations();
    this.loadAllTypeRefs();
    this.getAllAcounts();

    //get all locations on refresh of page
    this.subscribeLocationMasterData = PublisherService.isAllLocations$.subscribe(isLoaded => {
      this.getAllLocations(isLoaded);
    });

    //get all locations on refresh of page
    this.subscribeTypeRefMasterData = PublisherService.isAllTypeRefs$.subscribe(isLoaded => {
      this.getAllActiveRefs(isLoaded);
    })

  }
  /***************Constructor-End***************/

  /******************Component Methods-Start******************/
  
  //load all locations from app component
  private loadAllLocations() {
    this.allLocations = this.appComponent.allLocationMasterData;
  }

  //load all active refs from app component
  private loadAllTypeRefs() {
    this.allTypeRefs = this.appComponent.allTypeRefMasterData;
    this.allDosimeterTypeRefs = this.filterTypeRefs(this.allTypeRefs, 180);
  }

  //filter type refs based on their typeGroupCode
  private filterTypeRefs(allTypeRefs, typeGroupCode) {
    return allTypeRefs.filter((typeRef) => {
      return typeRef.typeGroupCode == typeGroupCode;
    })
  }

  /**
   * Get all locations from app component and function will get executed once page is refreshed 
   */
  private getAllLocations(isLoaded: boolean) {
    if (isLoaded) {
      this.loadAllLocations();
    }
  }

  /**
   * Get all type refs from app component and function will get executed once page is refreshed 
   */
  private getAllActiveRefs(isLoaded: boolean) {
    if (isLoaded) {
      this.loadAllTypeRefs();
    }
  }

  //Get all accounts
  private getAllAcounts(): void {
    this.recordMaintenanceService.getAllAccounts()
      .subscribe((data: any) => {
        this.allAccounts = data;
      });
  }

  //Get all dosimeter results
  private getAllDosimeterResults(participantId: number) {
    this.recordMaintenanceService.getAllDosimeterResults(participantId).subscribe((data: Array<object>) => {
      if(data.length==0) {
        this.allDosimeterResults = data;
        this.noDosimeterResult = true;
      } else {
        data.forEach((dosObj, index) => {
          for (let key in this.allLocations) {
            if(dosObj['locationId']==this.allLocations[key]['locationId']) {
              data[index]['isotracLocationId'] = this.allLocations[key]['isotracLocationId'];
              data[index]['locationName'] = this.allLocations[key]['locationNameForDropdown']; //add location name in dosimeter result
              break;
            }
          }
        });
        data.orderBy('isotracLocationId');
        this.allDosimeterResults = data;
        this.noDosimeterResult = false;
      }
    });
  } 

  //submit participant search form
  public submitParticipantSearch() {
    if (this.participantSearchForm.value.participantNumber===undefined || this.participantSearchForm.value.participantNumber=='') {
      this.participantNumberElement.nativeElement.focus();
      this.searchDosimeterError = true;
      this.searchDosimeterErrorMsg = RecordMaintenanceConstant.SEARCH_DOSIMETER_EMPTY_ERROR_MSG;
      return false;
    } else if(this.participantSearchForm.value.participantNumber!='') {
      var regex = /^[0-9]{5}$/;
      if(!regex.test(this.participantSearchForm.value.participantNumber)) {
        this.participantNumberElement.nativeElement.focus();
        this.searchDosimeterError = true;
        this.searchDosimeterErrorMsg = RecordMaintenanceConstant.SEARCH_DOSIMETER_LENGTH_ERROR_MSG;
        return false;
      } else {
        this.searchDosimeterError = false;
        this.searchDosimeterErrorMsg = '';
        this.showDetails = false;
        this.noDosimeterResult = false;
        this.selectedDoseimeter = '';
        this.dosimeterResultObj = [];
        this.allDosimeterResults = [];
        this.getAllDosimeterResults(this.participantSearchForm.value.participantNumber);
      }
    }
  }

  //reset participant search form
  public onResetParticipantSearchForm(event: any) {
    event.preventDefault();
    this.searchDosimeterError = false;
    this.searchDosimeterErrorMsg = '';
    this.noDosimeterResult = false;
    this.participantSearchForm.reset();
    this.dosimeterResultObj = [];
    this.showDetails = false;
    this.allDosimeterResults = [];
  }
  
  //show external dose result
  public onShowDosimeterResult(dosResultId, dosResultObj) {
    this.formDisabled = true;
    this.selectedDoseimeter = dosResultId;
    if(dosResultObj.inceptionDate !='') {    
      dosResultObj.inceptionDate = AppUtilService.createDateObjectForDatepicker(dosResultObj.inceptionDate);
    }
    this.dosimeterResultObj = dosResultObj;
    this.showDetails = true;
  } 

  //when component destroy make recources free
  ngOnDestroy() {
    if(this.subscribeLocationMasterData !== null) this.subscribeLocationMasterData.unsubscribe();
    if(this.subscribeTypeRefMasterData !== null) this.subscribeTypeRefMasterData.unsubscribe();
  }

  /******************Component Methods-Start******************/
}
