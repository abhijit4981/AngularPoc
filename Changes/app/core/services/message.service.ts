import { Injectable } from '@angular/core';
import { ToastrService, ActiveToast } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  /*********************Properties*********************/
  private TOASTR_TYPE = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  };
  /*********************Properties*********************/

  /*********************Constructor*********************/
  constructor(private toastr: ToastrService) {}
  /*********************Constructor*********************/

  /*********************Service Methods*********************/

  success(message: string, title?: string, options?: any) {
    title = title || 'Success';
    return this.showToastrMessage(this.TOASTR_TYPE.SUCCESS, message, title, options);
  }

  error(message: string, title?: string, options?: any) {
    title = title || 'Error';
    return this.showToastrMessage(this.TOASTR_TYPE.ERROR, message, title, options);
  }

  warn(message: string, title?: string, options?: any) {
    title = title || 'Warning';
    return this.showToastrMessage(this.TOASTR_TYPE.WARNING, message, title, options);
  }

  info(message: string, title?: string, options?: any) {
    title = title || 'Information';
    return this.showToastrMessage(this.TOASTR_TYPE.INFO, message, title, options);
  }

  /*********************Service Methods*********************/

  /*********************Private Methods*********************/

  private showToastrMessage(type: string, message: string, title?: string, options?: any): ActiveToast<any> {
    let toast: ActiveToast<any>;
    options = this.getToastrOptions(options);

    switch (type) {
      case this.TOASTR_TYPE.SUCCESS:
        toast = this.toastr.success(message, title, options);
        break;

      case this.TOASTR_TYPE.ERROR:
        toast = this.toastr.error(message, title, options);
        break;

      case this.TOASTR_TYPE.WARNING:
        toast = this.toastr.warning(message, title, options);
        break;

      case this.TOASTR_TYPE.INFO:
        toast = this.toastr.info(message, title, options);
        break;
    }

    return toast;
  }

  private getToastrOptions(options) {
    const defaultToastrOptions = {
      closeButton: true,
      tapToDismiss: false,
      timeOut: 5000,
      positionClass: 'toast-top-right'
    };

    return Object.assign(defaultToastrOptions, options);
  }

  /*********************Private Methods*********************/
}
