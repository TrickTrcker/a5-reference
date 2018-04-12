import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from "@angular/router";
import { LocalStorageService } from '../../../shared/local-storage.service';
import * as _ from "lodash";
import { MasterService } from '../../../services/master.service';
import { PaymentService } from '../../../../app/payment/payment.service';
import { AmountsToWordsService } from '../../../services/amounts-to-words.service';
import { AppConstant } from '../../../app.constant'
import { UtilsService } from '../../../services/utils.service';
import { FeaturesService } from '../../../services/features.service';
import { HotkeysService, Hotkey } from "angular2-hotkeys";
@Component({
  selector: 'app-view-vendor-advance',
  templateUrl: './view-vendor-advance.component.html',
  styleUrls: ['./view-vendor-advance.component.scss']
})
export class ViewVendorAdvanceComponent implements OnInit {
  @Input()
  pymtrectid: any;
  vend_advanceData: any;
  vend_advancedatas: any = [];
  vend_advancetaxs: Array<any> = [];
  userstoragedata: any = {};
  resources: any = {};
  reqdata: any = {};
  vend_advance_feature: string = "Vendor Advance";
  dataFormat: string;
  currency_Symbol: string;
  pymtrectno: any;
  constructor(
    private masterservice: MasterService,
    private amountstowordsservice: AmountsToWordsService,
    private storageservice: LocalStorageService,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private utilservice: UtilsService,
    private featureservice: FeaturesService,
    private _hotkeysService: HotkeysService,
    private router: Router
  ) {

    // Back to list form
    this._hotkeysService.add(new Hotkey('backspace', (event: KeyboardEvent): boolean => {
      this.router.navigate(['/purchase/vendoradvance']);
      return false;
    }));
    // Download
    this._hotkeysService.add(new Hotkey('shift+d', (event: KeyboardEvent): boolean => {
      this.pdfdownload();
      return false;
    }));
    this.route.params.subscribe(params => {
      if (!_.isEmpty(params)) {
        this.pymtrectid = params.pymtrectid;
        console.log("url params", params);
      }
    });

    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.resources = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.RESOURCE);
    this.dataFormat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  }

  ngOnInit() {
    this.reqdata = {
      "pymtrectid": this.pymtrectid
    };
    console.log("vendordetails", this.pymtrectid);
    if (this.pymtrectid && this.pymtrectid != undefined) {
      this.loadvend_advanceDetails(this.reqdata);
    }
  }
  loadvend_advanceDetails(reqdata) {
    this.vend_advanceData = [];
    var reqdata: any = {
      "paymentReceiptid": this.pymtrectid,
      "feature": "Payment"
    };
    this.paymentService.PaymentgetbyID(reqdata)
      .then((res) => {

        if (res.status) {
          this.vend_advanceData = res.data[0];
          this.vend_advancedatas = res.data[0].details[0];
          this.pymtrectno = this.vend_advanceData.pymtrectno;
          console.log("Vendor adv data: ", JSON.stringify(this.vend_advanceData));
          console.log(this.vend_advancedatas)
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
    data = this.utilservice.getReportParams(AppConstant.REPORTS.VENDOR_ADVANCE.VENDOR_REPORT_NAME, this.userstoragedata);
    data.reportparams = 'paymentid:' + this.pymtrectid;
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        console.log(data);
        this.utilservice.saveToFileSystem(data, "application/pdf", this.vend_advanceData.pymtrectno, ".pdf");
        return data;
      },
      error => {
        console.error(error);
        return error;

      }
      );
  }


}
