import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorDialogComponent } from '../../common/confirm-dialog/error-dialog.component';
import { PublisherService } from '../services/publisher.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    modalOption: NgbModalOptions = {};
    modalRef: any;
    
    /***************Constructor***************/
    constructor(
        private router: Router,
        private authService: AuthService,
        private messageService: MessageService,
        private modalService: NgbModal
    ) { }
    /***************Constructor***************/

    private openModal(title: string, message: string) {
        this.modalOption.backdrop = 'static';
        this.modalOption.keyboard = false;
        this.modalOption.size = 'sm';
        this.modalRef = this.modalService.open(ErrorDialogComponent, this.modalOption);
        this.modalRef.componentInstance.title = title;
        this.modalRef.componentInstance.message = message;
        return this.modalRef.result;
      }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap(
                (event: HttpEvent<any>) => { },
                (error: any) => {
                    if (error instanceof HttpErrorResponse && error.error) {
                        if (error.status == 401 || error.status == 412) {
                            // const result = this.openModal("Session Expired", "Your sessiona has been expired.");
                            // result.then((result) => {
                            //     PublisherService.notifyPopupModalOpen();
                            //     this.router.navigate(['/logout'], { queryParams: { manual: false } });
                            // }, (reason) => { });

                            this.messageService.warn('Session expired, but staying on page.');
                        } else {
                            this.messageService.error('Some error occured.');
                        }
                    }
                }
            )
        )
    }
}