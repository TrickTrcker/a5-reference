import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from "@angular/common";

@Pipe({
  name: 'currencyformat'
})
export class CurrencyformatPipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) { }
  transform(value: any, currencyCode?: string, symbolDisplay?: boolean, digits?: string): string {
    let transformed = this.currencyPipe.transform(value, currencyCode, symbolDisplay, digits);
    let myTransformed: string[] = [];
    for (var i = 0; i < transformed.length; i++) {
      if (!this.isLetter(transformed[i])) {
        myTransformed.push(transformed[i])
      }
    }
    return myTransformed.join("");
  }
  isLetter(c) {
    return c.toLowerCase() != c.toUpperCase();
  }
}
