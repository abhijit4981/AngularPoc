import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
// Removed deprecated ng-pick-datetime module

import { RecordMaintenanceRoutingModule } from './record-maintenance-routing.module';
import { DosimeterComponent } from './dosimeter/dosimeter.component';
import { InternalContaminationComponent } from './internal-contamination/internal-contamination.component';
import { ExternalContaminationComponent } from './external-contamination/external-contamination.component';
import { CanDeactivateGuard } from 'src/app/core/guards/can-deactivate.guard';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/shared/modules/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    MaterialModule,
    NgSelectModule,
    // Removed deprecated OwlDateTimeModule
    RecordMaintenanceRoutingModule,
  ],
  providers: [CanDeactivateGuard],
  declarations: [DosimeterComponent, InternalContaminationComponent, ExternalContaminationComponent],
})
export class RecordMaintenanceModule { }
