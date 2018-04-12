import { DropdownModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { SalesService } from '../../services/sales/sales.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { DashboardService } from '../../services/dashboard.service';
import { AppConstant } from '../../app.constant';
import { ContextMenuModule, MenuItem } from 'primeng/primeng';
import { Router, NavigationExtras } from '@angular/router';
import * as _ from "lodash";
import { CurrencyPipe } from "@angular/common";
import { FeaturesService } from '../../services/features.service';
import { MasterService } from '../../services/master.service';
import { ReportService } from '../../services/reports/reports.service'
import { DateformatPipe } from '../../pipes/dateformat.pipe';
import { MessagesService } from '../../shared/messages.service';
import { ViewPaymentComponent } from '../../payment/view-payment/view-payment.component';
import { UtilsService } from '../../services/utils.service';
import { PrimengConstant } from '../../app.primeconfig';
import { HotkeysService, Hotkey } from "angular2-hotkeys";
@Component({
  selector: 'app-invoice-taxation',
  templateUrl: './invoice-taxation.component.html',
  styleUrls: ['./invoice-taxation.component.scss']
})
export class InvoiceTaxationComponent implements OnInit {
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  private date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  public paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES;
  cities: SelectItem[];
  value: Date;
  selectedCity: string;
  userstoragedata: any;
  finyear: any;
  currencyFilter: any;
  list: any;
  contactlist: any;
  allcontacts: any;
  selectedCon: any;
  selectedContact: any;
  invoiceDate: any;
  currentDate: any;
  DueDate: any;
  show: boolean = false;
  validation: any;
  validationMsg: any;
  InvoiceNumber: any;
  fromdate: any;
  todate: any;
  pymtrectno: any;
  selectedpymntrec: any = [];
  activeTab: String = "-";
  invoicereqData: any = [];
  proformainvoicereqData: any = [];
  activetabindex: number = 0;
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];

  constructor(
    private salesService: SalesService,
    private storageservice: LocalStorageService,
    private dashboardService: DashboardService,
    private router: Router,
    private featureservice: FeaturesService,
    private masterservice: MasterService,
    private reportService: ReportService,
    private dateFormatPipeFilter: DateformatPipe,
    private messageService: MessagesService,
    private UtilsService: UtilsService,
    private _hotkeysService: HotkeysService) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    // Back to list form
    this.hotkeyClose = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/list']);
      return false;
    }));
    // Download
    this.hotkeyDownload = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.DOWNLOAD.KEY, (event: KeyboardEvent): boolean => {
      this.pdfdownload(this.selectedCon, this.invoiceDate, this.DueDate);
      return false;
    }));
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.currencyFilter = new CurrencyPipe("en-in");
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.invoiceDate = this.currentDate;
    this.DueDate = this.currentDate;
    this.getInvoiceTaxation(this.currentDate, this.currentDate);
    this.getAllContacts();
  }
  pdfdownload(contactdet, fromdate, todate) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.INVOICE_TAXATION.REPORT_NAME, this.userstoragedata);
    data.reportparams = this.UtilsService.prepareReportParams({
      'contactid': contactdet ? contactdet.contactid : 'All',
      'fromdt': this.dateFormatPipeFilter.transform(fromdate, this.date_apiformat),
      'todt': this.dateFormatPipeFilter.transform(todate, this.date_apiformat)
    });
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        this.UtilsService.saveToFileSystem(data, "application/pdf", AppConstant.REPORTS.INVOICE_TAXATION.PREFIX_NAME, ".pdf");
        return data;
      },
      error => {
        return error;

      }
      );
  }
  getAllContacts() {
    var data = {
      tenantid: this.userstoragedata.tenantid,
      status: "Active",
      contactype: "Customer"
    };
    this.featureservice.contactGetAll(data)
      .then((res) => {
        this.allcontacts = res.data;
        this.contactlist = this.masterservice.formatDataforDropdown("firstname", this.allcontacts, "All");
      });
  }
  onContactSelect(item) {
    this.selectedContact = item.value;
  }

  getInvoiceTaxation(frmdt, todt) {
    this.fromdate = this.dateFormatPipeFilter.transform(frmdt, this.date_apiformat);
    this.todate = this.dateFormatPipeFilter.transform(todt, this.date_apiformat);
    this.validation = true;
    this.validationMsg = ""
    if (_.isEmpty(this.fromdate)) {
      this.validation = false;
      this.validationMsg = PrimengConstant.COMMONREG.FROMDATE
    }
    else if (_.isEmpty(this.todate)) {
      this.validation = false;
      this.validationMsg = PrimengConstant.COMMONREG.TODATE
    }
    if (this.fromdate > this.todate) {
      this.validation = false;
      this.validationMsg = PrimengConstant.COMMONREG.VALIDDATE
    }
    var data: any = {
      'tenantid': this.userstoragedata.tenantid,
      'finyear': this.finyear.finyear,
      'type': 'invoicetaxation',
      "startdt": this.fromdate,
      "enddt": this.todate,
    }
    if (!_.isEmpty(this.selectedContact)) {
      data.contactid = this.selectedContact.contactid;
    }
    if (this.validation) {
      this.reportService.getInvTaxReport(data).then((res) => {
        this.list = res.data;
      })
    }
    else {
      this.messageService.showMessage({
        severity: 'error', summary: 'Error',
        detail: this.validationMsg
      });
    }
  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyDownload);
    this._hotkeysService.remove(this.hotkeyClose);
  }
}
