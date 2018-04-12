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
  selector: 'app-payment-register',
  templateUrl: './payment-register.component.html',
  styleUrls: ['./payment-register.component.scss']
})
export class PaymentRegisterComponent implements OnInit, OnDestroy {
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
    this.getAllPayments(this.currentDate, this.currentDate);
    this.getAllContacts();
  }
  pdfdownload(contactdet, fromdate, todate) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.PAYMENT_REGISTER.REPORT_NAME, this.userstoragedata);
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
    console.log("DATA", data);
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        console.log(data);
        console.log("Time",contactdet)
        this.UtilsService.saveToFileSystem(data, "application/pdf",  AppConstant.REPORTS.PAYMENT_REGISTER.PREFIX_NAME , ".pdf");
        return data;
      },
      error => {
        console.error(error);
        return error;

      }
      );
  }
  getAllContacts() {
    var data = {
      tenantid: this.userstoragedata.tenantid,
      status: "Active",
      contactype: "Vendor"
    };
    this.featureservice.contactGetAll(data)
      .then((res) => {
        this.allcontacts = res.data;
        this.contactlist = this.masterservice.formatDataforDropdown("firstname", this.allcontacts, "All");
        console.log("contactlist", this.contactlist)
      });
  }
  onContactSelect(item) {
    this.selectedContact = item.value;
    console.log("SelectedContact", this.selectedContact);
  }

  getAllPayments(frmdt, todt) {
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
      "startdt": this.fromdate,
      "enddt": this.todate,
      'tenantid': this.userstoragedata.tenantid,
      'feature': "Payment",
      'finyear': this.finyear.finyear,
      // 'limit': 10,
      // 'offset': 0
    }
    if (!_.isEmpty(this.selectedContact)) {
      data.contactid = this.selectedContact.contactid;
    }
    if (this.validation) {
      this.reportService.GetPayRecReportlist(data).then((res) => {
        console.log("reclist", JSON.stringify(res));
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
  addTabViewinvoice(item, addTabViewinvoice) {
    this.UtilsService.activate_multitab(this.selectedpymntrec, item, addTabViewinvoice, "pymtrectno");
  }

  handleTabClose(event, closetab) {
    this.UtilsService.deactivate_multitab(this.selectedpymntrec, event, closetab, "pymtrectno");
  }
  showhidefilter(allreceipt, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(allreceipt, this.show, btnid);

  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyDownload);
    this._hotkeysService.remove(this.hotkeyClose);
  }
}
