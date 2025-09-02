import {HostListener} from "@angular/core";
import { Observable } from "rxjs";

export interface ComponentCanDeactivate {
 
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;

    /* @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (!this.canDeactivate()) {
            $event.returnValue = true;
        }
    } */
}