import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from 'src/app/common/confirm-dialog/confirm-dialog.component';

describe('DialogService', () => {
  let service: DialogService;
  let modalServiceSpy: jasmine.SpyObj<NgbModal>;
  let modalRefSpy: jasmine.SpyObj<NgbModalRef>;

  beforeEach(() => {
    modalRefSpy = jasmine.createSpyObj('NgbModalRef', ['result'], {
      componentInstance: {}
    });

    modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);

    TestBed.configureTestingModule({
      providers: [
        DialogService,
        { provide: NgbModal, useValue: modalServiceSpy }
      ]
    });

    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open confirm dialog with correct options', () => {
    modalServiceSpy.open.and.returnValue(modalRefSpy);

    const resultPromise = Promise.resolve('confirmed');
    (modalRefSpy as any).result = resultPromise;

    const result = service.confirmDialog('Test Title', 'Test Message');

    expect(modalServiceSpy.open).toHaveBeenCalledWith(
      ConfirmDialogComponent,
      jasmine.objectContaining<NgbModalOptions>({
        backdrop: 'static',
        keyboard: false
      })
    );
    expect(modalRefSpy.componentInstance.title).toBe('Test Title');
    expect(modalRefSpy.componentInstance.message).toBe('Test Message');
    expect(result).toBe(resultPromise);
  });
});
