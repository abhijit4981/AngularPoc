import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RecordMaintenanceService } from '../record-maintenance.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { AppComponent } from 'src/app/app.component';
import { PublisherService } from 'src/app/core/services/publisher.service';
import { ConfirmSaveComponent } from 'src/app/common/confirm-dialog/confirm-save.component';
import { ComponentCanDeactivate } from 'src/app/core/guards/component-can-deactivate';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { RecordMaintenanceConstant } from '../record-maintenance.constants';
import { AppUtilService } from 'src/app/core/utils/app-util.service';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'qnr-external-contamination',
  templateUrl: './external-contamination.component.html',
  styleUrls: ['./external-contamination.component.scss']
})
export class ExternalContaminationComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  /***************Properties-Start***************/
  @ViewChild("employeeSearchForm") empSearchForm: any;
  @ViewChild('updateExternalResultForm') updateExternalResultForm: NgForm;
  @ViewChild('addExternalResultForm') addExternalResultForm: NgForm;
  @ViewChild('selectedEmployee', { read: ElementRef }) private searchEmployeeElement: ElementRef;// if we want to use element ref to target element we have to use 'read' and private in the @viewchild
  @ViewChild('startDate', { read: ElementRef }) private searchDateElement: ElementRef;
  @ViewChild('openCollapseLink', { read: ElementRef }) private openCollapseLink: ElementRef;
  formDisabled: boolean = true;
  showDetails: boolean = false;
  disableAddNew: boolean = true;
  addNewForm: boolean = false;
  addNewSave: boolean = false;
  submitted: boolean = false;
  showCollapse: boolean = false;
  noExternalResult: boolean = false;
  searchEmployeeError: boolean = true;
  searchDateError: boolean = true; 
  noMatchFound: boolean = false;
  startDateError:boolean = false;
  startDateErrorMsg:string = '';
  searchEmployeeErrorMsg: string = RecordMaintenanceConstant.SEARCH_EMPLOYEE_ERROR_MSG;
  searchDateErrorMsg: string = RecordMaintenanceConstant.SEARCH_DATE_ERROR_MSG;
  selectedExternalDose: any = '';
  allLocations: Array<object> = [];
  allTypeRefs: Array<object> = [];
  allBadgeUseTypeRefs: Array<object> = [];
  allDoseDerivationTypeRefs: Array<object> = [];
  allDoseUseTypeRefs: Array<object> = [];
  allDoseStatusTypeRefs: Array<object> = [];
  allDosimeterTypeRefs: Array<object> = [];
  allDoseConversionTypeRefs: Array<object> = [];
  allRadiationQualityTypeRefs: Array<object> = [];
  allControlIndicator: Array<object> = [{id: true, name: 'Y'},{id: false, name: 'N'}];
  externalDoseResultObj: Array<object> = [];
  allExternalDoseResults: Array<object> = [];
  addExtDoseResultFormData = {};
  modalRef: any;
  modalOption: NgbModalOptions = {};
  employeeSearch: any = {};
  selectedEmployee: any = '';
  selectedEmployeeDetails: any = {};
  storedSelectedEmployeeDetails: any = {};
  selectedEmployeeFlag: boolean;
  selectedEmployeeId: any = '';
  selectedParticipantId: any = '';
  selectedParticipantNum: any = '';
  selectedStartDate: any = '';
  minEndDate: any;
  maxStartDate: any;
  allEmployees$: Observable<any>;
  allEmpData: Array<object> = []; 
  hideSearchList: boolean = false;
  private empSearchTerms = new Subject<string>();
  //variable for subscribing publisher notification
  private subscribeLocationMasterData: Subscription = null;
  private subscribeTypeRefMasterData: Subscription = null;
  private popupAlreadyOpenSubscription: Subscription = null;
  /***************Properties-End***************/
  /***************Constructor-Start***************/
  constructor(
    private modalService: NgbModal,
    private dialogService: DialogService,  
    private recordMaintenanceService: RecordMaintenanceService,
    private messageService: MessageService,
    private appComponent: AppComponent,
    private publisherService: PublisherService
  ) { }

  ngOnInit() {
    this.loadAllLocations();
    this.loadAllTypeRefs();

    //get all locations on refresh of page
    this.subscribeLocationMasterData = this.publisherService.isAllLocations$.subscribe(isLoaded => {
      this.getAllLocations(isLoaded);
    });

    //get all locations on refresh of page
    this.subscribeTypeRefMasterData = this.publisherService.isAllTypeRefs$.subscribe(isLoaded => {
      this.getAllActiveRefs(isLoaded);
    });

    //check popup modal already opened
    this.popupAlreadyOpenSubscription = this.publisherService.isPopModalOpen$.subscribe(request => {
      this.checkActivePopupModal();
    });

    this.allEmployees$ = this.empSearchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      switchMap((searchTerm: any) => this.recordMaintenanceService.getAllEmployees(searchTerm, 'external')),
      
    );
    this.allEmployees$.subscribe(data => {
      if(data.length == 0){
        this.hideSearchList = false;
        this.searchEmployeeError = true;
      } else {
        this.hideSearchList = true;
      }
    });

  }

  //open confirmation popup modal when user made chanes in form and try to navigate away
  canDeactivate(): Observable<boolean> | boolean | Promise<boolean> {
    if (this.updateExternalResultForm===undefined && this.addExternalResultForm===undefined) {
      return true;
    } else if (this.updateExternalResultForm!==undefined && this.updateExternalResultForm.dirty) {
      return this.dialogService.confirmDialog(RecordMaintenanceConstant.EDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);

    } else if(this.addExternalResultForm!==undefined && this.addExternalResultForm.dirty) {
      return this.dialogService.confirmDialog(RecordMaintenanceConstant.EDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.ADD_ROUTE_CONFIRM_DIALOG_MSG);
    }
    return true;
  } 

  /***************Constructor-End***************/

  /******************Component Methods-Start******************/
  
  //load all locations from app component
  public loadAllLocations() {
    this.allLocations = this.appComponent.allLocationMasterData;
  }

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
  }

  //filter type refs based on their typeGroupCode
  filterTypeRefs(allTypeRefs, typeGroupCode) {
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

  //check and close all active popup modal
  private checkActivePopupModal() {
    if(this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
  }

  // Push a search term into the observable stream.
  public searchEmployee(term: string): void {
    if(term && term.length>=2) {
      this.empSearchTerms.next(term);
    } else {
      this.empSearchTerms.next('');
    }
  }

  //assign selected search emp in employee input
  public onSelectSearchEmployee(selectedEmp) {
    this.selectedEmployeeDetails = selectedEmp;
    this.employeeSearch.selectedEmployee = selectedEmp.lastName+(selectedEmp.firstName!==''?', '+selectedEmp.firstName:'')+(selectedEmp.participantId!==null?' - '+selectedEmp.participantId:'');
    sessionStorage.setItem('selectedEmpLastName', selectedEmp.lastName);
    this.employeeSearch.employeeId = selectedEmp.personNum;
    this.employeeSearch.participantNum = selectedEmp.participantNum;
    this.employeeSearch.isPerson = selectedEmp.isPerson; 
    this.searchEmployeeError = false; 
    this.hideSearchList = false;
    // this.empSearchTerms.next('');   
  }

  //hide employee search result on blur of employee name field
  public hideEmployeeSearchResult() {
    // this.empSearchTerms.next('');
    setTimeout(() => {
      this.hideSearchList = false; 
    }, 300);
  }

  public startDateSelected($event) {
    if ($event.value == null) {
      this.searchDateError = true;
    } else {
      this.searchDateError = false;
    }
  }

  public onEmployeeSearchClear() {
    if (this.employeeSearch.selectedEmployee == '') {
      this.searchEmployeeError = true;
    }
  } 

  //open modal dialog when user click on any button after add/edit EDR
  private openModal(title: string, message: string) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalRef = this.modalService.open(ConfirmSaveComponent, this.modalOption);
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.message = message;
    return this.modalRef.result;
  }

  private performEmployeeSearch(searchForm: any) {
    this.disableAddNew = true;
    if (this.searchEmployeeError == true && this.searchDateError == true) {
      this.searchEmployeeElement.nativeElement.focus();
      return false;
    } else if (this.searchEmployeeError == false && this.searchDateError == true) {
      this.searchDateElement.nativeElement.focus();
      return false;
    } else if (this.searchEmployeeError == true && this.searchDateError == false) {
      this.searchEmployeeElement.nativeElement.focus();
      return false;
    } else {
      this.showDetails = false;
      this.noExternalResult = false;
      this.addNewSave = false;
      this.disableAddNew = false;
      this.addNewForm = false;
      this.selectedExternalDose = '';
      this.externalDoseResultObj = [];
      this.allExternalDoseResults = [];
      sessionStorage.removeItem('selectedExternalDoseResultId');
      sessionStorage.removeItem('selectedExternalDoseResult');
      this.selectedEmployeeFlag = this.employeeSearch.isPerson;
      this.selectedEmployeeId = this.employeeSearch.employeeId;
      this.selectedParticipantId = this.employeeSearch.participantId;
      this.selectedParticipantNum = (this.employeeSearch.participantNum!==null) ? this.employeeSearch.participantNum : -1;
      //this.selectedStartDate = moment(this.empSearchForm.value.startDate).format('MM/DD/YYYY');
      ///added for GX-5255
      this.selectedStartDate = moment(this.empSearchForm.value.startDate).toDate().toISOString( );
      //keep selected person and startDate details for add new
      this.storedSelectedEmployeeDetails = Object.assign({}, this.selectedEmployeeDetails, { startDate: this.selectedStartDate });
      this.getAllExternalDoseResults(this.selectedEmployeeFlag, this.selectedParticipantNum, this.selectedEmployeeId, this.selectedStartDate);
    }

  }

  //submit employee search form
  public submitEmployeeSearch() {
    if(this.updateExternalResultForm!==undefined && this.updateExternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.EDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelExternalDoseResultEdit();
        this.updateExternalResultForm.form.markAsPristine();
        
        //perform search on basis of search criteria
        this.performEmployeeSearch(this.empSearchForm);
        
      }, (reason)=>{});
    } else if(this.addExternalResultForm!==undefined && this.addExternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.EDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.ADD_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelExternalDoseResultAdd();
        this.addExternalResultForm.form.markAsPristine();
        //perform search on basis of search criteria
        this.performEmployeeSearch(this.empSearchForm);

      }, (reason)=>{});
    } else  {
      //perform search on basis of search criteria
      this.performEmployeeSearch(this.empSearchForm);      
    }
  }

  private performResetEmployeeSearch() {
    this.selectedEmployeeId = '';
    this.selectedParticipantId = '';
    this.selectedParticipantNum = '';
    this.selectedStartDate = '';
    this.selectedEmployeeDetails = {};
    this.storedSelectedEmployeeDetails = {};
    this.searchEmployeeError = true;
    this.searchDateError = true;
    this.startDateError = false;
    this.startDateErrorMsg = '';
    sessionStorage.removeItem('selectedEmpLastName');
    sessionStorage.removeItem('selectedExternalDoseResultId');
    sessionStorage.removeItem('selectedExternalDoseResult');
    this.empSearchForm.reset();
    this.noExternalResult = false;
    this.externalDoseResultObj = [];
    this.selectedExternalDose = '';
    this.showDetails = false;
    this.addNewSave = false;
    this.disableAddNew = true;
    this.addNewForm = false;
    this.addExtDoseResultFormData = {};
    this.allExternalDoseResults = [];
  }

  //reset employees search form
  public onResetEmployeeSearchForm(event: any) {
    event.preventDefault();

    if(this.updateExternalResultForm!==undefined && this.updateExternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.EDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelExternalDoseResultEdit();
        this.updateExternalResultForm.form.markAsPristine();
        //reset employee search form
        this.performResetEmployeeSearch();
        
      }, (reason)=>{});
    } else if(this.addExternalResultForm!==undefined && this.addExternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.EDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.ADD_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelExternalDoseResultAdd();
        this.addExternalResultForm.form.markAsPristine();
      }, (reason)=>{});
    } else  {
      //reset employee search form
      this.performResetEmployeeSearch();
    }
  }

  private processAddNewExternalDosimeter() {
    this.addExtDoseResultFormData = {};
    this.addExtDoseResultFormData['personId'] = this.storedSelectedEmployeeDetails.personNum;
    this.addExtDoseResultFormData['participantId'] = this.storedSelectedEmployeeDetails.participantNum;
    this.addExtDoseResultFormData['startDate'] = new Date(this.storedSelectedEmployeeDetails.startDate);
    this.addExtDoseResultFormData['endDate'] = new Date(this.storedSelectedEmployeeDetails.startDate);
    this.showDetails = false;
    this.formDisabled = false;
    this.addNewForm = true;
    this.selectedExternalDose = '';
    this.externalDoseResultObj = [];
  }

  //add new external dosimeter
  public onAddNewExternalDosimeter(event: any) {
    event.preventDefault();

    if(this.updateExternalResultForm!==undefined && this.updateExternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.EDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelExternalDoseResultEdit();
        this.updateExternalResultForm.form.markAsPristine();
        //process to show add new EDR form
        this.processAddNewExternalDosimeter();
        
      }, (reason)=>{});
    } else if(this.addExternalResultForm!==undefined && this.addExternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.EDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.ADD_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelExternalDoseResultAdd();
        this.addExternalResultForm.form.markAsPristine();
      }, (reason)=>{});
    } else  {
      //process to show add new EDR form
      this.processAddNewExternalDosimeter();      
    }
  }

  //get all external dose results
  private getAllExternalDoseResults(isPerson: boolean, participantNum: any, empId: any, startDate: any) {
    this.recordMaintenanceService.getAllExternalDoseResults(isPerson, participantNum, empId, startDate).subscribe((data: Array<object>) => {
      this.allExternalDoseResults = data;
      if(data.length==0) {
        this.noExternalResult = true;
      } else {
        this.noExternalResult = false;
      }
    });
  }
  
  private showClickedExternalDoseResult(clickedExtDoseResultId, clickedExtDoseResultObj) {
    this.formDisabled = true;
    var triggerClick = false;
    if(clickedExtDoseResultId!==this.selectedExternalDose && this.showCollapse) {
      triggerClick = true;
    }
    this.selectedExternalDose = clickedExtDoseResultId;
    if(clickedExtDoseResultObj.deepDoseEquQty==null) {
      clickedExtDoseResultObj.deepDoseEquQty = 0;
    }
    if(clickedExtDoseResultObj.lensDoseEquQty==null) {
      clickedExtDoseResultObj.lensDoseEquQty = 0;
    }
    if(clickedExtDoseResultObj.shallowDoseEquQty==null) {
      clickedExtDoseResultObj.shallowDoseEquQty = 0;
    }
    if(clickedExtDoseResultObj.ddePhotonPartQty==null) {
      clickedExtDoseResultObj.ddePhotonPartQty = 0;
    }
    if(clickedExtDoseResultObj.ldePhotonPartQty==null) {
      clickedExtDoseResultObj.ldePhotonPartQty = 0;
    }
    if(clickedExtDoseResultObj.sdePhotonPartQty==null) {
      clickedExtDoseResultObj.sdePhotonPartQty = 0;
    }
    if(clickedExtDoseResultObj.deNeutronPartyQty==null) {
      clickedExtDoseResultObj.deNeutronPartyQty = 0;
    }
    if(clickedExtDoseResultObj.controlIndFlag==null) {
      clickedExtDoseResultObj.controlIndFlag = false;
    }
    if(clickedExtDoseResultObj.sdeBetaPartQty==null) {
      clickedExtDoseResultObj.sdeBetaPartQty = 0;
    }
    if(clickedExtDoseResultObj.startDate !='') {    
      clickedExtDoseResultObj.startDate = AppUtilService.createDateObjectForDatepicker(clickedExtDoseResultObj.startDate);
    }
    if(clickedExtDoseResultObj.endDate !='') {  
      clickedExtDoseResultObj.endDate = AppUtilService.createDateObjectForDatepicker(clickedExtDoseResultObj.endDate);
    }

    this.externalDoseResultObj = clickedExtDoseResultObj;
    this.showDetails = true;
    if(triggerClick) {
      setTimeout(()=>{
        this.openCollapseLink.nativeElement.click();
      }, 0);
    }
    this.addNewForm = false;
  }

  //show external dose result
  public onShowExternalDoseResult(extDoseResultId, extDoseResultObj) {
    
    if(this.updateExternalResultForm!==undefined && this.updateExternalResultForm.dirty) {
      const result = this.openModal(RecordMaintenanceConstant.EDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=> {
        this.formDisabled = true;
        this.startDateError = false;
        this.startDateErrorMsg = '';
        
        var prevSelectedExternalDoseResultId = parseInt(sessionStorage.getItem('selectedExternalDoseResultId'));
        this.allExternalDoseResults.forEach((extDoseObj, index) => {
          if(prevSelectedExternalDoseResultId === index) {
            this.allExternalDoseResults[index] = JSON.parse(sessionStorage.getItem('selectedExternalDoseResult'));
          }
        });
        this.updateExternalResultForm.form.markAsPristine();
        //show external dose result
        this.showClickedExternalDoseResult(extDoseResultId, extDoseResultObj);
      }, (reason)=>{});

    } else if(this.addExternalResultForm!==undefined && this.addExternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.EDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.ADD_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelExternalDoseResultAdd();
        this.addExternalResultForm.form.markAsPristine();
      }, (reason)=>{});
    } else  {
      //show external dose result
      this.showClickedExternalDoseResult(extDoseResultId, extDoseResultObj);     
    }
    
  }
  
  private performEnableExternalDoseResultEdit(clickedExtDoseResultId, clickedExtDoseResultObj): void {
    this.formDisabled = false;
    var triggerClick = false;
    if(clickedExtDoseResultId!==this.selectedExternalDose && this.showCollapse) {
      triggerClick = true;
    }
    this.selectedExternalDose = clickedExtDoseResultId;
    if(clickedExtDoseResultObj.deepDoseEquQty==null) {
      clickedExtDoseResultObj.deepDoseEquQty = 0;
    }
    if(clickedExtDoseResultObj.lensDoseEquQty==null) {
      clickedExtDoseResultObj.lensDoseEquQty = 0;
    }
    if(clickedExtDoseResultObj.shallowDoseEquQty==null) {
      clickedExtDoseResultObj.shallowDoseEquQty = 0;
    }
    if(clickedExtDoseResultObj.ddePhotonPartQty==null) {
      clickedExtDoseResultObj.ddePhotonPartQty = 0;
    }
    if(clickedExtDoseResultObj.ldePhotonPartQty==null) {
      clickedExtDoseResultObj.ldePhotonPartQty = 0;
    }
    if(clickedExtDoseResultObj.sdePhotonPartQty==null) {
      clickedExtDoseResultObj.sdePhotonPartQty = 0;
    }
    if(clickedExtDoseResultObj.deNeutronPartyQty==null) {
      clickedExtDoseResultObj.deNeutronPartyQty = 0;
    }
    if(clickedExtDoseResultObj.sdeBetaPartQty==null) {
      clickedExtDoseResultObj.sdeBetaPartQty = 0;
    }
    if(clickedExtDoseResultObj.controlIndFlag==null) {
      clickedExtDoseResultObj.controlIndFlag = false;
    }
    if(clickedExtDoseResultObj.startDate !='') {
      if(typeof clickedExtDoseResultObj.startDate === 'object') {
      } else {
        clickedExtDoseResultObj.startDate = AppUtilService.createDateObjectForDatepicker(clickedExtDoseResultObj.startDate);
      }
    }
    if(clickedExtDoseResultObj.endDate !='') {
      if(typeof clickedExtDoseResultObj.endDate === 'object') {
      } else {  
        clickedExtDoseResultObj.endDate = AppUtilService.createDateObjectForDatepicker(clickedExtDoseResultObj.endDate);
      }
    }
    this.externalDoseResultObj = clickedExtDoseResultObj;
    sessionStorage.setItem('selectedExternalDoseResultId', clickedExtDoseResultId);
    sessionStorage.setItem('selectedExternalDoseResult', JSON.stringify(clickedExtDoseResultObj));
    if(!this.showDetails) this.showDetails=true; //if external dose result details not already opened then first open
    if(triggerClick) {
      setTimeout(()=>{
        this.openCollapseLink.nativeElement.click();
      }, 0);
    }
    this.addNewForm = false;
  } 

  /**
   * Enable update of external dose result
   * @param 'extDoseResultId' group ref id, 'extDoseResultObj' obj of type ref which will be updated 
   */
  public onEnableExternalDoseResultEdit(extDoseResultId, extDoseResultObj, event): void {
    event.preventDefault();

    if(this.updateExternalResultForm!==undefined && this.updateExternalResultForm.dirty) {
      const result = this.openModal(RecordMaintenanceConstant.EDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=> {
       
        this.formDisabled = true;
        this.startDateError = false;
        this.startDateErrorMsg = '';
        var prevSelectedExternalDoseResultId = parseInt(sessionStorage.getItem('selectedExternalDoseResultId'));
        this.allExternalDoseResults.forEach((extDoseObj, index) => {
          if(prevSelectedExternalDoseResultId === index) {
            this.allExternalDoseResults[index] = JSON.parse(sessionStorage.getItem('selectedExternalDoseResult'));
            }
        });
        this.updateExternalResultForm.form.markAsPristine();
        
        //show external dose result
        this.performEnableExternalDoseResultEdit(extDoseResultId, extDoseResultObj);
      }, (reason)=>{});
    } else if(this.addExternalResultForm!==undefined && this.addExternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.EDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.ADD_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelExternalDoseResultAdd();
        this.addExternalResultForm.form.markAsPristine();
      }, (reason)=>{});
    } else  {
      //show external dose result
      this.performEnableExternalDoseResultEdit(extDoseResultId, extDoseResultObj);  
    }  
  }

  public onCancelExternalDoseResult(event): void {
    event.preventDefault();
    this.showDetails = false;
    this.addNewForm = false;
    this.selectedExternalDose = '';
    this.externalDoseResultObj = [];
  }

  /**
   * Update external dose result
   */
  public onUpdateExternalDoseResult() {
    this.submitted = true;
    var startDateUpdated = new Date(this.updateExternalResultForm.value.startDate);
    var startDateTimestamp = startDateUpdated.getTime();
    var endDateUpdated = new Date(this.updateExternalResultForm.value.endDate);
    var endDateTimestamp = endDateUpdated.getTime();
    
    if(startDateTimestamp > endDateTimestamp) {
      this.startDateError = true;
      this.startDateErrorMsg = RecordMaintenanceConstant.START_END_DATE_ERROR_MSG;
      return;
    }
    
    var updateExtFormSubmitData = {};
    if(this.updateExternalResultForm.valid) {
      updateExtFormSubmitData = this.externalDoseResultObj;
      updateExtFormSubmitData['startDate'] = AppUtilService.changeDateToSaveFormat(this.updateExternalResultForm.value.startDate);
      updateExtFormSubmitData['endDate'] = AppUtilService.changeDateToSaveFormat(this.updateExternalResultForm.value.endDate);
      
      this.recordMaintenanceService.updateExternalDoseResult(updateExtFormSubmitData)
        .subscribe(result => {
          this.externalDoseResultObj = result;
          this.onShowExternalDoseResult(this.selectedExternalDose, this.externalDoseResultObj);
          this.messageService.success('Record updated successfully'); 
        });
      this.formDisabled = true;
      this.addNewForm = false;
      this.startDateError = false;
      this.startDateErrorMsg = '';
      this.updateExternalResultForm.form.markAsPristine();
    } else {
      return;
    }
  }
  
  /**
   *  On cancel of type ref update close pop up and undo changes
   */
  private cancelExternalDoseResultEdit(): void {
    this.formDisabled = true;
    this.addNewForm = false;
    this.startDateError = false;
    this.startDateErrorMsg = '';
    this.externalDoseResultObj = JSON.parse(sessionStorage.getItem('selectedExternalDoseResult'));
    this.allExternalDoseResults[this.selectedExternalDose] = this.externalDoseResultObj;
  }

  /**
   *  On cancel of edit EDR if form is updated or not then perfornm cancel
   */
  public onCancelExternalDoseResultEdit(): void {
    if(this.updateExternalResultForm!==undefined && this.updateExternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.EDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelExternalDoseResultEdit();
        this.updateExternalResultForm.form.markAsPristine();
        
      }, (reason)=>{});
    } else  {
      this.cancelExternalDoseResultEdit();      
    }
  }

  /**
   *  On cancel of add EDR, close pop up and undo changes
   */
  private cancelExternalDoseResultAdd(): void {
    this.performResetEmployeeSearch();
  }

  /**
   *  On cancel of edit external dose result if form is updated or not then perfornm cancel
   */
  public onCancelExternalDoseResultAdd(): void {
    if(this.addExternalResultForm!==undefined && this.addExternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.EDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.ADD_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelExternalDoseResultAdd();
        this.addExternalResultForm.form.markAsPristine();
        
      }, (reason)=>{});
    } else  {
      this.cancelExternalDoseResultAdd();
    }
  }

  /**
   * Add external dose result
   */
  public onSaveAddExternalDoseResult() {
    this.submitted = true;
    var startDateUpdated = new Date(this.addExternalResultForm.value.startDate);
    var startDateTimestamp = startDateUpdated.getTime();
    var endDateUpdated = new Date(this.addExternalResultForm.value.endDate);
    var endDateTimestamp = endDateUpdated.getTime();
    
    if(startDateTimestamp > endDateTimestamp) {
      this.startDateError = true;
      this.startDateErrorMsg = RecordMaintenanceConstant.START_END_DATE_ERROR_MSG;
      return;
    }
    if(this.addExternalResultForm.valid) {
      var formattedStartDate = AppUtilService.changeDateToSaveFormat(this.addExternalResultForm.value.startDate);
      var formattedEndDate = AppUtilService.changeDateToSaveFormat(this.addExternalResultForm.value.endDate);
      this.addExtDoseResultFormData['startDate'] = formattedStartDate;
      this.addExtDoseResultFormData['endDate'] = formattedEndDate;

      this.recordMaintenanceService.updateExternalDoseResult(this.addExtDoseResultFormData)
        .subscribe(result => {
          this.messageService.success('Record added successfully');
          this.recordMaintenanceService.getAllExternalDoseResults(this.storedSelectedEmployeeDetails.isPerson, this.selectedParticipantNum, this.storedSelectedEmployeeDetails.personNum, this.storedSelectedEmployeeDetails.startDate).subscribe((data: Array<object>) => {
            this.allExternalDoseResults = data;
            if(data.length==0) {
              this.noExternalResult = true;
            } else {
              this.noExternalResult = false;
            }
            this.selectedExternalDose = 0;
            this.addExternalResultForm.form.markAsPristine();
            this.addNewForm = false;
            this.startDateError = false;
            this.startDateErrorMsg = '';
            this.onShowExternalDoseResult(this.allExternalDoseResults.length-1, this.allExternalDoseResults[this.allExternalDoseResults.length-1]);
          });          
        });
    } else {
      return;
    }
  }

  public startDateExtDoseSelected($event) {
    if($event.value === null) {
      this.startDateError = false;
      this.startDateErrorMsg = '';
    }
  }

  public endDateExtDoseSelected($event) {
    if($event.value != '') {
      this.maxStartDate = new Date($event.value);
    }
  }
  
  ngOnDestroy() {
    if(this.subscribeLocationMasterData !== null) this.subscribeLocationMasterData.unsubscribe();
    if(this.subscribeTypeRefMasterData !== null) this.subscribeTypeRefMasterData.unsubscribe();
    if(this.popupAlreadyOpenSubscription !== null) this.popupAlreadyOpenSubscription.unsubscribe();
    sessionStorage.removeItem('selectedEmpLastName');
    sessionStorage.removeItem('selectedExternalDoseResultId');
    sessionStorage.removeItem('selectedExternalDoseResult');
  }

  /******************Component Methods-End******************/
}
