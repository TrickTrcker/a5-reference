import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from '../../../shared/local-storage.service';
import * as _ from 'lodash';
import { MasterService } from '../../../services/master.service';
import { AccountsService } from '../../service/accounts.service';
import { SalesService } from '../../../services/sales/sales.service';
import { AmountsToWordsService } from '../../../services/amounts-to-words.service';
import { AppConstant } from '../../../app.constant';
import { UtilsService } from '../../../services/utils.service';
import { FeaturesService } from '../../../services/features.service';
import { PrimengConstant } from '../../../app.primeconfig';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-view-cnote',
  templateUrl: './view-cnote.component.html',
  styleUrls: ['./view-cnote.component.scss']
})
export class ViewCnoteComponent implements OnInit, OnDestroy {
  @Input() crdrid: any;
  invoiceList: Array<any> = [];
  creditDeta: any = {};
  transno: any[];
  invoiceDeta: any;
  userstoragedata: any = {};
  finyear: any = {};
  resources: any = {};
  reqdata: any = {};
  invoicelistdetails: any = {};
  reqinvoicedata: any = {};
  common: any = {};
  invoicelineitems: any = [];
  credit_feature: string = 'Credit Note';
  dataFormat: string;
  currency_Symbol: string;
  GSTTaxTotal: Array<any> = [];
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];
  constructor(
    private masterservice: MasterService,
    private storageservice: LocalStorageService,
    private amountstowordsservice: AmountsToWordsService,
    private accountservice: AccountsService, private salesservice: SalesService,
    private utilservice: UtilsService,
    private featureservice: FeaturesService,
    private _hotkeysService: HotkeysService,
    private router: Router
  ) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeyClose = this._hotkeysService.add(
      new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
        this.router.navigate(['accounts/creditnote']);
        return false;
      }));
    // Download
    this.hotkeyDownload = this._hotkeysService.add(
      new Hotkey(shrtkeys.COMMON.DOWNLOAD.KEY, (event: KeyboardEvent): boolean => {
        this.pdfdownload();
        return false;
      }));
    // this.route.params.subscribe(params => {
    //   if (!_.isEmpty(params)) {
    //     this.crdrid = params.crdrid;
    //     console.log('url params', this.crdrid);
    //   }
    // });
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.resources = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.RESOURCE);
    this.finyear = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.dataFormat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  }

  ngOnInit() {
    //   this.reqdata = {
    //     'crdrid': this.crdrid
    //   };
    //   console.log('credit details', this.crdrid);
    //   if (this.crdrid && this.crdrid != undefined) {
    //     this.loadcreditDetails(this.reqdata);
    //   }
    this.loadcreditDetails();
  }

  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyDownload);
    this._hotkeysService.remove(this.hotkeyClose);
  }
  loadcreditDetails() {
    this.creditDeta = [];
    var reqdata: any = {
      'crdrid': this.crdrid,
      'feature': 'CRNOTE'
    };
    this.accountservice.FindByIDAccounts(reqdata)
      .then((res) => {
        if (res.status) {
          this.creditDeta = res.data[0];
          this.GSTTaxTotal = _.filter(res.data[0].crtaxes, function (tx: any) {
            if (tx.cgst > 0 || tx.sgst > 0 || tx.igst > 0 || tx.amt > 0) {
              return tx;
            }
          });
          console.log(' this.creditDeta', this.creditDeta);
          console.log(' this.creditDeta', this.creditDeta);
          this.transno = this.creditDeta.transno;
          console.log(' this.transno', this.transno);
          this.loadinvoicedetails().then(res => {
            this.invoicelineitems = _.find(this.invoiceList, { invoiceno: this.creditDeta.crdrrefno });
            console.log('  this.invoicelineitems', this.invoicelineitems);
          })
        }
      });
  }
  loadinvoicedetails(): Promise<any> {
    this.invoiceDeta = [];
    var reqinvoicedata: any = {
      'tenantid': this.userstoragedata.tenantid,
      'finyear': this.finyear.finyear,
      'feature': 'invoice',
      'status': this.userstoragedata.status
    };
    return this.salesservice.getInvoiceList(reqinvoicedata).then((res) => {
      if (res.status) {
        this.invoiceList = res.data;
      }
    });
  }
  ruppesinwords(amount) {
    if (amount != undefined) {
      return this.amountstowordsservice.AmountintoWords(amount);
    }
  }

  // PDF Download
  pdfdownload() {
    let data = {} as any;
    data = this.utilservice.getReportParams(AppConstant.REPORTS.ACCOUNTS.CREDIT_REPORT_NAME, this.userstoragedata);
    data.reportparams = 'creditid:' + this.crdrid;
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        console.log(data);
        this.utilservice.saveToFileSystem(data, 'application/pdf', this.creditDeta.transno, '.pdf');
        return data;
      },
      error => {
        console.error(error);
        return error;

      }
      );
  }

}
