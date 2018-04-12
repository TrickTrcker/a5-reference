import { Component, OnInit,OnDestroy, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../../shared/local-storage.service';
import * as _ from 'lodash';
import { MasterService } from '../../../services/master.service';
import { AccountsService } from '../../service/accounts.service';
import { PurchasesService } from '../../../services/purchases/purchases.service';
import { AmountsToWordsService } from '../../../services/amounts-to-words.service';
import { AppConstant } from '../../../app.constant'
import { UtilsService } from '../../../services/utils.service';
import { FeaturesService } from '../../../services/features.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { PrimengConstant } from '../../../app.primeconfig';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-view-dnote',
  templateUrl: './view-dnote.component.html',
  styleUrls: ['./view-dnote.component.scss']
})
export class ViewDnoteComponent implements OnInit, OnDestroy {
  @Input() crdrid: any;
  transno: any;
  billList: Array<any> = [];
  debitData: any = [];
  userstoragedata: any = {};
  finyear: any = {};
  resources: any = {};
  reqdata: any = {};
  reqinvoicedata: any = {};
  billData: any;
  billlineitems: any = [];
  credit_feature: string = 'Debit Note';
  dataFormat: string;
  currency_Symbol: string;
  GSTTaxTotal: any[] = [];
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];
  constructor(
    private masterservice: MasterService,
    private storageservice: LocalStorageService,
    private amountstowordsservice: AmountsToWordsService,
    private route: ActivatedRoute,
    private accountservice: AccountsService,
    private billservice: PurchasesService,
    private utilservice: UtilsService,
    private featureservice: FeaturesService,
    private _hotkeysService: HotkeysService,
    private router: Router
  ) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeyClose = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['accounts/debitnote']);
      return false;
    }));
    // Download
    this.hotkeyDownload = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.DOWNLOAD.KEY, (event: KeyboardEvent): boolean => {
      this.pdfdownload();
      return false;
    }));
    this.route.params.subscribe(params => {
      if (!_.isEmpty(params)) {
        this.crdrid = params.crdrid;
      }
    });
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.resources = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.RESOURCE);
    this.finyear = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.dataFormat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyDownload);
    this._hotkeysService.remove(this.hotkeyClose);
  }
  ngOnInit() {
    this.reqdata = {
      'crdrid': this.crdrid
    };
    if (this.crdrid && this.crdrid != undefined) {
      this.loaddebitDetails(this.reqdata);
    }
  }
  loaddebitDetails(reqdata) {
    this.debitData = [];
    var reqdata: any = {
      'crdrid': this.crdrid,
      'feature': 'DRNOTE'
    };
    this.accountservice.FindByIDAccounts(reqdata)
      .then((res) => {
        if (res.status) {
          this.debitData = res.data[0];
          console.log(' this.debitData', this.debitData)
          this.GSTTaxTotal = _.filter(res.data[0].crtaxes, function (tx: any) {
            if (tx.cgst > 0 || tx.sgst > 0 || tx.igst > 0 || tx.amt > 0) {
              return tx;
            }
          });
          this.transno = this.debitData.transno;
          this.loadbilldetails().then(res => {
            this.billlineitems = _.find(this.billList, { billno: this.debitData.crdrrefno });
          })
        }
      });

  }
  loadbilldetails(): Promise<any> {
    this.billData = [];
    var reqinvoicedata: any = {
      'tenantid': this.userstoragedata.tenantid,
      'finyear': this.finyear.finyear,
      'feature': 'bill',
      'status': this.userstoragedata.status
    };
    return this.billservice.getBillList(reqinvoicedata).then((res) => {
      this.billList = res.data;
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
    data = this.utilservice.getReportParams(AppConstant.REPORTS.ACCOUNTS.DEBIT_REPORT_NAME, this.userstoragedata);
    data.reportparams = 'debitid:' + this.crdrid;
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        console.log(data);
        this.utilservice.saveToFileSystem(data, 'application/pdf', this.debitData.transno, '.pdf');
        return data;
      },
      error => {
        console.error(error);
        return error;

      }
      );
  }

}
