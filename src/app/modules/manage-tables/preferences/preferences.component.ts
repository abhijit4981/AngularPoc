import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { Subscription, Observable, Subject } from 'rxjs';

import { ManageTablesService } from '../manage-tables.service';
import { AppComponent } from '../../../app.component';
import { PublisherService } from 'src/app/core/services/publisher.service';
import { MangeTableConstant } from '../manage-tables.constants';
import { NgForm } from '@angular/forms';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmSaveComponent } from '../../../common/confirm-dialog/confirm-save.component';
import { DialogService } from '../../../shared/services/dialog.service';
import { ComponentCanDeactivate } from '../../../core/guards/component-can-deactivate';
import { MessageService } from 'src/app/core/services/message.service';
import { AppUtilService } from 'src/app/core/utils/app-util.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'qnr-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  /***************Properties-Start***************/
  @ViewChild('configurationForm') configurationForm: NgForm;
  @ViewChild('personSearch', { read: ElementRef }) private personSearch: ElementRef;// if we want to use element ref to target element we have to use 'read' and private in the @viewchild
  formDisabled: boolean = true;
  showDetails: boolean = false;
  onError: boolean = false;
  showMask: boolean = true;
  showSearchMask: boolean = true;
  showFirstCollapse: boolean = false;
  showSecondCollapse: boolean = false;
  selectedConfigIndex: number;
  selectedConfigTitle: string = '';
  selectedConfigType: string = '';
  selectedConfigTypeObj: any = {};
  allLocations: Array<object> = [];
  allLocationSeries: Array<object> = [];
  allAccounts: Array<object> = [];
  allIntakeRetention: Array<object> = [];
  allRadionuclides: Array<object> = [];
  allTypeRefs: Array<object> = [];
  allFrequencyTypeRefs: Array<object> = [];
  allGroupTypeRefs: Array<object> = [];
  personData: Array<object> = [];
  personDetails: Array<object> = [];
  personIdentityDetails: Array<object> = [];
  personParticipantDetails: Array<object> = [];
  personPregnancyDetails: Array<object> = [];
  allPersonParticipants: Array<object> = [];
  allBadgeUseTypeRefs: Array<object> = [];
  allIdTypeTypeRefs: Array<object> = [];
  modalRef: any;
  modalOption: NgbModalOptions = {};
  saveDataObj: Array<object> = [];
  tempSaveDataObj: Array<object> = [];
  private lastMenuSelected: string = '';
  public genderDropdownValue: Array<object> = [{ id: 'M', name: 'Male' }, { id: 'F', name: 'Female' }];
  personSearched: boolean = false;
  searchCriteria: string = '';
  allPersons$: Observable<any>;
  private personSearchTerms = new Subject<string>();
  //variable for subscribing publisher notification
  private subscribeTypeRefMasterData: Subscription = null;
  //variable for subscribing publisher notification
  private subscribeLocationMasterData: Subscription = null;
  private popupAlreadyOpenSubscription: Subscription = null;
  configurationLeftNavLinks = MangeTableConstant.CONFIGURATION_LEFT_LINKS;
  /***************Properties-End***************/

  /***************Constructor-Start***************/
  constructor(
    private mtService: ManageTablesService,
    private appComponent: AppComponent,
    private modalService: NgbModal,
    private dialogService: DialogService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.loadAllLocations();
    this.loadAllTypeRefs();
    //get all locations on refresh of page
    this.subscribeLocationMasterData = PublisherService.isAllLocations$.subscribe(isLoaded => {
      this.getAllLocations(isLoaded);
    });
    //get all locations on refresh of page
    this.subscribeTypeRefMasterData = PublisherService.isAllTypeRefs$.subscribe(isLoaded => {
      this.getAllActiveRefs(isLoaded);
    });

    //check popup modal already opened
    this.popupAlreadyOpenSubscription = PublisherService.isPopModalOpen$.subscribe(request => {
      this.checkActivePopupModal();
    });

    this.getAllAcounts();
    this.getAllIntakeRetention();
    this.getAllRadionuclides();

    this.allPersons$ = this.personSearchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      switchMap((searchTerm: any) => this.mtService.getPersonData(searchTerm)),
      
    );
    //this.allPersons$.subscribe(data => { this.allEmpData = data});
  }

  ngOnDestroy(): void {
    if(this.subscribeLocationMasterData !== null) this.subscribeLocationMasterData.unsubscribe();
    if(this.subscribeTypeRefMasterData !== null) this.subscribeTypeRefMasterData.unsubscribe();
    if(this.popupAlreadyOpenSubscription !== null) this.popupAlreadyOpenSubscription.unsubscribe();
  }

  //open confirmation popup modal when user made chanes in form and try to navigate away
  canDeactivate(): Observable<boolean> | boolean | Promise<boolean> {
    if (this.configurationForm === undefined) {
      return true;
    } else if (this.configurationForm !== undefined && this.configurationForm.dirty) {
      return this.dialogService.confirmDialog(MangeTableConstant.CONFIG_ROUTE_CONFIRM_DIALOG_TITLE, MangeTableConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
    }
    return true;
  }
  /***************Constructor-End***************/

  /**************** Helper Methods *********************/
  //open modal dialog when user click on any button after add/edit EDR
  private openModal(title: string, message: string) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg';
    this.modalRef = this.modalService.open(ConfirmSaveComponent, this.modalOption);
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.message = message;
    return this.modalRef.result;
  }

  //check and close all active popup modal
  private checkActivePopupModal() {
    if(this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
  }

  //input validation for restricting zero 
  public inputValidation(e, i, configType, inputName?: string, inputType?: string) {
    //register index value when row value is updated
    this.tempSaveDataObj.push(i);
    this.saveDataObj = this.tempSaveDataObj.distinct();
    let input = '';
    if(inputType!==undefined && inputType=='select') {
      input = e;
    } else {
      input = e.currentTarget.value;
    }
    switch (configType) {
      case 'account':

        break;
      case 'intakeRetention':
        if (inputName === 'irfValueQty') {
          if (!(/^\s*(?=.*[1-9])\d*(?:\.\d{1,6})?\s*$/).test(input)
            && input != '') {
            e.currentTarget.classList.add('is-invalid');
            e.currentTarget.parentNode.children[1].style.display = 'block';
            this.onError = true;
          } else {
            e.currentTarget.classList.remove('is-invalid');
            e.currentTarget.parentNode.children[1].style.display = 'none';
            this.onError = false;
          }
        } else if (inputName === 'daysGreatEqQty') {
          if (!(/^\s*(?=.*[0-9])\d*(?:\.\d{1,2})?\s*$/).test(input)
            && input != '') {
            e.currentTarget.classList.add('is-invalid');
            e.currentTarget.parentNode.children[1].style.display = 'block';
            this.onError = true;
          } else {
            e.currentTarget.classList.remove('is-invalid');
            e.currentTarget.parentNode.children[1].style.display = 'none';
            this.onError = false;
          }
        } else if (inputName === 'daysLessQty') {
          if (!(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/).test(input)
            && input != '') {
            e.currentTarget.classList.add('is-invalid');
            e.currentTarget.parentNode.children[1].style.display = 'block';
            this.onError = true;
          } else {
            e.currentTarget.classList.remove('is-invalid');
            e.currentTarget.parentNode.children[1].style.display = 'none';
            this.onError = false;
          }
        }
        break;
      case 'location':
        break;
      case 'person':

        break;
      case 'radionuclide':
        if (!(/^[1-9]\d*$/).test(input) && input != '') {
          e.currentTarget.classList.add('is-invalid');
          this.onError = true;
          e.currentTarget.parentNode.children[1].style.display = 'block';
        } else {
          e.currentTarget.classList.remove('is-invalid');
          this.onError = false;
          e.currentTarget.parentNode.children[1].style.display = 'none';
        }
        break;
    }
  }

  /****************** Helper Methods *******************/

  /******************Component Methods-Start******************/
  //load all locations from app component
  public loadAllLocations() {
    this.allLocationSeries = [];
    this.allLocations = this.appComponent.allLocationMasterData;
    let locationSeriesArray = this.appComponent.allLocationMasterData;
    this.allLocationSeries = this.allLocationSeries.concat(locationSeriesArray);
    this.allLocationSeries.orderByForStringField('seriesValue');
    this.allLocations.orderBy('isotracLocationId');
  }

  //load all active refs from app component
  public loadAllTypeRefs() {
    this.allTypeRefs = this.appComponent.allTypeRefMasterData;
    this.allBadgeUseTypeRefs = this.filterTypeRefs(this.allTypeRefs, 100);
    this.allIdTypeTypeRefs = this.filterTypeRefs(this.allTypeRefs, 200);
    this.allFrequencyTypeRefs = this.filterTypeRefs(this.allTypeRefs, 270);
    this.allGroupTypeRefs = this.filterTypeRefs(this.allTypeRefs, 220);
    this.allGroupTypeRefs.orderByForStringField('description');
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
  public getAllLocations(isLoaded: boolean) {
    if (isLoaded) {
      this.loadAllLocations();
    }
  }

  /**
   * Get all type refs from app component and function will get executed once page is refreshed 
   */
  public getAllActiveRefs(isLoaded: boolean) {
    if (isLoaded) {
      this.loadAllTypeRefs();
    }
  }

  //Get all accounts
  private getAllAcounts(): void {
    this.mtService.getAllAccounts()
      .subscribe((data: any) => {
        this.allAccounts = data;
      });
  }

  //Get all Intake Retention
  private getAllIntakeRetention(): void {
    this.mtService.getAllIntakeRetention()
      .subscribe((data: any) => {
        this.allIntakeRetention = data;
      });
  }

  //Get all Nuclieds
  private getAllRadionuclides(): void {
    this.mtService.getAllRadionuclides()
      .subscribe((data: any) => {
        this.allRadionuclides = data;
      });
  }
  
  // Push a person search term into the observable stream.
  public searchPerson(term: string): void {
    if(term && term.length > 2) {
      this.personSearchTerms.next(term);
    } else {
      this.personSearchTerms.next('');
    }
  }

  private performPersonSearch(id) {
    this.allPersonParticipants = [];
    this.mtService.getPersonDataByID(id)
      .subscribe((data: any) => {
        this.personSearched = true;
        this.searchCriteria = '';
        
        if(!String.isNullOrEmpty(data.birthDate)) {    
          data.birthDate = AppUtilService.createDateObjectForDatepicker(data.birthDate);
        }
        this.personDetails = data;
        if(data.personIdentity.length > 0) {
          this.personIdentityDetails = data.personIdentity[0];  
        } else {
          this.personIdentityDetails['personId'] = data.personId;
          this.personIdentityDetails['officialId'] = '';
          this.personIdentityDetails['identityTypeCode'] = null;
        }
        this.personParticipantDetails = data.participant;
        if(data.participant.length > 0) {
          let participantTemp = {};
          data.participant.forEach((participantObj, index) => {
            if(participantObj.participantLocation.length > 0) {
              participantObj.participantLocation.forEach((participantLocObj, j) => {
                participantTemp = {
                  participantId: participantObj.participantId,
                  inceptionDate: participantObj['inceptionDate'],
                  dosimetryParticipantId: participantObj['dosimetryParticipantId'],
                  participantLocationName: ''
                };
                participantTemp['participantLocationName'] = AppUtilService.getValueFromArray(this.allLocations, participantLocObj['locationId'], 'locationId', 'locationNameForDropdown');
                this.allPersonParticipants.push(participantTemp);
              });
            }
          });
        }
        this.personPregnancyDetails = data.pregnancy;
      });
  }

  //on select search result
  public onSelectSearchPerson(id) {
    if(this.configurationForm !== undefined && this.configurationForm.dirty) {
      const result = this.openModal(MangeTableConstant.CONFIG_ROUTE_CONFIRM_DIALOG_TITLE, MangeTableConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result) => {
        this.performPersonSearch(id);
        this.configurationForm.form.markAsPristine();
        this.formDisabled = true;
      }, (reason) => { });
    } else {
      this.formDisabled = true;
      this.performPersonSearch(id);
    }
  }
  
  //hide person search result on blur of person name field
  public hidePersonSearchResult() {
    this.personSearchTerms.next('');
  }

  /**
   * Update configuration
   */
  public onUpdateConfiguration(configType) {
    switch (configType) {
      case 'account':
        let allAccountsObj: any = this.saveDataObj.map((item: any) =>
          this.allAccounts[item]
        );
        this.mtService.saveAllAccounts(allAccountsObj)
          .subscribe((result: any) => {
            this.getAllAcounts();
            this.configurationForm.form.markAsPristine();
            this.formDisabled = true;
            this.messageService.success('Account updated successfully.');
          });
        break;
      case 'intakeRetention':
        //Filter changed objects from actual data              
        let intakeObj: any = this.saveDataObj.map((item: any) =>
          this.allIntakeRetention[item]
        );
        this.mtService.saveAllIntakeRetention(intakeObj)
          .subscribe((result: any) => {
            this.getAllIntakeRetention();
            this.configurationForm.form.markAsPristine();
            this.formDisabled = true;
            this.messageService.success('Intake retention fraction updated successfully.');            
          });
        break;
      case 'location':
        //Filter changed objects from actual data              
        let locationObj: any = this.saveDataObj.map((item: any) =>
          this.allLocations[item]
        );
        this.mtService.saveAllLocation(locationObj)
          .subscribe((result: any) => {
            this.appComponent.getAllLocationMsterData();
            this.configurationForm.form.markAsPristine();
            this.formDisabled = true;
          });
        break;
      case 'person':
        let updatePersonDetails = {personIdentity: []};
        updatePersonDetails["personId"] = this.personDetails["personId"];
        updatePersonDetails["lastName"] = this.personDetails["lastName"];
        updatePersonDetails["firstName"] = this.personDetails["firstName"];
        updatePersonDetails["genderCode"] = this.personDetails["genderCode"];
        updatePersonDetails["personId"] = this.personDetails["personId"];
        if(this.personDetails['birthDate'] !== null) {
          updatePersonDetails['birthDate'] = AppUtilService.changeDateToSaveFormat(this.personDetails['birthDate']);
        }
        if(this.personDetails['personIdentity'].length > 0) {
          this.personDetails['personIdentity'][0] = this.personIdentityDetails;
          updatePersonDetails['personIdentity'][0] = this.personIdentityDetails;
        } else {
          if(this.personIdentityDetails["officialId"] != '' || this.personIdentityDetails['identityTypeCode'] !== null) {
            let personIdentityObj = {};
            personIdentityObj['personId'] = this.personDetails["personId"];
            personIdentityObj['officialId'] = this.personIdentityDetails["officialId"];
            personIdentityObj['identityTypeCode'] = this.personIdentityDetails['identityTypeCode'];
            personIdentityObj['personIdentityId'] = null;
            personIdentityObj['activeFlag'] = true;
            updatePersonDetails['personIdentity'].push(personIdentityObj);

          } else {
            updatePersonDetails['personIdentity'] = [];
          }
        }
        this.mtService.savePersonDetails(updatePersonDetails)
          .subscribe((result: any) => {
            this.configurationForm.form.markAsPristine();
            this.onSelectSearchPerson(this.personDetails['personId']);
            this.formDisabled = true;
            this.messageService.success('Person details updated successfully.');            
          });
        break;
      case 'radionuclide':
        //Filter changed objects from actual data              
        let nucliedObj: any = this.saveDataObj.map((item: any) =>
          this.allRadionuclides[item]
        );
        this.mtService.saveAllRadionuclides(nucliedObj)
          .subscribe((result: any) => {
            this.getAllRadionuclides();
            this.configurationForm.form.markAsPristine();
            this.formDisabled = true;
            this.messageService.success('Radionuclide updated successfully.');            
          });
        break;
    }
  }

  /**
   * Cancel Configuration
   */
  public onCancelConfiguration(e) {
    if(this.configurationForm !== undefined && this.configurationForm.dirty) {
      e.preventDefault();
      const result = this.openModal(MangeTableConstant.CONFIG_ROUTE_CONFIRM_DIALOG_TITLE, MangeTableConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result) => {
        this.tempSaveDataObj = [];
        this.lastMenuSelected = this.selectedConfigTypeObj.name;
        //undo all the chages
        switch (this.lastMenuSelected) {
          case 'account':
            this.getAllAcounts();
            break;
          case 'intakeRetention':
            this.getAllIntakeRetention();
            break;
          case 'location':
            this.appComponent.getAllLocationMsterData();
            break;
          case 'person':
            this.onSelectSearchPerson(this.personDetails['personId']);
            break;
          case 'radionuclide':
            this.getAllRadionuclides();
            break;
        }
        this.configurationForm.form.markAsPristine();
        this.formDisabled = true;
      }, (reason) => { });
    } else {
      this.configurationForm.form.markAsPristine();
      this.formDisabled = true;
    }
  }

  /**
   * Show listing of particular config type
   */
  public onShowConfigTypeDetails(e, linkIndex, configType): void {
    if (this.configurationForm !== undefined && this.configurationForm.dirty) {
      e.preventDefault();
      const result = this.openModal(MangeTableConstant.CONFIG_ROUTE_CONFIRM_DIALOG_TITLE, MangeTableConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result) => {
        this.tempSaveDataObj = [];
        this.lastMenuSelected = this.selectedConfigTypeObj.name;
        switch (this.lastMenuSelected) {
          case 'account':
            this.getAllAcounts();
            break;
          case 'intakeRetention':
            this.getAllIntakeRetention();
            break;
          case 'location':
            this.loadAllLocations();
            break;
          case 'person':
            this.personSearched = false;
            this.personDetails = [];
            this.allPersonParticipants = [];
            break;
          case 'radionuclide':
            this.getAllRadionuclides();
            break;
        }
        this.onMenuSelect(linkIndex, configType);
        this.configurationForm.form.markAsPristine();
        this.formDisabled = true;
      }, (reason) => { });
    }
    else {
      if(configType.name!="person") {
        this.personSearched = false;
        this.personDetails = [];
        this.allPersonParticipants = [];
      }
      this.onMenuSelect(linkIndex, configType);
    }

  }

  //Open menu on menu selection
  public onMenuSelect(linkIndex, configType) {
    this.formDisabled = true;
    this.selectedConfigIndex = linkIndex;
    this.selectedConfigTypeObj = configType;
    this.showDetails = true;
  }

