import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'parseDate'
})
export class ParseDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(typeof value === 'object' && value !== null) {
      return moment(new Date(value)).format('MM/DD/YYYY');
    } else {
      if(value.indexOf('T') > -1) {
        var dateArray = value.toString().split('T');
        if(dateArray.length == 0) {
          return dateArray[0];
        } else {
          var dateArray2 = dateArray[0].split('-');
          return dateArray2[1]+'/'+dateArray2[2]+'/'+dateArray2[0];
        }
      } else if(value.indexOf('T')==-1 && value.indexOf('-') > -1) {
        var dateArray2 = value.split('-');
        return dateArray2[1]+'/'+dateArray2[2]+'/'+dateArray2[0];
      } else if(value.indexOf('/') > -1) {
        return value;
      }
    }
  }

}
