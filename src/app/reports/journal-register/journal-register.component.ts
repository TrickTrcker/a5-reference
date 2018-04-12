import { DropdownModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import { ContextMenuModule, MenuItem } from 'primeng/primeng';
import { Router, NavigationExtras } from '@angular/router';
import * as _ from "lodash";
import { CurrencyPipe } from "@angular/common";
import { FeaturesService } from '../../services/features.service';
import { MasterService } from '../../services/master.service';
import { DateformatPipe } from '../../pipes/dateformat.pipe';
import { MessagesService } from '../../shared/messages.service';
import { ViewPaymentComponent } from '../../payment/view-payment/view-payment.component';
import { UtilsService } from '../../services/utils.service';
import { PrimengConstant } from '../../app.primeconfig';
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { JournalsService } from '../../accounts/service/journals.service';
@Component({
  selector: 'app-journal-register',
  templateUrl: './journal-register.component.html',
  styleUrls: ['./journal-register.component.scss']
})
export class JournalRegisterComponent implements OnInit {
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  private date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  public paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES;
  value: Date;
  userstoragedata: any;
  finyear: any;
  currencyFilter: any;
  list: any;
  journalfeat: any;
  selectedCon: any;
  selectedContact: any;
  invoiceDate: any;
  currentDate: any;
  DueDate: any;
  show: boolean = false;
  validation: any;
  validationMsg: any;
  fromdate: any;
  todate: any;
  journalType: any;
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];
  constructor(
    private storageservice: LocalStorageService,
    private router: Router,
    private featureservice: FeaturesService,
    private masterservice: MasterService,
    private dateFormatPipeFilter: DateformatPipe,
    private messageService: MessagesService,
    private UtilsService: UtilsService,
    private journalService: JournalsService,
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
    this.getAllJournals(this.currentDate, this.currentDate);
    this.getAllCodeMasterFeatures();
  }
  pdfdownload(type, fromdate, todate) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.JOURNAL_REGISTER.REPORT_NAME, this.userstoragedata);
    data.reportparams = this.UtilsService.prepareReportParams({
      'type': type ? type : 'All',
      'fromdt': this.dateFormatPipeFilter.transform(fromdate, this.date_apiformat),
      'todt': this.dateFormatPipeFilter.transform(todate, this.date_apiformat)
    });
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        this.UtilsService.saveToFileSystem(data, "application/pdf", AppConstant.REPORTS.JOURNAL_REGISTER.PREFIX_NAME, ".pdf");
        return data;
      },
      error => {
        return error;

      }
      );
  }
  getAllCodeMasterFeatures() {
    let params: any = {};
    params.type = "JOURNAL";

    this.featureservice.getcodemasterList(params).then(res => {
      if (res.status) {
        this.journalfeat = this.masterservice.filterformatDataforDropdown("name", res.data, "All");
        this.journalType = this.journalfeat[0].value;
      }
    });
  };

  onContactSelect(item) {
    this.selectedContact = item.value;
  }

  getAllJournals(frmdt, todt) {
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
      "startdate": this.fromdate,
      "enddate": this.todate,
      "query": {
        "tenantid": this.userstoragedata.tenantid,
        "finyear": this.finyear.finyear,
        "feature": "Journal"
      }

    }
    if (!_.isEmpty(this.selectedContact)) {
      data.query.type = this.selectedContact;
    }
    console.log("Data", data);
    if (this.validation) {
      this.journalService.getAllJournals(data).then(res => {
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
