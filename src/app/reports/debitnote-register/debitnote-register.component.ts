import { Component, OnInit } from '@angular/core';
import { AppConstant } from './../../app.constant';
import { LocalStorageService } from '../../shared/local-storage.service';
import { UtilsService } from '../../services/utils.service'
import * as _ from "lodash";
import { FeaturesService } from "../../services/features.service";
import { PrimengConstant } from "../../app.primeconfig";
import { MessagesService } from '../../shared/messages.service';
import { ConfirmationService, ConfirmDialog } from 'primeng/primeng';
import { AccountsService } from '../../accounts/service/accounts.service';
import { MasterService } from '../../services/master.service';
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { DateformatPipe } from '../../pipes/dateformat.pipe';
@Component({
  selector: 'app-debitnote-register',
  templateUrl: './debitnote-register.component.html',
  styleUrls: ['./debitnote-register.component.scss']
})
export class DebitnoteRegisterComponent implements OnInit {

  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  private date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  public paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES; userdetails: any
  alldebit: any = [];
  finyear: any;
  dataFormat: string;
  currency_Symbol: string;
  invoiceDate: any;
  currentDate: any;
  DueDate: any;
  contactlist: any;
  allcontacts: any;
  selectedCon: any;
  selectedContact: any;
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];
  fromdate: any;
  todate: any;
  validation: any;
  validationMsg: any;
  constructor(private AccountsService: AccountsService,
    private LocalStorageService: LocalStorageService,
    private UtilsService: UtilsService,
    private featureservice: FeaturesService,
    private dateFormatPipeFilter: DateformatPipe,
    private masterservice: MasterService,
    private messageService: MessagesService,
    private _hotkeysService: HotkeysService,
    private confirmationService: ConfirmationService) {
    this.userdetails = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.dataFormat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    // Download
    this.hotkeyDownload = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.DOWNLOAD.KEY, (event: KeyboardEvent): boolean => {
      this.pdfdownload(this.selectedCon, this.invoiceDate, this.DueDate);
      return false;
    }));
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.invoiceDate = this.currentDate;
    this.DueDate = this.currentDate;
    this.crdrgetall(this.currentDate, this.currentDate);
    this.getAllContacts();

  }
  crdrgetall(frmdt, todt) {
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

      "startCreatedDt": this.fromdate,
      "endCreatedDt": this.todate,
      "query": {
        "tenantid": this.userdetails.tenantid,
        "type": "DRNOTE"
      }

    }
    if (!_.isEmpty(this.selectedContact)) {
      data.contactid = [this.selectedContact.contactid];
    }
    if (this.validation) {
      this.AccountsService.FindAllAccounts(data).then((res) => {
        if (res.status) {
          this.alldebit = res.data;
        }
        else {
          this.alldebit = [];
        }

      })
    } else {
      this.messageService.showMessage({
        severity: 'error', summary: 'Error',
        detail: this.validationMsg
      });
    }
  }
  onContactSelect(item) {
    this.selectedContact = item.value;
  }
  getAllContacts() {
    var data = {
      tenantid: this.userdetails.tenantid,
      status: "Active",
      contactype: "Vendor"
    };
    this.featureservice.contactGetAll(data)
      .then((res) => {
        this.allcontacts = res.data;
        this.contactlist = this.masterservice.formatDataforDropdown("firstname", this.allcontacts, "All");
      });
  }
  pdfdownload(contactdet, fromdate, todate) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.DEBIT_NOTE_REG.REPORT_NAME, this.userdetails);
    data.reportparams = this.UtilsService.prepareReportParams({
      'contactid': contactdet ? contactdet.contactid : 'All',
      'fromdt': this.dateFormatPipeFilter.transform(fromdate, this.date_apiformat),
      'todt': this.dateFormatPipeFilter.transform(todate, this.date_apiformat)
    });
    console.log("Data", data)
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        this.UtilsService.saveToFileSystem(data, "application/pdf", AppConstant.REPORTS.DEBIT_NOTE_REG.PREFIX_NAME, ".pdf");
        return data;
      },
      error => {
        return error;

      }
      );
  }
}
