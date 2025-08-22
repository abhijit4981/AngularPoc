import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask'
})
export class MaskInputPipe implements PipeTransform {

  transform(value: any, showMask: boolean): string {
    if(String.isNullOrEmpty(value) || value === undefined) {
      return value;
    }
    if (!showMask || value.length < 5) {
      return value;
    }
    if(/^[0-9]+$/.test(value)) {
      return 'XXXXX' + value.substr(5);
    } else {
      return value;
    }
  }

}
