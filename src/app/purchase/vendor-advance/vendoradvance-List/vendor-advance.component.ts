import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PurchasesService } from '../../../services/purchases/purchases.service';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { PaymentService } from '../../../payment/payment.service';
import { AppConstant } from '../../../app.constant';
import { DashboardService } from '../../../services/dashboard.service';
import { CurrencyPipe } from "@angular/common";
import * as _ from "lodash";
import { UtilsService } from "../../../services/utils.service";
import { FeaturesService } from '../../../services/features.service';
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-vendor-advance',
  templateUrl: './vendor-advance.component.html',
  styleUrls: ['./vendor-advance.component.scss']
})
export class VendorAdvanceComponent implements OnInit {
  public paginator = AppConstant.API_CONFIG.PAGINATOR.LISTPAGES;
  barData: any;
  lineData: any;
  pymtrectid: any;
  vend_advanceData: any;
  vend_advancedatas: any = [];
  vend_advancetaxs: Array<any> = [];
  invoicelist: any = [];
  userstoragedata: any;
  finyear: any;
  selectedinvoice: any = [];
  userdetails: any;
  matchedlist: any[];
  unmatchedlist: any[];
  heads: any;
  dataFormat: string;
  currency_Symbol: string;
  show: boolean = false;
  topSalesData;
  chartConfig = {
    self: this,
    legend: {
      position: 'bottom'
    },
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label(tooltipItem, data) {
          var allData = data.datasets[tooltipItem.datasetIndex].data;
          var tooltipLabel = data.labels[tooltipItem.index];
          var tooltipData = allData[tooltipItem.index];
          // return tooltipLabel + ":" + this.currencyFilter.transform(tooltipData, "INR", "symbol");
          return tooltipLabel + ":" + this._options.self.currencyFilter.transform(tooltipData, "INR", "symbol");
        }
      }
    }
  };


  currencyFilter: CurrencyPipe;

  // Chart variable declartions
  vendorAdvanceSummaryData;
  vendorAdvanceCountData;
  transactionNoRecordDisp = {
    vendorAdvance: false,
    vendorAdvanceCount: false,
    topsales: false
  }
  barChartConfig: any = {
    legend: {
      position: 'bottom'
    },
    scales: {},

  };
  // Chart variable declartions


  constructor(private localstorageservice: LocalStorageService, private purchasesService: PurchasesService,
    private paymentService: PaymentService,
    private dashboardService: DashboardService,
    private featureservice: FeaturesService,
    private utilservice: UtilsService,
    private UtilsService: UtilsService,
    private _hotkeysService: HotkeysService,
    private router: Router) {
    // Short Cut ket to add
    this._hotkeysService.add(new Hotkey('shift+a', (event: KeyboardEvent): boolean => {
      this.router.navigate(['purchase/vendoradvanceaddedit']);
      return false;
    }));
    this.userdetails = this.localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.heads = this.localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.HEADS);
    this.dataFormat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
    this.currencyFilter = new CurrencyPipe("en-in");
  }

  ngOnInit() {

    this.initBarChartConfig();
    this.getallvendoradvList();

    var self = this;

    // Begin     
    let commonParam: any = {};
    commonParam.tenantid = this.userdetails.tenantid;
    commonParam.finyear = this.finyear.finyear;

    this.getVendorAdvSummary(commonParam);
    this.getVendorAdvCountSummary(commonParam);
    this.getTopVendorAdvance(commonParam);

  }

  showhidefilter(datatable, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(datatable, this.show, btnid);
  }

  getallvendoradvList() {
    var data = {
      "offset": 0,
      "limit": null,
      "query": {
        'tenantid': this.userdetails.tenantid,
        'feature': "Payment",
        'finyear': this.finyear.finyear,

      }
    }
    this.paymentService.PaymentGetall(data).then((res) => {
      this.matchedlist = _.filter(res.data, function (res) {
        if (res.pymtrecttype == "ADVANCE" && res.balamount != 0) {
          return res;
        }
      });
      // this.matchedlist = res.data;
      // this.unmatchedlist = res.unmatched
    })
  }

  getVendorAdvSummary(queryParam) {
    let label_1 = "Total Advances";
    this.dashboardService.getVendorAdvanceSummary(queryParam)
      .then((response: any) => {
        if (response.status) {
          if (!response.data || !response.data.length) {
            this.vendorAdvanceSummaryData = this.dashboardService.getDefaultBarChartData(label_1);
            this.transactionNoRecordDisp.vendorAdvance = true;
            return false;
          }
          let invoiceChartData: any = {};
          let labels = [];
          let datasets = [
            {
              label: label_1,
              backgroundColor: '#50a72e',
              borderColor: '#50a72e',
              data: []
            }

          ];
          let isNonZeroExists = false;
          _.forEach(response.data, (value: any) => {

            if (value.amount) {
              isNonZeroExists = true;
            }
            datasets[0].data.push(value.amount);
            labels.push(value.label);
          });

          if (!isNonZeroExists) {
            this.vendorAdvanceSummaryData = this.dashboardService.getDefaultBarChartData(label_1);
            this.transactionNoRecordDisp.vendorAdvance = true;
            return;
          }

          invoiceChartData.labels = labels;
          invoiceChartData.datasets = datasets;

          // Prepare Chart Config Object
          var self = this;
          this.vendorAdvanceSummaryData = invoiceChartData;
        }
        else {
          this.vendorAdvanceSummaryData = this.dashboardService.getDefaultBarChartData(label_1);
          this.transactionNoRecordDisp.vendorAdvance = true;
        }

      })
  }

  getVendorAdvCountSummary(queryParam) {
    let label_1 = "Total Advances";
    this.dashboardService.getVendorAdvanceSummary(queryParam)
      .then((response: any) => {
        if (response.status) {
          if (!response.data || !response.data.length) {
            this.vendorAdvanceCountData = this.dashboardService.getDefaultBarChartData(label_1);
            this.transactionNoRecordDisp.vendorAdvanceCount = true;
            return false;
          }
          let invoiceChartData: any = {};
          let labels = [];
          let datasets = [
            {
              label: label_1,
              backgroundColor: '#42A5F5',
              borderColor: '#1E88E5',
              data: []
            }

          ];
          let isNonZeroExists = false;
          _.forEach(response.data, (value: any) => {

            if (value.count) {
              isNonZeroExists = true;
            }
            datasets[0].data.push(value.count);
            labels.push(value.label);
          });

          if (!isNonZeroExists) {
            this.vendorAdvanceCountData = this.dashboardService.getDefaultBarChartData(label_1);
            this.transactionNoRecordDisp.vendorAdvanceCount = true;
            return;
          }

          invoiceChartData.labels = labels;
          invoiceChartData.datasets = datasets;

          // Prepare Chart Config Object
          var self = this;
          this.vendorAdvanceCountData = invoiceChartData;
        }
        else {
          this.vendorAdvanceCountData = this.dashboardService.getDefaultBarChartData(label_1);
          this.transactionNoRecordDisp.vendorAdvanceCount = true;
        }

      })
  }

  getTopVendorAdvance(queryParam) {
    let copyParam = { ...queryParam };
    copyParam.limit = 4;

    let defaultLabel = ['Customer1', 'Customer2', 'Customer3'];

    this.dashboardService.getTopVendorAdvance(copyParam)
      .then((response: any) => {
        if (response.status) {
          if (!response.data || !response.data.length) {
            this.topSalesData = this.dashboardService.getDefaultPieChartData(...defaultLabel);
            this.transactionNoRecordDisp.topsales = true;
            return;
          }

          let topSalesChartData: any = {};
          let labels = [];
          let datasets = [
            {
              data: [],
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
              ]
            }

          ];
          let isNonZeroExists = false;
          _.forEach(response.data, (value: any) => {
            if (value.amount) {
              isNonZeroExists = true;
            }
            datasets[0].data.push(value.amount);
            labels.push(value.label);
          });

          if (!isNonZeroExists) {
            this.topSalesData = this.dashboardService.getDefaultPieChartData(...defaultLabel);
            this.transactionNoRecordDisp.topsales = true;
            return;
          }

          topSalesChartData.labels = labels;
          topSalesChartData.datasets = datasets;

          this.topSalesData = topSalesChartData;
        }
        else {
          this.topSalesData = this.dashboardService.getDefaultPieChartData(...defaultLabel);
          this.transactionNoRecordDisp.topsales = true;
        }

      })
  }

  initBarChartConfig() {
    var self = this;
    this.barChartConfig.scales = {
      yAxes: [{
        ticks: {
          //max: parseInt(maxamount.toFixed(2)) - 2,
          callback(value, index, values) {
            // return value;
            return self.currencyFilter.transform(value, "INR", "symbol");
            // return self.currencyFilter.transform(value, "USD", true, "1.0-0").substr(3);
          }
        }
      }]
    },
      this.barChartConfig.tooltips = {
        enabled: true,
        mode: 'single',
        callbacks: {
          label(tooltipItems, data) {
            return self.currencyFilter.transform(tooltipItems.yLabel, "INR", "symbol");
            // return self.currencyFilter.transform(tooltipItems.yLabel, "USD", true, "1.0-0").substr(3);
          }
        }
      };
  }

  // PDF Download
  pdfdownload(pymtrectid, pymtrectno) {
    let data = {} as any;
    data = this.utilservice.getReportParams(AppConstant.REPORTS.VENDOR_ADVANCE.VENDOR_REPORT_NAME, this.userdetails);
    data.reportparams = 'paymentid:' + pymtrectid;
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        this.utilservice.saveToFileSystem(data, "application/pdf", pymtrectno, ".pdf");
        return data;
      },
      error => {
        console.error(error);
        return error;

      }
      );
  }
}
