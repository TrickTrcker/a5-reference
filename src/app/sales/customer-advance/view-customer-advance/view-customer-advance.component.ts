import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from "@angular/router";
import { LocalStorageService } from '../../../shared/local-storage.service';
import * as _ from "lodash";
import { MasterService } from '../../../services/master.service';
import { AmountsToWordsService } from '../../../services/amounts-to-words.service';
import { ReceiptService } from '../../../../app/receipts/receipt.service';
import { AppConstant } from '../../../app.constant';
import { OrganizationSettingsService } from "../../../pages/settings/services/organization-settings.service";
import { UtilsService } from '../../../services/utils.service';
import { FeaturesService } from '../../../services/features.service';
import { HotkeysService, Hotkey } from "angular2-hotkeys";



@Component({
  selector: 'app-view-customer-advance',
  templateUrl: './view-customer-advance.component.html',
  styleUrls: ['./view-customer-advance.component.scss']
})
export class ViewCustomerAdvanceComponent implements OnInit {
  @Input() pymtrectid: any;
  cust_advanceData: any;
  cust_advancedatas: any = [];
  cust_advancetaxs: any = [];
  userstoragedata: any = {};
  resources: any = {};
  reqdata: any = {};
  cust_advance_feature: string = "Custormer Advance";
  dataFormat: string;
  currency_Symbol: string;
  tenaentAddress: any;
  tenantgstin: any;
  pymtrectno: any;

  constructor(private masterservice: MasterService,
    private storageservice: LocalStorageService,
    private route: ActivatedRoute,
    private receiptservice: ReceiptService,
    private amountstowordsservice: AmountsToWordsService,
    private OrganizationSettingsService: OrganizationSettingsService,
    private utilservice: UtilsService,
    private featureservice: FeaturesService,
    private _hotkeysService: HotkeysService,
    private router: Router
  ) {

    // Back to list form
    this._hotkeysService.add(new Hotkey('backspace', (event: KeyboardEvent): boolean => {
      this.router.navigate(['/sales/customeradvance']);
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
    if (this.pymtrectid && this.pymtrectid != undefined) {
      this.loadcust_advanceDetails(this.reqdata);
    }
    this.getTenantAdderess(this.userstoragedata.Tenant.tenantid);
  }
  getTenantAdderess(data) {
    this.OrganizationSettingsService.FindAll(data).then((res) => {
      this.tenaentAddress = res.data;
      if (!res.data.settings) {
        res.data.settings = "";
      }
      else {
        for (var i = 0; i < res.data.settings.length; i++) {
          if (res.data.settings[i].settingref == "GST") {
            this.tenantgstin = res.data.settings[i].settingvalue;
          }

        }
      }
    });
  }
  loadcust_advanceDetails(reqdata) {

    this.cust_advanceData = [];
    var reqdata: any = {
      "feature": "Receipt",
      "paymentReceiptid": this.pymtrectid
    };
    this.receiptservice.ReceiptGetbyId(reqdata)
      .then((res) => {
        if (res.status) {
          this.cust_advanceData = res.data[0];
          this.cust_advancedatas = res.data[0].details[0];
          // this.cust_advancetaxs = res.data[0].invoiceTaxes;
          this.pymtrectno = this.cust_advanceData.pymtrectno;
          // if( res.data[0].feature == "proforma_invoice")
          // {
          // this.invoice_feature = "Pro-Forma Invoice";
          // }
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
    data = this.utilservice.getReportParams(AppConstant.REPORTS.CUSTOMER_ADVANCE.CUSTOMER_REPORT_NAME, this.userstoragedata);
    data.reportparams = 'receiptid:' + this.pymtrectid;
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        this.utilservice.saveToFileSystem(data, "application/pdf", this.cust_advanceData.pymtrectno, ".pdf");
        return data;
      },
      error => {
        return error;

      }
      );
  }

}


