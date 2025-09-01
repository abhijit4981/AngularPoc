import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DosimetryApiService as DMApi } from '../../../core/api/dosimetry-api.service';

import { InternalContaminationComponent } from './internal-contamination.component';
import { ParseDatePipe } from '../../../shared/pipes/parse-date.pipe';
import { DialogService } from '../../../shared/services/dialog.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AppComponent } from '../../../app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RecordMaintenanceService } from '../record-maintenance.service';
import { of } from 'rxjs';

describe('InternalContaminationComponent', () => {
  let component: InternalContaminationComponent;
  let fixture: ComponentFixture<InternalContaminationComponent>;
  let recordMaintenanceService: RecordMaintenanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, NgSelectModule, MatDatepickerModule, MatNativeDateModule,
      ToastrModule.forRoot(), RouterTestingModule ],
      declarations: [ InternalContaminationComponent, ParseDatePipe ],
      providers: [DMApi, DialogService, ToastrService, AppComponent, RecordMaintenanceService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalContaminationComponent);
    component = fixture.componentInstance;
    recordMaintenanceService = TestBed.get(RecordMaintenanceService);
    spyOn(recordMaintenanceService, 'getAllNuclides').and.returnValue(
      of()
      ); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
