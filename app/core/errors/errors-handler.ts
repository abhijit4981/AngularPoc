import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from '../services/message.service';

@Injectable()

export class ErrorsHandler implements ErrorHandler {
    
    constructor(private injectror: Injector) {}

    handleError(error: Error | HttpErrorResponse) {
        //inject service
        const messageService = this.injectror.get(MessageService);
    
        // Server error happened 
        if(error instanceof HttpErrorResponse) {
            // No Internet connection
            if(!navigator.onLine) {
                messageService.error("No internet connection.");
            }
        } else {
            // Client Error Happend
            messageService.error("Some error occured.");
        }
    }
}