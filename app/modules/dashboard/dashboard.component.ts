import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { PublisherService } from '../../core/services/publisher.service';
import { DashboardService } from './dashboard.service';
import { AppComponent } from '../../app.component';
import { NgForm } from '@angular/forms';
import { rejectionCode } from '../../core/constants/app.constant';
import { AppUtilService } from '../../core/utils/app-util.service';
import { ConfirmSaveComponent } from '../../common/confirm-dialog/confirm-save.component';
import { DashboardConstant } from './dashboard.constants';
import { MessageService } from '../../core/services/message.service';

@Component({
  selector: 'qnr-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  /***************Properties-Start***************/
  @ViewChild('participantModal') participantModal: TemplateRef<any>;
  @ViewChild('EDRModal') EDRModal: TemplateRef<any>;
  @ViewChild('PersonnelModal') PersonnelModal: TemplateRef<any>;
  @ViewChild('openCollapseLink', { read: ElementRef }) private openCollapseLink: ElementRef;
  counts: any;
  allLocations: Array<object> = [];
  allTypeRefs: Array<object> = [];
  allBadgeUseTypeRefs: Array<object> = [];
  allDoseDerivationTypeRefs: Array<object> = [];
  allDoseUseTypeRefs: Array<object> = [];
  allDoseStatusTypeRefs: Array<object> = [];
  allDosimeterTypeRefs: Array<object> = [];
  allDoseConversionTypeRefs: Array<object> = [];
  allRadiationQualityTypeRefs: Array<object> = [];
  allIdTypeTypeRefs: Array<object> = [];
  allAccounts: Array<object> = [];
  lastProcessedParticipant: any = {};
  lastProcessedEDR: any = {};
  personIdentityDetails: Array<object> = [];

  /** Rejection Flags **/
  accountNumRejectionFlag: boolean = false;
  participantNumRejectionFlag: boolean = false;
  identificationTypeRejectionFlag: boolean = false;
  officialIdRejectionFlag: boolean = false;
  seriesRejectionFlag: boolean = false;
  inceptionDateRejectionFlag: boolean = false;
  conceptionDateRejectionFlag: boolean = false;
  lastNameRejectionFlag: boolean = false;
  sexRejectionFlag: boolean = false;
  dosimeterTypeCodeRejectionFlag: boolean = false;
  endDateRejectionFlag: boolean = false;
  firstNameRejectionFlag: boolean = false;
  birthDateRejectionFlag: boolean = false;
  lastNamePersonnelRejectionFlag: boolean = false;
  firstNamePersonnelRejectionFlag: boolean = false;
  identificationTypePersonnelRejectionFlag: boolean = false;
  officialIdPersonnelRejectionFlag: boolean = false;
  sexPersonnelRejectionFlag: boolean = false;
  birthDatePersonnelRejectionFlag: boolean = false;

  accountNumDisableFlag: boolean = true;
  participantNumDisableFlag: boolean = true;
  identificationTypeDisableFlag: boolean = true;
  officialIdDisableFlag: boolean = true;
  seriesDisableFlag: boolean = true;
  inceptionDateDisableFlag: boolean = true;
  conceptionDateDisableFlag: boolean = true;
  lastNameDisableFlag: boolean = true;
  sexDisableFlag: boolean = true;
  dosimeterTypeCodeDisableFlag: boolean = true
  endDateDisableFlag: boolean = true;
  firstNameDisableFlag: boolean = true;
  birthDateDisableFlag: boolean = true;
  lastNamePersonnelDisableFlag: boolean = true;
  firstNamePersonnelDisableFlag: boolean = true;
  identificationTypePersonnelDisableFlag: boolean = true;
  officialIdPersonnelDisableFlag: boolean = true;
  sexPersonnelDisableFlag: boolean = true;
  birthDatePersonnelDisableFlag: boolean = true;

  participantFormValid: boolean = false;
  EDRFormValid: boolean = false;
  personnelFormValid: boolean = false;
  modalRef: any;
  modalObj: any;
  locationPlaceholder: string = '';
  typeCodePlaceholder: string = '';
  accountNumPlaceholder: string = '';
  idTypePlaceholder: string = '';
  /** Rejection Flags **/

  /** EDR flags **/
  endDateError: boolean = false;
  endDateErrorMsg: string = '';
  showCollapse: boolean = false;
  formDisabled: boolean = true;
  /** EDR flags **/

  public rejectedRecordListParticipant: Array<object> = [];
  public rejectedRecordListEDR: Array<object> = [];
  public rejectedRecordListPersonnel: Array<object> = [];
  public rejectedRecordListBioAssay: Array<object> = [];
  public participantRejectionData: Array<object> = [];
  public EDRRejectionData: Array<object> = [];
  public personnelFlagData: Array<object> = [];
  public genderDropdownValue: Array<object> = [{ id: 'M', name: 'Male' }, { id: 'F', name: 'Female' }];
  //variable for subscribing publisher notification
  private subscribeLocationMasterData: Subscription = null;
  modalOption: NgbModalOptions = {};
  private subscribeTypeRefMasterData: Subscription = null;
  private popupAlreadyOpenSubscription: Subscription = null;
  /***************Properties-End***************/

  /***************Constructor-Start***************/
  constructor(
    private dashboardService: DashboardService,
    private appComponent: AppComponent,
    private modal: NgbModal,
    private modalService: NgbModal,
    private messageService: MessageService,
    private publisherService: PublisherService
  ) { }

  ngOnInit() {
    this.loadAllLocations();
    this.loadAllTypeRefs();

    //get all locations on refresh of page
    this.subscribeLocationMasterData = this.publisherService.isAllLocations$.subscribe(isLoaded => {
      this.getAllLocations(isLoaded);
    });

    //get all typeref on refresh of page
    this.subscribeTypeRefMasterData = this.publisherService.isAllTypeRefs$.subscribe(isLoaded => {
      this.getAllActiveRefs(isLoaded);
    });

    //check popup modal already opened
    this.popupAlreadyOpenSubscription = this.publisherService.isPopModalOpen$.subscribe(request => {
      this.checkActivePopupModal();
    });

    this.getCounts();
    this.getAllRecordListEDR();
    this.getAllRecordListParticipant();
    this.getAllRecordListPersonnel();
    this.getAllAccounts();
  }

  /***************Constructor-End***************/

  /**************** Helper Methods *********************/
  //open modal dialog when user click on any button after add/edit EDR
  private openModal(title: string, message: string) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalRef = this.modalService.open(ConfirmSaveComponent, this.modalOption);
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.message = message;
    return this.modalRef.result;
  }
  /****************** Helper Methods *******************/

  /******************Component Methods-Start******************/

  //load all active refs from app component
  public loadAllTypeRefs() {
    this.allTypeRefs = this.appComponent.allTypeRefMasterData;
    this.allBadgeUseTypeRefs = this.filterTypeRefs(this.allTypeRefs, 100);
    this.allDoseDerivationTypeRefs = this.filterTypeRefs(this.allTypeRefs, 140);
    this.allDoseStatusTypeRefs = this.filterTypeRefs(this.allTypeRefs, 160);
    this.allDoseUseTypeRefs = this.filterTypeRefs(this.allTypeRefs, 170);
    this.allDosimeterTypeRefs = this.filterTypeRefs(this.allTypeRefs, 190);
    this.allDoseConversionTypeRefs = this.filterTypeRefs(this.allTypeRefs, 130);
    this.allRadiationQualityTypeRefs = this.filterTypeRefs(this.allTypeRefs, 250);
    this.allIdTypeTypeRefs = this.filterTypeRefs(this.allTypeRefs, 200);
  }

  //filter type refs based on their typeGroupCode
  filterTypeRefs(allTypeRefs, typeGroupCode) {
    return allTypeRefs.filter((typeRef) => {
      return typeRef.typeGroupCode == typeGroupCode;
    })
  }

  /**
   * Get all type refs from app component and function will get executed once page is refreshed 
  */
  public getAllActiveRefs(isLoaded: boolean) {
    if (isLoaded) {
      this.loadAllTypeRefs();
    }
  }

  //load all locations from app component
  public loadAllLocations() {
    this.allLocations = this.appComponent.allLocationMasterData;
  }

  //check and close all active popup modal
  private checkActivePopupModal() {
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
    if (this.modal.hasOpenModals()) {
      this.modal.dismissAll();
    }
  }

  //Get all counts on page load
  public getCounts() {
    this.dashboardService.getAllCounts().subscribe((data: any) => {
      this.counts = data;
      data.stageJobAuditVOList.forEach((lastProcessedObj, index) => {
        if (lastProcessedObj.description === "Participant") {
          this.lastProcessedParticipant = lastProcessedObj;
          this.lastProcessedParticipant['jobStp'] = AppUtilService.changeDateFormat(lastProcessedObj.jobStp);
        } else if (lastProcessedObj.description === "External Dose") {
          this.lastProcessedEDR = lastProcessedObj;
          this.lastProcessedEDR['jobStp'] = AppUtilService.changeDateFormat(lastProcessedObj.jobStp);
        }
      });
    });
  }

  /**
   * Get all locations from app component and function will get executed once page is refreshed 
   */
  public getAllLocations(isLoaded: boolean) {
    if (isLoaded) {
      this.loadAllLocations();
    }
  }

  //Get all rejected records of Participant
  public getAllRecordListParticipant() {
    this.dashboardService.getRecordListParticipant().subscribe((data: any) => {
      this.rejectedRecordListParticipant = data;
    });
  }

  //Get all rejected records of External Dose Results
  public getAllRecordListEDR() {
    this.dashboardService.getRecordListEDR().subscribe((data: any) => {
      this.rejectedRecordListEDR = data;
    });
  }

  //Get all rejected records of Personnel
  public getAllRecordListPersonnel() {
    this.dashboardService.getRecordListPersonnel().subscribe((data: any) => {
      this.rejectedRecordListPersonnel = data;
    });
  }

  //Get All Accounts
  public getAllAccounts() {
    this.dashboardService.getAllAccounts().subscribe((data: any) => {
      this.allAccounts = data;
    });
  }

  /** Participant Rejection Code **/
  //open participant rejection modal
  public onOpenParticipantRejectionModal(participant) {

    this.accountNumRejectionFlag = false;
    this.conceptionDateRejectionFlag = false;
    this.identificationTypeRejectionFlag = false;
    this.inceptionDateRejectionFlag = false;
    this.lastNameRejectionFlag = false;
    this.officialIdRejectionFlag = false;
    this.participantNumRejectionFlag = false;
    this.seriesRejectionFlag = false;
    this.sexRejectionFlag = false;

    this.accountNumDisableFlag = true;
    this.conceptionDateDisableFlag = true;
    this.identificationTypeDisableFlag = true;
    this.inceptionDateDisableFlag = true;
    this.lastNameDisableFlag = true;
    this.officialIdDisableFlag = true;
    this.participantNumDisableFlag = true;
    this.seriesDisableFlag = true;
    this.sexDisableFlag = true;

    this.dashboardService.getParticipantRejectionDetails(participant.stageParticipantNum).subscribe((data: any) => {

      // date formatter
      if (data.inceptionDate != '' || data.inceptionDate != null) {
        if (typeof data.inceptionDate === 'object') {
        } else {
          data.inceptionDate = AppUtilService.createDateObjectForDatepicker(data.inceptionDate);
        }
      }
      if (data.conceptionDate != '' || data.conceptionDate != null) {
        if (typeof data.conceptionDate === 'object') {
        } else {
          data.conceptionDate = AppUtilService.createDateObjectForDatepicker(data.conceptionDate);
        }
      }
      // date formatter

      this.participantRejectionData = data;

      // Rejected reason check
      let codeValue = data.rejectionReason;
      let codeArray = codeValue.split(",");

      //If rejection reason is not null disable save button
      if (codeArray.length != 0) {
        this.participantFormValid = true;
      }

      //check if identification type is empty make it null for drop down
      if (this.participantRejectionData['identificationType'] == '') {
        this.participantRejectionData['identificationType'] = null;
      }
      // Rejected reason form element flags
      codeArray.forEach((code, index) => {
        switch (code) {
          case rejectionCode.accountNumCode:
            this.accountNumRejectionFlag = true;
            this.accountNumDisableFlag = false;
            this.accountNumPlaceholder = data.accountNum;
            this.participantRejectionData['accountNum'] = null;
            break;
          case rejectionCode.conceptionDateCode:
            this.conceptionDateRejectionFlag = true;
            this.conceptionDateDisableFlag = false;
            this.sexRejectionFlag = true;
            this.sexDisableFlag = false;
            break;
          case rejectionCode.identificationTypeCode:
            this.identificationTypeRejectionFlag = true;
            this.identificationTypeDisableFlag = false;
            this.idTypePlaceholder = data.identificationType;
            this.participantRejectionData['identificationType'] = null;
            break;
          case rejectionCode.inceptionDateCode:
            this.inceptionDateRejectionFlag = true;
            this.inceptionDateDisableFlag = false;
            break;
          case rejectionCode.lastNameCode:
            this.lastNameRejectionFlag = true;
            this.lastNameDisableFlag = false;
            break;
          case rejectionCode.officialIdCode:
            this.officialIdRejectionFlag = true;
            this.officialIdDisableFlag = false;
            break;
          case rejectionCode.participantNumCode:
            this.participantNumRejectionFlag = true;
            this.participantNumDisableFlag = false;
            break;
          case rejectionCode.seriesCode:
            this.seriesRejectionFlag = true;
            this.seriesDisableFlag = false;
            this.locationPlaceholder = data.series;
            this.participantRejectionData['series'] = null;
            break;
        }
      });
      // Rejected code check
    });

    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg';
    this.modalObj = this.modal.open(this.participantModal, this.modalOption);
  }

  //On Value change
  public participantValueChange(data) {
    if (data.viewModel !== '' || data.viewModel !== null) {
      if (data.viewModel == 'M') {
        this.conceptionDateRejectionFlag = true;
        this.sexRejectionFlag = true;
      }
      else if (data.viewModel == 'F') {
        this.conceptionDateRejectionFlag = false;
        this.sexRejectionFlag = false;
      }
      switch (data.name) {
        case 'accountNum':
          this.accountNumRejectionFlag = false;
          this.accountNumDisableFlag = false;
          break;
        case 'conceptionDate':
          this.conceptionDateRejectionFlag = false;
          this.conceptionDateDisableFlag = false;
          break;
        case 'identificationType':
          this.identificationTypeRejectionFlag = false;
          this.identificationTypeDisableFlag = false;
          break;
        case 'inceptionDate':
          this.inceptionDateRejectionFlag = false;
          this.inceptionDateDisableFlag = false;
          break;
        case 'lastName':
          this.lastNameRejectionFlag = false;
          this.lastNameDisableFlag = false;
          break;
        case 'officialId':
          this.officialIdRejectionFlag = false;
          this.officialIdDisableFlag = false;
          break;
        case 'series':
          this.seriesRejectionFlag = false;
          this.seriesDisableFlag = false;
          break;
      }
      if (this.accountNumRejectionFlag == false && this.conceptionDateRejectionFlag == false && this.identificationTypeRejectionFlag == false && this.inceptionDateRejectionFlag == false && this.lastNameRejectionFlag == false && this.officialIdRejectionFlag == false && this.seriesRejectionFlag == false) {
        this.participantFormValid = false;
      }
      else {
        this.participantFormValid = true;
      }
    }
  }

  //save Participant Rejection details
  public onSaveParticipantRejectionDetail(updateParticipantRejectionForm: NgForm) {
    // date formatter
    this.participantRejectionData['inceptionDate'] = AppUtilService.changeDateToSaveFormat(this.participantRejectionData['inceptionDate']);
    this.participantRejectionData['conceptionDate'] = AppUtilService.changeDateToSaveFormat(this.participantRejectionData['conceptionDate']);
    // date formatter

    this.dashboardService.saveParticipantRejectionDetails(this.participantRejectionData).subscribe((data: any) => {
      this.getAllRecordListParticipant();
      this.getCounts();
      this.modalObj.dismiss("dismiss");
      this.messageService.success('Record updated successfully'); 
    });
  }

  //On Cancel click
  public onCancelParticipantRejectionDetails(e, updateParticipantRejectionForm: NgForm) {
    if (updateParticipantRejectionForm !== undefined && updateParticipantRejectionForm.dirty) {
      e.preventDefault();
      const result = this.openModal(DashboardConstant.PARTICIPANT_REJECTION_CONFIRM_DIALOG_TITLE, DashboardConstant.REJECTION_CONFIRM_DIALOG_MSG);
      result.then((result) => {
        updateParticipantRejectionForm.form.markAsPristine();
        this.getAllRecordListParticipant();
        this.modalObj.close();
      }, (reason) => { });
    }
    else {
      this.modalObj.dismiss("dismiss");
    }
  }
  /** Participant Rejection Code ends **/

  /** EDR Rejection Code- start **/
  //open EDR rejection modal
  public onOpenEDRRejectionModal(EDR) {

    this.accountNumRejectionFlag = false;
    this.endDateRejectionFlag = false;
    this.seriesRejectionFlag = false;
    this.dosimeterTypeCodeRejectionFlag = false;
    this.participantNumRejectionFlag = false

    this.accountNumDisableFlag = true;
    this.endDateDisableFlag = true;
    this.seriesDisableFlag = true;
    this.dosimeterTypeCodeDisableFlag = true;
    this.participantNumDisableFlag = true;

    this.dashboardService.getEDRRejectionDetails(EDR.stageExtDoseResultNum).subscribe((data: any) => {

      // date formatter
      if (data.startDate != '' || data.startDate != null) {
        if (typeof data.startDate === 'object') {
        } else {
          data.startDate = AppUtilService.createDateObjectForDatepicker(data.startDate);
        }
      }

      if (data.endDate != '' || data.endDate != null) {
        if (typeof data.endDate === 'object') {
        } else {
          data.endDate = AppUtilService.createDateObjectForDatepicker(data.endDate);
        }
      }
      // date formatter
      this.EDRRejectionData = data;

      // Rejected reason check
      let codeValue = data.rejectionReason;
      let codeArray = codeValue.split(",");

      //If rejection reason is not null disable save button
      if (codeArray.length != 0) {
        this.EDRFormValid = true;
      }

      // Rejected reason form element flags
      codeArray.forEach((code, index) => {
        switch (code) {
          case rejectionCode.accountNumCode:
            this.accountNumRejectionFlag = true;
            this.accountNumDisableFlag = false;
            this.accountNumPlaceholder = data.accountNum;
            this.EDRRejectionData['accountNum'] = null;
            break;
          case rejectionCode.participantNumCode:
            this.participantNumRejectionFlag = true;
            this.participantNumDisableFlag = false;
            break;
          case rejectionCode.dosimeterTypeCode:
            this.dosimeterTypeCodeRejectionFlag = true;
            this.dosimeterTypeCodeDisableFlag = false;
            this.typeCodePlaceholder = data.series;
            this.EDRRejectionData['dosimeterType'] = null;
            break;
          case rejectionCode.endDateCode:
            this.endDateRejectionFlag = true;
            this.endDateDisableFlag = false;
            break;
          case rejectionCode.seriesCode:
            this.seriesRejectionFlag = true;
            this.seriesDisableFlag = false;
            this.locationPlaceholder = data.series;
            this.EDRRejectionData['series'] = null;
            break;
        }
      });
      // Rejected code check
    });

    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg';
    this.modalObj = this.modal.open(this.EDRModal, this.modalOption);
  }

  //On Value change
  public EDRValueChange(data) {
    if (data.viewModel !== '' || data.viewModel !== null) {
      switch (data.name) {
        case 'accountNum':
          this.accountNumRejectionFlag = false;
          this.accountNumDisableFlag = false;
          break;
        case 'series':
          this.seriesRejectionFlag = false;
          this.seriesDisableFlag = false;
          break;
        case 'dosimeterTypeCode':
          this.dosimeterTypeCodeRejectionFlag = false;
          this.dosimeterTypeCodeDisableFlag = false;
          break;
        case 'endDate':
          this.endDateRejectionFlag = false;
          this.endDateDisableFlag = false;
          break;
      }
      if (this.accountNumRejectionFlag == false && this.dosimeterTypeCodeRejectionFlag == false && this.endDateRejectionFlag == false && this.seriesRejectionFlag == false) {
        this.EDRFormValid = false;
      }
      else {
        this.EDRFormValid = true;
      }
    }
  }

  // Update external dose result  
  public onSaveEDRRejectionDetails(updateEDRRejectionForm: NgForm) {
    let startDateUpdated = new Date(updateEDRRejectionForm.form.controls.startDate.value);
    let startDateTimestamp = startDateUpdated.getTime();
    let endDateUpdated = new Date(updateEDRRejectionForm.form.controls.endDate.value);
    let endDateTimestamp = endDateUpdated.getTime();

    if (startDateTimestamp > endDateTimestamp) {
      this.endDateError = true;
      this.endDateErrorMsg = DashboardConstant.START_END_DATE_ERROR_MSG;
      return;
    }

    let updateExtFormSubmitData = {};
    if (updateEDRRejectionForm.valid) {
      updateExtFormSubmitData = this.EDRRejectionData;
      updateExtFormSubmitData['startDate'] = AppUtilService.changeDateToSaveFormat(startDateUpdated);
      updateExtFormSubmitData['endDate'] = AppUtilService.changeDateToSaveFormat(endDateUpdated);

      this.dashboardService.saveEDRRejectionDetails(updateExtFormSubmitData)
        .subscribe(result => {
          this.getAllRecordListEDR();
          this.getCounts();
          this.modalObj.dismiss("dismiss");
          this.messageService.success('Record updated successfully'); 
        });
      this.formDisabled = true;
      this.endDateError = false;
      this.endDateErrorMsg = '';
      updateEDRRejectionForm.form.markAsPristine();
    } else {
      return;
    }
  }

  //On Cancel click
  public onCancelEDRRejectionDetails(e, updateEDRRejectionForm: NgForm) {
    if (updateEDRRejectionForm !== undefined && updateEDRRejectionForm.dirty) {
      e.preventDefault();
      const result = this.openModal(DashboardConstant.EDR_REJECTION_CONFIRM_DIALOG_TITLE, DashboardConstant.REJECTION_CONFIRM_DIALOG_MSG);
      result.then((result) => {
        updateEDRRejectionForm.form.markAsPristine();
        this.getAllRecordListEDR();
        this.modalObj.close();
      }, (reason) => { });
    }
    else {
      this.modalObj.dismiss("dismiss");
    }
  }
  /** EDR Rejection Code - End **/


  /** Personnel Flag/Rejection  Code - Start **/
  public onOpenPersonnelFlagModal(Personnel) {

    //set all rejectionflags as false
    this.lastNamePersonnelRejectionFlag = false;
    this.firstNamePersonnelRejectionFlag = false;
    this.identificationTypePersonnelRejectionFlag = false;
    this.officialIdPersonnelRejectionFlag = false;
    this.sexPersonnelRejectionFlag = false;
    this.birthDatePersonnelRejectionFlag = false;

    //set all diableflags as true
    this.lastNamePersonnelDisableFlag = true;
    this.firstNamePersonnelDisableFlag = true;
    this.identificationTypePersonnelDisableFlag = true;
    this.officialIdPersonnelDisableFlag = true;
    this.sexPersonnelDisableFlag = true;
    this.birthDatePersonnelDisableFlag = true;


    this.dashboardService.getPersonnelFlagDetails(Personnel.personNum).subscribe((data: any) => {

      // date formatter
      if (data.birthDate != '' || data.birthDate !== null) {
        if (typeof data.birthDate === 'object') {
        } else {
          data.birthDate = AppUtilService.createDateObjectForDatepicker(data.birthDate);
        }
      }
      this.personnelFlagData = data;
      if (data.personIdentity.length > 0) {
        this.personIdentityDetails = data.personIdentity[0];
      } else {
        this.personIdentityDetails['personId'] = data.personId;
        this.personIdentityDetails['officialId'] = '';
        this.personIdentityDetails['identityTypeCode'] = null;
      }

      // Rejected reason check
      let codeValue = data.flagReasonCode.toString();
      let codeArray = codeValue.split(",");

      //If rejection reason is not null disable save button
      if (codeArray.length != 0) {
        this.personnelFormValid = true;
      }

      // Rejected reason form element flags
      codeArray.forEach((code, index) => {
        switch (code) {
          case rejectionCode.lastNameCodePersonnel:
            this.lastNamePersonnelRejectionFlag = true;
            this.lastNamePersonnelDisableFlag = false;
            break;
          case rejectionCode.firstNameCodePersonnel:
            this.firstNamePersonnelRejectionFlag = true;
            this.firstNamePersonnelDisableFlag = false;
            break;
          case rejectionCode.officialIdCodePersonnel:
            this.officialIdPersonnelRejectionFlag = true;
            this.officialIdPersonnelDisableFlag = false;
            break;
          case rejectionCode.genderCodePersonnel:
            this.sexPersonnelRejectionFlag = true;
            this.sexPersonnelDisableFlag = false;
            break;
          case rejectionCode.birthDateCodePersonnel:
            this.birthDatePersonnelRejectionFlag = true;
            this.birthDatePersonnelDisableFlag = false;
            break;
        }
      });
      // Rejected code check
    });
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg';
    this.modalObj = this.modal.open(this.PersonnelModal, this.modalOption);
  }

  //On Value change
  public personnelValueChange(data) {
    if (data.viewModel !== "" || data.viewModel !== null) {
      switch (data.name) {
        case 'lastNamePersonnel':
          this.lastNamePersonnelRejectionFlag = false;
          this.lastNamePersonnelDisableFlag = false;
          break;
        case 'firstNamePersonnel':
          this.firstNamePersonnelRejectionFlag = false;
          this.firstNamePersonnelDisableFlag = false;
          break;
        case 'identificationTypePersonnel':
          this.identificationTypePersonnelRejectionFlag = false;
          this.identificationTypePersonnelDisableFlag = false;
          break;
        case 'officialIdPersonnel':
          this.officialIdPersonnelRejectionFlag = false;
          this.officialIdPersonnelDisableFlag = false;
          break;
        case 'sexPersonnel':
          this.sexPersonnelRejectionFlag = false;
          this.sexPersonnelDisableFlag = false;
          break;
        case 'birthDatePersonnel':
          this.birthDatePersonnelRejectionFlag = false;
          this.birthDatePersonnelDisableFlag = false;
          break;
      }
      if (this.lastNamePersonnelRejectionFlag == false && this.firstNamePersonnelRejectionFlag == false && this.identificationTypePersonnelRejectionFlag == false && this.officialIdPersonnelRejectionFlag == false && this.sexPersonnelRejectionFlag == false && this.birthDatePersonnelRejectionFlag == false) {
        this.personnelFormValid = false;
      }
      else {
        this.personnelFormValid = true;
      }
    }
  }

  //save Participant Rejection details
  public onSavePersonnelFlagDetail(updatePersonnelFlagForm: NgForm) {
    let updatePersonnelDetails = { personIdentity: [] };
    updatePersonnelDetails["personId"] = this.personnelFlagData["personId"];
    updatePersonnelDetails["lastName"] = this.personnelFlagData["lastName"];
    updatePersonnelDetails["firstName"] = this.personnelFlagData["firstName"];
    updatePersonnelDetails["genderCode"] = this.personnelFlagData["genderCode"];
    updatePersonnelDetails["flagReasonCode"] = this.personnelFlagData["flagReasonCode"];
    if (this.personnelFlagData['birthDate'] !== null) {
      updatePersonnelDetails['birthDate'] = AppUtilService.changeDateToSaveFormat(this.personnelFlagData['birthDate']);
    }
    if (this.personnelFlagData['personIdentity'].length > 0) {
      this.personnelFlagData['personIdentity'][0] = this.personIdentityDetails;
      updatePersonnelDetails['personIdentity'][0] = this.personIdentityDetails;
    } else {
      if (this.personIdentityDetails["officialId"] != '' || this.personIdentityDetails['identityTypeCode'] !== null) {
        let personIdentityObj = {};
        personIdentityObj['personId'] = this.personnelFlagData["personId"];
        personIdentityObj['officialId'] = this.personIdentityDetails["officialId"];
        personIdentityObj['identityTypeCode'] = this.personIdentityDetails['identityTypeCode'];
        personIdentityObj['personIdentityId'] = null;
        personIdentityObj['activeFlag'] = true;
        updatePersonnelDetails['personIdentity'].push(personIdentityObj);

      } else {
        updatePersonnelDetails['personIdentity'] = [];
      }

    }
    
    this.dashboardService.savePersonnelFlagDetails(updatePersonnelDetails).subscribe((data: any) => {
      this.getAllRecordListPersonnel();
      this.getCounts();
      this.modalObj.dismiss("dismiss");
      this.messageService.success('Record updated successfully'); 
    });
  }

  //On Cancel click
  public onCancelPersonnelFlagDetails(e, updatePersonnelFlagForm: NgForm) {
    if (updatePersonnelFlagForm !== undefined && updatePersonnelFlagForm.dirty) {
      e.preventDefault();
      const result = this.openModal(DashboardConstant.PERSONNEL_REJECTION_CONFIRM_DIALOG_TITLE, DashboardConstant.REJECTION_CONFIRM_DIALOG_MSG);
      result.then((result) => {
        updatePersonnelFlagForm.form.markAsPristine();
        this.getAllRecordListPersonnel();
        this.modalObj.close();
      }, (reason) => { });
    }
    else {
      this.modalObj.dismiss("dismiss");
    }
  }

  /** Person Flag/Rejection Code - End **/

  ngOnDestroy() {
    if (this.subscribeLocationMasterData) this.subscribeLocationMasterData.unsubscribe();
    if (this.subscribeTypeRefMasterData) this.subscribeTypeRefMasterData.unsubscribe();
    if (this.popupAlreadyOpenSubscription) this.popupAlreadyOpenSubscription.unsubscribe();
  }
  /******************Component Methods-End******************/

}
