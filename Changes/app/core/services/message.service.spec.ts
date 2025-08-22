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

    service = TestBed.inject(MessageService);
    toastr = TestBed.inject(ToastrService);
    
    toast = {} as ActiveToast<any>;
    spyOn(toastr, 'success').and.returnValue(toast);
    spyOn(toastr, 'error').and.returnValue(toast);
    spyOn(toastr, 'warning').and.returnValue(toast);
    spyOn(toastr, 'info').and.returnValue(toast);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show success with title', () => {
    const result = service.success('testMessage', 'testTitle', { timeout: 12 });
    expect(toastr.success).toHaveBeenCalledWith('testMessage', 'testTitle', jasmine.objectContaining({
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right',
      timeout: 12
    }));
    expect(result).toBe(toast);
  });

  it('should show success without title', () => {
    const result = service.success('testMessage');
    expect(toastr.success).toHaveBeenCalledWith('testMessage', 'Success', jasmine.objectContaining({
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right'
    }));
    expect(result).toBe(toast);
  });

  it('should show error with title', () => {
    const result = service.error('testMessage', 'testTitle', { timeout: 12 });
    expect(toastr.error).toHaveBeenCalledWith('testMessage', 'testTitle', jasmine.objectContaining({
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right',
      timeout: 12
    }));
    expect(result).toBe(toast);
  });

  it('should show error without title', () => {
    const result = service.error('testMessage');
    expect(toastr.error).toHaveBeenCalledWith('testMessage', 'Error', jasmine.objectContaining({
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right'
    }));
    expect(result).toBe(toast);
  });

  it('should show warning with title', () => {
    const result = service.warn('testMessage', 'testTitle', { timeout: 12 });
    expect(toastr.warning).toHaveBeenCalledWith('testMessage', 'testTitle', jasmine.objectContaining({
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right',
      timeout: 12
    }));
    expect(result).toBe(toast);
  });

  it('should show warning without title', () => {
    const result = service.warn('testMessage');
    expect(toastr.warning).toHaveBeenCalledWith('testMessage', 'Warning', jasmine.objectContaining({
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right'
    }));
    expect(result).toBe(toast);
  });

  it('should show info with title', () => {
    const result = service.info('testMessage', 'testTitle', { timeout: 12 });
    expect(toastr.info).toHaveBeenCalledWith('testMessage', 'testTitle', jasmine.objectContaining({
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right',
      timeout: 12
    }));
    expect(result).toBe(toast);
  });

  it('should show info without title', () => {
    const result = service.info('testMessage');
    expect(toastr.info).toHaveBeenCalledWith('testMessage', 'Information', jasmine.objectContaining({
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right'
    }));
    expect(result).toBe(toast);
  });

  it('should merge options with defaults', () => {
    service.success('test', 'test', { customOption: true });
    expect(toastr.success).toHaveBeenCalledWith('test', 'test', jasmine.objectContaining({
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right',
      customOption: true
    }));
  });

});
