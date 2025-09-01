import { TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from './dialog.service';
import { ConfirmDialogComponent } from 'src/app/common/confirm-dialog/confirm-dialog.component';

describe('DialogService', () => {
  let service: DialogService;
  let modalService: NgbModal;

  beforeEach(() => {
    const mockModalService = {
      open: jasmine.createSpy('open').and.returnValue({
        componentInstance: {},
        result: Promise.resolve(true)
      })
    };

    TestBed.configureTestingModule({
      providers: [
        DialogService,
        { provide: NgbModal, useValue: mockModalService }
      ]
    });

    service = TestBed.get(DialogService);
    modalService = TestBed.get(NgbModal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /* it('should open confirm dialog with correct parameters', () => {
    const title = 'Test Title';
    const message = 'Test Message';

    service.confirmDialog(title, message);

    expect(modalService.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      backdrop: 'static',
      keyboard: false
    });
  }); */

  /* it('should set modal options correctly', () => {
    const title = 'Test Title';
    const message = 'Test Message';

    service.confirmDialog(title, message);

    expect(service.modalOption.backdrop).toBe('static');
    expect(service.modalOption.keyboard).toBe(false);
  }); */
});
