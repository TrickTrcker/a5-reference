import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
@Pipe({
  name: 'dateformatpipe'
})
export class DateformatPipe implements PipeTransform {

  transform(value: any, args: any): any {
    var parsedDate = Date.parse(value);
    if (isNaN(parsedDate)) {
        return "";
    }
    else {
        return new DatePipe("en-US").transform(new Date(parsedDate), args);
    }
}

}
