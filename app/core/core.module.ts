import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { AppUtilService } from './utils/app-util.service';
import { CommonModule } from '@angular/common';
import { HttpService } from './services/http/http.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderInterceptor } from './interceptors/header.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AppConfigService } from './services/init/app-config.service';
import { InitFactory } from './services/init/app-init.factory';
import { DialogModule } from '../common/confirm-dialog/dialog.module';
import { AuthService } from './services/auth.service';
import { ParseDatePipe } from '../shared/pipes/parse-date.pipe';
import { MessageService } from './services/message.service';
import { MaskInputPipe } from '../shared/pipes/mask-input.pipe';
import { ErrorsHandler } from './errors/errors-handler';

@NgModule({
    imports: [ CommonModule, DialogModule ],
    declarations: [ParseDatePipe, MaskInputPipe],
    providers: [
        HttpService,
        AuthService,
        AppUtilService,
        MessageService,
        { provide: ErrorHandler, useClass: ErrorsHandler },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, deps: [ AuthService ], multi: true },
        { provide: APP_INITIALIZER, useFactory: InitFactory, deps: [AppConfigService], multi: true },
    ],
    exports: [ParseDatePipe, MaskInputPipe]
})

export class CoreModule { }