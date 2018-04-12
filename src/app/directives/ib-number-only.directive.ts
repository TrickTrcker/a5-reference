import { Directive, ElementRef, HostListener, Input, Output } from '@angular/core';
import * as _ from 'lodash';
@Directive({
  selector: '[ibNumberOnly]'
})
export class IbNumberOnlyDirective {
  @Input() min: number = 1;
  @Input() max: number = 16;
  @Input() decimals: number = 2;
  constructor() { }
  @HostListener('onkeypress', ['$event']) onkeypress(event) {
    let e = event;
    var regexStr: any = '^[0-9]*$';
    if ([8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode == 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode == 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+V
      (e.keyCode == 86 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode == 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    var decimal_allow = true;
    if (e.keyCode == 46) // de
    {
      if (e.target.value.indexOf(".") == -1) {
        return;
      }
      else {
        e.preventDefault();
      }
    }
    let ch = String.fromCharCode(e.keyCode);
    let regEx = new RegExp(regexStr);
    if (regEx.test(ch))
      return;
    else
      e.preventDefault();
  }

  /**
             * Minimum  Maximum value validator.
             */
  minValidator(value) {
    var validatedvalue;
    if (this.min !== undefined) {
      if (!_.isEmpty(value) && (value < this.min)) {
        validatedvalue = this.min;
      } else {
        validatedvalue = value;
      }
    }
    if (this.max !== undefined) {
      if (!_.isEmpty(value) && (value > this.max)) {
        validatedvalue = this.max;
      } else {
        validatedvalue = value;
      }
    }
    var length = this.calculateMaxLength(value);
    console.log("decimal length",length);
  }

  /**
             * Calculate the maximum input length in characters.
             * If no maximum the input will be limited to 16; the maximum ECMA script int.
             */
calculateMaxLength(value) {
  var length = 16;
  if (! _.isEmpty(value)) {
    length = Math.floor(value).toString().length;
  }
  if (this.decimals > 0) {
    // Add extra length for the decimals plus one for the decimal separator.
    length += this.decimals + 1;
  }
  if (this.min < 0) {
    // Add extra length for the - sign.
    length++;
  }
  return length;
}

}
