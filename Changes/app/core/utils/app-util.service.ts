import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppUtilService {

  constructor() { }

  /***************Utility Methods***************/
  static getBaseUrl() {
    return window.location.origin
      ? window.location.origin
      : window.location.protocol + '//' + window.location.host;
  }

  //date format to mm/dd/yy
  static changeDateFormat(dateObj: any) {
    var newDateObj = new Date(dateObj);
    var month = newDateObj.getMonth() + 1;
    var day = newDateObj.getDate();
    var year = newDateObj.getFullYear().toString().slice(2);
    var updatedDay = (day < 10) ? '0' + day : day;
    var updatedMonth = (month < 10) ? '0' + month : month;
    return updatedMonth+'/'+updatedDay+'/'+year;
  } 

  //change date format to mm-dd-yyyy before sending over server for save
  static changeDateToSaveFormat(dateObj: any) {
    if(dateObj !== null){
    var newDateObj = new Date(dateObj);
    var month = newDateObj.getMonth() + 1;
    var day = newDateObj.getDate();
    var year = newDateObj.getFullYear();
    var updatedDay = (day < 10) ? '0' + day : day;
    var updatedMonth = (month < 10) ? '0' + month : month;
    return year+'-'+updatedMonth+'-'+updatedDay;
  }
  else {
    return null;
  }
  }

  //create date object for datepicker at show/edit form
  static createDateObjectForDatepicker(inputDate: any) {
    if(typeof inputDate !== 'object' && inputDate.indexOf('T') > -1) {
      var inputDateArray = inputDate.toString().split('T');
      var inputDateForCal = '';
      if(inputDateArray.length==0) {
        inputDateForCal = inputDateArray[0];
      } else {
        var inputDateArray2 = inputDateArray[0].split('-');
        inputDateForCal = inputDateArray2[1]+'/'+inputDateArray2[2]+'/'+inputDateArray2[0];
      }
      return new Date(inputDateForCal);
    } else {
      return new Date(inputDate);
    }
  }

  //return specified field value from array aafter perfoming some condition
  static getValueFromArray(orgArray: Array<object>, valueToCompare: any, fieldForCondition: string, fieldToReturn: string) {
    let valueToBeReturned = '';
    if(orgArray.length > 0) {
      for (let key=0; key < orgArray.length; key++) {
        if(valueToCompare!==null && valueToCompare==orgArray[key][fieldForCondition]) {
          valueToBeReturned = orgArray[key][fieldToReturn];
          break;
        }
      }
    }
    return valueToBeReturned;
  }
  /***************Utility Methods***************/
}
