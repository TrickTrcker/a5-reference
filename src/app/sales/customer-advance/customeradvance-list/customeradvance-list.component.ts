import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SalesService } from '../../../services/sales/sales.service';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { DashboardService } from '../../../services/dashboard.service';
import { ReceiptService } from '../../../receipts/receipt.service';
import { AppConstant } from '../../../app.constant';
import { CurrencyPipe } from "@angular/common";
import { UtilsService } from '../../../services/utils.service';
import * as _ from "lodash";

import { FeaturesService } from '../../../services/features.service';
@Component({
  selector: 'app-customeradvance-list',
  templateUrl: './customeradvance-list.component.html',
  styleUrls: ['./customeradvance-list.component.scss']
})
export class CustomeradvanceListComponent implements OnInit {
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  private date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  public paginator = AppConstant.API_CONFIG.PAGINATOR.LISTPAGES;
  private dateformat = AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  barData: any;
  lineData: any;
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
  currencyFilter: CurrencyPipe;
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

          return tooltipLabel + ":" + this._options.self.currencyFilter.transform(tooltipData, "INR", "symbol");
        }
      }
    }
  };

  // Chart variable declartions
  customerAdvanceSummaryData;
  customerAdvanceCountData;
  transactionNoRecordDisp = {
    cusAdvance: false,
    cusAdvanceCount: false,
    topsales: false
  }
  barChartConfig: any = {
    legend: {
      position: 'bottom'
    },
    scales: {},

  };
  // Chart variable declartions


  constructor(private localstorageservice: LocalStorageService, private salesservice: SalesService,
    private receiptservice: ReceiptService,
    private dashboardService: DashboardService,
    private UtilsService: UtilsService, private featureService: FeaturesService) {
    this.userdetails = this.localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.heads = this.localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.HEADS);
    this.dataFormat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
    this.currencyFilter = new CurrencyPipe("en-in");
  }

  ngOnInit() {
    this.initBarChartConfig();

    this.getallcustomeradvList();

    // Begin     
    let commonParam: any = {};
    commonParam.tenantid = this.userdetails.tenantid;
    commonParam.finyear = this.finyear.finyear;

    this.getCustomerAdvSummary(commonParam);
    this.getCustomerAdvCountSummary(commonParam);
    //this.getTopCustomerBySales(commonParam);
    this.getTopCustomerAdvanceDetails(commonParam);


    var self = this;
  }

  showhidefilter(datatable, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(datatable, this.show, btnid);
  }

  getallcustomeradvList() {
    var data = {
      "offset": 0,
      "limit": null,
      "query": {
        'tenantid': this.userdetails.tenantid,
        'feature': "Receipt",
        'pymtrecttype': "ADVANCE",
        'finyear': this.finyear.finyear
      }
    }
    this.receiptservice.ReceiptGetAll(data).then((res) => {
      this.matchedlist = _.filter(res.data, function (res) {
        if (res.pymtrecttype == 'ADVANCE' && res.pymtamount != 0) {
          return res;
        }
      });
    })
  }

  getCustomerAdvSummary(queryParam) {
    let label_1 = "Total Advances";
    this.dashboardService.getCustomerAdvanceSummary(queryParam)
      .then((response: any) => {
        if (response.status) {
          if (!response.data || !response.data.length) {
            this.customerAdvanceSummaryData = this.dashboardService.getDefaultBarChartData(label_1);
            this.transactionNoRecordDisp.cusAdvance = true;
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
            this.customerAdvanceSummaryData = this.dashboardService.getDefaultBarChartData(label_1);
            this.transactionNoRecordDisp.cusAdvance = true;
            return;
          }

          invoiceChartData.labels = labels;
          invoiceChartData.datasets = datasets;

          // Prepare Chart Config Object
          var self = this;
          this.customerAdvanceSummaryData = invoiceChartData;
        }
        else {
          this.customerAdvanceSummaryData = this.dashboardService.getDefaultBarChartData(label_1);
          this.transactionNoRecordDisp.cusAdvance = true;
        }

      })
  }

  getCustomerAdvCountSummary(queryParam) {
    let label_1 = "Total Advances";
    this.dashboardService.getCustomerAdvanceSummary(queryParam)
      .then((response: any) => {
        if (response.status) {
          if (!response.data || !response.data.length) {
            this.customerAdvanceCountData = this.dashboardService.getDefaultBarChartData(label_1);
            this.transactionNoRecordDisp.cusAdvanceCount = true;
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
            this.customerAdvanceCountData = this.dashboardService.getDefaultBarChartData(label_1);
            this.transactionNoRecordDisp.cusAdvanceCount = true;
            return;
          }

          invoiceChartData.labels = labels;
          invoiceChartData.datasets = datasets;

          // Prepare Chart Config Object
          var self = this;
          this.customerAdvanceCountData = invoiceChartData;
        }
        else {
          this.customerAdvanceCountData = this.dashboardService.getDefaultBarChartData(label_1);
          this.transactionNoRecordDisp.cusAdvanceCount = true;
        }

      })
  }

  getTopCustomerBySales(queryParam) {
    let copyParam = { ...queryParam };
    copyParam.limit = 5;

    let defaultLabel = ['Customer1', 'Customer2', 'Customer3'];

    this.dashboardService.getTopCustomerBySales(copyParam)
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

  getTopCustomerAdvanceDetails(queryParam) {
    let copyParam = { ...queryParam };
    copyParam.limit = 4;

    let defaultLabel = ['Customer1', 'Customer2', 'Customer3'];

    this.dashboardService.getTopCustomerAdvance(copyParam)
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
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.VENDOR_ADVANCE.VENDOR_REPORT_NAME, this.userdetails);
    data.reportparams = 'paymentid:' + pymtrectid;
    var res = this.featureService.reportDownload(data)
      .subscribe(
      data => {
        this.UtilsService.saveToFileSystem(data, "application/pdf", pymtrectno, ".pdf");
        return data;
      },
      error => {
        return error;

      }
      );
  }
}
