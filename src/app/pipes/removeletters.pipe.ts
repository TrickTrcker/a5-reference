import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeletters'
})
export class RemovelettersPipe implements PipeTransform {
  transform(value: string) {

    let myTransformed: string[] = [];

    for (var i = 0; i < value.length; i++) {
      if (!this.isLetter(value[i])) {
        myTransformed.push(value[i])
      }
    }

    return myTransformed.join("");
  }
  isLetter(c) {
    return c.toLowerCase() != c.toUpperCase();
  }
}
