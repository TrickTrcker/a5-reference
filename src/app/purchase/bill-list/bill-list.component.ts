import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { InvoiceDataTable } from '../invoice-data-table.interface';
import { DataTableModule, SelectItem } from 'primeng/primeng';
import { PurchasesService } from '../../services/purchases/purchases.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import { ViewBillComponent } from '../view-bill/view-bill.component';
import { DashboardService } from '../../services/dashboard.service';
import * as _ from 'lodash';
import { CurrencyPipe } from '@angular/common';
import { UtilsService } from '../../services/utils.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Router, NavigationExtras } from '@angular/router';
// import { ViewInvoiceComponent } from '../view-invoice/view-invoice.component';
import { FeaturesService } from '../../services/features.service';
import { OrganizationSettingsService } from '../../pages/settings/services/organization-settings.service';
import { PrimengConstant } from '../../app.primeconfig';
import { ConfirmationService, ConfirmDialog } from 'primeng/primeng';
import { MessagesService } from '../../shared/messages.service';
@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.scss']
})
export class BillListComponent implements OnInit {
  tenantgstin: any;
  tenaentAddress: any;
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  private date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  public paginator = AppConstant.API_CONFIG.PAGINATOR.LISTPAGES;
  barData: any;
  lineData: any;
  billlist: any = [];
  userstoragedata: any;
  finyear: any;
  selectedbills: any = [];
  show: boolean = false;
  currencyFilter: CurrencyPipe;
  billSummaryData: any;
  billCountData: any;
  changestatus: SelectItem[];
  transactionNoRecordDisp = {
    bill: false,
    billCount: false
  }
  barChartConfig: any = {
    legend: {
      position: 'bottom'
    },
    scales: {},

  };
  lineChartConfig: any = {
    legend: {
      position: 'bottom'
    },
    scales: {},

  };
  public display_dtime = AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  status: any;
  constructor(private purchaseservice: PurchasesService,
    private storageservice: LocalStorageService,
    private dashboardService: DashboardService, private UtilsService: UtilsService,
    private _hotkeysService: HotkeysService,
    private OrganizationSettingsService: OrganizationSettingsService,
    private router: Router, private featureService: FeaturesService,
    private confirmationService: ConfirmationService,
    private messageService: MessagesService) {
    // Short Cut key to add
    this._hotkeysService.add(new Hotkey('shift+a', (event: KeyboardEvent): boolean => {
      this.router.navigate(['purchase/billedit']);
      return false;
    }));
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.currencyFilter = new CurrencyPipe('en-in');
    this.status = AppConstant.API_CONFIG.status;
    this.changestatus = [];
    this.changestatus.push({ label: 'All', value: null });
    for (var i = 0; i < this.status.length; i++) {
      this.changestatus.push({
        label: this.status[i].stat, value: this.status[i].stat
      });
    }
  }

