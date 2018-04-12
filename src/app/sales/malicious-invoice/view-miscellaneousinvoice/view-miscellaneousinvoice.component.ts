import { Component, OnInit, EventEmitter, ElementRef, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { LocalStorageService } from '../../../shared/local-storage.service';
import { AppConstant } from '../../../app.constant';
import * as _ from "lodash";
import { MasterService } from '../../../services/master.service';
import { SalesService } from '../../../services/sales/sales.service';
import { AmountsToWordsService } from '../../../services/amounts-to-words.service';
import { Router, NavigationExtras } from '@angular/router';
import { OrganizationSettingsService } from "../../../pages/settings/services/organization-settings.service";
import { CommonService } from "../../../pages/settings/services/common.service";
import { Location } from '@angular/common';
import { UtilsService } from "../../../services/utils.service";
import { FeaturesService } from "../../../services/features.service"

@Component({
  selector: 'app-view-miscellaneousinvoice',
  templateUrl: './view-miscellaneousinvoice.component.html',
  styleUrls: ['./view-miscellaneousinvoice.component.scss']
})
export class ViewMiscellaneousinvoiceComponent implements OnInit {
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  @Input() invoiceid: any;
  userstoragedata: any = {};
  resources: any = {};
  reqdata: any = {};
  invoiceDeta: any;
  invoicedatas: Array<any> = [];
  invoicetaxs: Array<any> = [];
  invoice_feature: string = "B2C Invoice";
  mode: string;
  tenaentAddress:any;
  tenantgstin:any;
  GSTTaxTotal:any[]=[];
  constructor(private masterservice: MasterService, private storageservice: LocalStorageService,
    private route: ActivatedRoute, private SalesService: SalesService, 
    private amountstowordsservice : AmountsToWordsService, private UtilsService : UtilsService,
    private featureservice: FeaturesService,
    private router: Router,private location: Location,
  private OrganizationSettingsService:OrganizationSettingsService) {
    this.route.params.subscribe(params => {
      if (!_.isEmpty(params)) {
        this.invoiceid = params.invoiceid;
        this.mode = params.invoice;
        console.log("url params", params);
      }
    });
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.resources = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.RESOURCE);
  }

  ngOnInit() {
    this.reqdata = {
      "billid": this.invoiceid
    };
    console.log("invoicedetails", this.invoiceid);
    if (this.invoiceid && this.invoiceid != undefined) {
      this.loadBillDetails(this.reqdata);
    }
    this.getTenantAdderess(this.userstoragedata.Tenant.tenantid);
  }
  getTenantAdderess(data){
    this.OrganizationSettingsService.FindAll(data).then((res)=>{
      console.log("tenet",res.data);
      this.tenaentAddress=res.data;
      if (!res.data.settings) {
        res.data.settings = "";
      }
      else {
        for(var i=0;i<res.data.settings.length;i++){
          if(res.data.settings[i].settingref == "GST"){
            this.tenantgstin = res.data.settings[i].settingvalue;
          }

        }
      }
      console.log("this.tenantgstin",this.tenantgstin)
    });
  }
  redirecttoprev() {
    if (this.mode == "fromledger") {
      this.router.navigate(['/reports/trailbalance']);
    }
    else if (this.mode == "invoice") {
      this.router.navigate(['/purchase/list']);
    }
    this.location.back();
  }


  loadBillDetails(reqdata) {
    this.invoiceDeta = [];
    var reqdata: any = {
      "feature": "cai_invoice",
      "invoiceid": this.invoiceid
    };
    this.SalesService.getInvoiceById(reqdata)
      .then((res) => {
        if (res.status) {
          console.log("invoooo",res.data)
          this.invoiceDeta = res.data[0];
          this.invoicedatas = res.data[0].invoiceDetails;
          this.invoicetaxs = res.data[0].invoiceTaxes;
          this.GSTTaxTotal = _.filter(this.invoicetaxs, function (tx: any) {
            if(tx.cgst > 0 || tx.sgst> 0 || tx.igst > 0 || tx.amt > 0)
            {
              return tx;
            }
          });
          console.log("invoice tax value",this.GSTTaxTotal)
          // if (res.data[0].feature == "proforma_bill") {
          //   this.bill_feature = "Pro-Forma Bill";
          // }
        }
      });

  }
  ruppesinwords(amount)
  {
    if(amount != undefined)
    {
       return this.amountstowordsservice.AmountintoWords(amount);
     }
  }
  pdfdownload(invoiceid, refno) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.INVOICE.REPORT_NAME, this.userstoragedata);
    data.reportparams = 'invoiceid:' + invoiceid;
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        this.UtilsService.saveToFileSystem(data, "application/pdf", refno, ".pdf");
        return data;
      },
      error => {
        return error;

      }
      );
  }
}
