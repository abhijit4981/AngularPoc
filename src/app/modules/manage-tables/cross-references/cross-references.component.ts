import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { ManageTablesService } from '../manage-tables.service';
import { AppComponent } from '../../../app.component';
import { ConfirmSaveComponent } from 'src/app/common/confirm-dialog/confirm-save.component';
import { ComponentCanDeactivate } from 'src/app/core/guards/component-can-deactivate';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { PublisherService } from 'src/app/core/services/publisher.service';
import { MessageService } from '../../../core/services/message.service';
import { NgForm } from '@angular/forms';
import { MangeTableConstant } from '../manage-tables.constants';

@Component({
  selector: 'qnr-cross-references',
  templateUrl: './cross-references.component.html',
  styleUrls: ['./cross-references.component.scss']
})
export class CrossReferencesComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  /***************Properties-Start***************/
  @ViewChild('crossReferenceForm') crForm: NgForm;
  modalOption: NgbModalOptions = {};
  modalRef: any;
  formDisabled = true;
  showDetails = false;
  selectedTypeGroupRef: any = '';
  allTypeGroups: Array<object> = [];
  allTypeRefObj: Array<object> = [];
  //variable for subscribing publisher notification
  private subscribeMasterData: Subscription = null;
  private popupAlreadyOpenSubscription: Subscription = null;
  /***************Properties-End***************/

  /***************Constructor-Start***************/
  constructor(
    private mtService: ManageTablesService,
    private appComponent: AppComponent,
    private messageService: MessageService,
    private modalService: NgbModal,
    private dialogService: DialogService,
    private publisherService: PublisherService
  ) { }

  ngOnInit() {
    this.loadTypeGroups();

    // get all type groups on refresh of page
    this.subscribeMasterData = this.publisherService.isAllTypeGroups$.subscribe(isLoaded => {
      this.getAllTypeGroups(isLoaded);
    });

    //check popup modal already opened
    this.popupAlreadyOpenSubscription = this.publisherService.isPopModalOpen$.subscribe(request => {
      this.checkActivePopupModal();
    });
  }

  ngOnDestroy(): void {
    if(this.subscribeMasterData) this.subscribeMasterData.unsubscribe();
    if(this.popupAlreadyOpenSubscription !== null) this.popupAlreadyOpenSubscription.unsubscribe();
    sessionStorage.removeItem('selectedCrossRef');
  }
  /***************Constructor-End***************/

  /***************Helper Method-Start***************/
  //open confirmation popup modal when user made chanes in form and try to navigate away
  canDeactivate(): Observable<boolean> | boolean | Promise<boolean> {
    if (this.crForm===undefined) {
      return true;
    } else if (this.crForm!==undefined && this.crForm.dirty) {
      return this.dialogService.confirmDialog(MangeTableConstant.CROSS_REFERENCE_CONFIRM_DIALOG_TITLE, MangeTableConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);

    }
    return true;
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
  /***************Helper Method-End***************/

  /******************Component Methods-Start******************/
  // get all type groups from app component
  public loadTypeGroups() {
    this.allTypeGroups = JSON.parse(JSON.stringify(this.appComponent.allTypeGroupMasterData));
  }
  
  /**
   * Get all type groups from app component and function will get executed once page is refreshed 
   */
  public getAllTypeGroups(isLoaded: boolean) {
    if (isLoaded) {
      this.loadTypeGroups();
    }
  }

  //check and close all active popup modal
  private checkActivePopupModal() {
    if(this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
  }

  private performShowCrossRefDetails(typeGroupRefId, typeGroupObj) {
    this.formDisabled = true;
    this.selectedTypeGroupRef = typeGroupRefId;
    this.allTypeRefObj = typeGroupObj;
    this.showDetails = true;
  }

  /**
   * Show cross ref details
   */
  public onShowCrossRefDetails(typeGroupRefId, typeGroupObj): void {
    if(this.crForm!==undefined && this.crForm.dirty) {
      const result = this.openModal(MangeTableConstant.CROSS_REFERENCE_CONFIRM_DIALOG_TITLE, MangeTableConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=> {
        this.undoCrossReferenceEdit();
        this.formDisabled = true;
        //perform show cross reference
        this.performShowCrossRefDetails(typeGroupRefId, typeGroupObj);
      }, (reason)=>{});

    } else {
      //perform show cross reference
      this.performShowCrossRefDetails(typeGroupRefId, typeGroupObj);
    }
  }
  
  private performCrossRefEdit(typeGroupRefId, typeGroupObj): void {
    this.formDisabled = false;
    this.selectedTypeGroupRef = typeGroupRefId;
    this.allTypeRefObj = typeGroupObj;
    sessionStorage.setItem('selectedCrossRef', JSON.stringify(typeGroupObj));
    if(!this.showDetails) this.showDetails=true; //if cross ref details not already opened then first open
  }

  /**
   * Enable update of cross ref details
   * @param 'typeGroupRefId' group ref id, 'typeGroupObj' obj of type ref which will be updated 
   */
  public onEnableCrossReferenceEdit(typeGroupRefId, typeGroupObj): void {
    if(this.crForm!==undefined && this.crForm.dirty) {
      const result = this.openModal(MangeTableConstant.CROSS_REFERENCE_CONFIRM_DIALOG_TITLE, MangeTableConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=> {
        this.crForm.form.markAsPristine();
        this.appComponent.getAllTypeGroupsMasterData();
        this.appComponent.getAllTypeRefsMasterData();
        //perform cross reference edit
        this.performCrossRefEdit(typeGroupRefId, typeGroupObj);
      }, (reason)=>{});

    } else {
      //perform cross reference edit
      this.performCrossRefEdit(typeGroupRefId, typeGroupObj);
    }  
  }

  /**
   * Update type ref details
   */
  public onUpdateCrossReferenceType() {
    this.mtService.updateTypeGroup(this.allTypeRefObj)
      .subscribe(result => { 
        this.messageService.success('Record updated successfully');
        this.appComponent.getAllTypeGroupsMasterData();
        this.appComponent.getAllTypeRefsMasterData();
      });
    this.formDisabled = true;
    this.crForm.form.markAsPristine();
  }

  private undoCrossReferenceEdit(): void {
    this.allTypeRefObj = JSON.parse(sessionStorage.getItem('selectedCrossRef'));
    this.appComponent.getAllTypeGroupsMasterData();
    this.appComponent.getAllTypeRefsMasterData();
    this.crForm.form.markAsPristine();
  }

  /**
   *  On cancel of type ref update close pop up and undo changes
   */
  public onCancelCrossReferenceEdit(e): void {
    e.preventDefault();

    if(this.crForm!==undefined && this.crForm.dirty) {      
      const result = this.openModal(MangeTableConstant.CROSS_REFERENCE_CONFIRM_DIALOG_TITLE, MangeTableConstant.UPDATE_ROUTE_CONFIRM_DIALOG_MSG);
      result.then((result)=> {
        this.undoCrossReferenceEdit();
        this.formDisabled = true;

      }, (reason)=>{});
    } else  {
      this.formDisabled = true;
    }
  }

  /******************Component Methods-End******************/
}
