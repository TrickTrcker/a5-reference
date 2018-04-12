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
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit, OnDestroy {
  // utilsservice: any;
  featureservice: any;
  userstoragedata: any;
  @Input()
  externalinput: boolean = false;
  @Input()
  externalsubaccheadid: any;
  @Input()
  externalstartdate: any;
  @Input()
  externalenddate: any;
  fromdt: any;
  todt: any;

  ledgerlist: any[] = [];
  FilteredLedgerList: any[] = [];
  Lvl1LedgerList: any = {};
  isLevel1Ledger : boolean = false;
  localstorageDetails: any;
  finyear: any;
  ledgerFilterForm: FormGroup;
  startdt: FormControl;
  enddt: FormControl;
  accheadname: FormControl;
  currentDate: any;
  dispDateFormat: string = AppConstant.API_CONFIG.DATE.displayFormat;
  public date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  selectedLedger: any;

  creditTotal: any = 0;
  debitTotal: any = 0;
  closingbalance : any = 0;
  msgs: Message[] = [];
  Allledger: any;
  companyname: any = "jjiji";
  invoiceLedgerdata: any[] = [];
  journalLedgerdata: any[] = [];
  transactionledgerdata: any[] = [];
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];
  bookdetails: any ;
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
      'startdt': [new Date(), Validators.required],
      'enddt': [new Date(), Validators.required],
      'accheadname': [null, Validators.required]
    })
    this.dispDateFormat = AppConstant.API_CONFIG.DATE.displayFormat;
  }
  ngOnInit() {
    this.currentDate = new Date();
    this.startdt = this.currentDate;
    this.enddt = this.currentDate;
    this.filterLedger();
    if (this.externalinput) {
      if (this.externalstartdate == "" || this.externalenddate == "") {
        var sdate = moment(this.finyear.YearStartsFrom, "DD-MM-YYYY").toDate();
        var edate = moment(this.finyear.YearEndsOn, "DD-MM-YYYY").toDate();
        this.externalstartdate = this.dateFormatPipeFilter.transform(sdate, this.date_apiformat);
        this.externalenddate = this.dateFormatPipeFilter.transform(edate, this.date_apiformat);
      }
      var formdata = {
        'tenantid': this.localstorageDetails.tenantid,
        'finyear': this.finyear.finyear,
        'accheadid': this.externalsubaccheadid,
        'startdt': this.externalstartdate,
        'enddt': this.externalenddate
      }
      this.getLedgerBookDetails(this.externalsubaccheadid);
      this.getledgerreport(formdata);
    }
  }
  getLedgerBookDetails(data)
  {
  var self = this;
  this.masterservice.BookGetById(data)
    .then(function (res) {
      console.log(res);
      if (res.status) {
        
      }
      else {
       
      }
    });
  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyDownload);
    this._hotkeysService.remove(this.hotkeyClose);
  }
  filterLedger() {
    this.reportservice.getLedgerlist({ tenantid: [this.localstorageDetails.tenantid, 0] }).then((res) => {
      if (res.status == true) {
        this.ledgerlist = [];
        this.Allledger = [];
        this.Allledger = res.data;
        this.ledgerlist = this.masterservice.formatDataforDropdown("subaccheadname", this.Allledger, "Select ledger");
        // this.ledgerlist.push({ label: 'Select Ledger', value: null });
        // for (var i = 0; i < res.data.length; i++) {
        //   this.ledgerlist.push({
        //     label: res.data[i].subaccheadname, value: {
        //       subaccheadname: res.data[i].subaccheadname,
        //       subaccheadid: res.data[i].subaccheadid
        //     }
        //   });
        // }
      }
    });

  }
  formObj: any = {
    startdt: {
      required: PrimengConstant.COMMONREG.FROMDATE
    },
    enddt: {
      required: PrimengConstant.COMMONREG.TODATE
    },
    accheadname: {
      required: PrimengConstant.COMMONREG.LEDGER
    }
  }

  search(data) {

    if (this.ledgerFilterForm.status == "INVALID") {
      var errorMessage = this.masterservice.getFormErrorMessage(this.ledgerFilterForm, this.formObj);
      this.messageService.showMessage({ severity: 'error', summary: 'Error Message', detail: errorMessage });
      return false;
    }

    var formdata = {
      'tenantid': this.localstorageDetails.tenantid,
      'finyear': this.finyear.finyear,
      'accheadid': data.accheadname.subaccheadid,
      'startdt': this.dateFormatPipeFilter.transform(data.startdt, this.date_apiformat),
      'enddt': this.dateFormatPipeFilter.transform(data.enddt, this.date_apiformat),
    }
    var childrenbooks = _.filter(this.Allledger,{"accheadid" : data.subaccheadid });

    if(childrenbooks.length > 0)
    {
      this.getledgerreport(formdata,true);
    }
    else
    {
      this.getledgerreport(formdata,false);
    }
  }
  formatTree(formdata,transdata)
  {
    this.Lvl1LedgerList = {};
    var ledger = _.find(this.Allledger,{ "subaccheadid" : formdata.accheadid });
    if(! _.isEmpty(ledger))
    {
  var fdata = this.UtilsService.ledgerLevlTrans_formater(this.Allledger,ledger,transdata);
  this.Lvl1LedgerList =fdata;
    }
  }
  getledgerreport(formdata,isLevel1 = false) {
    this.creditTotal = 0;
    this.debitTotal = 0;
    this.closingbalance = 0;
    console.log("formdata", formdata);
    this.isLevel1Ledger = isLevel1;
    this.reportservice.getFilteredLedgerlist(formdata).then((res) => {
      console.log("table data", res);
      if (res.status == true) {
        if(isLevel1)
        {
          this.formatTree(formdata,res.data);
        }
        else{
          this.FilteredLedgerList = res.data;
          console.log("ledger data:", this.FilteredLedgerList);
          for (var i = 0; i < res.data.length; i++) {
            this.creditTotal += parseFloat(res.data[i].credit);
            this.debitTotal += parseFloat(res.data[i].debit);
            this.closingbalance = 0;
          }
        }
      }
      else {
        this.FilteredLedgerList = [];
      }
    });


  }
  viewtransaction(item, addTab) {
    var transactionitem = {
      txnrefno: item.txnrefno,
      label: "TXN - " + item.txnrefno,
      feature: item.feature,
      txnid: item.txnid
    };
    this.UtilsService.activate_multitab(this.transactionledgerdata, transactionitem, addTab, "label");

  }
  viewfeatures(item, addTab, mode) {
    console.log("item", item);
    var label = "";
    if (mode == "ledgerview") {
      label = "LDGR - " + item.txnrefno;
    }
    else if (mode == "txnview") {
      label = "TXN - " + item.txnrefno;
    }
    var transactionitem = {
      txnrefno: item.txnrefno,
      label: label,
      feature: item.feature,
      txnid: item.txnid,
      mode: mode,
      tabinsertion: "last"
    };
    this.UtilsService.activate_multitab(this.invoiceLedgerdata, transactionitem, addTab, "label");

    // else if (featuredata.feature == "Payment") {
    //   this.router.navigate(['payment', 'viewpayment', 'fromledger', featuredata.txnid]);
    // }
    // else if (featuredata.feature == "Receipt") {
    //   this.router.navigate(['receipts', 'viewreceipt', 'fromledger', featuredata.txnid]);
    // }
    // else if (featuredata.feature == "Bill") {
    //   this.router.navigate(['purchase', 'viewbill', 'fromledger', featuredata.txnid]);
    // }
    // else if (featuredata.feature == "invoice") {
    //   this.router.navigate(['sales', 'viewinvoice', 'fromledger', featuredata.txnid]);
    // }
    // else if (featuredata.feature == "proforma_invoice") {
    //   this.router.navigate(['sales', 'viewinvoice', 'fromledger', featuredata.txnid]);
    // }
    // else if (featuredata.feature == "CRNOTE") {
    //   this.router.navigate(['accounts', 'viewcrnote', 'fromledger', featuredata.txnid, featuredata.txnrefno]);
    // }
    // else if (featuredata.feature == "DRNOTE") {
    //   this.router.navigate(['sales', 'viewinvoice', 'fromledger', featuredata.txnid]);
    // }
    // console.log(featuredata);
    // this.router.navigate(['/sales/viewinvoice'], { queryParams: { "invoiceid": "2" } });

  }
  transactionDetails() {
    console.log("tansaction");
  }
  handleClose(event, addTab) {
    this.UtilsService.deactivate_multitab(this.invoiceLedgerdata, event, addTab, "transno");
  }

  // PDF Download
  pdfdownload(inputdata) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.LEDGER_REGISER.REPORT_NAME, this.localstorageDetails);
    data.reportparams = this.UtilsService.prepareReportParams({
      'tenantid': this.localstorageDetails.tenantid,
      'finyear': this.finyear.finyear,
      'accheadid': inputdata.accheadname ? inputdata.accheadname.subaccheadid : 'All',
      'fromdt': this.dateFormatPipeFilter.transform(inputdata.startdt, this.date_apiformat),
      'todt': this.dateFormatPipeFilter.transform(inputdata.enddt, this.date_apiformat)
    });
    var res = this.featuresservice.reportDownload(data)
      .subscribe(
      data => {
        console.log(data);
        this.UtilsService.saveToFileSystem(data, "application/pdf", AppConstant.REPORTS.LEDGER_REGISER.PREFIX_NAME, ".pdf");
        return data;
      },
      error => {
        console.error(error);
        return error;

      }
      );
  }

}




