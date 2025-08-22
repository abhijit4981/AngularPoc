import { TestBed } from '@angular/core/testing';
import { ToastrService, ToastrModule, ActiveToast } from 'ngx-toastr';
import { MessageService } from './message.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MessageService', () => {
  let toastr: ToastrService;
  let toast: ActiveToast<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ ToastrModule.forRoot(), BrowserAnimationsModule ],
      providers: [MessageService, ToastrService]
    });

    toastr = TestBed.get(ToastrService);
    spyOn(toastr, 'success').and.returnValue(toast);
  });

  it('should be created', () => {
    const service: MessageService = TestBed.get(MessageService);
    expect(service).toBeTruthy();
  });

  it('success with title', () => {
    const service: MessageService = TestBed.get(MessageService);
    service.success('testMessage', 'testTitle', 12);
  });

  it('success without title', () => {
    const service: MessageService = TestBed.get(MessageService);
    service.success('testMessage', '', 12);
  });

  it('error with title', () => {
    const service: MessageService = TestBed.get(MessageService);
    service.error('testMessage', 'testTitle', 12);
  });

  it('error without title', () => {
    const service: MessageService = TestBed.get(MessageService);
    service.error('testMessage', '', 12);
  });

  it('warn with title', () => {
    const service: MessageService = TestBed.get(MessageService);
    service.warn('testMessage', 'testTitle', 12);
  });

  it('warn without title', () => {
    const service: MessageService = TestBed.get(MessageService);
    service.warn('testMessage', '', 12);
  });

  it('info with title', () => {
    const service: MessageService = TestBed.get(MessageService);
    service.info('testMessage', 'testTitle', 12);
  });

  it('info without title', () => {
    const service: MessageService = TestBed.get(MessageService);
    service.info('testMessage', '', 12);
  });

});
