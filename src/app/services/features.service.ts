import { Injectable } from '@angular/core';
import { CommonHttpService } from '../shared/common-http.service';
import { AppConstant } from '../app.constant';
import * as _ from "lodash";
import {Http, Response} from '@angular/http';
@Injectable()
export class FeaturesService {
  appendpoint: string;
  acconfiglist_url: string;
  contactlist_url: string;
  invoicetypelist_url: string;
  codemaster_url: string;
  productlist_url: string;
  taxlist_url: string;
  bookofacclist_url: string;
  hsncodelist_url: string;
  saccodelist_url : string;
  accheads_list: string;
  allmodule_list : string;
  tenantmodule_list : string;
  allpaymode: string;
  allpayterm: string;
  logoutUrl : string;
  reportUrl:string;
  screenfeature_urls:string;
  ledgerlist_url:string;
  consultantlogin_url : string;
  constructor(private http:Http,private httpService: CommonHttpService) {
    this.appendpoint = AppConstant.API_ENDPOINT;
    this.acconfiglist_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_ACCOUNTCONFIG.LIST;
    this.contactlist_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.CONTACT.LIST; //new api for contact list instead of contact FINDALL
    this.invoicetypelist_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_ACCOUNTCONFIG.LIST;
    this.codemaster_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_CODEMASTER.LIST;
    this.productlist_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_PRODUCTS.LIST;
    this.taxlist_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_TAXES.LIST;
    this.bookofacclist_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.ACC_BOOKOFACCOUNTS.LIST;
    this.accheads_list = this.appendpoint + AppConstant.API_CONFIG.API_URL.ACC_HEADS.LIST;
    this.allpaymode = this.appendpoint + AppConstant.API_CONFIG.API_URL.PAYTERMS.RECPAYMODE;
    this.allpayterm = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_CODEMASTER.LIST;
    this.hsncodelist_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_PRODUCTS.HSNCODE;
    this.saccodelist_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_PRODUCTS.SACCODE;
    this.logoutUrl = AppConstant.ACCOUNT.BASE_URL+ AppConstant.ACCOUNT.API.LOGOUT;
    this.reportUrl = AppConstant.REPORTS.REPORT;
    // this.screenfeature_urls = AppConstant.API_CONFIG.API_URL.FEATURESCREEN_LIST;
    this.tenantmodule_list = AppConstant.ACCOUNT.BASE_URL + AppConstant.ACCOUNT.MODULES.TENANTLIST;
    this.allmodule_list = AppConstant.ACCOUNT.BASE_URL + AppConstant.ACCOUNT.MODULES.LIST;
    this.screenfeature_urls = AppConstant.ACCOUNT.BASE_URL + AppConstant.ACCOUNT.Role.USERROLELIST;
    this.ledgerlist_url =  this.appendpoint + AppConstant.API_CONFIG.API_URL.REPORTS.LEDGERLIST;
    this.consultantlogin_url = AppConstant.ACCOUNT.BASE_URL + AppConstant.API_CONFIG.API_URL.CONSULTANT.LOGIN;
  }
  public featurescreen_list(roleid)
  {
    // return this.http.get(this.screenfeature_urls)
    // .toPromise()
    // .then(res =>
    //    <any[]> res.json().data
    //   )
    // .then(data => {
    //    return data; 
    //   });
    return this.httpService.globalGetServiceByUrl(this.screenfeature_urls+roleid, "")
    .then(data => {
      console.log(data);
      return data;
    });
    
  }
  // params : type will be Customer,Vendor 
  public contactGetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.contactlist_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }

  // params : Invoice,Bill,Journal,ProfomaInv
  public getacconfigList(data: any): Promise<any> {
    return this.httpService.globalPostService(this.acconfiglist_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }

  // params : Invoice,Bill,Journal,POS
  public getcodemasterList(data: any): Promise<any> {
    return this.httpService.globalPostService(this.codemaster_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }

  public ProductList(data: any): Promise<any> {
    return this.httpService.globalPostService(this.productlist_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public AllModuleList(data: any): Promise<any> {
    return this.httpService.globalPostService(this.allmodule_list, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public TenantModuleList(data: any): Promise<any> {
    return this.httpService.globalPostService(this.tenantmodule_list, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public TaxList(data: any): Promise<any> {
    return this.httpService.globalPostService(this.taxlist_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  // get all book of accounts
  public AccHeadList(data: any): Promise<any> {
    return this.httpService.globalPostService(this.accheads_list, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  // get all book of accounts
  public BookofAccList(data: any): Promise<any> {
    return this.httpService.globalPostService(this.bookofacclist_url, data)
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
  public hsnGetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.hsncodelist_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public sacGetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.saccodelist_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public LogOut(data: any): Promise<any> {
    return this.httpService.globalGetServiceByUrl(this.logoutUrl, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public report(data: any): Promise<any> {
    var header = { 'Accept': 'application/pdf' };
    return this.httpService.globalPostStreamService(this.reportUrl, data,header)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public reportDownload(data: any){
    var header = { 'Accept': 'application/pdf' };
    return this.httpService.HttpBlobPostService(this.reportUrl, data);
  }
  public downloadsamplepdf(data: any) {
    return this.httpService.downloadfile(this.reportUrl, data);
  }
  public getledgerList(data: any): Promise<any> {
    return this.httpService.globalPostService(this.ledgerlist_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public consultantLogin(data: any): Promise<any> {
    return this.httpService.globalPostService(this.consultantlogin_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
}
