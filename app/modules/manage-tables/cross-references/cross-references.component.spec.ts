import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of, Subject } from 'rxjs';

import { CrossReferencesComponent } from './cross-references.component';
import { ManageTablesService } from '../manage-tables.service';
import { AppComponent } from '../../../app.component';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { PublisherService } from 'src/app/core/services/publisher.service';
import { MessageService } from '../../../core/services/message.service';
import { ConfirmSaveComponent } from 'src/app/common/confirm-dialog/confirm-save.component';

describe('CrossReferencesComponent', () => {
  let component: CrossReferencesComponent;
  let fixture: ComponentFixture<CrossReferencesComponent>;
  let mockManageTablesService: jasmine.SpyObj<ManageTablesService>;
  let mockAppComponent: jasmine.SpyObj<AppComponent>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockModalService: jasmine.SpyObj<NgbModal>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockPublisherService: jasmine.SpyObj<PublisherService>;
  let mockModalRef: jasmine.SpyObj<NgbModalRef>;
  let mockForm: jasmine.SpyObj<NgForm>;
  
  // Subjects for observables
  let isAllTypeGroupsSubject: Subject<boolean>;
  let isPopModalOpenSubject: Subject<any>;

  beforeEach(async () => {
    // Create subjects for observables
    isAllTypeGroupsSubject = new Subject<boolean>();
    isPopModalOpenSubject = new Subject<any>();

    // Create spies
    mockManageTablesService = jasmine.createSpyObj('ManageTablesService', ['updateTypeGroup']);
    mockAppComponent = jasmine.createSpyObj('AppComponent', [
      'getAllTypeGroupsMasterData', 
      'getAllTypeRefsMasterData'
    ]);
    mockMessageService = jasmine.createSpyObj('MessageService', ['success']);
    mockModalService = jasmine.createSpyObj('NgbModal', ['open', 'hasOpenModals', 'dismissAll']);
    mockDialogService = jasmine.createSpyObj('DialogService', ['confirmDialog']);
    mockPublisherService = jasmine.createSpyObj('PublisherService', [], {
      isAllTypeGroups$: isAllTypeGroupsSubject.asObservable(),
      isPopModalOpen$: isPopModalOpenSubject.asObservable()
    });
    mockModalRef = jasmine.createSpyObj('NgbModalRef', ['result'], {
      componentInstance: { title: '', message: '' }
    });
    mockForm = jasmine.createSpyObj('NgForm', [], {
      dirty: false,
      form: { markAsPristine: jasmine.createSpy('markAsPristine') }
    });

    // Set up default return values
    mockAppComponent.allTypeGroupMasterData = [
      { id: 1, name: 'Type Group 1' },
      { id: 2, name: 'Type Group 2' }
    ];
    mockManageTablesService.updateTypeGroup.and.returnValue(of({ success: true }));
    mockModalService.open.and.returnValue(mockModalRef);
    mockModalRef.result = Promise.resolve('confirmed');

    await TestBed.configureTestingModule({
      declarations: [CrossReferencesComponent],
      providers: [
        { provide: ManageTablesService, useValue: mockManageTablesService },
        { provide: AppComponent, useValue: mockAppComponent },
        { provide: MessageService, useValue: mockMessageService },
        { provide: NgbModal, useValue: mockModalService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: PublisherService, useValue: mockPublisherService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CrossReferencesComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.formDisabled).toBe(true);
      expect(component.showDetails).toBe(false);
      expect(component.selectedTypeGroupRef).toBe('');
      expect(component.allTypeGroups).toEqual([]);
      expect(component.allTypeRefObj).toEqual([]);
    });

    it('should call loadTypeGroups on ngOnInit', () => {
      spyOn(component, 'loadTypeGroups');
      component.ngOnInit();
      expect(component.loadTypeGroups).toHaveBeenCalled();
    });

    it('should subscribe to publisher services on ngOnInit', () => {
      component.ngOnInit();
      expect(component['subscribeMasterData']).toBeTruthy();
      expect(component['popupAlreadyOpenSubscription']).toBeTruthy();
    });
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      component.ngOnInit(); // Initialize subscriptions
    });

    it('should unsubscribe from subscribeMasterData if it exists', () => {
      spyOn(component['subscribeMasterData'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component['subscribeMasterData'].unsubscribe).toHaveBeenCalled();
    });

    it('should unsubscribe from popupAlreadyOpenSubscription if it exists', () => {
      spyOn(component['popupAlreadyOpenSubscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component['popupAlreadyOpenSubscription'].unsubscribe).toHaveBeenCalled();
    });

    it('should remove selectedCrossRef from sessionStorage', () => {
      spyOn(sessionStorage, 'removeItem');
      component.ngOnDestroy();
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('selectedCrossRef');
    });

    it('should handle null popupAlreadyOpenSubscription', () => {
      component['popupAlreadyOpenSubscription'] = null;
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('canDeactivate', () => {
    it('should return true when crForm is undefined', () => {
      component.crForm = undefined;
      const result = component.canDeactivate();
      expect(result).toBe(true);
    });
  });

  describe('loadTypeGroups', () => {
    it('should load type groups from app component', () => {
      const mockData = [{ id: 1, name: 'Test Group' }];
      mockAppComponent.allTypeGroupMasterData = mockData;
      
      component.loadTypeGroups();
      
      expect(component.allTypeGroups).toEqual(mockData);
    });
  });

  describe('getAllTypeGroups', () => {
    it('should call loadTypeGroups when isLoaded is true', () => {
      spyOn(component, 'loadTypeGroups');
      
      component.getAllTypeGroups(true);
      
      expect(component.loadTypeGroups).toHaveBeenCalled();
    });

    it('should not call loadTypeGroups when isLoaded is false', () => {
      spyOn(component, 'loadTypeGroups');
      
      component.getAllTypeGroups(false);
      
      expect(component.loadTypeGroups).not.toHaveBeenCalled();
    });
  });

  describe('checkActivePopupModal', () => {
    it('should dismiss all modals when hasOpenModals returns true', () => {
      mockModalService.hasOpenModals.and.returnValue(true);
      
      component['checkActivePopupModal']();
      
      expect(mockModalService.dismissAll).toHaveBeenCalled();
    });

    it('should not dismiss modals when hasOpenModals returns false', () => {
      mockModalService.hasOpenModals.and.returnValue(false);
      
      component['checkActivePopupModal']();
      
      expect(mockModalService.dismissAll).not.toHaveBeenCalled();
    });
  });

  describe('openModal', () => {
    it('should open modal with correct configuration', () => {
      const title = 'Test Title';
      const message = 'Test Message';
      
      component['openModal'](title, message);
      
      expect(mockModalService.open).toHaveBeenCalledWith(ConfirmSaveComponent, {
        backdrop: 'static',
        keyboard: false
      });
      expect(mockModalRef.componentInstance.title).toBe(title);
      expect(mockModalRef.componentInstance.message).toBe(message);
    });
  });

  describe('performShowCrossRefDetails', () => {
    it('should set component properties correctly', () => {
      const typeGroupRefId = 'test-id';
      const typeGroupObj = [{ id: 1, name: 'Test' }];
      
      component['performShowCrossRefDetails'](typeGroupRefId, typeGroupObj);
      
      expect(component.formDisabled).toBe(true);
      expect(component.selectedTypeGroupRef).toBe(typeGroupRefId);
      expect(component.allTypeRefObj).toBe(typeGroupObj);
      expect(component.showDetails).toBe(true);
    });
  });

  describe('onShowCrossRefDetails', () => {
    const typeGroupRefId = 'test-id';
    const typeGroupObj = [{ id: 1, name: 'Test' }];

    it('should call performShowCrossRefDetails when form is undefined', () => {
      component.crForm = undefined;
      spyOn(component, 'performShowCrossRefDetails' as any);
      
      component.onShowCrossRefDetails(typeGroupRefId, typeGroupObj);
      
      expect(component['performShowCrossRefDetails']).toHaveBeenCalledWith(typeGroupRefId, typeGroupObj);
    });
  });

  describe('performCrossRefEdit', () => {
    it('should set component properties and sessionStorage correctly', () => {
      spyOn(sessionStorage, 'setItem');
      const typeGroupRefId = 'test-id';
      const typeGroupObj = [{ id: 1, name: 'Test' }];
      component.showDetails = false;
      
      component['performCrossRefEdit'](typeGroupRefId, typeGroupObj);
      
      expect(component.formDisabled).toBe(false);
      expect(component.selectedTypeGroupRef).toBe(typeGroupRefId);
      expect(component.allTypeRefObj).toBe(typeGroupObj);
      expect(component.showDetails).toBe(true);
      expect(sessionStorage.setItem).toHaveBeenCalledWith('selectedCrossRef', JSON.stringify(typeGroupObj));
    });

    it('should not change showDetails when it is already true', () => {
      spyOn(sessionStorage, 'setItem');
      const typeGroupRefId = 'test-id';
      const typeGroupObj = [{ id: 1, name: 'Test' }];
      component.showDetails = true;
      
      component['performCrossRefEdit'](typeGroupRefId, typeGroupObj);
      
      expect(component.showDetails).toBe(true);
    });
  });

  describe('onEnableCrossReferenceEdit', () => {
    const typeGroupRefId = 'test-id';
    const typeGroupObj = [{ id: 1, name: 'Test' }];

    it('should call performCrossRefEdit when form is undefined', () => {
      component.crForm = undefined;
      spyOn(component, 'performCrossRefEdit' as any);
      
      component.onEnableCrossReferenceEdit(typeGroupRefId, typeGroupObj);
      
      expect(component['performCrossRefEdit']).toHaveBeenCalledWith(typeGroupRefId, typeGroupObj);
    });
  });

  describe('onUpdateCrossReferenceType', () => {
    beforeEach(() => {
      component.allTypeRefObj = [{ id: 1, name: 'Test' }];
      component.crForm = mockForm as NgForm;
    });

    it('should call updateTypeGroup service method', () => {
      component.onUpdateCrossReferenceType();
      
      expect(mockManageTablesService.updateTypeGroup).toHaveBeenCalledWith(component.allTypeRefObj);
    });

    it('should show success message after successful update', () => {
      component.onUpdateCrossReferenceType();
      
      expect(mockMessageService.success).toHaveBeenCalledWith('Record updated successfully');
    });

    it('should refresh master data after successful update', () => {
      component.onUpdateCrossReferenceType();
      
      expect(mockAppComponent.getAllTypeGroupsMasterData).toHaveBeenCalled();
      expect(mockAppComponent.getAllTypeRefsMasterData).toHaveBeenCalled();
    });

    it('should disable form and mark as pristine after update', () => {
      component.onUpdateCrossReferenceType();
      
      expect(component.formDisabled).toBe(true);
      expect(mockForm.form.markAsPristine).toHaveBeenCalled();
    });
  });

  describe('undoCrossReferenceEdit', () => {
    beforeEach(() => {
      component.crForm = mockForm as NgForm;
    });

    it('should restore data from sessionStorage', () => {
      const storedData = [{ id: 1, name: 'Stored Test' }];
      spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify(storedData));
      
      component['undoCrossReferenceEdit']();
      
      expect(component.allTypeRefObj).toEqual(storedData);
    });

    it('should refresh master data', () => {
      spyOn(sessionStorage, 'getItem').and.returnValue('[]');
      
      component['undoCrossReferenceEdit']();
      
      expect(mockAppComponent.getAllTypeGroupsMasterData).toHaveBeenCalled();
      expect(mockAppComponent.getAllTypeRefsMasterData).toHaveBeenCalled();
    });

    it('should mark form as pristine', () => {
      spyOn(sessionStorage, 'getItem').and.returnValue('[]');
      
      component['undoCrossReferenceEdit']();
      
      expect(mockForm.form.markAsPristine).toHaveBeenCalled();
    });
  });

  describe('onCancelCrossReferenceEdit', () => {
    let mockEvent: jasmine.SpyObj<Event>;

    beforeEach(() => {
      mockEvent = jasmine.createSpyObj('Event', ['preventDefault']);
    });

    it('should disable form when form is undefined', () => {
      component.crForm = undefined;
      
      component.onCancelCrossReferenceEdit(mockEvent);
      
      expect(component.formDisabled).toBe(true);
    });
  });

  describe('Publisher Service Subscriptions', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should call getAllTypeGroups when isAllTypeGroups$ emits true', () => {
      spyOn(component, 'getAllTypeGroups');
      
      isAllTypeGroupsSubject.next(true);
      
      expect(component.getAllTypeGroups).toHaveBeenCalledWith(true);
    });

    it('should call checkActivePopupModal when isPopModalOpen$ emits', () => {
      spyOn(component, 'checkActivePopupModal' as any);
      
      isPopModalOpenSubject.next({});
      
      expect(component['checkActivePopupModal']).toHaveBeenCalled();
    });
  });
});