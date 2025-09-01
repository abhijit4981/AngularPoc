import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DosimeterComponent } from './dosimeter/dosimeter.component';
import { InternalContaminationComponent } from './internal-contamination/internal-contamination.component';
import { ExternalContaminationComponent } from './external-contamination/external-contamination.component';
import { RoutePrefix } from '../../core/constants/routes.constant';
import { CanDeactivateGuard } from '../../core/guards/can-deactivate.guard';

const rmRoutes: Routes = [
  { path: RoutePrefix.RecordMaintenanceDosimeter, component: DosimeterComponent },
  { path: RoutePrefix.RecordMaintenanceInternalContamination, component: InternalContaminationComponent, canDeactivate: [CanDeactivateGuard] },
  { path: RoutePrefix.RecordMaintenanceExternalContamination, component: ExternalContaminationComponent, canDeactivate: [CanDeactivateGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(rmRoutes)
  ],
  exports: [ RouterModule ],
  declarations: [],
})
export class RecordMaintenanceRoutingModule { }
