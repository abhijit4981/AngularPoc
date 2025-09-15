import { TestBed } from '@angular/core/testing';
import { ToastrService, ToastrModule, ActiveToast } from 'ngx-toastr';
import { MessageService } from './message.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MessageService', () => {
  let service: MessageService;
  let toastr: jasmine.SpyObj<ToastrService>;
  let mockToast: ActiveToast<any>;

  beforeEach(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning', 'info']);
    mockToast = {} as ActiveToast<any>;

    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot(), BrowserAnimationsModule],
      providers: [
        MessageService,
        { provide: ToastrService, useValue: toastrSpy }
      ]
    });

    service = TestBed.inject(MessageService);
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    
    toastr.success.and.returnValue(mockToast);
    toastr.error.and.returnValue(mockToast);
    toastr.warning.and.returnValue(mockToast);
    toastr.info.and.returnValue(mockToast);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success', () => {
    it('should call toastr.success with title', () => {
      const result = service.success('testMessage', 'testTitle', { timeOut: 12 });
      
      expect(toastr.success).toHaveBeenCalledWith('testMessage', 'testTitle', jasmine.objectContaining({
        closeButton: true,
        tapToDismiss: false,
        timeOut: 12,
        positionClass: 'toast-top-right'
      }));
      expect(result).toBe(mockToast);
    });

    it('should use default title when not provided', () => {
      service.success('testMessage');
      
      expect(toastr.success).toHaveBeenCalledWith('testMessage', 'Success', jasmine.objectContaining({
        closeButton: true,
        tapToDismiss: false,
        timeOut: 5000,
        positionClass: 'toast-top-right'
      }));
    });

    it('should use default title when empty string provided', () => {
      service.success('testMessage', '');
      
      expect(toastr.success).toHaveBeenCalledWith('testMessage', 'Success', jasmine.any(Object));
    });
  });

  describe('error', () => {
    it('should call toastr.error with title', () => {
      const result = service.error('testMessage', 'testTitle', { timeOut: 12 });
      
      expect(toastr.error).toHaveBeenCalledWith('testMessage', 'testTitle', jasmine.objectContaining({
        closeButton: true,
        tapToDismiss: false,
        timeOut: 12,
        positionClass: 'toast-top-right'
      }));
      expect(result).toBe(mockToast);
    });

    it('should use default title when not provided', () => {
      service.error('testMessage');
      
      expect(toastr.error).toHaveBeenCalledWith('testMessage', 'Error', jasmine.any(Object));
    });
  });

  describe('warn', () => {
    it('should call toastr.warning with title', () => {
      const result = service.warn('testMessage', 'testTitle', { timeOut: 12 });
      
      expect(toastr.warning).toHaveBeenCalledWith('testMessage', 'testTitle', jasmine.objectContaining({
        closeButton: true,
        tapToDismiss: false,
        timeOut: 12,
        positionClass: 'toast-top-right'
      }));
      expect(result).toBe(mockToast);
    });

    it('should use default title when not provided', () => {
      service.warn('testMessage');
      
      expect(toastr.warning).toHaveBeenCalledWith('testMessage', 'Warning', jasmine.any(Object));
    });
  });

  describe('info', () => {
    it('should call toastr.info with title', () => {
      const result = service.info('testMessage', 'testTitle', { timeOut: 12 });
      
      expect(toastr.info).toHaveBeenCalledWith('testMessage', 'testTitle', jasmine.objectContaining({
        closeButton: true,
        tapToDismiss: false,
        timeOut: 12,
        positionClass: 'toast-top-right'
      }));
      expect(result).toBe(mockToast);
    });

    it('should use default title when not provided', () => {
      service.info('testMessage');
      
      expect(toastr.info).toHaveBeenCalledWith('testMessage', 'Information', jasmine.any(Object));
    });
  });

  describe('getToastrOptions (private method testing through public methods)', () => {
    it('should merge custom options with defaults', () => {
      const customOptions = { timeOut: 10000, closeButton: false };
      service.success('test', 'title', customOptions);
      
      expect(toastr.success).toHaveBeenCalledWith('test', 'title', jasmine.objectContaining({
        closeButton: false,
        tapToDismiss: false,
        timeOut: 10000,
        positionClass: 'toast-top-right'
      }));
    });

    it('should use defaults when no options provided', () => {
      service.success('test');
      
      expect(toastr.success).toHaveBeenCalledWith('test', 'Success', jasmine.objectContaining({
        closeButton: true,
        tapToDismiss: false,
        timeOut: 5000,
        positionClass: 'toast-top-right'
      }));
    });

    it('should handle null options', () => {
      service.success('test', 'title', null);
      
      expect(toastr.success).toHaveBeenCalledWith('test', 'title', jasmine.objectContaining({
        closeButton: true,
        tapToDismiss: false,
        timeOut: 5000,
        positionClass: 'toast-top-right'
      }));
    });
  });
});
