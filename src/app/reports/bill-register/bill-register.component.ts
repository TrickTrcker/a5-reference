import { DropdownModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { InvoiceDataTable } from '../../sales/invoice-data-table.interface';
import { LocalStorageService } from '../../shared/local-storage.service';
import { DashboardService } from '../../services/dashboard.service';
import { AppConstant } from '../../app.constant';
import { ViewBillComponent } from '../../purchase/view-bill/view-bill.component';
import { ContextMenuModule, MenuItem } from 'primeng/primeng';
import { Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
import { CurrencyPipe } from '@angular/common';
import { FeaturesService } from '../../services/features.service';
import { MasterService } from '../../services/master.service';
import { ReportService } from '../../services/reports/reports.service'
import { DateformatPipe } from '../../pipes/dateformat.pipe';
import { MessagesService } from '../../shared/messages.service';
import { PurchasesService } from '../../services/purchases/purchases.service';
import { UtilsService } from '../../services/utils.service';
import { PrimengConstant } from '../../app.primeconfig';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-bill-register',
  templateUrl: './bill-register.component.html',
  styleUrls: ['./bill-register.component.scss']
})
export class BillRegisterComponent implements OnInit, OnDestroy {
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  private date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  public paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES;
  value: Date;
  selectedCar: string;
  billlist: any = [];
  userstoragedata: any;
  finyear: any;
  selectedbills: any = [];
  activeTab: String = '-';
  invoicereqData: any = [];
  proformainvoicereqData: any = [];
  currencyFilter: CurrencyPipe;
  contactlist: any;
  allcontacts: any;
  selectedContact: any;
  show = false;
  invoiceDate: any;
  currentDate: any;
  DueDate: any;
  validation: any;
  validationMsg: any;
  InvoiceNumber: any;
  cars: SelectItem[];
  billno: any;
  fromdate: any;
  todate: any;
  activetabindex: number = 0;
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];
  constructor(
    private purchaseservice: PurchasesService,
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
      this.pdfdownload(this.selectedContact, this.invoiceDate, this.DueDate);
      return false;
    }));
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.currencyFilter = new CurrencyPipe('en-in');
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.invoiceDate = this.currentDate;
    this.DueDate = this.currentDate;
    this.getBillList(this.currentDate, this.currentDate);
    this.getAllContacts();
  }
  pdfdownload(contactdet, fromdate, todate) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.BILL_REGISTER.REPORT_NAME, this.userstoragedata);
    data.reportparams = this.UtilsService.prepareReportParams({
      'contactid': contactdet ? contactdet.contactid : 'All',
      'fromdt': this.dateFormatPipeFilter.transform(fromdate, this.date_apiformat),
      'todt': this.dateFormatPipeFilter.transform(todate, this.date_apiformat)
    });
    //  this.featureservice.downloadsamplepdf(data);
    //  this.featureservice.report(data).then((res)=>{
    //   if(res.status){
    //    console.log("report feature",res.data);
    //   }

    // });
    const res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        this.UtilsService.saveToFileSystem(data, 'application/pdf', AppConstant.REPORTS.BILL_REGISTER.PREFIX_NAME, '.pdf');
        return data;
      },
      error => {
        return error;
      }
      );
  }

  getAllContacts() {
    const data = {
      tenantid: this.userstoragedata.tenantid,
      status: 'Active',
      contactype: 'Vendor'
    };
    this.featureservice.contactGetAll(data)
      .then((res) => {
        this.allcontacts = res.data;
        this.contactlist = this.masterservice.formatDataforDropdown('firstname', this.allcontacts, 'All');
      });
  }
  onContactSelect(item) {
    this.selectedContact = item.value;
  }

  getBillList(frmdt, todt) {
    this.fromdate = this.dateFormatPipeFilter.transform(frmdt, this.date_apiformat);
    this.todate = this.dateFormatPipeFilter.transform(todt, this.date_apiformat);
    this.validation = true;
    this.validationMsg = ''
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
    this.invoicereqData = {
      startdt: this.fromdate,
      enddt: this.todate,
      tenantid: this.userstoragedata.tenantid,
      // offset: 0,
      // limit: 10
    };
    if (!_.isEmpty(this.selectedContact)) {
      this.invoicereqData.contactid = this.selectedContact.contactid;
    }
    if (!_.isEmpty(this.billno)) {
      this.invoicereqData.billno = this.billno;
    }
    if (this.validation) {
      this.reportService.GetBillReportlist(this.invoicereqData)
        .then(res => {
          this.billlist = res.data;
        });
    }
    else {
      this.messageService.showMessage({
        severity: 'error', summary: 'Error',
        detail: this.validationMsg
      });
    }

  }
  addTabViewinvoice(item, addTabViewinvoice) {
    this.UtilsService.activate_multitab(this.selectedbills, item, addTabViewinvoice, 'billno');
  }
  handletabClose(event, closetab) {
    this.UtilsService.deactivate_multitab(this.selectedbills, event, closetab, 'billno');

  }
  showhidefilter(allreceipt, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(allreceipt, this.show, btnid);
  }

  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyDownload);
    this._hotkeysService.remove(this.hotkeyClose);
  }
}
