import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { DialogService } from '../../shared/services/dialog.service';
import { ConfirmSaveComponent } from './confirm-save.component';
import { ErrorDialogComponent } from './error-dialog.component'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ConfirmDialogComponent, ConfirmSaveComponent, ErrorDialogComponent],
  exports: [ConfirmDialogComponent, ConfirmSaveComponent, ErrorDialogComponent],
  providers: [DialogService],
  entryComponents: [ConfirmDialogComponent, ConfirmSaveComponent, ErrorDialogComponent]
})
export class DialogModule { }
