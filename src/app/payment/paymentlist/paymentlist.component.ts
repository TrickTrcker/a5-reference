import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../services/sales/sales.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import { PaymentService } from '../payment.service';
import { CurrencyPipe } from "@angular/common";
import { MasterService } from './../../services/master.service';
import { Router, NavigationExtras } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { UtilsService } from './../../services/utils.service'
import * as _ from "lodash";
import { SelectItem, MenuItem } from 'primeng/primeng';
import { JournalsService } from '../../accounts/service/journals.service';
import { FeaturesService } from '../../services/features.service';
import { PrimengConstant } from '../../app.primeconfig';
import { ConfirmationService, ConfirmDialog } from 'primeng/primeng';
import { MessagesService } from "../../shared/messages.service";


@Component({
  selector: 'app-paymentlist',
  templateUrl: './paymentlist.component.html',
  styleUrls: ['./paymentlist.component.scss']
})
export class PaymentlistComponent implements OnInit {
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
  menuItems: MenuItem[];
  matchedlist: any[];
  generalPaymentList: any[];
  filterjournalno: SelectItem[];
  unmatchedlist: any[];
  heads: any;
  pymtrectid: any;
  tenantgstin: any;
  paymentData: any = [];
  paymentDetails: any = [];
  show: boolean = false;
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
  paymentSummaryData;
  paymentCountData;
  transactionNoRecordDisp = {
    payment: false,
    paymentCount: false
  }
  barChartConfig: any = {
    legend: {
      position: 'bottom'
    },
    scales: {},

  };
  // Chart variable declartions


