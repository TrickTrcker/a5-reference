import { Component, OnInit, Directive, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, ValidatorFn, AbstractControl }
  from '@angular/forms';
import { BanksService } from '../../service/banks.service';
import { MasterService } from '../../../services/master.service';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { AppConstant } from '../../../app.constant';
import { SelectItem } from 'primeng/primeng';
import { Http, Response } from '@angular/http';
import { PapaParseService } from 'ngx-papaparse';
import { UtilsService } from "../../../services/utils.service";
import { Message } from 'primeng/primeng';
import * as _ from "lodash";
import { MessagesService } from '../../../shared/messages.service';
import * as moment from "moment";
import { DateformatPipe } from '../../../pipes/dateformat.pipe';
import { Router, NavigationStart, NavigationExtras, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { DataTable } from 'primeng/primeng';
@Component({
  selector: 'app-brsmatching',
  templateUrl: './brsmatching.component.html',
  styleUrls: ['./brsmatching.component.scss']
})

export class BRSMatchingComponent implements OnInit {
  @Output()
  brsUpdateevent: EventEmitter<object> = new EventEmitter<object>();
  // @ViewChild('fromtodate_calendar') fromtodate_calendar: Calendar;
  @ViewChild('ledgerTable') ledgerTable: DataTable;
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  private userdetails: any;
  fromtodate: any = [];
  brsfromdate: Date = new Date();
  brstodate: Date = new Date();
  currentdate: any;
  BankList: SelectItem[];
  selectedbank: any = {};
  selectedTrans: any = {};
  selectedLedgers: any = [];
  duplicatedledgers : any = [];
  selectedbankstmtid : any;
  brslist: any = [];
  brsledgerList: any = [];
  finyear: any;
  ledgerdisplay: boolean = false;
  displayApplyOptions = false;
  extqueryParams: any = {};
  brstypeList = [
    { label: 'Unreconciliated', value: "U" },
    { label: 'Reconciliated', value: "R" }
  ];
  constructor(private BanksService: BanksService,
    private LocalStorageService: LocalStorageService,
    private masterService: MasterService,
    private router: Router,
    private actedroute: ActivatedRoute,
    private PapaParseService: PapaParseService, private http: Http, private utilservice: UtilsService,
    private messageservice: MessagesService, private dateFormatPipeFilter: DateformatPipe) {
    this.userdetails = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.currentdate = this.dateFormatPipeFilter.transform(new Date(), this.date_apiformat);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.getAllBankList();
    var fromdate = new Date();
    var todate = new Date();
    this.fromtodate = [
      fromdate,
      todate
    ];
    // this.getbrslist(false);
  }
  openpage(path) {
    this.router.navigate([path]);
    return false;
  }
  onBRSTypeSelect(event, selectedbrs, ridx, brslisttable) {
    this.brslist[ridx].reconstatus = event.value;
    this.brslist[ridx].reconstatus = event.value;
  }

  getbrslist(mode) {
    var stmtfromdt = this.dateFormatPipeFilter.transform(this.fromtodate[0], this.date_apiformat);
    var stmttodt = this.dateFormatPipeFilter.transform(this.fromtodate[1], this.date_apiformat);
    if (stmttodt == "") {
      stmttodt = stmtfromdt;
    }
    var self = this;
    // var data = {
    //   "startdate": stmtfromdt,
    //   "enddate": stmttodt,
    //   "limitsize": 1000,
    //   "offsetsize": 0,
    //   "accheadid": this.selectedbank.bankcode
    // };
    var data = {
      "bankstmtid": this.selectedbankstmtid
    };
    var error = false, errormessage = "";

    if (this.selectedbank.bankcode == "" || this.selectedbank.bankcode == undefined || this.selectedbank.bankcode == null) {
      error = true;
      errormessage = "Please select bank.";
    }
    if (!error) {
      self.brslist = [];
      this.BanksService.brsDetailsList(data)
        .then((res) => {
          if (res.status) {
            // self.brslist = res.data;
            var redata = [];
            _.forEach(res.data, function (d) {
              var data = {
                txnno: d.txnno,
                txndate: d.txndate,
                debit: d.debit,
                credit: d.credit,
                feature: "",
                bankstmtid: d.bankstmtid,
                bankstmtdtlid: d.bankstmtdtlid,
                pymtamount: "",
                openingbal: d.openingbal,
                closeingbal: d.closeingbal,
                recondate: d.recondate,
                reconstatus: d.reconstatus,
                remarks: d.remarks,
                description: d.description,
                matcheddata: []
              }
              redata.push(data);
            });
            self.brslist = redata;
          }
          else {
            if (mode) {
              self.messageservice.showMessage({
                severity: 'error',
                summary: 'Info', detail: "Unreconciled transactions not available."
              });
            }
          }
        });
    }
    else {
      // self.messageservice.showMessage({
      //   severity: 'error',
      //   summary: 'Info', detail: errormessage
      // });
    }

    // this.getledgerList();
  }

  getAllBankList() {
    var self = this;
    this.BanksService.getAllBanks({ tenantid: this.userdetails.tenantid, limit: 1000, offset: 0 })
      .then(res => {
        if (res.status) {

          self.BankList = self.masterService.formatDataforDropdown("bankname", res.data, "Select Bank");
          if (!_.isEmpty(self.extqueryParams)) {
            self.fromtodate = [];
            self.fromtodate.push(new Date(moment(self.extqueryParams.stmtfromdt, 'YYYY-MM-DD', true).format()));
            self.fromtodate.push(new Date(moment(self.extqueryParams.stmttodt, 'YYYY-MM-DD', true).format()));
            self.brsfromdate = new Date(moment(self.extqueryParams.stmtfromdt, 'YYYY-MM-DD', true).format());
            self.brstodate = new Date(moment(self.extqueryParams.stmttodt, 'YYYY-MM-DD', true).format());
            // self.fromtodate[0] = new Date(moment(self.extqueryParams.stmtfromdt, 'YYYY-MM-DD', true).format());
            // self.fromtodate[1] = new Date(moment(self.extqueryParams.stmttodt, 'YYYY-MM-DD', true).format()); 
            // self.fromtodate_calendar.value = [...self.fromtodate_calendar.value];
            self.selectedbank = _.find(res.data, (d) => {
              return (d.bankcode == self.extqueryParams.accheadid)
            });
            self.getbrslist(true);
          }
        }
        else {
          console.log("no bank found");
        }
      });
  }
  updatebrsstatement() {
    var self = this;
    if (this.checkFormValid()) {
      var formatbrsupdatedata = this.getformatedbrsdata(this.brslist);
      var error = false, errormessage = "";
      if (this.fromtodate.length <= 0) {
        error = true;
        errormessage = "Please select From-To date.";
      }
      if (formatbrsupdatedata.length <= 0) {
        error = true;
        errormessage = "Matching data should be empty.";
      }
      if (!error) {

        this.BanksService.brsUpdate(formatbrsupdatedata)
          .then(res => {
            if (res.status) {
              self.resetbrsform();
              self.brsUpdateevent.emit({ mode: "brsupdates", update: true });
              self.messageservice.showMessage({
                severity: 'success',
                summary: 'Success', detail: res.message
              });
              self.router.navigate(['banks/brslist']);
              return false;
            }
            else {
              self.messageservice.showMessage({
                severity: 'error',
                summary: 'Error', detail: res.message
              }, true);
            }
          });
      }
      else {
        self.messageservice.showMessage({
          severity: 'error',
          summary: 'Error', detail: errormessage
        }, true);
      }
    }
  }
  getformatedbrsdata(brslist) {
    var paymentheader = [];
    var banksTransdetails = [];
    var self = this;
    _.forEach(brslist, (data: any) => {
      var bdata = {
        "bankstmtdtlid": data.bankstmtdtlid,
        "bankstmtid": data.bankstmtid,
        "pymtrectid": null,
        "tenantid": self.userdetails.tenantid,
        "txnno": data.txnno,
        "txndate": data.txndate,
        "description": data.description,
        "openingbal": data.openingbal,
        "debit": data.debit,
        "credit": data.credit,
        "closeingbal": data.closeingbal,
        "reconstatus": data.reconstatus,
        "recondate": data.recondate,
        "remarks": data.remarks,
        "matcheddata": data.matcheddata
      };
      var tdata = {
        "pymtrectid": data.pymtrectid,
        "recodate": self.currentdate,
        "recostatus": data.reconstatus,
        "remarks": ""
      };
      banksTransdetails.push(bdata);
      paymentheader.push(tdata);

    });
    return banksTransdetails;
    // return {
    //   "bankstmtdtl": banksTransdetails,
    //   "pymtrectHdr": paymentheader
    // }
  }
  checkFormValid() {
    return true;
  }
  resetbrsform() {
    this.brslist = [];
    var fromdate = new Date();
    var todate = new Date();
    this.fromtodate = [
      fromdate,
      todate
    ];
  }

  ngOnInit() {
    this.actedroute.queryParams
      .filter(params => params.finyear)
      .subscribe(params => {
        console.log("param values: ", params);
        if (params.bankstmtid != null && params.bankstmtid != undefined) {
          this.extqueryParams = params;
          this.selectedbankstmtid =params.bankstmtid;
        }
        // { "bankstmtid":1, "finyear":"APR 2017 - MAR 2018","accheadid":52,
        //  "stmtfromdt":"2018-01-15","stmttodt":"2018-01-25"}
      });
  }
  getledgerList(req) {

    this.BanksService.brsLedgerList(req)
      .then((res) => {
        if (res.status) {
          this.brsledgerList = res.data;
          this.selectedLedgers = [];
          var ledgerlist = [];
          _.forEach(res.data, (outer) => {
            var exist = _.find(this.brslist,(data)=> {
              if(data.matcheddata.length > 0)
              {
               var l =  _.find(data.matcheddata,{ "ledgerid" : outer.ledgerid });
               return (_.isEmpty(l) == false);
              }
            })
           if(_.isEmpty(exist)) 
           {
            ledgerlist.push(outer);
           }
            // _.forEach(this.selectedTrans.matcheddata, (inner) => {
            //   if (outer.ledgerid == inner.ledgerid) {
            //     this.selectedLedgers.push(outer);
            //   }
            // });
          });
          this.ledgerdisplay = true;
        }
        else {

        }
      });
  }
  matchwithLedger(selectedtrans) {
    this.displayApplyOptions = false;
    this.brsledgerList = [];
    this.selectedLedgers = [];
    console.log(selectedtrans);
    this.selectedTrans = selectedtrans;
    var stmtfromdt = this.dateFormatPipeFilter.transform(this.fromtodate[0], this.date_apiformat);
    var stmttodt = this.dateFormatPipeFilter.transform(this.fromtodate[1], this.date_apiformat);
    var crdr = "C";
    if (selectedtrans.credit != null) {
      crdr = "C";
    }
    else if (selectedtrans.debit != null) {
      crdr = "D";
    }
    var data = {
      "startdate": stmtfromdt,
      "enddate": stmttodt,
      "limitsize": 1000,
      "offsetsize": 0,
      "accheadid": this.selectedbank.bankcode,
      "finyear": this.finyear.finyear,
      "crdr": crdr

    };
    this.getledgerList(data);
  }
  applymatching() {
    var errormesage = "";
    if (this.selectedLedgers != undefined && this.selectedLedgers != null) {
      if (this.selectedLedgers.length > 0) {
        var amount = 0, key, transactionamount = 0;
        var consremarks = "", matcheddata = [];
        if (this.selectedTrans.credit != null) {
          key = "cramount";
          transactionamount = parseInt(this.selectedTrans.credit);
        }
        else if (this.selectedTrans.debit != null) {
          key = "dramount";
          transactionamount = parseInt(this.selectedTrans.debit);
        }
        _.forEach(this.selectedLedgers, (d) => {
          console.log(d);
          amount = amount + parseInt(d[key]);
          consremarks += d.feature + "-" + d.txnrefno + ",";
          var ledgerdata = {
            "bankstmtdtlid": this.selectedTrans.bankstmtdtlid,
            "ledgerid": d.ledgerid,
            "status": "Active",
            "updateddt": this.currentdate,
            "updatedby": this.userdetails.loginname,
          }
          matcheddata.push(ledgerdata);
        });
        this.selectedTrans.matcheddata = matcheddata;
        console.log(amount);
        if (amount <= transactionamount) {
          this.displayApplyOptions = true;
          this.selectedTrans.reconstatus = "R";
          this.selectedTrans.remarks = consremarks;
          this.ledgerdisplay = false;
        }
        else {
          errormesage = "Matching amount should not exceed the transaction amount.";
          this.displayApplyOptions = false;
        }
      }
      else {
        this.displayApplyOptions = false;
        errormesage = "Please select ledger(s).";
      }

    }
    else {
      errormesage = "Please select ledger(s).";
      this.displayApplyOptions = false;
    }
  }
  onRowCheckboxSelection(event) {
    if( ! this.isMatching())
    {
      this.messageservice.showMessage({
            severity: 'error',
            summary: 'Error', detail: "Matching amount should not exceed the transaction amount."
          }, true);
    }
    if(this.duplicatedLedgerEntry())
    {
      console.log("Hi");
    }
  }
  duplicatedLedgerEntry()
  {
    // this.duplicatedledgers = [];
    _.forEach(this.brslist,function(d){
      if(d.matcheddata.length > 0)
      {
        // var dp = _.find(d.matcheddata, { "ledgerid" :  } );
      }
     
    });
    return true;
  }
  isMatching() {
    var matching = false;
    if (this.selectedLedgers != undefined && this.selectedLedgers != null) {
      if (this.selectedLedgers.length > 0) {
        var amount = 0, key, transactionamount = 0;
        if (this.selectedTrans.credit != null) {
          key = "cramount";
          transactionamount = parseInt(this.selectedTrans.credit);
        }
        else if (this.selectedTrans.debit != null) {
          key = "dramount";
          transactionamount = parseInt(this.selectedTrans.debit);
        }
        _.forEach(this.selectedLedgers, function (d) {
          console.log(d);
          amount = amount + parseInt(d[key]);
        });
        console.log(amount);
        if (amount <= transactionamount) {
          this.displayApplyOptions = true;
          matching = true;
        }
        else {
          // this.messageservice.showMessage({
          //   severity: 'error',
          //   summary: 'Error', detail: "Matching amount should not exceed the transaction amount."
          // }, true);
          this.displayApplyOptions = false;
          matching = false;
        }
      }
      else {
        this.displayApplyOptions = false;
        matching = false;
      }

    }
    return matching;
  }

}
