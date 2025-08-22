import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CrossReferencesComponent } from './cross-references/cross-references.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { RoutePrefix } from '../../core/constants/routes.constant';
import { CanDeactivateGuard } from 'src/app/core/guards/can-deactivate.guard';

const mtRoutes: Routes = [
  { path: '', component: CrossReferencesComponent },
  { path: RoutePrefix.ManageTablesCrossReferences, component: CrossReferencesComponent, canDeactivate: [CanDeactivateGuard] },
  { path: RoutePrefix.ManageTablesPreferences, component: PreferencesComponent, canDeactivate: [CanDeactivateGuard] } 
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(mtRoutes)
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class ManageTablesRoutingModule { }
