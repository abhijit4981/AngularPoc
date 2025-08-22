import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from 'src/app/app.component';
import { PublisherService } from 'src/app/core/services/publisher.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'qnr-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  public title: string;
  public message: string;
  
  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

}
