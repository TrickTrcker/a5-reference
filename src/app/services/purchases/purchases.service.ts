import { Injectable } from '@angular/core';
import { CommonHttpService } from '../../shared/common-http.service';
import { AppConstant } from '../../app.constant';
@Injectable()
export class PurchasesService {
  validatebill_url: string;
  billDelete: string;
  billlist_url: string;
  billgetbyid_url: string;
  updatebill_url: string;
  invoicegetall: string;
  invoicedetails: string;
  appendpoint: string;
  createbill: string;
  Bookaccdetails: any;
  vendoradvlist: any;
  constructor(private httpService: CommonHttpService) {
    this.appendpoint = AppConstant.API_ENDPOINT;
    this.billlist_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_BILL.LIST;
    this.billgetbyid_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_BILL.GETBYID;
    this.updatebill_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_BILL.UPDATE;
    this.invoicegetall = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_BILL.FINDALL;
    this.createbill = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_BILL.CREATE;
    this.invoicedetails = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_BILL.DETAILS;
    this.Bookaccdetails = this.appendpoint + AppConstant.API_CONFIG.API_URL.ACC_BOOKOFACCOUNTS.FINDALL;
    this.vendoradvlist = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_BILL.PAYMENTRECEIPTLIST;
    this.billDelete =this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_BILL.DELETE;
    this.validatebill_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_INVOICE.VALIDATE;
    
  }
  public getBillList(data: any): Promise<any> {
    return this.httpService.globalPostService(this.billlist_url, data)
      .then(data => {
        console.log(data);
        return data;
      });

  }
  public getAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.invoicegetall, data)
      .then(data => {
        console.log(data);
        return data;
      });

  }
  public getInvoiceDetails(data: any): Promise<any> {
    return this.httpService.globalPostService(this.invoicedetails, data)
      .then(data => {
        console.log(data);
        return data;
      });

  }
  public getcustomeradv(data: any): Promise<any> {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.API_URL.ADV_RECEIPT.ADVLIST, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public BillCreate(data: any): Promise<any> {
    return this.httpService.globalPostService(this.createbill, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public BillUpdate(data: any): Promise<any> {
    return this.httpService.globalPostService(this.updatebill_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public getBillById(data: any): Promise<any> {
    return this.httpService.globalPostService(this.billgetbyid_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }

  public getVendoradvlist(data: any): Promise<any> {
    return this.httpService.globalPostService(this.vendoradvlist, data)
      .then(data => {
        console.log(data);
        return data;
      });

  }
  public BookgetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.Bookaccdetails, data)
      .then(data => {
        console.log(data);
        return data;
      });

  }
  public deleteBill(data: any): Promise<any> {
    return this.httpService.globalPostService(this.billDelete, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public validateTransaction(data: any): Promise<any> {
    return this.httpService.globalPostService(this.validatebill_url, data)
      .then(data => {
        return data;
      });
  }
}
