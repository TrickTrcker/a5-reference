import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import * as _ from "lodash";
import { FeaturesService } from '../../services/features.service';
import { UtilsService } from '../../services/utils.service';
import { MasterService } from '../../services/master.service';
import { PurchasesService } from '../../services/purchases/purchases.service';
import { Router, NavigationExtras } from '@angular/router';
import { AmountsToWordsService } from '../../services/amounts-to-words.service';
import { OrganizationSettingsService } from "../../pages/settings/services/organization-settings.service";
import { Location } from '@angular/common';
import { HotkeysService, Hotkey } from "angular2-hotkeys";

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  @Input() billid: any;
  userstoragedata: any = {};
  resources: any = {};
  reqdata: any = {};
  billDeta: any;
  billdatas: Array<any> = [];
  billtaxs: Array<any> = [];
  bill_feature: string = "Purchase Bill";
  mode: string;
  tenaentAddress: any;
  tenantgstin: any;
  GSTTaxTotal: any[] = [];
  constructor(private masterservice: MasterService, private storageservice: LocalStorageService,
    private route: ActivatedRoute, private purchaseservice: PurchasesService, private featureservice: FeaturesService,
    private amountstowordsservice: AmountsToWordsService, private utilservice: UtilsService,

    private router: Router, private location: Location,
    private OrganizationSettingsService: OrganizationSettingsService,
    private _hotkeysService: HotkeysService) {
    // Back to list form
    this._hotkeysService.add(new Hotkey('backspace', (event: KeyboardEvent): boolean => {
      this.router.navigate(['/purchase/list']);
      return false;
    }));
    // Download
    this._hotkeysService.add(new Hotkey('shift+d', (event: KeyboardEvent): boolean => {
      this.pdfdownload();
      return false;
    }));
    this.route.params.subscribe(params => {
      if (!_.isEmpty(params)) {
        this.billid = params.billid;
        this.mode = params.bill;
        console.log("url params", params);
      }
    });
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.resources = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.RESOURCE);
  }

  ngOnInit() {
    this.reqdata = {
      "billid": this.billid
    };
    console.log("invoicedetails", this.billid);
    if (this.billid && this.billid != undefined) {
      this.loadBillDetails(this.reqdata);
    }
    this.getTenantAdderess(this.userstoragedata.Tenant.tenantid);
  }
  getTenantAdderess(data) {
    this.OrganizationSettingsService.FindAll(data).then((res) => {
      console.log("tenet", res.data);
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
      console.log("this.tenantgstin", this.tenantgstin)
    });
  }
  pdfdownload() {
    let data = {} as any;
    data = this.utilservice.getReportParams(AppConstant.REPORTS.BILL.REPORT_NAME, this.userstoragedata);
    data.reportparams = this.utilservice.prepareReportParams({
      "billid": this.billid,
      "gstinno": this.tenantgstin ? this.tenantgstin : null
    });
    //  this.featureservice.downloadsamplepdf(data);
    //  this.featureservice.report(data).then((res)=>{
    //   if(res.status){
    //    console.log("report feature",res.data);
    //   }

    // });
    console.log("DATA", data);
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        console.log(data);
        this.utilservice.saveToFileSystem(data, "application/pdf", this.billDeta.billno, ".pdf");
        return data;
      },
      error => {
        console.error(error);
        return error;

      }
      );
  }
  redirecttoprev() {
    if (this.mode == "fromledger") {
      this.router.navigate(['/reports/trailbalance']);
    }
    else if (this.mode == "bill") {
      this.router.navigate(['/purchase/list']);
    }
    this.location.back();
  }


  loadBillDetails(reqdata) {
    this.billDeta = [];
    var reqdata: any = {
      "feature": "bill",
      "billid": this.billid
    };
    this.purchaseservice.getBillById(reqdata)
      .then((res) => {
        if (res.status) {
          this.billDeta = res.data[0];
          this.billdatas = res.data[0].billDetails;
          this.billtaxs = res.data[0].billTaxes;
          this.GSTTaxTotal = _.filter(this.billtaxs, function (tx: any) {
            if (tx.cgst > 0 || tx.sgst > 0 || tx.igst > 0 || tx.amt > 0) {
              return tx;
            }
          });
          console.log("bill data: ", this.billDeta);
          // if (res.data[0].feature == "proforma_bill") {
          //   this.bill_feature = "Pro-Forma Bill";
          // }
        }
      });

  }
  ruppesinwords(amount) {
    if (amount != undefined) {
      return this.amountstowordsservice.AmountintoWords(amount);
    }
  }

}