  ngOnInit() {
    this.initBarChartConfig();
    this.initLineChartConfig();
    var self = this;
    let commonParam: any = {};
    commonParam.tenantid = this.userstoragedata.tenantid;
    commonParam.finyear = this.finyear.finyear;
    this.getBillSummary(commonParam);
    this.getBillCountSummary(commonParam);
    var data = {
      tenantid: this.userstoragedata.tenantid,
      finyear: this.finyear.finyear,
      status: 'Active'
    };
    this.purchaseservice.getBillList(data)
      .then(function (res) {
        self.billlist = res.data;
      });
    this.lineData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#3984b8'
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: '#3eb839'
        }
      ]
    };
    this.barData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: '#59c429',
          borderColor: '#3984b8',
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          backgroundColor: '#6ec5ff',
          borderColor: '#f6ac2b',
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    }
  }
  initBarChartConfig() {
    var self = this;
    this.barChartConfig.scales = {
      yAxes: [{
        ticks: {
          //max: parseInt(maxamount.toFixed(2)) - 2,
          callback(value, index, values) {
            // return value;
            return self.currencyFilter.transform(value, 'INR', 'symbol');
            // return self.currencyFilter.transform(value, 'USD', true, '1.0-0').substr(3);
          }
        }
      }]
    },
      this.barChartConfig.tooltips = {
        enabled: true,
        mode: 'single',
        callbacks: {
          label(tooltipItems, data) {
            return self.currencyFilter.transform(tooltipItems.yLabel, 'INR', 'symbol');
            // return self.currencyFilter.transform(tooltipItems.yLabel, 'USD', true, '1.0-0').substr(3);
          }
        }
      };
  }
  initLineChartConfig(){
    var self = this;
    this.lineChartConfig.scales = {
      yAxes: [{
        ticks: {
          callback(value, index, values) {
            return value;
          }
        }
      }]
    },
      this.lineChartConfig.tooltips = {
        enabled: true,
        mode: 'single',
        callbacks: {
          label(tooltipItems, data) {
            return self.currencyFilter.transform(tooltipItems.yLabel, 'INR', 'symbol');
          }
        }
      };
  }
  getBillSummary(queryParam) {
    let label_1 = 'Total Open Bills';
    let label_2 = 'Total Due Bills';
    this.dashboardService.getBillSummary(queryParam)
      .then((response: any) => {
        if (response.data) {
          if (!response.data || !response.data.length) {
            this.billSummaryData = this.dashboardService.getDefaultBarChartData(label_1, label_2);
            this.transactionNoRecordDisp.bill = true;
            return false;
          }

          let billChartData: any = {};
          let labels = [];
          let datasets = [
            {
              label: label_1,
              backgroundColor: '#50a72e',
              borderColor: '#50a72e',
              data: []
            },
            {
              label: label_2,
              backgroundColor: '#e9453b',
              borderColor: '#e9453b',
              data: []
            }

          ];
          let isNonZeroExists = false;
          _.forEach(response.data, (value: any) => {

            if (value.billamount || value.balamount) {
              isNonZeroExists = true;
            }

            datasets[0].data.push(value.billamount);
            datasets[1].data.push(value.balamount);
            labels.push(value.label);
          });

          if (!isNonZeroExists) {
            this.billSummaryData = this.dashboardService.getDefaultBarChartData(label_1, label_2);
            this.transactionNoRecordDisp.bill = true;
            return;
          }

          billChartData.labels = labels;
          billChartData.datasets = datasets;

          this.billSummaryData = billChartData;
        }
        else {
          this.billSummaryData = this.dashboardService.getDefaultBarChartData(label_1, label_2);
          this.transactionNoRecordDisp.bill = true;
        }


      })
  }
  getBillCountSummary(queryParam) {
    let label_1 = 'Total Bills';
    this.dashboardService.getBillCountSummary(queryParam)
      .then((response: any) => {
        if (response.data) {
          if (!response.data || !response.data.length) {
            this.billCountData = this.dashboardService.getDefaultBarChartData(label_1);
            this.transactionNoRecordDisp.billCount = true;
            return false;
          }

          let billChartData: any = {};
          let labels = [];
          let datasets = [
            {
              label: label_1,
              backgroundColor: '#42A5F5',
              borderColor: '#1E88E5',
              data: [],
              fill: false
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
            this.billCountData = this.dashboardService.getDefaultBarChartData(label_1);
            this.transactionNoRecordDisp.billCount = true;
            return;
          }

          billChartData.labels = labels;
          billChartData.datasets = datasets;

          this.billCountData = billChartData;
        }
        else {
          this.billCountData = this.dashboardService.getDefaultBarChartData(label_1);
          this.transactionNoRecordDisp.billCount = true;
        }


      })
  }

  showhidefilter(datatable, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(datatable, this.show, btnid);
  }
  addTabViewbill(item) {

    if (this.selectedbills.length > 0) {
      this.selectedbills.unshift(item);
    }
    else {
      this.selectedbills.push(item);
    }
    console.log(this.selectedbills);
  }
  handletabClose(e) {
    // alert(e);
    e.close();
  }
  getTenantAdderess(data) {
    this.OrganizationSettingsService.FindAll(data).then((res) => {
      console.log('tenet', res.data);
      this.tenaentAddress = res.data;
      if (!res.data.settings) {
        res.data.settings = '';
      }
      else {
        for (var i = 0; i < res.data.settings.length; i++) {
          if (res.data.settings[i].settingref == 'GST') {
            this.tenantgstin = res.data.settings[i].settingvalue;
          }

        }
      }
      console.log('this.tenantgstin', this.tenantgstin)
    });
  }
  pdfdownload(billid, billno) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.BILL.REPORT_NAME, this.userstoragedata);
    data.reportparams =this.UtilsService.prepareReportParams({
      'billid': billid,
      'gstinno': this.tenantgstin ? this.tenantgstin : null
    });
    console.log('DATA', data);
    var res = this.featureService.reportDownload(data)
      .subscribe(
      data => {
        console.log(data);
        this.UtilsService.saveToFileSystem(data, 'application/pdf', billno, '.pdf');
        return data;
      },
      error => {
        console.error(error);
        return error;

      }
      );
  }

  // Delete record
  deleteRecord(data) {

    let formdata = {} as any;
    formdata = data;
    this.confirmationService.confirm({
      message: PrimengConstant.GLOBAL_ERROR.DELETE_CONFIRM_MSG,
      accept: () => {
        formdata.status = PrimengConstant.COMMON.TRANS_STATUS.DELETED;
        this.purchaseservice.deleteBill(data).then(res => {
          if (res.status) {
            this.getBillList();
            this.messageService.showMessage({
              severity: 'success', summary: 'Success',
              detail: PrimengConstant.JOURNALS.DELETESUCCESS
            });
          } else {
            this.messageService.showMessage({
              severity: 'error', summary: 'Error',
              detail: res.message
            });
          }
        });
      }
    });
  }

  getBillList() {
    var self = this;
    var data = {
      tenantid: this.userstoragedata.tenantid,
      finyear: this.finyear.finyear,
      status: 'Active'
    };
    this.purchaseservice.getBillList(data)
      .then(function (res) {
        self.billlist = res.data;
      });
  }
  edit(data) {
    data.type = 'BILL';
    this.purchaseservice.validateTransaction(data).then(res => {
      if (res.status) {
        this.router.navigate(['/purchase/editbill', data.billid]);
      } else {
        this.messageService.showMessage({
          severity: 'error', summary: 'Error',
          detail: res.message
        });
      }
    });
  }
}
