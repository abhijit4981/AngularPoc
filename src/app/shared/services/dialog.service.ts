import { Injectable } from '@angular/core';
import {NgbModal, NgbActiveModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from 'src/app/common/confirm-dialog/confirm-dialog.component';

@Injectable()
export class DialogService {
  modalOption: NgbModalOptions = {};
  constructor(private modalService: NgbModal) { }

  public confirmDialog(title: string, message: string) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(ConfirmDialogComponent, this.modalOption);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    return modalRef.result;
  }
}
