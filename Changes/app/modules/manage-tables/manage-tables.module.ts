import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
// Removed deprecated ng-pick-datetime module

import { ManageTablesRoutingModule } from './manage-tables-routing.module';
import { CrossReferencesComponent } from './cross-references/cross-references.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    // Removed deprecated OwlDateTimeModule
    NgSelectModule,
    ManageTablesRoutingModule
  ],
  declarations: [CrossReferencesComponent, PreferencesComponent]
})
export class ManageTablesModule { }
