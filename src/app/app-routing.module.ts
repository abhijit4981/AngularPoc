import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';
import { LoginComponent } from './modules/login/login.component';

import { RoutePrefix } from './core/constants/routes.constant';
import { AuthGuard } from './core/guards/auth.guard';
import { UnauthorizedComponent } from './common/unauthorized/unauthorized.component';
import { ErrorComponent } from './common/error/error.component';

const appRoutes: Routes = [
  { path: RoutePrefix.Dashboard, component: DashboardComponent },
  { path: RoutePrefix.RecordMaintenance, loadChildren: () => import('./modules/record-maintenance/record-maintenance.module').then(m => m.RecordMaintenanceModule) },
  { path: RoutePrefix.ManageTables, loadChildren: () => import('./modules/manage-tables/manage-tables.module').then(m => m.ManageTablesModule) },
  { path: '', component: DashboardComponent },
  { path: RoutePrefix.Logout, component: LoginComponent },
  { path: RoutePrefix.Unauthorized, component: UnauthorizedComponent },
  { path: RoutePrefix.Error, component: ErrorComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
