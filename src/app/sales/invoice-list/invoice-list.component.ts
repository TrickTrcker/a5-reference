import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InvoiceDataTable } from '../invoice-data-table.interface';
import { DataTableModule, SelectItem } from 'primeng/primeng';
import { SalesService } from '../../services/sales/sales.service';
import { ConvertProformaToInvoiceService } from '../../services/sales/convert-proforma-to-invoice.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { DashboardService } from '../../services/dashboard.service';
import { AppConstant } from '../../app.constant';
import { ViewInvoiceComponent } from '../view-invoice/view-invoice.component';
import { MenuItem } from 'primeng/primeng';
import { Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
import { CurrencyPipe } from '@angular/common';
import { UtilsService } from '../../services/utils.service';
import { FeaturesService } from '../../services/features.service'
import { PrimengConstant } from '../../app.primeconfig';
import { MessagesService } from '../../shared/messages.service';
import { ConfirmationService, ConfirmDialog } from 'primeng/primeng';
@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  public display_dtime = AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  public paginator = AppConstant.API_CONFIG.PAGINATOR.LISTPAGES;
  // private invoicelistmenuitem: MenuItem[];
  public invoicelistmainmenu: MenuItem[];
  proformainvoiceCnxtmenu: MenuItem[];
  selectedProforma: any = null;
  barData: any;
  lineData: any;
  invoicelist: any = [];
  proformainvoicelist: any = [];
  miscellaneousinvoicelist: any = [];
  userstoragedata: any;
  finyear: any;
  selectedinvoice: any = [];
  activeTab: String = '-';
  invoicereqData: any = [];
  proformainvoicereqData: any = [];
  miscellaneousinvoicereqData: any = [];
  currencyFilter: CurrencyPipe;
  show: boolean = false;
  changestatus: SelectItem[];
  prochangestatus: SelectItem[];
  // Chart variable declartions
  invoiceSummaryData;
  invoiceCountData;
  transactionCount = {
    invoice: 0,
    bill: 0,
    payment: 0,
    receipt: 0,
  };
  transactionNoRecordDisp = {
    invoice: false,
    invoiceCount: false
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
  status: any;
  // Chart variable declartions
  constructor(private salesService: SalesService, private storageservice: LocalStorageService,
    private dashboardService: DashboardService,
    private router: Router, private UtilsService: UtilsService,
    private ConvertProToInvService: ConvertProformaToInvoiceService,
    private messageservice: MessagesService,
    private featureservice: FeaturesService,
    private confirmationService: ConfirmationService
  ) {
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
    this.prochangestatus = [];
    this.prochangestatus.push({ label: 'All', value: null });
    for (var i = 0; i < this.status.length; i++) {
      this.prochangestatus.push({
        label: this.status[i].stat, value: this.status[i].stat
      });
    }
    console.log('this.finyear', this.finyear)
  }

  ngOnInit() {
    this.proformainvoiceCnxtmenu = [
      {
        label: 'Convert to Invoice',
        icon: 'fa-exchange',
        command: (event) => {
          this.convertProToInvoice();
          //event.originalEvent: Browser event
          //event.item: menuitem metadata

        }
      }
    ];
    this.initBarChartConfig();
    this.initLineChartConfig();
    // Begin     
    let commonParam: any = {};
    commonParam.tenantid = this.userstoragedata.tenantid;
    commonParam.finyear = this.finyear.finyear;

    this.getInvoiceSummary(commonParam);
    this.getInvoiceCountSummary(commonParam);
    this.invoicelistmainmenu = [
      {
        label: 'B2B Invoice', icon: 'fa-plus', command: (event) => {
          //event.originalEvent: Browser event
          //event.item: menuitem metadata
          this.router.navigate(['sales/addedit']);
        }
      },
      {
        label: 'B2C Invoice', icon: 'fa-plus', command: (event) => {
          //event.originalEvent: Browser event
          //event.item: menuitem metadata
          this.router.navigate(['sales/maliciousinvoice']);
        }
      },
      {

        label: 'Pro forma', icon: 'fa-plus', command: (event) => {
          //event.originalEvent: Browser event
          //event.item: menuitem metadata
          this.router.navigate(['sales/proformaadd']);
        }
      },
    ];

    var self = this;

    this.invoicereqData = {
      tenantid: this.userstoragedata.tenantid,
      finyear: this.finyear.finyear,
      feature: 'invoice',
      status: 'Active'
    };
    this.proformainvoicereqData = {
      tenantid: this.userstoragedata.tenantid,
      finyear: this.finyear.finyear,
      feature: 'proforma_invoice',
      status: 'Active'
    };
    this.miscellaneousinvoicereqData = {
      tenantid: this.userstoragedata.tenantid,
      finyear: this.finyear.finyear,
      feature: 'cai_invoice',
      status: 'Active'
    };
    this.getInvoiceList();
    this.getProformaInvoiceList();
    this.getmiscellaneousInvoiceList();
    // this.salesService.getInvoiceList(data)
    //   .then(function (res) {

    //   });
  }

  convertProSelection(item) {
    this.selectedProforma = item;
    this.convertProToInvoice();
  }
  convertProToInvoice() {
    if (this.selectedProforma.detailid == null) {
      this.ConvertProToInvService.convertToInoice(this.selectedProforma);
      var response: any = this.ConvertProToInvService.prepareData().then((response) => {
        if (!_.isEmpty(response)) {
          if (response.status) {
            this.getProformaInvoiceList();
          }
        }
      });

    }
    else {
      this.messageservice.showMessage({
        severity: 'error',
        summary: 'Error', detail: 'Already converted.'
      }, true);
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
  initLineChartConfig() {
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
            return self.currencyFilter.transform(tooltipItems.yLabel, 'USD', true, '1.0-0').substr(3);
          }
        }
      };
  }
  getInvoiceSummary(queryParam) {
    let label_1 = 'Total Open Invoice (INR)';
    let label_2 = 'Total Due Invoice (INR)';
    this.dashboardService.getInvoiceSummary(queryParam)
      .then((response: any) => {
        if (response.status) {
          if (!response.data || !response.data.length) {
            this.invoiceSummaryData = this.dashboardService.getDefaultBarChartData(label_1, label_2);
            this.transactionNoRecordDisp.invoice = true;
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
            },
            {
              label: label_2,
              backgroundColor: '#e9453b',
              borderColor: '#e9453b',
              data: []
            }

          ];
          let isNonZeroExists = false;
          let minamount = response.data[0].invamount;
          let maxamount = response.data[0].invamount;
          _.forEach(response.data, (value: any) => {

            if (value.invamount || value.balamount) {
              isNonZeroExists = true;
            }

            if (value.invamount > maxamount) {
              maxamount = value.invamount;
            }
            else if (value.invamount < minamount) {
              minamount = value.invamount;
            }

            datasets[0].data.push(value.invamount);
            datasets[1].data.push(value.balamount);
            labels.push(value.label);
          });

          if (!isNonZeroExists) {
            this.invoiceSummaryData = this.dashboardService.getDefaultBarChartData(label_1, label_2);
            this.transactionNoRecordDisp.invoice = true;
            return;
          }

          invoiceChartData.labels = labels;
          invoiceChartData.datasets = datasets;

          // Prepare Chart Config Object
          var self = this;
          this.invoiceSummaryData = invoiceChartData;
        }
        else {
          this.invoiceSummaryData = this.dashboardService.getDefaultBarChartData(label_1, label_2);
          this.transactionNoRecordDisp.invoice = true;
        }

      })
  }

  getInvoiceCountSummary(queryParam) {
    let label_1 = 'Total Invoice';
    this.dashboardService.getInvoiceCountSummary(queryParam)
      .then((response: any) => {
        if (response.status) {
          if (!response.data || !response.data.length) {
            this.invoiceCountData = this.dashboardService.getDefaultLinearChartData(label_1);
            this.transactionNoRecordDisp.invoiceCount = true;
            return false;
          }
          let invoiceChartData: any = {};
          let labels = [];
          let datasets = [
            {
              label: label_1,
              backgroundColor: '#42A5F5',
              borderColor: '#1E88E5',
              fill: false,
              data: []
            }
          ];
          let isNonZeroExists = false;
          let minamount = response.data[0].count;
          let maxamount = response.data[0].count;
          _.forEach(response.data, (value: any) => {

            if (value.count) {
              isNonZeroExists = true;
            }

            if (value.count > maxamount) {
              maxamount = value.count;
            }
            else if (value.count < minamount) {
              minamount = value.count;
            }
            datasets[0].label = 'Invoice Count';
            datasets[0].data.push(value.count);
            labels.push(value.label);
          });
          if (!isNonZeroExists) {
            this.invoiceCountData = this.dashboardService.getDefaultLinearChartData(label_1);
            this.transactionNoRecordDisp.invoiceCount = true;
            return;
          }
          invoiceChartData.labels = labels;
          invoiceChartData.datasets = datasets;
          // Prepare Chart Config Object
          var self = this;
          this.invoiceCountData = invoiceChartData;
        }
        else {
          this.invoiceCountData = this.dashboardService.getDefaultLinearChartData(label_1);
          this.transactionNoRecordDisp.invoiceCount = true;
        }
      })
  }

  showhidefilter(datatable, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(datatable, this.show, btnid);
  }

  getInvoiceList() {
    this.salesService.getInvoiceList(this.invoicereqData)
      .then(res => {
        this.invoicelist = res.data;
      });
  }
  getProformaInvoiceList() {
    this.salesService.getInvoiceList(this.proformainvoicereqData)
      .then(res => {
        this.proformainvoicelist = res.data;
        console.log(this.proformainvoicelist);
      });
  }
  getmiscellaneousInvoiceList() {
    this.salesService.getInvoiceList(this.miscellaneousinvoicereqData)
      .then(res => {
        this.miscellaneousinvoicelist = res.data;
        console.log('miscellaneousinvoicelist', this.miscellaneousinvoicelist);
      });
  }
  loadData(event) {
    //event.first = First row offset
    //event.rows = Number of rows per page
    console.log(event);
  }
  addTabViewinvoice(item) {
    this.activeTab = '-';
    if (this.selectedinvoice.length > 0) {
      this.selectedinvoice.unshift(item);
    }
    else {
      this.selectedinvoice.push(item);
    }
    this.activeTab = item.invoiceno;
  }
  handletabClose(e) {
    // alert(e);
    e.close();

  }
  handleTabChange(e, menu) {
    console.log(e);
  }
  onContextSelect(event) {
    console.log(event);
  }
  pdfdownload(invoiceid, refno) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.INVOICE.REPORT_NAME, this.userstoragedata);
    data.reportparams = 'invoiceid:' + invoiceid;
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        this.UtilsService.saveToFileSystem(data, 'application/pdf', refno, '.pdf');
        return data;
      },
      error => {
        return error;

      }
      );
  }
  // Delete record
  deleteRecord(data, type) {

    let formdata = {} as any;
    formdata = { invoiceid: data.invoiceid, invoiceno: data.invoiceno, feature: data.feature };
    this.confirmationService.confirm({
      message: PrimengConstant.GLOBAL_ERROR.DELETE_CONFIRM_MSG,
      accept: () => {
        formdata.status = PrimengConstant.COMMON.TRANS_STATUS.DELETED;
        this.salesService.deleteInvoice(formdata).then(res => {
          if (res.status) {
            if (type === 'b2b') {
              this.getInvoiceList();
            } else if (type === 'b2c') {
              this.getmiscellaneousInvoiceList()
            } else {
              this.getProformaInvoiceList()
            }
            this.messageservice.showMessage({
              severity: 'success', summary: 'Success',
              detail: PrimengConstant.JOURNALS.DELETESUCCESS
            });
          } else {
            this.messageservice.showMessage({
              severity: 'error', summary: 'Error',
              detail: res.message
            });
          }
        });
      }
    });
  }
  edit(data, type) {
    data.type = 'INVOICE';
    this.salesService.validateTransaction(data).then(res => {
      if (res.status) {
        if (type === 'b2b') {
          this.router.navigate(['/sales/editinvoice', data.invoiceid]);
        } else if (type === 'b2c') {
          this.router.navigate(['/sales/editmiscellaneousinvoice', data.invoiceid]);
        } else {
          this.router.navigate(['/sales/editproformainvoice', data.invoiceid]);
        }
      } else {
        this.messageservice.showMessage({
          severity: 'error', summary: 'Error',
          detail: res.message
        });
      }
    });
  }
}
