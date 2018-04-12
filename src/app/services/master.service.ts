import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl,FormArray } from '@angular/forms';
import { CommonHttpService } from '../shared/common-http.service';
import { AppConstant } from '../app.constant';
import * as _ from "lodash";
@Injectable()
export class MasterService {
  appendpoint: string;
  allcontacts: string;
  timezone: string;
  allinvoicetype: string;
  findtaxdetails: string;
  gsttaxall: string;
  getbookofacc: string;
  gerbookdetails : string;
  seqgen: string;
  acconfig: string;
  acconfiglisturl: string;
  allpayterm: string;
  allpaymode: string;
  currency:string;
  constructor(private httpService: CommonHttpService) {
    this.appendpoint = AppConstant.API_ENDPOINT;

    //start new api integration 
    this.allcontacts = this.appendpoint + AppConstant.API_CONFIG.API_URL.CONTACT.LIST; //new api for contact list instead of contact FINDALL
    this.acconfiglisturl = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_ACCOUNTCONFIG.LIST;
    this.getbookofacc = this.appendpoint + AppConstant.API_CONFIG.API_URL.ACC_BOOKOFACCOUNTS.LIST;
    this.gerbookdetails = this.appendpoint + AppConstant.API_CONFIG.API_URL.SUBLEDGER.FINDBYID;
    // end
    this.timezone = AppConstant.ACCOUNT.BASE_URL + AppConstant.API_CONFIG.API_URL.TIMEZONE.LIST;
    this.currency = AppConstant.ACCOUNT.BASE_URL + AppConstant.API_CONFIG.API_URL.CURRENCY.LIST;
    this.allinvoicetype = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_JOURNAL.FEATURE;
    this.findtaxdetails = this.appendpoint + AppConstant.API_CONFIG.API_URL.TAX.FINDALL;
    this.gsttaxall = this.appendpoint + AppConstant.API_CONFIG.API_URL.TAXES.GSTFINDALL;

    this.acconfig = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_INVOICE.ACCCONFIG;
    this.seqgen = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_INVOICE.SEQ;
    this.allpaymode = this.appendpoint + AppConstant.API_CONFIG.API_URL.PAYTERMS.RECPAYMODE;
    this.allpayterm = this.appendpoint + AppConstant.API_CONFIG.API_URL.PAYTERMS.RECPAYTERM;
  }
  public contactGetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.allcontacts, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
   public currencyGetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.currency, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
   public timeZoneGetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.timezone, data)
      .then(data => {
        console.log("-0-000-",data);
        return data;
      });
  }
  public taxFindAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.findtaxdetails, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public GSTTaxGetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.gsttaxall, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public BookGetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.getbookofacc, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public BookGetById(data: any): Promise<any> {
    return this.httpService.globalGetServiceByUrl(this.gerbookdetails, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public getacconfigList(data: any): Promise<any> {
    return this.httpService.globalPostService(this.acconfiglisturl, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public getacconfig(data: any): Promise<any> {
    return this.httpService.globalPostService(this.acconfig, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public seqgenerator(data: any): Promise<any> {
    return this.httpService.globalPostService(this.seqgen, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public invoiceTypeGetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.allinvoicetype, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public paytermGetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.allpayterm, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public paymodeGetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.allpaymode, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public formatDataforDropdown(label,data, Placeholdervalue?) {
    let formatdata = [];
    let customdata = {
      label: null,
      value: null
    };
    if (!_.isEmpty(Placeholdervalue)) {
      formatdata.push({
        label: Placeholdervalue,
        value: null
      });
    }

    _.forEach(data, function (value) {
      var shallow = _.clone(customdata);
      shallow.label = value[label];
      shallow.value = value;
      formatdata.push(shallow);
    });
    return formatdata;
  }
  public filterformatDataforDropdown(label,data, Placeholdervalue?) {
    let formatdata = [];
    let customdata = {
      label: null,
      value: null
    };
    if (!_.isEmpty(Placeholdervalue)) {
      formatdata.push({
        label: Placeholdervalue,
        value: null
      });
    }

    _.forEach(data, function (value) {
      var shallow = _.clone(customdata);
      shallow.label = value[label];
      shallow.value = value[label];
      formatdata.push(shallow);
    });
    return formatdata;
  }
  public productHsnCodeDropdown(label,label2, data, Placeholdervalue?) {
    let formatdata = [];
    let customdata = {
      label: null,
      value: null
    };
    if (!_.isEmpty(Placeholdervalue)) {
      formatdata.push({
        label: Placeholdervalue,
        value: null
      });
    }

    _.forEach(data, function (value) {
      var shallow = _.clone(customdata);
      shallow.label = value[label]+"-"+value[label2];
      shallow.value = value;
      formatdata.push(shallow);
    });
    return formatdata;
  }
  getFormErrorMessage(formGroupObj : FormGroup,errorObj:any){
    for (let i in formGroupObj.controls) {
              var formControlObj = formGroupObj.controls[i];
             if ( formControlObj instanceof FormControl) {
                  if(formControlObj.errors) {
                     return errorObj[i][Object.keys(formControlObj.errors)[0]];
                  }
              }
        }
        
  }

}
