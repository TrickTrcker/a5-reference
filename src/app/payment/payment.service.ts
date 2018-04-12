import { Injectable } from '@angular/core';
import { CommonHttpService } from '../shared/common-http.service';
import { AppConstant } from '../app.constant';

@Injectable()
export class PaymentService {
  appendpoint: string;
  paymentcreate: string;
  paymentall: string;
  paymentgetbyID: string;
  paymentUpdate: string;
  deletepayment:string;

  constructor(private httpService: CommonHttpService) {
    this.appendpoint = AppConstant.API_ENDPOINT;
    this.paymentcreate = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_PAYMENT_RECEIPT.CREATE;
    this.paymentUpdate = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_PAYMENT_RECEIPT.UPDATE;
    this.paymentall = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_PAYMENT_RECEIPT.LIST;
    this.paymentgetbyID = this.appendpoint + AppConstant.API_CONFIG.API_URL.TNT_PAYMENT_RECEIPT.FINDBYID;
    this.deletepayment = AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.API_URL.TNT_PAYMENT_RECEIPT.DELETE;
  }
  public PaymentCreate(data: any): Promise<any> {
    return this.httpService.globalPostService(this.paymentcreate, data)
      .then(data => {
        console.log(data);
        return data;
      });

  }
  public PaymentgetbyID(data: any): Promise<any> {
    return this.httpService.globalPostService(this.paymentgetbyID, data)
      .then(data => {
        console.log(data);
        return data;
      });

  }

  public PaymentGetall(data: any): Promise<any> {
    return this.httpService.globalPostService(this.paymentall, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public UpdatePayment(data: any): Promise<any> {
    return this.httpService.globalPostService(this.paymentUpdate, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public deletePayment(data): Promise<any> {
    return this.httpService.globalPostService(this.deletepayment, data)
      .then(data => {
        return data;
      });
  }

}
