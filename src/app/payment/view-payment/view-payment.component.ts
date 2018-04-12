import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import * as _ from "lodash";
import { PaymentService } from '../payment.service';
import { Router, NavigationExtras } from '@angular/router';
import { AmountsToWordsService } from '../../services/amounts-to-words.service';
import { Location } from '@angular/common';
import { UtilsService } from '../../services/utils.service';
import { FeaturesService } from '../../services/features.service';
import { HotkeysService, Hotkey } from "angular2-hotkeys";

@Component({
  selector: 'app-view-payment',
  templateUrl: './view-payment.component.html',
  styleUrls: ['./view-payment.component.scss']
})
export class ViewPaymentComponent implements OnInit {
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  @Input()
  pymtrectid: any;
  paymentData: any = [];
  paymentDetails: any = [];
  userstoragedata: any = {};
  refno: any;
  mode: string;
  pymtrectno: any;
  constructor(
    private storageservice: LocalStorageService,
    private amountstowordsservice: AmountsToWordsService,
    private location: Location,
    private route: ActivatedRoute,
    private paymentservice: PaymentService,
    private router: Router,
    private utilservice: UtilsService,
    private featureservice: FeaturesService,
    private _hotkeysService: HotkeysService) {
    // Back to list form
    this._hotkeysService.add(new Hotkey('backspace', (event: KeyboardEvent): boolean => {
      this.router.navigate(['/payment/list']);
      return false;
    }));
    // Download
    this._hotkeysService.add(new Hotkey('shift+d', (event: KeyboardEvent): boolean => {
      this.pdfdownload();
      return false;
    }));
    this.userstoragedata = this.storageservice.getItem(
      AppConstant.API_CONFIG.LOCALSTORAGE.USER
    );
    this.route.params.subscribe(params => {
      if (!_.isEmpty(params)) {
        this.pymtrectid = params.pymtrectid;
        this.mode = params.payment;
      }
    });
  }

  ngOnInit() {
    if (this.pymtrectid && this.pymtrectid != undefined) {
      this.loadPayments();
    }

  }

  redirecttoprev() {
    if (this.mode == "fromledger") {
      this.router.navigate(['/reports/trailbalance']);
    }
    else if (this.mode == "payment") {
      this.router.navigate(['/payment/list']);
    }
    this.location.back();
  }
  loadPayments() {
    this.paymentservice.PaymentgetbyID({
      paymentReceiptid: this.pymtrectid,
      feature: "payment"

    })

      .then((res) => {

        if (res.status) {
          this.paymentData = res.data[0];
          this.paymentDetails = this.paymentData.details[0];
          this.pymtrectno = this.paymentData.pymtrectno;
          console.log(this.pymtrectid);
        }
        else {
          this.paymentData = [];
          this.paymentDetails = [];
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
    data = this.utilservice.getReportParams(AppConstant.REPORTS.PAYMENT.PAYMENT_REPORT_NAME, this.userstoragedata);
    data.reportparams = 'paymentid:' + this.pymtrectid;
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        console.log(data);
        this.utilservice.saveToFileSystem(data, "application/pdf", this.paymentData.pymtrectno, ".pdf");
        return data;
      },
      error => {
        console.error(error);
        return error;

      }
      );
  }
}

