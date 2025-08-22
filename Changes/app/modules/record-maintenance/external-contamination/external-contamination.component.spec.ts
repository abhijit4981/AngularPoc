import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AppComponent } from '../../../app.component';
import { ExternalContaminationComponent } from './external-contamination.component';
import { ParseDatePipe } from '../../../shared/pipes/parse-date.pipe';
import { DialogModule } from '../../../common/confirm-dialog/dialog.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { DialogService } from 'src/app/shared/services/dialog.service';

describe('ExternalContaminationComponent', () => {
  let component: ExternalContaminationComponent;
  let fixture: ComponentFixture<ExternalContaminationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, NgSelectModule, MatDatepickerModule, MatNativeDateModule, DialogModule, ToastrModule.forRoot(),RouterTestingModule],
      providers: [AppComponent, ToastrService, DialogService],
      declarations: [ ExternalContaminationComponent, ParseDatePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalContaminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
