import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DosimeterComponent } from './dosimeter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpHandler, HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from '../../../app.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RecordMaintenanceService } from '../record-maintenance.service';
import { of } from 'rxjs';

describe('DosimeterComponent', () => {
  let component: DosimeterComponent;
  let fixture: ComponentFixture<DosimeterComponent>;
  let recordMaintenanceService: RecordMaintenanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, RouterTestingModule, ToastrModule.forRoot() ],
      declarations: [ DosimeterComponent ],
      providers: [ HttpClient, HttpHandler, AppComponent, ToastrService, RecordMaintenanceService ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DosimeterComponent);
    component = fixture.componentInstance;
    recordMaintenanceService = TestBed.get(RecordMaintenanceService);
    spyOn(recordMaintenanceService, 'getAllAccounts').and.returnValue(
      of()
      );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
