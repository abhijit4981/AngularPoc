import { TestBed } from '@angular/core/testing';
import { ToastrService, ToastrModule, ActiveToast } from 'ngx-toastr';
import { MessageService } from './message.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MessageService', () => {
  let service: MessageService;
  let toastr: ToastrService;
  let toast: ActiveToast<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ ToastrModule.forRoot(), BrowserAnimationsModule ],
      providers: [MessageService, ToastrService]
    });

    service = TestBed.get(MessageService);
    toastr = TestBed.get(ToastrService);
    spyOn(toastr, 'success').and.returnValue(toast);
    spyOn(toastr, 'error').and.returnValue(toast);
    spyOn(toastr, 'warning').and.returnValue(toast);
    spyOn(toastr, 'info').and.returnValue(toast);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /* it('success with title', () => {
    service.success('testMessage', 'testTitle', 12);
    expect(toastr.success).toHaveBeenCalledWith('testMessage', 'testTitle', jasmine.objectContaining({
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right'
    }));
  }); */

  /* it('success without title', () => {
    service.success('testMessage', '', 12);
    expect(toastr.success).toHaveBeenCalledWith('testMessage', 'Success', jasmine.objectContaining({
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right'
    }));
  }); */

  /* it('error with title', () => {
    service.error('testMessage', 'testTitle', 12);
    expect(toastr.error).toHaveBeenCalledWith('testMessage', 'testTitle', jasmine.objectContaining({
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right'
    }));
  }); */

  /* it('error without title', () => {
    service.error('testMessage', '', 12);
    expect(toastr.error).toHaveBeenCalledWith('testMessage', 'Error', jasmine.objectContaining({
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right'
    }));
  }); */

  /* it('warn with title', () => {
    service.warn('testMessage', 'testTitle', 12);
    expect(toastr.warning).toHaveBeenCalledWith('testMessage', 'testTitle', jasmine.objectContaining({
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right'
    }));
  }); */

  /* it('warn without title', () => {
    service.warn('testMessage', '', 12);
    expect(toastr.warning).toHaveBeenCalledWith('testMessage', 'Warning', jasmine.objectContaining({
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right'
    }));
  }); */

  /* it('info with title', () => {
    service.info('testMessage', 'testTitle', 12);
    expect(toastr.info).toHaveBeenCalledWith('testMessage', 'testTitle', jasmine.objectContaining({
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right'
    }));
  }); */

  /* it('info without title', () => {
    service.info('testMessage', '', 12);
    expect(toastr.info).toHaveBeenCalledWith('testMessage', 'Information', jasmine.objectContaining({
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right'
    }));
  }); */

});
