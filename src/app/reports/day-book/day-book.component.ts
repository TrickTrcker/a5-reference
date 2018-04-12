import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ReportService } from '../../services/reports/reports.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import { Router, NavigationExtras } from '@angular/router';
import { Message } from 'primeng/primeng';
import { MasterService } from '../../services/master.service';
import { MessagesService } from '../../shared/messages.service';
import { DateformatPipe } from '../../pipes/dateformat.pipe';
import * as moment from 'moment';
import { PrimengConstant } from '../../app.primeconfig';
import { UtilsService } from '../../services/utils.service';
import * as _ from "lodash";
import { FeaturesService } from '../../services/features.service';
import { LedgerviewComponent } from '../../shared/components/ledgerview/ledgerview.component';
import { HotkeysService, Hotkey } from "angular2-hotkeys";
@Component({
  selector: 'app-day-book',
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.scss']
})
export class DayBookComponent implements OnInit {
  FiltereddaybookList: any[] = [];
  localstorageDetails: any;
  finyear: any;
  ledgerFilterForm: FormGroup;
  ledgerdate: FormControl;
  currentDate: any;
  creditTotal: any = 0;
  debitTotal: any = 0;
  selectedLedger: any;
  dispDateFormat: string = AppConstant.API_CONFIG.DATE.displayFormat;
  public date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  utilsservice: any;
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];
  constructor(
    private fb: FormBuilder,
    private reportservice: ReportService,
    private localstorageservice: LocalStorageService,
    private dateFormatPipeFilter: DateformatPipe,
    private router: Router,
    private featuresservice: FeaturesService,
    private messageService: MessagesService,
    private masterservice: MasterService,
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
      this.pdfdownload(this.ledgerFilterForm.value);
      return false;
    }));
    this.localstorageDetails = this.localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.ledgerFilterForm = fb.group({
      'ledgerdate': [new Date(), Validators.required]
    })
    this.dispDateFormat = AppConstant.API_CONFIG.DATE.displayFormat;
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.ledgerdate = this.currentDate;
    var formdata = {
      'type': 'daybook',
      'tenantid': this.localstorageDetails.tenantid,
      'finyear': this.finyear.finyear,
      'ledgerdt': this.dateFormatPipeFilter.transform(this.ledgerdate, this.date_apiformat),
    }
    this.getdaybookreport(formdata);
  }
  formObj: any = {
    ledgerdate: {
      required: PrimengConstant.COMMONREG.LEDGERDATE
    }
  }
  search(data) {

    if (this.ledgerFilterForm.status == "INVALID") {
      var errorMessage = this.masterservice.getFormErrorMessage(this.ledgerFilterForm, this.formObj);
      this.messageService.showMessage({ severity: 'error', summary: 'Error Message', detail: errorMessage });
      return false;
    }

    var formdata = {
      'type': 'daybook',
      'tenantid': this.localstorageDetails.tenantid,
      'finyear': this.finyear.finyear,
      'ledgerdt': this.dateFormatPipeFilter.transform(data.ledgerdate, this.date_apiformat),
    }
    this.getdaybookreport(formdata);
  }
  getdaybookreport(formdata) {
    this.creditTotal = 0;
    this.debitTotal = 0;
    this.reportservice.getDBreport(formdata).then((res) => {
      if (res.status == true) {
        this.FiltereddaybookList = res.data;
        for (var i = 0; i < res.data.length; i++) {
          this.creditTotal += parseFloat(res.data[i].cramount);
          this.debitTotal += parseFloat(res.data[i].dramount);
        }
      }
      else {
        this.FiltereddaybookList = [];
      }
    });


  }
  // PDF Download
  pdfdownload(inputdata) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.DAYBOOK_REGISTER.REPORT_NAME, this.localstorageDetails);
    data.reportparams = 'ledgerdate:' + this.dateFormatPipeFilter.transform(inputdata.ledgerdate, this.date_apiformat);
    var res = this.featuresservice.reportDownload(data)
      .subscribe(
      data => {
        console.log(data);
        this.UtilsService.saveToFileSystem(data, "application/pdf", AppConstant.REPORTS.DAYBOOK_REGISTER.PREFIX_NAME, ".pdf");
        return data;
      },
      error => {
        return error;

      }
      );
  }
}
