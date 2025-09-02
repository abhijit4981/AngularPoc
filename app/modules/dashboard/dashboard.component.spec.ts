import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpHandler, HttpClient } from '@angular/common/http';
import { AppComponent } from '../../app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DashboardService } from './dashboard.service';
import { PublisherService } from '../../core/services/publisher.service';
import { MessageService } from '../../core/services/message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { TEST_TYPE_REF , TEST_TYPE_GROUP, TEST_LOCATION } from '../test.data';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: DashboardService;
  let appComponent: AppComponent;
  let publisherService: PublisherService;
  let modalService: NgbModal;

  const mockCounts = {
    stageJobAuditVOList: [
      { description: 'Participant', jobStp: '2025-01-01T10:00:00Z' },
      { description: 'External Dose', jobStp: '2025-01-02T11:00:00Z' }
    ]
  };

  const mockRejectedRecords = [
    { stageParticipantNum: '12345', accountNum: 'ACC001', lastName: 'Test', firstName: 'User' },
    { stageParticipantNum: '67890', accountNum: 'ACC002', lastName: 'Another', firstName: 'User' }
  ];

  const mockParticipantDetails = {
    accountNum: 'ACC001',
    participantNum: '12345',
    identificationType: 'DL',
    officialId: 'DL123456',
    series: 'A',
    inceptionDate: '2025-01-01',
    conceptionDate: '2025-12-31',
    lastName: 'Test',
    firstName: 'User',
    sex: 'M',
    birthDate: '1990-01-01',
    rejectionReason: '101,102,103'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, RouterTestingModule, ToastrModule.forRoot() ],
      declarations: [ DashboardComponent ],
      providers: [ 
        HttpClient, 
        HttpHandler, 
        AppComponent,
        ToastrService, 
        DashboardService, 
        PublisherService,
        MessageService,
        NgbModal
      ],
      schemas : [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    appComponent = TestBed.inject(AppComponent);
    appComponent.allLocationMasterData = TEST_LOCATION;
    appComponent.allTypeRefMasterData = TEST_TYPE_REF;
    appComponent.allTypeGroupMasterData = TEST_TYPE_GROUP;
    dashboardService = TestBed.inject(DashboardService);
    publisherService = TestBed.inject(PublisherService);
    modalService = TestBed.inject(NgbModal);

    spyOn(dashboardService, 'getAllCounts').and.returnValue(of(mockCounts) as any);
    spyOn(dashboardService, 'getRecordListEDR').and.returnValue(of(mockRejectedRecords) as any);
    spyOn(dashboardService, 'getRecordListParticipant').and.returnValue(of(mockRejectedRecords) as any);
    spyOn(dashboardService, 'getRecordListPersonnel').and.returnValue(of(mockRejectedRecords) as any);
    spyOn(dashboardService, 'getAllAccounts').and.returnValue(of([{id: 1, name: 'Test Account'}]) as any);
    spyOn(dashboardService, 'getParticipantRejectionDetails').and.returnValue(of(mockParticipantDetails) as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize component with all required data', fakeAsync(() => {
      publisherService.notifyAllTypeRefs(true);
      publisherService.notifyAllLocations(true);
      publisherService.notifyPopupModalOpen(); 
      
      component.ngOnInit();
      tick();

      expect(dashboardService.getAllCounts).toHaveBeenCalled();
      expect(dashboardService.getRecordListEDR).toHaveBeenCalled();
      expect(dashboardService.getRecordListParticipant).toHaveBeenCalled();
      expect(dashboardService.getRecordListPersonnel).toHaveBeenCalled();
      expect(dashboardService.getAllAccounts).toHaveBeenCalled();
      expect(component.allLocations).toEqual(TEST_LOCATION);
    }));

    it('should set up publisher subscriptions correctly', () => {
      spyOn(component, 'getAllLocations');
      spyOn(component, 'getAllActiveRefs');
      spyOn(component as any, 'checkActivePopupModal').and.callThrough();

      component.ngOnInit();

      publisherService.notifyAllLocations(true);
      publisherService.notifyAllTypeRefs(true);
      publisherService.notifyPopupModalOpen();

      expect(component.getAllLocations).toHaveBeenCalledWith(true);
      expect(component.getAllActiveRefs).toHaveBeenCalledWith(true);
    });
  });

  describe('Type References', () => {
    it('should load all type references correctly', () => {
      component.loadAllTypeRefs();
      
      expect(component.allTypeRefs).toEqual(TEST_TYPE_REF);
      expect(component.allBadgeUseTypeRefs.length).toBeGreaterThanOrEqual(0);
      expect(component.allDoseDerivationTypeRefs.length).toBeGreaterThanOrEqual(0);
      expect(component.allDoseStatusTypeRefs.length).toBeGreaterThanOrEqual(0);
    });

    it('should filter type references by group code', () => {
      const testTypeRefs = [
        { typeGroupCode: 100, id: 1, name: 'Badge' },
        { typeGroupCode: 140, id: 2, name: 'Dose Derivation' },
        { typeGroupCode: 100, id: 3, name: 'Another Badge' }
      ];
      
      const filtered = component.filterTypeRefs(testTypeRefs, 100);
      
      expect(filtered.length).toBe(2);
      expect(filtered[0].typeGroupCode).toBe(100);
      expect(filtered[1].typeGroupCode).toBe(100);
    });

    it('should call loadAllTypeRefs when getAllActiveRefs is called with true', () => {
      spyOn(component, 'loadAllTypeRefs');
      
      component.getAllActiveRefs(true);
      
      expect(component.loadAllTypeRefs).toHaveBeenCalled();
    });

    it('should not call loadAllTypeRefs when getAllActiveRefs is called with false', () => {
      spyOn(component, 'loadAllTypeRefs');
      
      component.getAllActiveRefs(false);
      
      expect(component.loadAllTypeRefs).not.toHaveBeenCalled();
    });
  });

  describe('Location Management', () => {
    it('should load all locations from app component', () => {
      component.loadAllLocations();
      
      expect(component.allLocations).toEqual(TEST_LOCATION);
    });

    it('should call loadAllLocations when getAllLocations is called with true', () => {
      spyOn(component, 'loadAllLocations');
      
      component.getAllLocations(true);
      
      expect(component.loadAllLocations).toHaveBeenCalled();
    });

    it('should not call loadAllLocations when getAllLocations is called with false', () => {
      spyOn(component, 'loadAllLocations');
      
      component.getAllLocations(false);
      
      expect(component.loadAllLocations).not.toHaveBeenCalled();
    });
  });

  describe('Data Retrieval Methods', () => {
    it('should get counts and process stage job audit data', fakeAsync(() => {
      component.getCounts();
      tick();

      expect(dashboardService.getAllCounts).toHaveBeenCalled();
      expect(component.counts).toEqual(mockCounts);
      expect(component.lastProcessedParticipant.description).toBe('Participant');
      expect(component.lastProcessedEDR.description).toBe('External Dose');
    }));


    it('should get all rejected participant records', fakeAsync(() => {
      component.getAllRecordListParticipant();
      tick();

      expect(dashboardService.getRecordListParticipant).toHaveBeenCalled();
      expect(component.rejectedRecordListParticipant).toEqual(mockRejectedRecords);
    }));

    it('should get all rejected EDR records', fakeAsync(() => {
      component.getAllRecordListEDR();
      tick();

      expect(dashboardService.getRecordListEDR).toHaveBeenCalled();
      expect(component.rejectedRecordListEDR).toEqual(mockRejectedRecords);
    }));

    it('should get all rejected personnel records', fakeAsync(() => {
      component.getAllRecordListPersonnel();
      tick();

      expect(dashboardService.getRecordListPersonnel).toHaveBeenCalled();
      expect(component.rejectedRecordListPersonnel).toEqual(mockRejectedRecords);
    }));

    it('should get all accounts', fakeAsync(() => {
      component.getAllAccounts();
      tick();

      expect(dashboardService.getAllAccounts).toHaveBeenCalled();
      expect(component.allAccounts).toEqual([{id: 1, name: 'Test Account'}]);
    }));
  });


  describe('Participant Rejection Modal', () => {
    it('should initialize flags and call service when opening participant rejection modal', fakeAsync(() => {
      const participant = { stageParticipantNum: '12345' };
      
      component.onOpenParticipantRejectionModal(participant);
      tick();

      expect(dashboardService.getParticipantRejectionDetails).toHaveBeenCalledWith('12345');
      expect(component.accountNumRejectionFlag).toBe(false);
      expect(component.participantNumRejectionFlag).toBe(false);
      expect(component.accountNumDisableFlag).toBe(true);
      expect(component.participantNumDisableFlag).toBe(true);
    }));

    it('should process rejection codes correctly', fakeAsync(() => {
      const participant = { stageParticipantNum: '12345' };
      
      component.onOpenParticipantRejectionModal(participant);
      tick();

      expect(component.participantFormValid).toBe(true);
      expect(component.participantRejectionData).toEqual(jasmine.objectContaining(mockParticipantDetails));
    }));

    it('should handle empty identification type', fakeAsync(() => {
      const mockDetailsWithEmptyId = { ...mockParticipantDetails, identificationType: '' };
      dashboardService.getParticipantRejectionDetails = jasmine.createSpy().and.returnValue(of(mockDetailsWithEmptyId));
      
      const participant = { stageParticipantNum: '12345' };
      
      component.onOpenParticipantRejectionModal(participant);
      tick();

      expect(component.participantRejectionData['identificationType']).toBeNull();
    }));
  });

  describe('Component Properties', () => {
    it('should initialize with correct default values', () => {
      expect(component.allLocations).toEqual([]);
      expect(component.allTypeRefs).toEqual([]);
      expect(component.participantFormValid).toBe(false);
      expect(component.EDRFormValid).toBe(false);
      expect(component.personnelFormValid).toBe(false);
      expect(component.showCollapse).toBe(false);
      expect(component.formDisabled).toBe(true);
    });

    it('should have gender dropdown with correct values', () => {
      expect(component.genderDropdownValue).toEqual([
        { id: 'M', name: 'Male' }, 
        { id: 'F', name: 'Female' }
      ]);
    });

    it('should initialize all arrays correctly', () => {
      expect(Array.isArray(component.rejectedRecordListParticipant)).toBe(true);
      expect(Array.isArray(component.rejectedRecordListEDR)).toBe(true);
      expect(Array.isArray(component.rejectedRecordListPersonnel)).toBe(true);
      expect(Array.isArray(component.rejectedRecordListBioAssay)).toBe(true);
    });
  });


});