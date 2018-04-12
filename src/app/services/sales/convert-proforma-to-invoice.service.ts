import { Injectable } from '@angular/core';
import { SalesService } from './sales.service';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { DateformatPipe } from '../../pipes/dateformat.pipe';
import { AppConstant } from '../../app.constant';
import { LocalStorageService } from '../../shared/local-storage.service';
import { MessagesService } from '../../shared/messages.service';
import { promise } from 'selenium-webdriver';
@Injectable()
export class ConvertProformaToInvoiceService {
  reqinvoice: any;
  invoiceheader: any;
  invoiceDeta: any;
  invoiceDetails: any;
  invoicetaxs: any;
  invoiceLedgers: any;
  userstoragedata: any;
  currentdate : any;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  constructor(
    private salesservice: SalesService,
    private dateFormatPipeFilter: DateformatPipe,
    private storageservice: LocalStorageService,
    private messageservice: MessagesService, ) {
      this.currentdate = this.dateFormatPipeFilter.transform(new Date(), this.date_apiformat)
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
  }
  getinvoiceDetails() {
    var reqdata: any = {
      "invoiceid": this.reqinvoice.invoiceid,
      "feature": this.reqinvoice.feature
    };
    this.salesservice.getInvoiceById(reqdata)
      .then((res) => {
        if (res.status) {
          this.invoiceDeta = _.clone(res.data[0]);
          this.invoiceDetails = _.clone(res.data[0].invoiceDetails);
          this.invoicetaxs = _.clone(res.data[0].invoiceTaxes);
          this.invoiceLedgers = _.clone(res.data[0].ledgers);
          // return this.prepareData();
        }
      });
  }
  prepareData(): Promise<any>  {
    this.invoiceheader = _.clone(this.invoiceDeta);
    /**
    *  prepare header details
    */
    this.invoiceheader.refkey = "INV";
    this.invoiceheader.feature = "Invoice";
    this.invoiceheader.invoicedt = this.currentdate;
    this.invoiceheader.detailid = _.clone(this.invoiceheader.invoiceid);
    this.invoiceheader.createddt = this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat);
    this.invoiceheader.createdby = this.userstoragedata.loginname;
    this.invoiceheader.lastupdateddt = this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat);
    this.invoiceheader.lastupdatedby = this.userstoragedata.loginname;

    delete this.invoiceheader.invoiceid;
    delete this.invoiceheader.invoiceno;
    delete this.invoiceheader.invoiceDetails;
    delete this.invoiceheader.invoiceTaxes;
    delete this.invoiceheader.ledgers;
    delete this.invoiceheader.ledgerCore;
    var currentdate = this.dateFormatPipeFilter.transform(new Date(), this.date_apiformat);

    /**
     *  Map product details
     */
    _.forEach(this.invoiceDetails, (data) => {
      data.detailid = _.clone(data.invoiceid);
      delete data.invoiceitmid;
      delete data.invoiceid;
      delete data.headerid;
    });
    /**
     *  Map taxes details
     */
    _.forEach(this.invoicetaxs, (data) => {
      data.detailid = _.clone(data.invoiceid);
      delete data.invoicetaxid;
      delete data.invoiceid;
    });
    /**
   *  Map taxes details
   */
    _.forEach(this.invoiceLedgers, (data) => {
      data.detailid = _.clone(data.txnid);
      data.ledgerdate = this.currentdate;
      data.createddt = this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat);
      data.createdby = this.userstoragedata.loginname;
      data.lastupdateddt = this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat);
      data.lastupdatedby = this.userstoragedata.loginname;
      data.feature = "Invoice";
      delete data.ledgerid;
      delete data.txnid;
      delete data.txnrefno;
      delete data.ledgerdate;
    });

    var formatteddata = {
      "header": this.invoiceheader,
      "products": this.invoiceDetails,
      "taxes": this.invoicetaxs,
      "ledgers": this.invoiceLedgers
    };
   return this.salesservice.InvoiceCreate(formatteddata)
      .then((res) => {
        // self.msgs = [];
        if (res.status) {
          this.messageservice.showMessage({
            severity: 'success',
            summary: 'Success', detail: res.message
          });

        }
        else {
          this.messageservice.showMessage({
            severity: 'error',
            summary: 'Error', detail: res.message
          }, true);
        }
        return res;
      });
  }
  convertToInoice(invoice) {
    this.reqinvoice = invoice;
    if (this.reqinvoice != "" && this.reqinvoice != undefined && this.reqinvoice != null) {
      return this.getinvoiceDetails();
    }
    else {
      this.reqinvoice = null;
      this.messageservice.showMessage({
        severity: 'error',
        summary: 'Error', detail: "Invalid selection."
      }, true);
      return false;
    }

  }

}
