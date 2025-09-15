import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, Subject } from 'rxjs';

import { DosimeterComponent } from './dosimeter.component';
import { RecordMaintenanceService } from '../record-maintenance.service';
import { AppComponent } from '../../../app.component';
import { PublisherService } from 'src/app/core/services/publisher.service';
import { AppUtilService } from 'src/app/core/utils/app-util.service';

describe('DosimeterComponent', () => {
  let component: DosimeterComponent;
  let fixture: ComponentFixture<DosimeterComponent>;
  let mockRecordMaintenanceService: jasmine.SpyObj<RecordMaintenanceService>;
  let mockAppComponent: jasmine.SpyObj<AppComponent>;
  let mockPublisherService: jasmine.SpyObj<PublisherService>;
  let mockLocationSubject: Subject<boolean>;
  let mockTypeRefSubject: Subject<boolean>;

  beforeEach(async () => {
    const recordMaintenanceSpy = jasmine.createSpyObj('RecordMaintenanceService', [
      'getAllAccounts', 'getAllDosimeterResults'
    ]);
    const appComponentSpy = jasmine.createSpyObj('AppComponent', [], {
      allLocationMasterData: [
        { locationId: 1, isotracLocationId: 'L001', locationNameForDropdown: 'Location 1' },
        { locationId: 2, isotracLocationId: 'L002', locationNameForDropdown: 'Location 2' }
      ],
      allTypeRefMasterData: [
        { typeGroupCode: 180, typeId: 1, typeName: 'Type 1' },
        { typeGroupCode: 180, typeId: 2, typeName: 'Type 2' },
        { typeGroupCode: 200, typeId: 3, typeName: 'Type 3' }
      ]
    });

    mockLocationSubject = new Subject<boolean>();
    mockTypeRefSubject = new Subject<boolean>();
    const publisherSpy = jasmine.createSpyObj('PublisherService', [], {
      isAllLocations$: mockLocationSubject.asObservable(),
      isAllTypeRefs$: mockTypeRefSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ],
      declarations: [DosimeterComponent],
      providers: [
        { provide: RecordMaintenanceService, useValue: recordMaintenanceSpy },
        { provide: AppComponent, useValue: appComponentSpy },
        { provide: PublisherService, useValue: publisherSpy },
        ToastrService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DosimeterComponent);
    component = fixture.componentInstance;
    mockRecordMaintenanceService = TestBed.inject(RecordMaintenanceService) as jasmine.SpyObj<RecordMaintenanceService>;
    mockAppComponent = TestBed.inject(AppComponent) as jasmine.SpyObj<AppComponent>;
    mockPublisherService = TestBed.inject(PublisherService) as jasmine.SpyObj<PublisherService>;

    // Mock the ViewChild elements
    (component as any).participantNumberElement = {
      nativeElement: { focus: jasmine.createSpy('focus') }
    };

    mockRecordMaintenanceService.getAllAccounts.and.returnValue(of([
      { id: 1, name: 'Account 1' },
      { id: 2, name: 'Account 2' }
    ]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.formDisabled).toBe(true);
    expect(component.showDetails).toBe(false);
    expect(component.searchDosimeterError).toBe(false);
    expect(component.searchDosimeterErrorMsg).toBe('');
    expect(component.noDosimeterResult).toBe(false);
  });

  it('should call ngOnInit and load data', () => {
    spyOn(component, 'loadAllLocations' as any);
    spyOn(component, 'loadAllTypeRefs' as any);
    spyOn(component, 'getAllAcounts' as any);

    component.ngOnInit();

    expect(component['loadAllLocations']).toHaveBeenCalled();
    expect(component['loadAllTypeRefs']).toHaveBeenCalled();
    expect(component['getAllAcounts']).toHaveBeenCalled();
  });

  it('should load all locations from app component', () => {
    component.ngOnInit();
    expect(component.allLocations).toEqual(mockAppComponent.allLocationMasterData);
  });

  it('should load and filter type refs', () => {
    component.ngOnInit();
    expect(component.allTypeRefs).toEqual(mockAppComponent.allTypeRefMasterData);
    expect(component.allDosimeterTypeRefs.length).toBe(2);
    expect((component.allDosimeterTypeRefs[0] as any).typeGroupCode).toBe(180);
  });

  it('should get all accounts on init', () => {
    component.ngOnInit();
    expect(mockRecordMaintenanceService.getAllAccounts).toHaveBeenCalled();
    expect(component.allAccounts.length).toBe(2);
  });

  it('should filter type refs correctly', () => {
    const typeRefs = [
      { typeGroupCode: 180, name: 'Type A' },
      { typeGroupCode: 200, name: 'Type B' },
      { typeGroupCode: 180, name: 'Type C' }
    ];
    const filtered = component['filterTypeRefs'](typeRefs, 180);
    expect(filtered.length).toBe(2);
    expect(filtered[0].name).toBe('Type A');
    expect(filtered[1].name).toBe('Type C');
  });

  it('should respond to location master data changes', () => {
    spyOn(component, 'getAllLocations' as any);
    component.ngOnInit();
    
    mockLocationSubject.next(true);
    
    expect(component['getAllLocations']).toHaveBeenCalledWith(true);
  });

  it('should respond to type ref master data changes', () => {
    spyOn(component, 'getAllActiveRefs' as any);
    component.ngOnInit();
    
    mockTypeRefSubject.next(true);
    
    expect(component['getAllActiveRefs']).toHaveBeenCalledWith(true);
  });

  describe('submitParticipantSearch', () => {
    beforeEach(() => {
      // Mock the form
      component.participantSearchForm = {
        value: { participantNumber: '' }
      } as any;
    });

    it('should show error when participant number is undefined', () => {
      component.participantSearchForm.value.participantNumber = undefined;
      
      const result = component.submitParticipantSearch();
      
      expect(result).toBe(false);
      expect(component.searchDosimeterError).toBe(true);
      expect(component.searchDosimeterErrorMsg).toBe('Please enter participant number');
      expect((component as any).participantNumberElement.nativeElement.focus).toHaveBeenCalled();
    });

    it('should show error when participant number is empty', () => {
      component.participantSearchForm.value.participantNumber = '';
      
      const result = component.submitParticipantSearch();
      
      expect(result).toBe(false);
      expect(component.searchDosimeterError).toBe(true);
      expect(component.searchDosimeterErrorMsg).toBe('Please enter participant number');
    });

    it('should show error when participant number format is invalid', () => {
      component.participantSearchForm.value.participantNumber = '123';
      
      const result = component.submitParticipantSearch();
      
      expect(result).toBe(false);
      expect(component.searchDosimeterError).toBe(true);
      expect(component.searchDosimeterErrorMsg).toBe('Please enter 5 digit participant number');
    });

    it('should call getAllDosimeterResults with valid participant number', () => {
      component.participantSearchForm.value.participantNumber = '12345';
      spyOn(component, 'getAllDosimeterResults' as any);
      
      component.submitParticipantSearch();
      
      expect(component.searchDosimeterError).toBe(false);
      expect(component.searchDosimeterErrorMsg).toBe('');
      expect(component.showDetails).toBe(false);
      expect(component['getAllDosimeterResults']).toHaveBeenCalledWith(12345);
    });
  });

  describe('getAllDosimeterResults', () => {
    it('should handle empty dosimeter results', () => {
      mockRecordMaintenanceService.getAllDosimeterResults.and.returnValue(of([]));
      
      component['getAllDosimeterResults'](12345);
      
      expect(component.allDosimeterResults).toEqual([]);
      expect(component.noDosimeterResult).toBe(true);
    });

    it('should process dosimeter results with location mapping', () => {
      const mockResults = [
        { id: 1, locationId: 1, dose: 100 },
        { id: 2, locationId: 2, dose: 200 }
      ];
      mockRecordMaintenanceService.getAllDosimeterResults.and.returnValue(of(mockResults));
      
      component.ngOnInit(); // Load locations first
      component['getAllDosimeterResults'](12345);
      
      expect(component.allDosimeterResults.length).toBe(2);
      expect(component.noDosimeterResult).toBe(false);
    });
  });

  it('should reset participant search form', () => {
    const mockEvent = { preventDefault: jasmine.createSpy('preventDefault') };
    component.participantSearchForm = { reset: jasmine.createSpy('reset') } as any;
    component.searchDosimeterError = true;
    component.noDosimeterResult = true;
    component.showDetails = true;
    
    component.onResetParticipantSearchForm(mockEvent);
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(component.searchDosimeterError).toBe(false);
    expect(component.searchDosimeterErrorMsg).toBe('');
    expect(component.noDosimeterResult).toBe(false);
    expect(component.showDetails).toBe(false);
    expect(component.participantSearchForm.reset).toHaveBeenCalled();
  });

  it('should show dosimeter result', () => {
    spyOn(AppUtilService, 'createDateObjectForDatepicker').and.returnValue(new Date());
    const mockDosResult = { id: 1, dose: 100, inceptionDate: '2023-01-01' };
    
    component.onShowDosimeterResult(1, mockDosResult);
    
    expect(component.formDisabled).toBe(true);
    expect(component.selectedDoseimeter).toBe(1);
    expect(component.showDetails).toBe(true);
    expect(component.dosimeterResultObj).toEqual(jasmine.objectContaining(mockDosResult));
  });

  it('should handle dosimeter result with empty inception date', () => {
    const mockDosResult = { id: 1, dose: 100, inceptionDate: '' };
    
    component.onShowDosimeterResult(1, mockDosResult);
    
    expect(component.dosimeterResultObj).toEqual(jasmine.objectContaining(mockDosResult));
  });

  it('should unsubscribe on destroy', () => {
    const mockLocationSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    const mockTypeRefSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    
    component['subscribeLocationMasterData'] = mockLocationSubscription;
    component['subscribeTypeRefMasterData'] = mockTypeRefSubscription;
    
    component.ngOnDestroy();
    
    expect(mockLocationSubscription.unsubscribe).toHaveBeenCalled();
    expect(mockTypeRefSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should handle null subscriptions in ngOnDestroy', () => {
    component['subscribeLocationMasterData'] = null;
    component['subscribeTypeRefMasterData'] = null;
    
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});