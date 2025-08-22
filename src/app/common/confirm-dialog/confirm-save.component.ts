import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'qnr-confirm-save',
  templateUrl: './confirm-save.component.html',
  styleUrls: ['./confirm-save.component.scss']
})
export class ConfirmSaveComponent implements OnInit {
  public title: string;
  public message: string;
  
  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

}
