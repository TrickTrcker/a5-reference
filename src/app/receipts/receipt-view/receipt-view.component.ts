import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import * as _ from "lodash";
import { Router, NavigationExtras } from '@angular/router';
import { ReceiptService } from '../receipt.service';
import { AmountsToWordsService } from '../../services/amounts-to-words.service';
import { Location } from '@angular/common';
import { UtilsService } from '../../services/utils.service';
import { FeaturesService } from '../../services/features.service';
import { HotkeysService, Hotkey } from "angular2-hotkeys";

@Component({
  selector: 'app-receipt-view',
  templateUrl: './receipt-view.component.html',
  styleUrls: ['./receipt-view.component.scss']
})
export class ReceiptViewComponent implements OnInit {
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  @Input() pymtrectid: any;
  receiptData: any = [];
  receiptDetails: any = [];
  userstoragedata: any = {};
  refno: any;
  mode: string;
  constructor(private storageservice: LocalStorageService,
    private route: ActivatedRoute,
    private location: Location,
    private receiptservice: ReceiptService,
    private amountstowordsservice: AmountsToWordsService,
    private router: Router,
    private utilservice: UtilsService,
    private featureservice: FeaturesService,
    private _hotkeysService: HotkeysService) {
    // Back to list form
    this._hotkeysService.add(new Hotkey('backspace', (event: KeyboardEvent): boolean => {
      this.router.navigate(['/receipts/list']);
      return false;
    }));
    // Download
    this._hotkeysService.add(new Hotkey('shift+d', (event: KeyboardEvent): boolean => {
      this.pdfdownload();
      return false;
    }));
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.route.params.subscribe(params => {
      if (!_.isEmpty(params)) {
        this.pymtrectid = params.pymtrectid;
        this.mode = params.receipt;
      }
    });
  }

  ngOnInit() {
    if (this.pymtrectid && this.pymtrectid != undefined) {
      this.loadReceipts();
    }
  }

  redirecttoprev() {
    if (this.mode == "fromledger") {
      this.router.navigate(['/reports/trailbalance']);
    }
    else if (this.mode == "receipt") {
      this.router.navigate(['/receipts/list']);
    }
    this.location.back();
  }

  loadReceipts() {
    this.receiptservice.ReceiptGetbyId({
      "paymentReceiptid": this.pymtrectid,
      "feature": "Receipt"
    })
      .then((res) => {
        if (res.status) {
          this.receiptData = res.data[0];
          this.receiptDetails = this.receiptData.details[0];
        }
        else {
          this.receiptData = [];
          this.receiptDetails = [];
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
    data = this.utilservice.getReportParams(AppConstant.REPORTS.RECEIPT.RECEIPT_REPORT_NAME, this.userstoragedata);
    data.reportparams = 'receiptid:' + this.pymtrectid;
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        console.log(data);
        this.utilservice.saveToFileSystem(data, "application/pdf", this.receiptData.pymtrectno, ".pdf");
        return data;
      },
      error => {
        console.error(error);
        return error;

      }
      );
  }

}
