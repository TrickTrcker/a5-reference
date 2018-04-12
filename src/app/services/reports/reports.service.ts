import { Injectable } from '@angular/core';
import { CommonHttpService } from '../../shared/common-http.service';
import { AppConstant } from '../../app.constant'

@Injectable()
export class ReportService {
  appendpoint: string;
  trailbalance_url: string;
  ledger_url: string;
  filterledger_url: string;
  balancesheet_url: string;
  profitandloss_url: string;
  invoicereportlist: string;
  billreportlist: string;
  daybook_url: string;
  outstanding_inv: string;
  bill_taxation: string;
  Inv_taxation:string;
  taxsum_url:string;
  outstanding_pay:string;
  payrecreportlist :any;
  constructor(private httpService: CommonHttpService) {
    this.appendpoint = AppConstant.API_ENDPOINT;
    this.trailbalance_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.REPORTS.TB;
    this.ledger_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.BOOKOFACCOUNTS.LIST;
    this.filterledger_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.REPORTS.LEDGER;
    this.balancesheet_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.REPORTS.BALANCESHEET;
    this.profitandloss_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.REPORTS.PL;
    this.invoicereportlist = this.appendpoint + AppConstant.API_CONFIG.API_URL.REPORTS.INVOICEREG;
    this.billreportlist = this.appendpoint + AppConstant.API_CONFIG.API_URL.REPORTS.BILLREG;
    this.payrecreportlist = this.appendpoint + AppConstant.API_CONFIG.API_URL.REPORTS.PAYRECLIST;
    this.daybook_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.REPORTS.DAYBOOK;
    this.outstanding_inv = this.appendpoint + AppConstant.API_CONFIG.API_URL.REPORTS.OUTSTAND_INV;
    this.bill_taxation =  this.appendpoint + AppConstant.API_CONFIG.API_URL.REPORTS.BILL_TAX;
    this.Inv_taxation = this.appendpoint + AppConstant.API_CONFIG.API_URL.REPORTS.INV_TAX;
    this.taxsum_url = this.appendpoint + AppConstant.API_CONFIG.API_URL.REPORTS.TAX_SUM;
    this.outstanding_pay = this.appendpoint + AppConstant.API_CONFIG.API_URL.REPORTS.OUTSTAND_PAY;
  }
   //Invoice Taxation report added on 09/02/18
   public getInvTaxReport(data: any): Promise<any> {
    return this.httpService.globalPostService(this.Inv_taxation, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  //Bill Taxation report added on 09/02/18
  public getBillTaxReport(data: any): Promise<any> {
    return this.httpService.globalPostService(this.bill_taxation, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  //outstandinginvoice report added on 07/02/18
  public getOutstandingreport(data: any): Promise<any> {
    return this.httpService.globalPostService(this.outstanding_inv, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  //outstandingPayment report added on 15/02/18
  public getOutstandingPayment(data: any): Promise<any> {
    return this.httpService.globalPostService(this.outstanding_pay, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  //DayBook added on 07/02/18
  public getDBreport(data: any): Promise<any> {
    return this.httpService.globalPostService(this.daybook_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  //DayBook added on 14/02/18
  public getTaxSumreport(data: any): Promise<any> {
    return this.httpService.globalPostService(this.taxsum_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public getTBreport(data: any): Promise<any> {
    return this.httpService.globalPostService(this.trailbalance_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public getLedgerlist(data: any): Promise<any> {
    return this.httpService.globalPostService(this.ledger_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public getFilteredLedgerlist(data: any): Promise<any> {
    return this.httpService.globalPostService(this.filterledger_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public getBalanceSheetreport(data: any): Promise<any> {
    return this.httpService.globalPostService(this.balancesheet_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public getProfitandLossreport(data: any): Promise<any> {
    return this.httpService.globalPostService(this.profitandloss_url, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public GetInvoiceReportlist(data: any): Promise<any> {
    return this.httpService.globalPostService(this.invoicereportlist, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public GetBillReportlist(data: any): Promise<any> {
    return this.httpService.globalPostService(this.billreportlist, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
  public GetPayRecReportlist(data: any): Promise<any> {
    return this.httpService.globalPostService(this.payrecreportlist, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
}
