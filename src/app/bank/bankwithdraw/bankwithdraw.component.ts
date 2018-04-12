import { Component, OnInit, EventEmitter, Output, Input, OnChanges ,SimpleChanges} from '@angular/core';
import { DropdownModule } from 'primeng/primeng';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LocalStorageService } from '../../shared/local-storage.service';
import { FeaturesService } from '../../services/features.service';
import { MasterService } from '../../services/master.service';
import { AppConstant } from '../../app.constant';
import { DateformatPipe } from '../../pipes/dateformat.pipe';
import { MessagesService } from '../../shared/messages.service';
import { JournalsService } from '../../accounts/service/journals.service';
import { UtilsService } from '../../services/utils.service';
import { PrimengConstant } from '../../app.primeconfig'
import * as _ from "lodash";
import * as moment from "moment";
import { Hotkey, HotkeysService } from "angular2-hotkeys";
import { CommonService } from '../../pages/settings/services/common.service';

@Component({
  selector: 'app-bankwithdraw',
  templateUrl: './bankwithdraw.component.html',
  styleUrls: ['./bankwithdraw.component.scss']
})
export class BankwithdrawComponent implements OnInit, OnChanges {
  public amtlength = AppConstant.API_CONFIG.AMOUNTFORMAT.MAXLENGTH;
  userdetails: any;
  autogenyn = 'Y';
  journalno: any;
  data: any;
  seq: any;
  seqid: any;
  contactlist: any;
  selectedfrom: any;
  selectedfromdetails: any;
  selectedto: any;
  selectedtodetails: any;
  fromlist: Array<any> = [];
  tolist: Array<any> = [];
  filterformlist: Array<any> = [];
  filtertolist: Array<any> = [];
  journals: Array<any> = [];
  ledgers: Array<any> = [];
  validation = true;
  validationmsg = "";
  bankfind: any;
  finyear: any;

  bank: FormGroup;
  amount: FormControl;
  DocmentNo: FormControl;
  Docmentdata: FormControl;
    //add_parites start
    invoiceno = "";
    sundrygroup = "";
    addbank_display: boolean = false;
    //add_parites end

