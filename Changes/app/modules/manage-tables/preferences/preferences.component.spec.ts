import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferencesComponent } from './preferences.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MaskInputPipe } from '../../../shared/pipes/mask-input.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParseDatePipe } from '../../../shared/pipes/parse-date.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AppComponent } from '../../../app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DialogService } from '../../../shared/services/dialog.service';
import { RecordMaintenanceService } from '../../record-maintenance/record-maintenance.service';
import { of } from 'rxjs'; 
import { TEST_TYPE_REF , TEST_TYPE_GROUP, TEST_LOCATION, TEST_ACCOUNTS } from '../../test.data';
import { PublisherService } from '../../../core/services/publisher.service';
import { ManageTablesService } from '../manage-tables.service';

describe('PreferencesComponent', () => {
  let component: PreferencesComponent;
  let fixture: ComponentFixture<PreferencesComponent>;
  let recordMaintenanceService: RecordMaintenanceService;
  let appComponent: AppComponent;
  let mtService: ManageTablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, RouterTestingModule, ToastrModule.forRoot() ],
      declarations: [ PreferencesComponent, MaskInputPipe, ParseDatePipe ],
      providers: [HttpClient, HttpHandler, AppComponent, ToastrService, DialogService, RecordMaintenanceService, PublisherService ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferencesComponent);
    component = fixture.componentInstance;
    recordMaintenanceService = TestBed.get(RecordMaintenanceService);
    mtService = TestBed.get(ManageTablesService);
    appComponent = TestBed.get(AppComponent);
    appComponent.allLocationMasterData = TEST_LOCATION;
    appComponent.allTypeRefMasterData = TEST_TYPE_REF;
    appComponent.allTypeGroupMasterData = TEST_TYPE_GROUP;
    PublisherService.notifyAllTypeRefs(true);
    PublisherService.notifyAllLocations(true);
    spyOn(recordMaintenanceService, 'getAllAccounts').and.returnValue(of());
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test login controller oninit', () => {
    component.loadAllLocations();
    component.loadAllTypeRefs();
    const accountsSpy = spyOn(mtService,'getAllAccounts').and.returnValue(of(TEST_ACCOUNTS));
    expect(component.allLocations.length).toEqual(1);
    expect(component.allTypeRefs.length).toEqual(13);
    expect(component.allBadgeUseTypeRefs.length).toEqual(1);
   });

   it('test all accounts', () => {
    component.getAllActiveRefs(true);
  });
});
