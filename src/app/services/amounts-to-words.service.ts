import { Injectable } from '@angular/core';

@Injectable()
export class AmountsToWordsService {

  constructor() { }
  public convert_rupees(junkVal) {
    var numReversed, actnumber: any;
    // var junkVal=document.getElementById('rupees').value;
    junkVal = Math.floor(junkVal);
    var obStr = new String(junkVal);
    numReversed = obStr.split("");
    actnumber = numReversed.reverse();
    if (Number(junkVal) >= 0) {
      //do nothing
    }
    else {
      // alert('wrong Number cannot be converted');
      return false;
    }
    if (Number(junkVal) == 0) {
      // document.getElementById('container').innerHTML = obStr + '' + 'Rupees Zero Only';
      return false;
    }
    if (actnumber.length > 9) {
      // alert('Oops!!!! the Number is too big to covertes');
      return false;
    }
    var iWords = ["Zero", " One", " Two", " Three", " Four", " Five", " Six", " Seven", " Eight", " Nine"];
    var ePlace = ['Ten', ' Eleven', ' Twelve', ' Thirteen', ' Fourteen', ' Fifteen', ' Sixteen', ' Seventeen', ' Eighteen', 'Nineteen'];
    var tensPlace = ['dummy', ' Ten', ' Twenty', ' Thirty', ' Forty', ' Fifty', ' Sixty', ' Seventy', ' Eighty', ' Ninety'];
    var iWordsLength = numReversed.length;
    var totalWords = "";
    var inWords = new Array();
    var finalWord = "";
    var j = 0;
    for (var i = 0; i < iWordsLength; i++) {
      switch (i) {
        case 0:
          if (actnumber[i] == 0 || actnumber[i + 1] == 1) {
            inWords[j] = '';
          }
          else {
            inWords[j] = iWords[actnumber[i]];
          }
          inWords[j] = inWords[j];
          break;
        case 1:
          tens_complication();
          break;
        case 2:
          if (actnumber[i] == 0) {
            inWords[j] = '';
          }
          else if (actnumber[i - 1] != 0 && actnumber[i - 2] != 0) {
            inWords[j] = iWords[actnumber[i]] + ' Hundred and';
          }
          else {
            inWords[j] = iWords[actnumber[i]] + ' Hundred';
          }
          break;
        case 3:
          if (actnumber[i] == 0 || actnumber[i + 1] == 1) {
            inWords[j] = '';
          }
          else {
            inWords[j] = iWords[actnumber[i]];
          }
          if (actnumber[i + 1] != 0 || actnumber[i] > 0) { //here
            inWords[j] = inWords[j] + " Thousand";
          }
          break;
        case 4:
          tens_complication();
          break;
        case 5:
          if (actnumber[i] == "0" || actnumber[i + 1] == 1) {
            inWords[j] = '';
          }
          else {
            inWords[j] = iWords[actnumber[i]];
          }
          if (actnumber[i + 1] != 0 || actnumber[i] > 0) {   //here 
            inWords[j] = inWords[j] + " Lakh";
          }
          break;
        case 6:
          tens_complication();
          break;
        case 7:
          if (actnumber[i] == "0" || actnumber[i + 1] == 1) {
            inWords[j] = '';
          }
          else {
            inWords[j] = iWords[actnumber[i]];
          }
          if (actnumber[i + 1] != 0 || actnumber[i] > 0) { // changed here
            inWords[j] = inWords[j] + " Crore";
          }
          break;
        case 8:
          tens_complication();
          break;
        default:
          break;
      }
      j++;
    }
    function tens_complication() {
      if (actnumber[i] == 0) {
        inWords[j] = '';
      }
      else if (actnumber[i] == 1) {
        inWords[j] = ePlace[actnumber[i - 1]];
      }
      else {
        inWords[j] = tensPlace[actnumber[i]];
      }
    }
    inWords.reverse();
    for (i = 0; i < inWords.length; i++) {
      finalWord += inWords[i];
    }
    return finalWord;
  }
  AmountintoWords(amount) {
    var finalWord1 = this.convert_rupees(amount);
    if(finalWord1 == false)
    {
      finalWord1 = " Zero ";
    }
    var finalWord2 = " Only";
    var val = amount;
    var actual_val = amount;
    // document.getElementById('rupees').value = val;
    if (val.indexOf('.') != -1) {
      val = val.substring(val.indexOf('.') + 1, val.length);
      var decimal= val.substring(val.length , val.indexOf(":")+1);
      if (parseInt(decimal) > 0) {
        finalWord2 = " and "+ this.convert_rupees(decimal) + " paisa only";
      }
      else {
        finalWord2 = " only";
      }

    }
    else {
      // finalWord2 =  " Zero paisa only";
      finalWord2 = "  Only";
    }
    return "Rupees" + finalWord1 + finalWord2;
  }

}
