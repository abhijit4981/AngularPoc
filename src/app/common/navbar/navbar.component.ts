import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NavbarTitleConstants } from './navbar.contants';
import { RoutePrefix } from 'src/app/core/constants/routes.constant';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { PublisherService } from 'src/app/core/services/publisher.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common.service';
import { MessageService } from 'src/app/core/services/message.service';
import { ConfirmSaveComponent } from '../confirm-dialog/confirm-save.component';

@Component({
  selector: 'qnr-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  /***************Properties-Start***************/
  authenticated = false;
  modalRef: any;
  modalOption: NgbModalOptions = {};
  //variable for subscribing publisher notification
  private authenticationSubscription: Subscription = null;
  @ViewChild('reprocessRecordModal') reprocessRecordModal: TemplateRef<any>;
  
  menuOptions = [
    { src: RoutePrefix.Dashboard, icon: 'menu_home', title: NavbarTitleConstants.Dashboard, menuItem: 0, isClicked: false, highlight: false, hasSubMenu: false, },
    {
      src: RoutePrefix.RecordMaintenance, icon: 'menu_record', title: NavbarTitleConstants.Record_Maintenance, menuItem: 1, isClicked: false, highlight: false, hasSubMenu: true,
      subItems: [
        { src: RoutePrefix.RecordMaintenance+'/'+RoutePrefix.RecordMaintenanceDosimeter, name: NavbarTitleConstants.Dosimeter, menuSubItem: 0, redirectToPage: true },
        { src: RoutePrefix.RecordMaintenance+'/'+RoutePrefix.RecordMaintenanceInternalContamination, name: NavbarTitleConstants.Internal_Contamination, menuSubItem: 1, redirectToPage: true },
        { src: RoutePrefix.RecordMaintenance+'/'+RoutePrefix.RecordMaintenanceExternalContamination, name: NavbarTitleConstants.External_Contamination, menuSubItem: 2, redirectToPage: true },
        { src: '', name: NavbarTitleConstants.Reprocess_Records, menuSubItem: 3, redirectToPage: false }
      ]
    },
    { 
      src: RoutePrefix.ManageTables, icon: 'menu_configure', title: NavbarTitleConstants.Manage_Tables, menuItem: 2, isClicked: false, highlight: false, hasSubMenu: true,
      subItems: [
        { src: RoutePrefix.ManageTables+'/'+RoutePrefix.ManageTablesCrossReferences, name: NavbarTitleConstants.Cross_References, menuSubItem: 4, redirectToPage: true },
        { src: RoutePrefix.ManageTables+'/'+RoutePrefix.ManageTablesPreferences, name: NavbarTitleConstants.Preferences, menuSubItem: 5, redirectToPage: true }
      ]
    }
  ];
  /***************Properties-End***************/

  /***************Constructor-Start***************/
  constructor(
    private router: Router,
    private authService: AuthService,
    private modalService: NgbModal,
    private commonService: CommonService,
    private messageService: MessageService,
    private publisherService: PublisherService
  ) { }

  ngOnInit() {
    this.authenticated = this.authService.isAuthenticated();
    this.authenticationSubscription = this.publisherService.isAuthChanged$.subscribe(
      authenticated => this.onAuthenticationChange(authenticated)
    );
  }

  ngOnDestroy() {
    if(this.authenticationSubscription !== null) this.authenticationSubscription.unsubscribe();
  }
  /***************Constructor-End***************/

  /******************Helper Methods-Start******************/  
  private onAuthenticationChange(authenticated: boolean) {
    this.authenticated = authenticated;
  }

  private collapseAll() {
    this.menuOptions.forEach(value => {
      value.isClicked = false;
      value.highlight = false;
    });
  }

  private collapseAnother(index) {
    for(var i=0; i<this.menuOptions.length; i++){
      if(i!=index){
        this.menuOptions[i].isClicked = false;
      }
    }
  }

  //open modal dialog when user click on reprocess record link
  private openModal(title: string, message: string) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg';
    this.modalRef = this.modalService.open(ConfirmSaveComponent, this.modalOption);
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.message = message;
    return this.modalRef.result;
  }
  /******************Helper Methods-End******************/
  
  /******************Component Methods-Start******************/
  public showChilds(index){
    this.menuOptions.forEach(value => {
      value.highlight = false;
    });
    this.menuOptions[index].highlight = true;
    this.menuOptions[index].isClicked = !this.menuOptions[index].isClicked;
    this.collapseAnother(index);
    if (!this.menuOptions[index].hasSubMenu) {
      this.router.navigate(['/'+this.menuOptions[index].src]);
    }
  } 

  public doMenuClick(subItem) {
    this.collapseAll();
    if(subItem.redirectToPage) {
      this.router.navigate(['/'+subItem.src]);
    } else {
      //open popup
      const result = this.openModal(NavbarTitleConstants.Reprocess_Records_DIALOG_TITLE, NavbarTitleConstants.Reprocess_Records_DIALOG_MSG);
      result.then((result) => {
        this.commonService.stgEdrParticipantDateProcess().subscribe(result => {
        }, (error) => {
        });
        this.messageService.success(NavbarTitleConstants.Reprocess_Records_SUSS_MSG);
      }, (reason) => { })
    }
  }

  /******************Component Methods-End******************/

}