  constructor(private localstorageservice: LocalStorageService, private paymentService: PaymentService,
    private dashboardService: DashboardService, private confirmationService: ConfirmationService,
    private messageService: MessagesService, private router: Router, private journalService: JournalsService, private masterService: MasterService,
    private UtilsService: UtilsService, private featureservice: FeaturesService) {
    this.userdetails = this.localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.heads = this.localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.HEADS);
    this.currencyFilter = new CurrencyPipe("en-in");
  }

  ngOnInit() {
    this.menuItems = [
      // label: 'Save',
      // items: [
      {
        label: 'Vendor Payment', icon: 'fa-plus', command: () => {
          this.router.navigate(['/payment/paymentaddedit']);
        }
      },
      {
        label: 'General Payment', icon: 'fa-plus', command: () => {
          this.router.navigate(['/accounts/generalpayment']);
        }
      }
      // ]
    ];
    this.getallpayments();
    this.getGeneralPayments();
    this.initBarChartConfig();

    var self = this;

    // Begin     
    let commonParam: any = {};
    commonParam.tenantid = this.userdetails.tenantid;
    commonParam.finyear = this.finyear.finyear;

    this.getPaymentSummary(commonParam);
    this.getPaymentCountSummary(commonParam);


  }

  showhidefilter(datatable, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(datatable, this.show, btnid);
  }


  getallpayments() {
    var data = {
      "offset": 0,
      "limit": null,
      "query": {
        'tenantid': this.userdetails.tenantid,
        'feature': "Payment",
        'finyear': this.finyear.finyear
      }
    }
    this.paymentService.PaymentGetall(data).then((res) => {
      if (res.status) {
        this.matchedlist = [];
        this.unmatchedlist = [];
        this.unmatchedlist = _.filter(res.data, function (res) {
          if (res.pymtrecttype == "ADVANCE" && res.balamount != 0) {
            return res;
          }
        });
        this.matchedlist = _.filter(res.data, function (res) {
          return res.pymtrecttype != "ADVANCE"
        });
      }
      else {
        this.matchedlist = [];
        this.unmatchedlist = [];
      }
    })

  }
  getGeneralPayments(type?) {
    // let queryParams: any = {};
    let queryParams = {
      // "offset": 1,
      // "limit": 10,
      "query": {
        "tenantid": this.userdetails.tenantid,
        "finyear": this.finyear.finyear,
        "feature": "gnrl_payment"
      }
    }

    this.journalService.getAllJournals(queryParams).then(response => {
      if (response.status) {
        this.generalPaymentList = response.data;

      }
      else {
        this.generalPaymentList = [];
      }
    })
  }
  getjournalno() {
    this.filterjournalno = [];
    this.filterjournalno = this.masterService.filterformatDataforDropdown("journalno", this.generalPaymentList);
    console.log("journalno", this.filterjournalno)
  }
  getPaymentSummary(queryParam) {
    let label_1 = "Total Advances";
    this.dashboardService.getPaymentSummary(queryParam)
      .then((response: any) => {
        if (response.status) {
          if (!response.data || !response.data.length) {
            this.paymentSummaryData = this.dashboardService.getDefaultBarChartData(label_1);
            this.transactionNoRecordDisp.payment = true;
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
            this.paymentSummaryData = this.dashboardService.getDefaultBarChartData(label_1);
            this.transactionNoRecordDisp.payment = true;
            return;
          }

          invoiceChartData.labels = labels;
          invoiceChartData.datasets = datasets;

          // Prepare Chart Config Object
          var self = this;
          this.paymentSummaryData = invoiceChartData;
        }
        else {
          this.paymentSummaryData = this.dashboardService.getDefaultBarChartData(label_1);
          this.transactionNoRecordDisp.payment = true;
        }

      })
  }

  getPaymentCountSummary(queryParam) {
    let copyParam = { ...queryParam };
    copyParam.limit = 4;

    let defaultLabel = ['Customer1', 'Customer2', 'Customer3'];

    this.dashboardService.getTopPayments(copyParam)
      .then((response: any) => {
        if (response.status) {
          if (!response.data || !response.data.length) {
            this.paymentCountData = this.dashboardService.getDefaultPieChartData(...defaultLabel);
            this.transactionNoRecordDisp.paymentCount = true;
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
            this.paymentCountData = this.dashboardService.getDefaultPieChartData(...defaultLabel);
            this.transactionNoRecordDisp.paymentCount = true;
            return;
          }

          topSalesChartData.labels = labels;
          topSalesChartData.datasets = datasets;

          this.paymentCountData = topSalesChartData;
        }
        else {
          this.paymentCountData = this.dashboardService.getDefaultPieChartData(...defaultLabel);
          this.transactionNoRecordDisp.paymentCount = true;
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
  pdfdownload(id, refno, type) {
    let data = {} as any;
    if (type == 'payment') {
      data = this.UtilsService.getReportParams(AppConstant.REPORTS.PAYMENT.PAYMENT_REPORT_NAME, this.userdetails);
      data.reportName = AppConstant.REPORTS.PAYMENT.PAYMENT_REPORT_NAME;
      data.reportparams = "paymentid:" + id;
    } else {
      data = this.UtilsService.getReportParams(AppConstant.REPORTS.ACCOUNTS.JOURNALS_REPORT_NAME, this.userdetails);
      data.reportName = AppConstant.REPORTS.ACCOUNTS.JOURNALS_REPORT_NAME;
      data.reportparams = "journalid:" + id;
    }
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
  // Delete record
  deleteRecord(data) {
    let formdata = {};
    this.confirmationService.confirm({
      message: PrimengConstant.GLOBAL_ERROR.DELETE_CONFIRM_MSG,
      accept: () => {
        formdata = {
          txnid: data.pymtrectid,
          tenantid: this.userdetails.Tenant.tenantid,
          txnrefno: data.pymtrectno,
          finyear: data.finyear
        }
        data.status = PrimengConstant.COMMON.TRANS_STATUS.DELETED;
        this.paymentService.deletePayment(data).then(res => {
          if (res.status) {
            this.messageService.showMessage({
              severity: 'success', summary: 'Success',
              detail: PrimengConstant.JOURNALS.DELETESUCCESS
            });
          } else {
            this.messageService.showMessage({
              severity: 'error', summary: 'Error',
              detail: PrimengConstant.JOURNALS.DELETEFAILED
            });
          }
          this.getallpayments();
        });
      }
    });
  }
  deleteGeneralReceipt(data) {
    let formdata = {};
    this.confirmationService.confirm({
      message: PrimengConstant.GLOBAL_ERROR.DELETE_CONFIRM_MSG,
      accept: () => {
        formdata = {
          txnid: data.journalid,
          tenantid: this.userdetails.Tenant.tenantid,
          txnrefno: data.journalno,
          finyear: data.finyear
        }
        data.status = PrimengConstant.COMMON.TRANS_STATUS.DELETED;
        this.journalService.deleteJournal(data).then(res => {
          if (res.status) {
            this.messageService.showMessage({
              severity: 'success', summary: 'Success',
              detail: PrimengConstant.JOURNALS.DELETESUCCESS
            });
          } else {
            this.messageService.showMessage({
              severity: 'error', summary: 'Error',
              detail: PrimengConstant.JOURNALS.DELETEFAILED
            });
          }
          this.getGeneralPayments();
        });
      }
    });
  }
}
