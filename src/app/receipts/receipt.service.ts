import { Injectable } from '@angular/core';
import { CommonHttpService } from '../shared/common-http.service';
import { AppConstant } from '../app.constant';

@Injectable()
export class ReceiptService {
  deletereceipt: string;
  appendpoint: string;
  receiptcreate: string;
  receiptall: string;
  ReceiptUpdate: string;
  receiptgetbyId: string;
  constructor(private httpService: CommonHttpService) {
    this.appendpoint = AppConstant.API_ENDPOINT;
    this.receiptcreate = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_PAYMENT_RECEIPT.CREATE;
    this.receiptall = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_PAYMENT_RECEIPT.LIST;
    this.ReceiptUpdate = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_PAYMENT_RECEIPT.UPDATE;
    this.receiptgetbyId = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_PAYMENT_RECEIPT.FINDBYID;
    this.deletereceipt = AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.API_URL.TNT_PAYMENT_RECEIPT.DELETE;
  }

  public ReceiptCreate(data: any): Promise<any> {
    return this.httpService.globalPostService(this.receiptcreate, data)
      .then(data => {
        console.log(data);
        return data;
      });

  }
  public ReceiptGetbyId(data: any): Promise<any> {
    return this.httpService.globalPostService(this.receiptgetbyId, data)
      .then(data => {
        console.log(data);
        return data;
      });

  }
  public ReceiptGetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.receiptall, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public UpdateReceipt(data: any): Promise<any> {
    return this.httpService.globalPostService(this.ReceiptUpdate, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public deleteReceipt(data): Promise<any> {
    return this.httpService.globalPostService(this.deletereceipt, data)
      .then(data => {
        return data;
      });
  }
}
