import { DropdownModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { InvoiceDataTable } from '../../sales/invoice-data-table.interface';
import { SalesService } from '../../services/sales/sales.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { DashboardService } from '../../services/dashboard.service';
import { AppConstant } from '../../app.constant';
import { ViewInvoiceComponent } from '../../sales/view-invoice/view-invoice.component';
import { ContextMenuModule, MenuItem } from 'primeng/primeng';
import { Router, NavigationExtras } from '@angular/router';
import * as _ from "lodash";
import { CurrencyPipe } from "@angular/common";
import { FeaturesService } from '../../services/features.service';
import { MasterService } from '../../services/master.service';
import { ReportService } from '../../services/reports/reports.service'
import { DateformatPipe } from '../../pipes/dateformat.pipe';
import { MessagesService } from '../../shared/messages.service';
import { UtilsService } from '../../services/utils.service';
import { PrimengConstant } from '../../app.primeconfig';
import { Hotkey, HotkeysService } from "angular2-hotkeys";



@Component({
  selector: 'app-invoice-register',
  templateUrl: './invoice-register.component.html',
  styleUrls: ['./invoice-register.component.scss']
})
export class InvoiceRegisterComponent implements OnInit, OnDestroy {
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  private date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  public paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES;
  value: Date;
  selectedCar: string;
  invoicelist: any = [];
  userstoragedata: any;
  finyear: any;
  selectedinvoice: any = [];
  activeTab: String = "-";
  invoicereqData: any = [];
  proformainvoicereqData: any = [];
  currencyFilter: CurrencyPipe;
  contactlist: any;
  allcontacts: any;
  selectedcontact: any;
  selectedContact: any;
  invoiceDate: any;
  currentDate: any;
  DueDate: any;
  validation: any;
  show: boolean = false;
  validationMsg: any;
  InvoiceNumber: any;
  fromdate: any;
  tabs: boolean = false
  todate: any;
  list: boolean = true;
  activetabindex: number = 0;
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];
  hotkeyEnter: Hotkey | Hotkey[];
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
      this.pdfdownload(this.selectedcontact, this.invoiceDate, this.DueDate);
      return false;
    }));
    // Enter
    this.hotkeyEnter = this._hotkeysService.add(new Hotkey(PrimengConstant.SHORTCUTKEYS.ENTER, (event: KeyboardEvent): boolean => {
      this.getInvoiceList(this.invoiceDate, this.DueDate);
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
    this.getInvoiceList(this.currentDate, this.currentDate);
    this.getAllContacts();
  }
  pdfdownload(contactdet, fromdate, todate) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.INVOICE_REGISTER.REPORT_NAME, this.userstoragedata);
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
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        // if(flag == "download"){
        this.UtilsService.saveToFileSystem(data, "application/pdf",AppConstant.REPORTS.INVOICE_REGISTER.PREFIX_NAME , ".pdf");
        // }
        // else if(flag == "print"){
        //   let printContents = data; 
        //   let popupWin;
        //   popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        //   popupWin.document.open();
        //   popupWin.document.write(`<html><body onload="window.print();windowCOMMON.CLOSE.KEY()">${printContents}</body></html>`
        // );
        // }
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
        // console.log("contactlist", this.contactlist)
      });
  }
  onContactSelect(item) {
    this.selectedContact = item.value;
  }

  getInvoiceList(frmdt, todt) {
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
    this.invoicereqData = {
      startdt: this.fromdate,
      enddt: this.todate,
      tenantid: this.userstoragedata.tenantid,
      feature: "invoice",
      status: "Active",
      // offset: 0,
      // limit: 10
    };
    if (!_.isEmpty(this.selectedContact)) {
      this.invoicereqData.contactid = this.selectedContact.contactid;
    }
    if (!_.isEmpty(this.InvoiceNumber)) {
      this.invoicereqData.invoiceno = this.InvoiceNumber;
    }
    if (this.validation) {
      this.reportService.GetInvoiceReportlist(this.invoicereqData)
        .then(res => {
          this.invoicelist = res.data;
          // console.log(this.invoicelist);
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
    this.UtilsService.activate_multitab(this.selectedinvoice, item, addTabViewinvoice, "invoiceno");
  }
  handleTabClose(event, addTabViewinvoice) {
    this.UtilsService.deactivate_multitab(this.selectedinvoice, event, addTabViewinvoice, "invoiceno");
  }
  handletabClose(e) {
    e.close();
  }
  handleTabChange(e, menu) {
    console.log(e);
  }
  showhidefilter(allreceipt, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(allreceipt, this.show, btnid);

  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyDownload);
    this._hotkeysService.remove(this.hotkeyClose);
    this._hotkeysService.remove(this.hotkeyEnter);
  }
}
