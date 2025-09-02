import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ExternalContaminationComponent } from './external-contamination.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RecordMaintenanceService } from '../record-maintenance.service';
import { PublisherService } from 'src/app/core/services/publisher.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { MessageService } from '../../../core/services/message.service';
import { AppComponent } from 'src/app/app.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppUtilService } from 'src/app/core/utils/app-util.service';
import { of } from 'rxjs';

describe('ExternalContaminationComponent', () => {
  let component: ExternalContaminationComponent;
  let fixture: ComponentFixture<ExternalContaminationComponent>;

  beforeEach(async () => {
    const mockServices = {
      RecordMaintenanceService: jasmine.createSpyObj('RecordMaintenanceService', ['getAllEmployees']),
      PublisherService: jasmine.createSpyObj('PublisherService', [], {
        isAllLocations$: of(true),
        isAllTypeRefs$: of(true),
        isPopModalOpen$: of(true)
      }),
      DialogService: jasmine.createSpyObj('DialogService', ['confirmDialog']),
      MessageService: jasmine.createSpyObj('MessageService', ['success']),
      AppComponent: jasmine.createSpyObj('AppComponent', ['loadMasterData']),
      NgbModal: jasmine.createSpyObj('NgbModal', ['open']),
      AppUtilService: jasmine.createSpyObj('AppUtilService', ['formatDate'])
    };

    await TestBed.configureTestingModule({
      declarations: [ExternalContaminationComponent],
      imports: [FormsModule],
      providers: [
        { provide: RecordMaintenanceService, useValue: mockServices.RecordMaintenanceService },
        { provide: PublisherService, useValue: mockServices.PublisherService },
        { provide: DialogService, useValue: mockServices.DialogService },
        { provide: MessageService, useValue: mockServices.MessageService },
        { provide: AppComponent, useValue: mockServices.AppComponent },
        { provide: NgbModal, useValue: mockServices.NgbModal },
        { provide: AppUtilService, useValue: mockServices.AppUtilService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalContaminationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});