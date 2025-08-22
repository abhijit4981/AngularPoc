import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function configureTestBed() {
  TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      ToastrModule.forRoot(),
      NgbModule,
      BrowserAnimationsModule
    ],
    providers: []
  });
}

export const TestModuleSetup = {
  imports: [
    HttpClientTestingModule,
    RouterTestingModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgbModule,
    BrowserAnimationsModule
  ],
  providers: []
};