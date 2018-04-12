import { Component, OnInit, EventEmitter, ElementRef, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import * as _ from "lodash";
import { MasterService } from '../../services/master.service';
import { SalesService } from '../../services/sales/sales.service';
import { AmountsToWordsService } from '../../services/amounts-to-words.service';
import { Router, NavigationExtras } from '@angular/router';
import { OrganizationSettingsService } from "../../pages/settings/services/organization-settings.service";
import { CommonService } from "../../pages/settings/services/common.service";
import { Location } from '@angular/common';
import { UtilsService } from '../../services/utils.service';
import { FeaturesService } from '../../services/features.service'
import { HotkeysService, Hotkey } from "angular2-hotkeys";
@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss']
})
export class ViewInvoiceComponent implements OnInit {
  @Input() invoiceid: any;
  @Input() feature: any;
  invoiceDeta: any;
  invoicedatas: Array<any> = [];
  invoicetaxs: Array<any> = [];
  userstoragedata: any = {};
  resources: any = {};
  reqdata: any = {};
  invoice_feature: string = "B2B Invoice";
  flag: string;
  tenaentAddress: any;
  tenantgstin: any;
  GSTTaxTotal: any[] = [];
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  constructor(private featureservice: FeaturesService, private masterservice: MasterService, private storageservice: LocalStorageService, private location: Location,
    private route: ActivatedRoute, private salesservice: SalesService, private router: Router,
    private amountstowordsservice: AmountsToWordsService,
    private OrganizationSettingsService: OrganizationSettingsService,
    private CommonService: CommonService, private utilservice: UtilsService,
    private _hotkeysService: HotkeysService) {
    // Back to list form
    this._hotkeysService.add(new Hotkey('backspace', (event: KeyboardEvent): boolean => {
      this.router.navigate(['/sales/list']);
      return false;
    }));
    this.route.params.subscribe(params => {
      if (!_.isEmpty(params)) {
        this.invoiceid = params.invoiceid;
        this.flag = params.invtype;
        console.log("url params", params);
      }
    });

    // Download
    this._hotkeysService.add(new Hotkey('shift+d', (event: KeyboardEvent): boolean => {
      this.pdfdownload(this.invoiceid,this.invoiceDeta.invoiceno);
      return false;
    }));
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    console.log("this.userstoragedata", this.userstoragedata);
    this.resources = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.RESOURCE);

  }

  ngOnInit() {

    this.getTenantAdderess(this.userstoragedata.Tenant.tenantid);
    //  this.gettenentstate()
    //  this.gettenetcountry()
    //  this.gettenetcity()
    this.reqdata = {
      "invoiceid": this.invoiceid
    };
    console.log("invoicedetails", this.invoiceid);
    if (this.invoiceid && this.invoiceid != undefined) {
      this.loadInvoiceDetails(this.reqdata, this.flag);
      console.log("this.reqdata", this.reqdata, this.flag)
    }
  }
  // gettenetcity(){
  //   this.CommonService.FindAllCity({}).then((res)=>{
  //     console.log("find city",res.date);
  //   })
  // }
  // gettenentstate(){
  //   this.CommonService.FindAllState({}).then((res)=>)
  // }
  // gettenetcountry(){

  // }
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
  pdfdownload(invoiceid, refno) {
    let data = {} as any;
    data = this.utilservice.getReportParams(AppConstant.REPORTS.INVOICE.REPORT_NAME, this.userstoragedata);
    data.reportparams = 'invoiceid:' + invoiceid;
    //  this.featureservice.downloadsamplepdf(data);
    //  this.featureservice.report(data).then((res)=>{
    //   if(res.status){
    //    console.log("report feature",res.data);
    //   }

    // });
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        // if(reportType == "HTML")
        // {
        //   console.log(data);
        //   var myReader = new FileReader();
        //   myReader.addEventListener("loadend", function(e:any){
        //     console.log(e);
        //     if(navigator.userAgent.search("Firefox") > -1)
        //     {
        //       document.getElementById("htmlviewer").innerHTML = e.target.result;
        //     }
        //     else
        //     {
        //       document.getElementById("htmlviewer").innerHTML = e.srcElement.result;//prints a html
        //     }
            
        // });
        // //start the reading process.
        // myReader.readAsText(data._body);
        // }
        console.log(data);
        this.utilservice.saveToFileSystem(data, "application/pdf", refno, ".pdf");
        return data;
      },
      error => {
        console.error(error);
        return error;

      }
      );
  }
  redirecttoprev() {
    if (this.flag == "fromledger") {
      this.router.navigate(['/reports/trailbalance']);
    }
    else if (this.flag == "invoice") {
      this.router.navigate(['/sales/list']);
    }
    else if (this.flag == "proforma") {
      this.router.navigate(['/sales/list']);
    }
    this.location.back();
  }
  ruppesinwords(amount) {
    if (amount != undefined) {
      return this.amountstowordsservice.AmountintoWords(amount);
    }
  }
  loadInvoiceDetails(reqdata, flag) {
    this.invoiceDeta = [];
    var reqdata: any = {
      "invoiceid": this.invoiceid
    };
    if (!_.isEmpty(flag)) {
      if (flag == "proforma")
        reqdata.feature = "proforma_invoice";
      else if (flag == "invoice") {
        reqdata.feature = "invoice";
      } else {

      }
    } else {
      reqdata.feature = this.feature;
    }


    this.salesservice.getInvoiceById(reqdata)
      .then((res) => {
        if (res.status) {
          this.invoiceDeta = res.data[0];
          this.invoicedatas = res.data[0].invoiceDetails;
          this.invoicetaxs = res.data[0].invoiceTaxes;
          // console.log("invoice tax value",this.invoicetaxs)
          // console.log("Invoice data: ", this.invoiceDeta);
          this.GSTTaxTotal = _.filter(this.invoicetaxs, function (tx: any) {
            if (tx.cgst > 0 || tx.sgst > 0 || tx.igst > 0 || tx.amt > 0) {
              return tx;
            }
          });
          console.log("invoice tax value", this.GSTTaxTotal)
          if (res.data[0].feature == "proforma_invoice") {
            this.invoice_feature = "Pro-Forma";
          }
        }
      });
  }


}
