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
  selector: 'qnr-internal-contamination',
  templateUrl: './internal-contamination.component.html',
  styleUrls: ['./internal-contamination.component.scss']
})
export class InternalContaminationComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  /***************Properties-Start***************/
  @ViewChild("employeeSearchForm") empSearchForm: any;
  @ViewChild('updateInternalResultForm') updateInternalResultForm: NgForm;
  @ViewChild('addInternalResultForm') addInternalResultForm: NgForm;
  @ViewChild('selectedEmployee', { read: ElementRef }) private searchEmployeeElement: ElementRef;// if we want to use element ref to target element we have to use 'read' and private in the @viewchild
  @ViewChild('startDate', { read: ElementRef }) private searchDateElement: ElementRef;
  formDisabled: boolean = true;
  showDetails: boolean = false;
  disableAddNew: boolean = true;
  addNewForm: boolean = false;
  addNewSave: boolean = false;
  noInternalResult: boolean = false;
  searchEmployeeError: boolean = true;
  searchDateError: boolean = true;
  noMatchFound: boolean = false;
  searchEmployeeErrorMsg: string = RecordMaintenanceConstant.SEARCH_EMPLOYEE_ERROR_MSG;
  searchDateErrorMsg: string = RecordMaintenanceConstant.SEARCH_DATE_ERROR_MSG;
  selectedInternalDose: any = '';
  allLocations: Array<object> = [];
  allTypeRefs: Array<object> = [];
  allDoseModeTypeRefs: Array<object> = [];
  allDoseClassTypeRefs: Array<object> = [];
  allNuclides: Array<object> = [];
  internalDoseResultObj: Array<object> = [];
  allInternalDoseResults: Array<object> = [];
  addIntDoseResultFormData: any = {};
  modalRef: any;
  modalOption: NgbModalOptions = {};
  employeeSearch: any = {};
  selectedEmployee: any = '';
  selectedEmployeeDetails: any = {};
  storedSelectedEmployeeDetails: any = {};
  selectedEmployeeId: any = '';
  selectedParticipantId: any = '';
  selectedStartDate: any = '';
  allEmployees$: Observable<any>;
  allEmpData: Array<object> = [];
  hideSearchList: boolean = false; 
  private empSearchTerms = new Subject<string>();
  //variable for subscribing publisher notification
  private subscribeLocationMasterData: Subscription = null;
  private subscribeTypeRefMasterData: Subscription = null;
  private popupAlreadyOpenSubscription: Subscription = null;
  /***************Properties-End***************/

  constructor(
    private modalService: NgbModal,
    private dialogService: DialogService,  
    private recordMaintenanceService: RecordMaintenanceService,
    private messageService: MessageService,
    private appComponent: AppComponent
  ) { }

  ngOnInit() {
    this.loadAllLocations();
    this.loadAllTypeRefs();
    this.getAllNuclides();
    
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

    this.allEmployees$ = this.empSearchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      switchMap((searchTerm: any) => this.recordMaintenanceService.getAllEmployees(searchTerm, 'internal')),
      
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
    if (this.updateInternalResultForm===undefined  && this.addInternalResultForm===undefined) {
      return true;
    } else if (this.updateInternalResultForm!==undefined && this.updateInternalResultForm.dirty) {
      return this.dialogService.confirmDialog(RecordMaintenanceConstant.IDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
    } else if(this.addInternalResultForm!==undefined && this.addInternalResultForm.dirty) {       return this.dialogService.confirmDialog(RecordMaintenanceConstant.IDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.ADD_ROUTE_CONFIRM_DIALOG_MSG);
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
    this.allDoseModeTypeRefs = this.filterTypeRefs(this.allTypeRefs, 150);
    this.allDoseClassTypeRefs = this.filterTypeRefs(this.allTypeRefs, 120);
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

  //get all active nuclide
  public getAllNuclides() {
    this.recordMaintenanceService.getAllNuclides().subscribe((data: Array<object>) => {
      this.allNuclides = data;
    });
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
    this.searchEmployeeError = false; 
    this.hideSearchList = false;
    // this.empSearchTerms.next('');
  }

  //hide employee search result on blur of employee name field
  public hideEmployeeSearchResult() {
    //this.empSearchTerms.next('');
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
    }
    else if (this.searchEmployeeError == false && this.searchDateError == true) {
      this.searchDateElement.nativeElement.focus();
      return false;
    }
    else if (this.searchEmployeeError == true && this.searchDateError == false) {
      this.searchEmployeeElement.nativeElement.focus();
      return false;
    }
    else {
      this.showDetails = false;
      this.noInternalResult = false;
      this.addNewSave = false;
      this.disableAddNew = false;
      this.selectedInternalDose = '';
      this.internalDoseResultObj = [];
      this.allInternalDoseResults = [];
      sessionStorage.removeItem('selectedInternalDoseResultId');
      sessionStorage.removeItem('selectedInternalDoseResult');
      this.selectedEmployeeId = this.employeeSearch.employeeId;
      this.selectedParticipantId = (this.employeeSearch.participantId!==null) ? this.employeeSearch.participantId : '';
      this.selectedStartDate = moment(this.empSearchForm.value.startDate).format('MM/DD/YYYY');
      //keep selected person and startDate details for add new
      this.storedSelectedEmployeeDetails = Object.assign({}, this.selectedEmployeeDetails, { sampleDate: this.selectedStartDate });
      this.getAllInternalDoseResults(this.selectedEmployeeId, this.selectedStartDate);
    }
  }

  //submit employee search form
  public submitEmployeeSearch() {
    if(this.updateInternalResultForm!==undefined && this.updateInternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.IDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelInternalDoseResultEdit();
        this.updateInternalResultForm.form.markAsPristine();
        
        //perform search on basis of search criteria
        this.performEmployeeSearch(this.empSearchForm);
        
      }, (reason)=>{});
    } else if(this.addInternalResultForm!==undefined && this.addInternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.IDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.ADD_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelInternalDoseResultAdd();
        this.addInternalResultForm.form.markAsPristine();
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
    this.selectedStartDate = '';
    this.selectedEmployeeDetails = {};
    this.storedSelectedEmployeeDetails = {};
    this.searchEmployeeError = true;
    this.searchDateError = true;
    sessionStorage.removeItem('selectedEmpLastName');
    sessionStorage.removeItem('selectedInternalDoseResultId');
    sessionStorage.removeItem('selectedInternalDoseResult');
    this.empSearchForm.reset();
    this.noInternalResult = false;
    this.internalDoseResultObj = [];
    this.selectedInternalDose = '';
    this.showDetails = false;
    this.addNewForm = false;
    this.addNewSave = false;
    this.disableAddNew = true;
    this.allInternalDoseResults = [];
  }

  //reset employees search form
  public onResetEmployeeSearchForm(event: any) {
    event.preventDefault();

    if(this.updateInternalResultForm!==undefined && this.updateInternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.IDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelInternalDoseResultEdit();
        this.updateInternalResultForm.form.markAsPristine();
        //reset employee search form
        this.performResetEmployeeSearch();
        
      }, (reason)=>{});
    } else if(this.addInternalResultForm!==undefined && this.addInternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.IDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.ADD_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelInternalDoseResultAdd();
        this.addInternalResultForm.form.markAsPristine();
      
      }, (reason)=>{});
    } else  {
      //reset employee search form
      this.performResetEmployeeSearch();      
    }
  }

  private processAddNewInternalDosimeter() {
    this.selectedInternalDose = '';
    this.internalDoseResultObj = [];
    this.addIntDoseResultFormData = {};
    this.addIntDoseResultFormData['personId'] = this.storedSelectedEmployeeDetails.personNum;
    this.addIntDoseResultFormData['sampleDate'] = new Date(this.storedSelectedEmployeeDetails.sampleDate);
    this.showDetails = false;
    this.formDisabled = false;
    this.addNewForm = true;
    this.selectedInternalDose = '';
    this.internalDoseResultObj = [];
  }

  //add new internal dosimeter
  public onAddNewInternalDosimeter(event: any) {
    event.preventDefault();

    if(this.updateInternalResultForm!==undefined && this.updateInternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.IDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelInternalDoseResultEdit();
        this.updateInternalResultForm.form.markAsPristine();
        //process to show add new EDR form
        this.processAddNewInternalDosimeter();
        
      }, (reason)=>{});
    } else if(this.addInternalResultForm!==undefined && this.addInternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.IDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.ADD_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelInternalDoseResultAdd();
        this.addInternalResultForm.form.markAsPristine();
      
      }, (reason)=>{});
    } else  {
      //process to show add new EDR form
      this.processAddNewInternalDosimeter();      
    }
  }

  //get all internal dose results
  private getAllInternalDoseResults(empId: any, startDate: any) {
    this.recordMaintenanceService.getAllInternalDoseResults(empId, startDate).subscribe((data: Array<object>) => {
      this.allInternalDoseResults = data;
      if(data.length==0) {
        this.noInternalResult = true;
      } else {
        this.noInternalResult = false;
      }
      
    });
  }
  
  private showClickedInternalDoseResult(clickedIntDoseResultId, clickedIntDoseResultObj) {
    this.formDisabled = true;
    //console.log(clickedIntDoseResultObj)
    this.selectedInternalDose = clickedIntDoseResultId;
    if(clickedIntDoseResultObj.derivedIntakeQty==null) {
      clickedIntDoseResultObj.derivedIntakeQty = 0.0;
    }
    if(clickedIntDoseResultObj.derivedCedeQty==null) {
      clickedIntDoseResultObj.derivedCedeQty = 0;
    }
    if(clickedIntDoseResultObj.derivedCdeQty==null) {
      clickedIntDoseResultObj.derivedCdeQty = 0;
    }
    if(clickedIntDoseResultObj.sampleDate !='') {
      clickedIntDoseResultObj.sampleDate = AppUtilService.createDateObjectForDatepicker(clickedIntDoseResultObj.sampleDate);
    }
    this.internalDoseResultObj = clickedIntDoseResultObj;
    this.showDetails = true;
    this.addNewForm = false;
  }

  //show internal dose result
  public onShowInternalDoseResult(intDoseResultId, intDoseResultObj) {
    if(this.updateInternalResultForm!==undefined && this.updateInternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.IDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=> { 
        this.formDisabled = true;
        var prevSelectedInternalDoseResultId = parseInt(sessionStorage.getItem('selectedInternalDoseResultId'));
        this.allInternalDoseResults.forEach((extDoseObj, index) => {
          if(prevSelectedInternalDoseResultId === index) {
            this.allInternalDoseResults[index] = JSON.parse(sessionStorage.getItem('selectedInternalDoseResult'));
          }
        });
        this.updateInternalResultForm.form.markAsPristine();
        
        //show internal dose result
        this.showClickedInternalDoseResult(intDoseResultId, intDoseResultObj);
      }, (reason)=>{});
    } else if(this.addInternalResultForm!==undefined && this.addInternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.IDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.ADD_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelInternalDoseResultAdd();
        this.addInternalResultForm.form.markAsPristine();
        //perform search on basis of search criteria
        this.performEmployeeSearch(this.empSearchForm);

      }, (reason)=>{});
    } else  {
      //show internal dose result
      this.showClickedInternalDoseResult(intDoseResultId, intDoseResultObj);     
    }
    
  }
  
  public performEnableInternalDoseResultEdit(clickedExtDoseResultId, clickedIntDoseResultObj): void {
    this.formDisabled = false;
    this.selectedInternalDose = clickedExtDoseResultId;
    if(clickedIntDoseResultObj.derivedIntakeQty==null) {
      clickedIntDoseResultObj.derivedIntakeQty = 0.0;
    }
    if(clickedIntDoseResultObj.derivedCedeQty==null) {
      clickedIntDoseResultObj.derivedCedeQty = 0;
    }
    if(clickedIntDoseResultObj.derivedCdeQty==null) {
      clickedIntDoseResultObj.derivedCdeQty = 0;
    }
    if(clickedIntDoseResultObj.sampleDate !='') {
      if(typeof clickedIntDoseResultObj.sampleDate === 'object') {
      } else {
        clickedIntDoseResultObj.sampleDate = AppUtilService.createDateObjectForDatepicker(clickedIntDoseResultObj.sampleDate);
      }
    }
    this.internalDoseResultObj = clickedIntDoseResultObj;
    sessionStorage.setItem('selectedInternalDoseResultId', clickedExtDoseResultId);
    sessionStorage.setItem('selectedInternalDoseResult', JSON.stringify(clickedIntDoseResultObj));
    if(!this.showDetails) this.showDetails=true; //if internal dose result details not already opened then first open
    this.addNewForm = false;
  } 

  /**
   * Enable update of internal dose result
   * @param 'extDoseResultId' group ref id, 'extDoseResultObj' obj of type ref which will be updated 
   */
  public onEnableInternalDoseResultEdit(extDoseResultId, extDoseResultObj, event): void {
    event.preventDefault();

    if(this.updateInternalResultForm!==undefined && this.updateInternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.IDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=> {
        this.formDisabled = true;
        var prevSelectedInternalDoseResultId = parseInt(sessionStorage.getItem('selectedInternalDoseResultId'));
        this.allInternalDoseResults.forEach((extDoseObj, index) => {
          if(prevSelectedInternalDoseResultId === index) {
            this.allInternalDoseResults[index] = JSON.parse(sessionStorage.getItem('selectedInternalDoseResult'));
          }
        });
        this.updateInternalResultForm.form.markAsPristine();
        
        //show internal dose result
        this.performEnableInternalDoseResultEdit(extDoseResultId, extDoseResultObj);
      }, (reason)=>{});
    } else if(this.addInternalResultForm!==undefined && this.addInternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.IDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.ADD_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelInternalDoseResultAdd();
        this.addInternalResultForm.form.markAsPristine();
        //perform search on basis of search criteria
        this.performEmployeeSearch(this.empSearchForm);

      }, (reason)=>{});
    } else  {
      //show internal dose result
      this.performEnableInternalDoseResultEdit(extDoseResultId, extDoseResultObj);     
    }  
  }

  public onCancelInternalDoseResult(event): void {
    event.preventDefault();
    this.showDetails = false;
    this.addNewForm = false;
    this.selectedInternalDose = '';
    this.internalDoseResultObj = [];
  } 

  /**
   * Update internal dose result
   */
  public onUpdateInternalDoseResult() {
    var updateIntFormSubmitData = {};
    if(this.updateInternalResultForm.valid) {
      this.internalDoseResultObj['derivedIntakeQty'] = Number(this.internalDoseResultObj['derivedIntakeQty']);
      updateIntFormSubmitData = this.internalDoseResultObj;
      updateIntFormSubmitData['sampleDate'] = AppUtilService.changeDateToSaveFormat(this.updateInternalResultForm.value.sampleDate);

      this.recordMaintenanceService.updateInternalDoseResult(updateIntFormSubmitData)
        .subscribe(result => {
          this.internalDoseResultObj = result;
          this.onShowInternalDoseResult(this.selectedInternalDose, this.internalDoseResultObj);
          this.messageService.success('Record updated successfully'); 
        });
      this.formDisabled = true;
      this.addNewForm = false;
      this.updateInternalResultForm.form.markAsPristine();
    } else {
      return;
    }
  }
  
  /**
   *  On cancel of type ref update close pop up and undo changes
   */
  private cancelInternalDoseResultEdit(): void {
    this.formDisabled = true;
    this.addNewForm = false;
    this.internalDoseResultObj = JSON.parse(sessionStorage.getItem('selectedInternalDoseResult'));
    this.allInternalDoseResults[this.selectedInternalDose] = this.internalDoseResultObj;
  }

  /**
   *  On cancel of type ref first check edit internal dose result form is updated or not then perfornm cancel
   */
  public onCancelInternalDoseResultEdit(): void {
    if(this.updateInternalResultForm!==undefined && this.updateInternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.IDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelInternalDoseResultEdit();
        this.updateInternalResultForm.form.markAsPristine();
        
      }, (reason)=>{});
    } else  {
      this.cancelInternalDoseResultEdit();      
    }
  }

  /**
   *  On cancel of add EDR, close pop up and undo changes
   */
  private cancelInternalDoseResultAdd(): void {
    this.performResetEmployeeSearch();
  }

  /**
   *  On cancel of edit external dose result if form is updated or not then perfornm cancel
   */
  public onCancelInternalDoseResultAdd(): void {
    if(this.addInternalResultForm!==undefined && this.addInternalResultForm.dirty) {
      
      const result = this.openModal(RecordMaintenanceConstant.IDR_ROUTE_CONFIRM_DIALOG_TITLE, RecordMaintenanceConstant.ADD_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=>{
        this.cancelInternalDoseResultAdd();
        this.addInternalResultForm.form.markAsPristine();
        
      }, (reason)=>{});
    } else  {
      this.cancelInternalDoseResultAdd();
    }
  }

  /**
   * Add internal dose result
   */
  public onSaveAddInternalDoseResult() {
    if(this.addInternalResultForm.valid) {
      var formattedSampleDate = AppUtilService.changeDateToSaveFormat(this.addInternalResultForm.value.sampleDate);
      this.addIntDoseResultFormData['sampleDate'] = formattedSampleDate;
      this.addIntDoseResultFormData['derivedIntakeQty'] = Number(this.addIntDoseResultFormData['derivedIntakeQty']);

      this.recordMaintenanceService.updateInternalDoseResult(this.addIntDoseResultFormData)
        .subscribe(result => {
          this.messageService.success('Record added successfully');
          this.recordMaintenanceService.getAllInternalDoseResults(this.storedSelectedEmployeeDetails.personNum, this.selectedStartDate).subscribe((data: Array<object>) => {
            this.allInternalDoseResults = data;
            if(data.length==0) {
              this.noInternalResult = true;
            } else {
              this.noInternalResult = false;
            }
            this.selectedInternalDose = 0;
            this.addInternalResultForm.form.markAsPristine();
            this.addNewForm = false;
            this.onShowInternalDoseResult(this.allInternalDoseResults.length-1, this.allInternalDoseResults[this.allInternalDoseResults.length-1]);
          });
        });
    } else {
      return;
    }
  }

  ngOnDestroy() {
    if(this.subscribeLocationMasterData !== null) this.subscribeLocationMasterData.unsubscribe();
    if(this.subscribeTypeRefMasterData !== null) this.subscribeTypeRefMasterData.unsubscribe();
    if(this.popupAlreadyOpenSubscription !== null) this.popupAlreadyOpenSubscription.unsubscribe();
    sessionStorage.removeItem('selectedEmpLastName');
    sessionStorage.removeItem('selectedInternalDoseResultId');
    sessionStorage.removeItem('selectedInternalDoseResult');
  }

  /******************Component Methods-End******************/
}
