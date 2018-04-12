import { Injectable } from '@angular/core';
import { CommonHttpService } from '../../shared/common-http.service';
import { AppConstant } from '../../app.constant';
@Injectable()
export class SalesService {
  invoicedeleteurl: string;
  invoicelist_url: string;
  invoicegetbyid_url: string;
  invoicegetall: string;
  invoicedetails: string;
  appendpoint: string;
  createinvoice_url: string;
  updateinvoice_url: string;
  Bookaccdetails: string;
  cusomeradvancelist: string;
  cusomeradvcreate: string;
  validateinvoice_url:string;
  constructor(private httpService: CommonHttpService) {
    this.appendpoint = AppConstant.API_ENDPOINT;
    this.invoicelist_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_INVOICE.LIST;
    this.invoicegetbyid_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_INVOICE.GETBYID;
    this.invoicegetall = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_INVOICE.FINDALL;
    this.createinvoice_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_INVOICE.CREATE;
    this.updateinvoice_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_INVOICE.UPDATE;
    this.invoicedetails = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_INVOICE.DETAILS;
    this.Bookaccdetails = this.appendpoint + AppConstant.API_CONFIG.API_URL.ACC_BOOKOFACCOUNTS.FINDALL;
    this.cusomeradvancelist = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_BILL.PAYMENTRECEIPTLIST;
    this.cusomeradvcreate = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_BILL.BILLRECEIPT;
    this.invoicedeleteurl = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_INVOICE.DELETE;
    this.validateinvoice_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_INVOICE.VALIDATE;
  }
  public getInvoiceList(data: any): Promise<any> {
    return this.httpService.globalPostService(this.invoicelist_url, data)
      .then(data => {
        return data;
      });
  }

  public getAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.invoicegetall, data)
      .then(data => {
        return data;
      });

  }
  public InvoiceCreate(data: any): Promise<any> {
    return this.httpService.globalPostService(this.createinvoice_url, data)
      .then(data => {
        return data;
      });
  }
  public InvoiceUpdate(data: any): Promise<any> {
    return this.httpService.globalPostService(this.updateinvoice_url, data)
      .then(data => {
        return data;
      });
  }
  public getInvoiceById(data: any): Promise<any> {
    return this.httpService.globalPostService(this.invoicegetbyid_url, data)
      .then(data => {
        return data;
      });
  }
  public getInvoiceDetails(data: any): Promise<any> {
    return this.httpService.globalPostService(this.invoicedetails, data)
      .then(data => {
        return data;
      });

  }
  public getcustomeradv(data: any): Promise<any> {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.API_URL.ADV_RECEIPT.ADVLIST, data)
      .then(data => {
        return data;
      });
  }
  public CustomerAdvgetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.cusomeradvancelist, data)
      .then(data => {
        return data;
      });
  }

  public CustomerAdvanceCreate(data: any): Promise<any> {
    return this.httpService.globalPostService(this.cusomeradvcreate, data)
      .then(data => {
        return data;
      });

  }

  public BookgetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.Bookaccdetails, data)
      .then(data => {
        return data;
      });

  }
  public deleteInvoice(data: any): Promise<any> {
    return this.httpService.globalPostService(this.invoicedeleteurl, data)
      .then(data => {
        return data;
      });

  }
  public validateTransaction(data: any): Promise<any> {
    return this.httpService.globalPostService(this.validateinvoice_url, data)
      .then(data => {
        return data;
      });
  }
}