/**
 * Enable update of cross ref details
 * @param 'e' event obj, 'linkIndex' clicked config item and 'configType' config Obj which'll be updated 
 */
  public onEnableConfigurationEdit(e, linkIndex, configType): void {
    e.preventDefault();
    if(this.configurationForm !== undefined && this.configurationForm.dirty) {
      const result = this.openModal(MangeTableConstant.CONFIG_ROUTE_CONFIRM_DIALOG_TITLE, MangeTableConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result) => {
        this.tempSaveDataObj = [];
        this.lastMenuSelected = this.selectedConfigTypeObj.name;
        switch (this.lastMenuSelected) {
          case 'account':
            this.getAllAcounts();
            break;
          case 'intakeRetention':
            this.getAllIntakeRetention();
            break;
          case 'location':
            this.loadAllLocations();
            break;
          case 'person':
            this.personSearched = false;
            this.personDetails = [];
            this.allPersonParticipants = [];
            break;
          case 'radionuclide':
            this.getAllRadionuclides();
            break;
        }
        this.onMenuSelect(linkIndex, configType);
        this.configurationForm.form.markAsPristine();
        this.formDisabled = true;
      }, (reason) => { });
    } else {
      if(configType.name!="person") {
        this.personSearched = false;
        this.personDetails = [];
        this.allPersonParticipants = [];
      }
      this.onMenuSelect(linkIndex, configType);
      this.formDisabled = false;
      this.selectedConfigIndex = linkIndex;
      this.selectedConfigTypeObj = configType;
      if (!this.showDetails) this.showDetails = true; //if config details not already opened then first open
    }
  }

  /******************Component Methods-End******************/
}
