import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpHandler, HttpClient } from '@angular/common/http';
import { AppComponent } from '../../app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DashboardService } from './dashboard.service';
import { PublisherService } from '../../core/services/publisher.service';
import { of } from 'rxjs';
import { TEST_TYPE_REF , TEST_TYPE_GROUP, TEST_LOCATION } from '../test.data';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: DashboardService;
  let appComponent: AppComponent;
  let publisherService: PublisherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, RouterTestingModule, ToastrModule.forRoot() ],
      declarations: [ DashboardComponent ],
      providers: [ HttpClient, 
        HttpHandler, AppComponent,
        ToastrService, DashboardService, PublisherService ],
      schemas : [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    appComponent = TestBed.get(AppComponent);
    appComponent.allLocationMasterData = TEST_LOCATION;
    appComponent.allTypeRefMasterData = TEST_TYPE_REF;
    appComponent.allTypeGroupMasterData = TEST_TYPE_GROUP;
    dashboardService = TestBed.get(DashboardService);
    publisherService = TestBed.get(PublisherService);
    spyOn(dashboardService, 'getAllCounts').and.returnValue(
      of()
      );
    spyOn(dashboardService, 'getRecordListEDR').and.returnValue(
      of()
      );
    publisherService.notifyAllTypeRefs(true);
    publisherService.notifyAllLocations(true);
    publisherService.notifyPopupModalOpen(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* it('test login controller oninit', () => {
   component.loadAllLocations();
   component.loadAllTypeRefs();
   expect(component.allLocations.length).toEqual(1);
   expect(component.allTypeRefs.length).toEqual(13);
   expect(component.allBadgeUseTypeRefs.length).toEqual(1);
  }); */
  
  /* it('test counts', () => {
    component.getCounts();
    expect(dashboardService.getAllCounts).toHaveBeenCalled();
  }); */

  /* it('test record list EDR', () => {
    component.getAllRecordListEDR();
    expect(dashboardService.getRecordListEDR).toHaveBeenCalled();
  }); */
});