  @Input() withdrawls: any;
  @Output() notifyNewBank: EventEmitter<any> = new EventEmitter();
  @Output() notifyNewBankTransaction: EventEmitter<any> = new EventEmitter();
  @Input() withdrawbank : any;
  @Input() openedfromothers: boolean = false;
  public autocomplete_emptymessage = PrimengConstant.AUTOCOMPLETE.EMPTYMESSAGE;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  private date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  constructor(
    private fb: FormBuilder,
    private LocalStorageService: LocalStorageService,
    private MessagesService: MessagesService,
    private dateFormatPipeFilter: DateformatPipe,
    private JournalsService: JournalsService,
    private UtilsService: UtilsService,
    private sequenceService: CommonService,
    private featureservice:FeaturesService,
    private masterservice:MasterService,
    private _hotkeysService: HotkeysService
  ) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.SAVE.KEY, (event: KeyboardEvent): boolean => {
      this.createbank(this.bank.value);
      return false;
    }, [], shrtkeys.COMMON.SAVE.TXT));

    this.bank = fb.group({
      'amount': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(15)])],
      'Docmentdata': [new Date, Validators.required],
      'selecteduom': [null, Validators.required],
      'selectedfrom': [null, Validators.required],
      'selectedto': [null, Validators.required],
      'DocmentNo': [null, Validators.required],
      'Remark': [null,],
    });
    this.userdetails = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.getSequence();
  }
  callParent(data = null) {
    this.notifyNewBank.next();
    this.notifyNewBankTransaction.next(data);
  }
  numberOnly(event) {
    this.UtilsService.allowNumberOnly(event);
  }

  ngOnInit() {

   this.loadBankList(); // BK_SHT
    // if (!this.withdrawls.journalid) {
    //   setTimeout(() => {
    //     this.bank.controls["DocmentNo"].setValue(this.seq);
    //     this.bank.controls["DocmentNo"].disable();
    //   }, 1000);
    // }
    if(! _.isEmpty(this.withdrawls))
    {
      if (this.withdrawls.journalid) {
        setTimeout(() => {
          this.viewBankDeposit()
        }, 0);
      }
    }
  }
  loadBankList() // BK_SHT start
  {
    this.data = {
      "tenantid": this.userdetails.tenantid,
      "refkey": "WTDR",
      "status": "Active"
    }
    this.Journalconfig(this.data,null);
  } // BK_SHT end

  ngOnChanges(changes: SimpleChanges): void {
    if(! _.isEmpty(this.withdrawls))
    {
      if (this.withdrawls.journalid) {
        setTimeout(() => {
          this.viewBankDeposit()
        }, 0);
      }
    }
    console.log('cheatsheet changes: ', changes);
    if (changes.openedfromothers) {
      if ( ! changes.openedfromothers.currentValue) {
        this.clearform();
      }
      // withdrawbank
    }
  }
  Journalconfig(data,refreshdata) { // BK_SHT
    this.JournalsService.config(this.data).then((res) => {
      this.fromlist = res.data.bank;
      this.tolist = res.data.cash;
      console.log("bak list: ",refreshdata);
      if(refreshdata != null) // BK_SHT start
      {
        var selectebank =  _.find(this.fromlist,{"bankid":refreshdata.bankid});
        if( !_.isEmpty(selectebank))
        {
         this.selectfrom(selectebank);
         this.bank.controls['selectedfrom'].setValue(selectebank);
        }

      } // BK_SHT end
      if(! _.isEmpty(this.withdrawbank))
      {
        var selectebank =  _.find(this.fromlist,{"subaccheadid": this.withdrawbank.bankcode});
        if( !_.isEmpty(selectebank))
        {
         this.selectfrom(selectebank);
         this.bank.controls['selectedfrom'].setValue(selectebank);
        }

      }
    })
  };
  handleDropdownClick(event, label) {
    if (label == "from") {
      setTimeout(() => {
        this.filterformlist = this.fromlist;
        this.filterformlist = [...this.filterformlist]
      }, 100)
    } else if (label == "to") {
      setTimeout(() => {
        this.filtertolist = this.tolist;
        this.filtertolist = [...this.filtertolist];
      }, 100);
    }
  }

  searchfrom(event) {
    this.filterformlist = [];
    this.filterformlist = _.filter(this.fromlist, function (res) {
      var fromdata = res.subaccheadname;
      return (fromdata.toLowerCase().indexOf(event.query.toLowerCase()) == 0);
    });
  }
  searchto(event) {
    this.filtertolist = [];
    this.filtertolist = _.filter(this.tolist, function (res) {
      var todata = res.subaccheadname;
      return (todata.toLowerCase().indexOf(event.query.toLowerCase()) == 0);
    })
  }
  selectfrom(item) {
    this.selectedfrom = item.subaccheadname;
    this.selectedfromdetails = item;
  }
  selectto(item) {
    this.selectedto = item.subaccheadname;
    this.selectedtodetails = item;
  }
  clearform() {
    this.bank.reset();
  }

  viewBankDeposit() {
    this.JournalsService.getJournalDetails(this.withdrawls.journalid).then((res) => {
      if (res.status) {
        this.bankfind = res.data[0];
        if(this.bankfind.journalno != ''){
          this.autogenyn = 'Y'
        }
        var from = this.bankfind.ledgers[0];
        this.selectedfromdetails = _.find(this.fromlist, function (res) {
          return res.subaccheadid == from.accheadid;
        });
        this.selectfrom(this.selectedfromdetails);
        var to = this.bankfind.ledgers[1];
        this.selectedtodetails = _.find(this.tolist, function (res) {
          return res.subaccheadid == to.accheadid;
        });
        this.selectto(this.selectedtodetails);
        this.ledgers = this.bankfind.ledgers;
        //2017-09-13T00:00:00.000Z
        let momentdate = moment(this.bankfind.journaldt, "YYYY-MM-DD'T'HH:mm:ss.SSS'Z'");
        this.bank = new FormGroup({
          'amount': new FormControl(this.bankfind.journaltotal),
          'Docmentdata': new FormControl(momentdate.toDate()),
          'selectedfrom': new FormControl(this.selectedfromdetails),
          'selectedto': new FormControl(this.selectedtodetails),
         // 'DocmentNo': new FormControl(this.bankfind.journalno),
          'Remark': new FormControl(this.bankfind.remarks)
        });
      }

    });
  }


  createbank(data) {
    console.log("REEEQ", data)
    var validation = true;
    var validationmsg = "";
    var fromdata: any = {};
    var docDate = this.dateFormatPipeFilter.transform(data.Docmentdata, this.date_apiformat);
    var crdata = this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat);
    if (this.selectedfromdetails == undefined) {
      validation = false;
      validationmsg = PrimengConstant.COMMONTRANSACTION.DROPDOWN
    }
    if (_.isEmpty(docDate)) {
      validation = false;
      validationmsg = PrimengConstant.COMMONTRANSACTION.DATE
    }
    else if (this.autogenyn == 'N' && _.isEmpty(data.DocmentNo)) {
      validation = false;
      validationmsg = PrimengConstant.COMMONTRANSACTION.SEQNO
    }
    else if (_.isEmpty(data.selectedfrom)) {
      validation = false;
      validationmsg = PrimengConstant.COMMONTRANSACTION.SELECTBANK
    }
    else if (_.isEmpty(data.selectedto)) {
      validation = false;
      validationmsg = PrimengConstant.COMMONTRANSACTION.ACCOUNT
    }
    else if (_.isEmpty(data.amount) || data.amount == "0" || data.amount == "0.00") {
      validation = false;
      validationmsg = PrimengConstant.COMMONTRANSACTION.AMOUNT
    }
    if (validation == true) {
      var docmentno = this.bank.controls["DocmentNo"].value;

      if (this.bankfind) {
        this.ledgers[0].accheadid = this.selectedfromdetails.subaccheadid;
        this.ledgers[0].accheadname = this.selectedfromdetails.subaccheadname;
        this.ledgers[0].leadaccheadid = this.selectedfromdetails.accheadid;
        this.ledgers[0].leadaccheadname = this.selectedfromdetails.accheadname;
        this.ledgers[0].lastupdatedby = this.userdetails.loginname;
        this.ledgers[0].lastupdateddt = crdata;
        this.ledgers[0].cramount = data.amount;
        this.ledgers[0].contactname = this.selectedfromdetails.subaccheadname;
        this.ledgers[0].contactid = this.selectedfromdetails.subaccheadid;
        this.ledgers[0].companyname = this.selectedfromdetails.subaccheadname,

          this.ledgers[1].accheadid = this.selectedtodetails.subaccheadid;
        this.ledgers[1].accheadname = this.selectedtodetails.subaccheadname;
        this.ledgers[1].leadaccheadid = this.selectedtodetails.accheadid;
        this.ledgers[1].leadaccheadname = this.selectedtodetails.accheadname;
        this.ledgers[1].lastupdatedby = this.userdetails.loginname;
        this.ledgers[1].lastupdateddt = crdata;
        this.ledgers[1].dramount = data.amount;
        this.ledgers[1].contactname = this.selectedtodetails.subaccheadname;
        this.ledgers[1].contactid = this.selectedtodetails.subaccheadid;
        this.ledgers[1].companyname = this.selectedtodetails.subaccheadname,
          fromdata = {
            "header": {
              "journalid": this.bankfind.journalid,
              "type": "BANKWITHDRAW",
              "refkey": "WTDR",
              "journaldt": docDate,
              "finyear": this.finyear.finyear,
              "tenantid": this.userdetails.tenantid,
              "tenantname": this.userdetails.tenantname,
              "remarks": data.Remark,
              "ccyid": "1",
              "ccyname": "INR",
              "subtotal": data.amount,
              "taxtotal": "0",
              "roundoff": "0",
              "journaltotal": data.amount,
              "pymntamount": "0",
              "balamount": data.amount,
              "accheadname": this.selectedfromdetails.subaccheadname,
              "fromaccno": this.selectedfromdetails.accountno,
              "pymtlink": "http://link.in",
              "status": "Active",
            },
            "detailsForUpdate": {
              "delete": [],
              "update": this.ledgers,
              "insert": [],
            },
          }
      
        this.JournalsService.updateJournal(fromdata)
          .then((res) => {
            if (res.status) {
              this.callParent();
              this.clearform();
              this.MessagesService.showMessage({ severity: 'success', summary: 'Success', detail: res.message })
            }

          });
      }


      else {
        this.journals = [
          {
            "remarks": "",
            "cramount": data.amount,
            "contactdetails": "",
            "feature": "Journal",
            "type": "From",
            "crdr": "C",
            "accheadid": this.selectedfromdetails.subaccheadid,
            "accheadname": this.selectedfromdetails.subaccheadname,
            "parentaccheadid": this.selectedfromdetails.accheadid,
            "parentaccheadname": this.selectedfromdetails.accheadname,
            "leadaccheadid": this.selectedfromdetails.accheadid,
            "leadaccheadname": this.selectedfromdetails.accheadname,
            "contactname": this.selectedfromdetails.subaccheadname,
            "contactid": this.selectedfromdetails.subaccheadid,
            "companyname": this.selectedfromdetails.subaccheadname,
          },
          {
            "remarks": "",
            "dramount": data.amount,
            "contactdetails": "",
            "feature": "Journal",
            "type": "To",
            "crdr": "D",
            "accheadid": this.selectedtodetails.subaccheadid,
            "accheadname": this.selectedtodetails.subaccheadname,
            "parentaccheadid": this.selectedtodetails.accheadid,
            "parentaccheadname": this.selectedtodetails.accheadname,
            "leadaccheadid": this.selectedtodetails.accheadid,
            "leadaccheadname": this.selectedtodetails.accheadname,
            "contactname": this.selectedtodetails.subaccheadname,
            "contactid": this.selectedtodetails.subaccheadid,
            "companyname": this.selectedtodetails.subaccheadname,
          }];
        fromdata = {
          "header": {
            "type": "BANKWITHDRAW",
            "refkey": "WTDR",
            "journaldt": docDate,
            "finyear": this.finyear.finyear,
            "tenantid": this.userdetails.tenantid,
            "tenantname": this.userdetails.tenantname,
            "remarks": data.Remark,
            "duedate": "01/30/2017",
            "ccyid": "1",
            "ccyname": "INR",
            "subtotal": data.amount,
            "taxtotal": "0",
            "roundoff": "0",
            "journaltotal": data.amount,
            "pymntamount": "0",
            "balamount": data.amount,
            "pymtlink": "http://link.in",
            "templtid": "1",
            "templtname": "HTL",
            "emailyn": "Y",
            "status": "Active",
            "accheadname": this.selectedfromdetails.subaccheadname,
            "fromaccno": this.selectedfromdetails.accountno,
            "createdby": this.userdetails.loginname,
            "createddt": crdata,
          },
          "journaldetails": this.journals,
          "ledgers": this.journals
        }
        if (this.autogenyn == 'N') {
          fromdata.header.journalno = data.DocmentNo
        }
        this.JournalsService.saveJournal(fromdata)
          .then((res) => {
            if (res.status == true) {
              console.log("GENERATED", res.data)
              if(! this.openedfromothers)
              {
                this.MessagesService.showMessage({ severity: 'success', summary: 'Success', detail: res.message })
              }
              this.callParent(res.data);
              this.clearform();
            } else if (res.status == false) {
              this.MessagesService.showMessage({ severity: 'error', summary: 'Error', detail: res.message })
            }
          });
      }
    }
    else {
      this.MessagesService.showMessage({ severity: 'error', summary: 'Error', detail: validationmsg })
    }
  }

  getSequence() {
    var validationmsg = "";
    const data = {
      refkey: 'WTDR',
      status: 'Active',
      autogenyn: 'Y'
    }
    this.sequenceService.getSequenceSettings(data).then(res => {
      if (res.status) {
        this.autogenyn = 'Y';
      } else {
        this.autogenyn = 'N';
        // validationmsg = PrimengConstant.COMMONTRANSACTION.SEQNO
        console.log("Bank", this.bank.value)
        //  this.createbank(this.bank.value);  
        console.log("AUTOGEN")
      }
    });
  }

  displayaddbanks() {
    this.addbank_display = true;
    this.sundrygroup = PrimengConstant.COMMONTRANSACTION.SELECTBANK;
    this.sundrygroup = PrimengConstant.COMMON.SUNDRY_DEBTORS;
  }
  addbankDetection(contact: any) { // BK_SHT start
  
    this.data = {
      "tenantid": this.userdetails.tenantid,
      "refkey": "WTDR",
      "status": "Active"
    }
    this.Journalconfig(this.data,contact);
    this.addbank_display = false;
  } // BK_SHT end
  onhideBankpopup($event) {
    this.addbank_display = false; // BK_SHT end
  }
}

