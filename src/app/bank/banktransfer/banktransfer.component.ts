import { Component, OnInit, EventEmitter, Output, Input, OnChanges ,SimpleChanges} from '@angular/core';
import { DropdownModule } from 'primeng/primeng';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { Message } from 'primeng/primeng';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BanksService } from './../service/banks.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import { MessagesService } from '../../shared/messages.service';
import { MasterService } from '../../services/master.service';
import { DateformatPipe } from '../../pipes/dateformat.pipe';
import { JournalsService } from '../../accounts/service/journals.service';
import { UtilsService } from '../../services/utils.service'
import * as _ from "lodash";
import * as moment from "moment";
import { PrimengConstant } from '../../app.primeconfig'
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { CommonService } from '../../pages/settings/services/common.service';

@Component({
  selector: 'app-banktransfer',
  templateUrl: './banktransfer.component.html',
  styleUrls: ['./banktransfer.component.scss']
})
export class BanktransferComponent implements OnInit, OnChanges {
  public amtlength = AppConstant.API_CONFIG.AMOUNTFORMAT.MAXLENGTH;
  userdetails: any;
  autogenyn = 'Y';
  journalno: any;
  data: any;
  seq: any;
  seqid: any;
  selectedfrom: any;
  selectedfromdetails: any;
  selectedto: any;
  selectedtodetails: any;
  fromlist: Array<any> = [];
  tolist: Array<any> = [];
  filterformlist: Array<any> = [];
  filtertolist: Array<any> = [];
  journals: Array<any> = [];
  journalDetails: Array<any> = [];
  ledger: Array<any> = [];
  bankfind: any;
  BankList: SelectItem[];
  fdata: any;
  finyear: any;
  @Input() tranfls: any;
  @Output() notifyNewBank: EventEmitter<any> = new EventEmitter();
  @Output() notifyNewBankTransaction: EventEmitter<any> = new EventEmitter();
  @Input() withdrawbank : any;
  @Input() openedfromothers: boolean = false;
  bank: FormGroup;
  amount: FormControl;
  DocmentNo: FormControl;
  Docmentdata: FormControl;
  //add_parites start
  invoiceno = "";
  sundrygroup = "";
  addbank_display: boolean = false;
  addbankto_display: boolean = false;
  //add_parites end
  public autocomplete_emptymessage = PrimengConstant.AUTOCOMPLETE.EMPTYMESSAGE;  
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  private date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  constructor(private BanksService: BanksService,
    private fb: FormBuilder,
    private LocalStorageService: LocalStorageService,
    private masterService: MasterService,
    private MessagesService: MessagesService,
    private dateFormatPipeFilter: DateformatPipe,
    private JournalsService: JournalsService,
    private UtilsService: UtilsService,
    private sequenceService: CommonService,
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
      'DocmentNo': [, Validators.required],
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

  ngOnInit() {
    this.loadBankList();
    this.data = {
      "tenantid": this.userdetails.tenantid,
      "refkey": "TRNS",
      "status": "Active"
    }
    // if(!this.tranfls.journalid){
    //   setTimeout(() => {
    //     this.bank.controls["DocmentNo"].setValue(this.seq);
    //     this.bank.controls["DocmentNo"].disable();
    //     this.bank.controls["DocmentNo"].value;
    //   }, 1000);
    // }
    if(! _.isEmpty(this.tranfls))
    {
      setTimeout(() => {
        this.viewBankDeposit()
      }, 0);
    }
  }
  loadBankList() // BK_SHT start
  {
    this.data = {
      "tenantid": this.userdetails.tenantid,
      "refkey": "TRNS",
      "status": "Active"
    }
    this.Journalsconfig(this.data, null);
    this.Journalconfig(this.data, null);
  } // BK_SHT end
  ngOnChanges(changes: SimpleChanges): void {
    if(! _.isEmpty(this.tranfls))
    {
      if (this.tranfls.journalid) {
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
  numberOnly(event) {
    this.UtilsService.allowNumberOnly(event);
  }
  Journalconfig(data, refreshdata) {
    this.JournalsService.config(this.data).then((res) => {
      this.tolist = res.data.bank;
      if (refreshdata != null) // BK_SHT start
      {
        var selecttobank = _.find(this.tolist, { "bankid": refreshdata.bankid });
        var fromBank = this.bank.controls['selectedfrom'].value;
        if (selecttobank) {
          if (selecttobank.subaccheadid === fromBank.subaccheadid) {
            this.bank.controls["selectedto"].reset();
            this.MessagesService.showMessage({ severity: 'error', summary: 'Error', detail: "Please choose a different Source or Destination Bank." })
    
          } 
        }
        if (!_.isEmpty(selecttobank)) {
          this.selectto(selecttobank);
          this.bank.controls['selectedto'].setValue(selecttobank);
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
  }
  Journalsconfig(data, refreshdata) {
    this.JournalsService.config(this.data).then((res) => {
      this.fromlist = res.data.bank;
      console.log("bak list: ", this.fromlist);
      if (refreshdata != null) // BK_SHT start
      {
        var selectebank = _.find(this.fromlist, { "bankid": refreshdata.bankid });
        if (!_.isEmpty(selectebank)) {
          this.selectfrom(selectebank);
          this.bank.controls['selectedfrom'].setValue(selectebank);
        }
       
      } // BK_SHT end
    })
    // var callback: any = this;
    // callback.BankList = [];
    // this.JournalsService.config(data).then(function (res) {
    //   var fdata = res.data.bank;
    //   console.log("bank", res.data.bank)
    //   // fdata=_.filter(res.data.bank,function(res:any){

    //   //   return "Active"==res.status
    //   // })
    //   callback.BankList = callback.masterService.formatDataforDropdown("subaccheadname", fdata, "Select Bank");
    // })

  }


  handleDropdownClick(event, label) {
    if (label == "from") {
      setTimeout(() => {
        this.filterformlist = this.fromlist;
        this.filterformlist = [...this.filterformlist]
      }, 100)
    } else if (label == "to") {
      let item = this.bank.controls["selectedto"].value;
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
    if (this.selectedtodetails) {
      if (this.selectedtodetails.subaccheadid === this.selectedfromdetails.subaccheadid) {
        this.bank.controls["selectedto"].reset();
        this.MessagesService.showMessage({ severity: 'error', summary: 'Error', detail: "Please choose a different Source or Destination Bank." })

      } else if (this.selectedfromdetails.label === this.selectedtodetails.subaccheadname) {
        this.bank.controls["selectedfrom"].reset();
        this.MessagesService.showMessage({ severity: 'error', summary: 'Error', detail: "Please choose a different Source or Destination Bank." })

      }
    }
  }

  onSelectedBankTo() {
    let item = this.bank.controls["selectedto"].value;
    this.selectedto = item.subaccheadname;
    this.selectedtodetails = item;
    if (this.selectedtodetails) {
      if (this.selectedtodetails.subaccheadid === this.selectedfromdetails.subaccheadid) {
        this.bank.controls["selectedto"].reset();
        this.MessagesService.showMessage({ severity: 'error', summary: 'Error', detail: "Please choose a different Source or Destination Bank." })

      } else if (this.selectedfromdetails.label === this.selectedtodetails.subaccheadname) {
        this.bank.controls["selectedfrom"].reset();
        this.MessagesService.showMessage({ severity: 'error', summary: 'Error', detail: "Please choose a different Source or Destination Bank." })

      }
    }
  };
  onSelectedBankFrom() {
    let item = this.bank.controls["selectedfrom"].value;
    this.selectedfromdetails = item;
    this.selectedfrom = item.subaccheadname;
    if (this.selectedtodetails) {
      if (this.selectedfromdetails.subaccheadid === this.selectedtodetails.subaccheadid) {
        this.bank.controls["selectedfrom"].reset();
        this.MessagesService.showMessage({ severity: 'error', summary: 'Error', detail: "Please choose a different Source or Destination Bank." })
      } else if (this.selectedfromdetails.subaccheadname === this.selectedtodetails.label) {
        this.bank.controls["selectedfrom"].reset();
        this.MessagesService.showMessage({ severity: 'error', summary: 'Error', detail: "Please choose a different Source or Destination Bank." })

      }
    }

  }
  clearform() {
    this.bank.reset();
  }

  viewBankDeposit() {
    this.JournalsService.getJournalDetails(this.tranfls.journalid + '/null/Contra').then((res) => {
      if (res.status) {
        console.log("Bank Tranfer", res.data)
        this.bankfind = res.data[0];
        var self = this;
        var from = this.bankfind.ledgers[0];
        // this.selectedfromdetails = _.find(this.BankList, { label: from.accheadname });
        this.selectedfromdetails = _.find(this.fromlist, function (res) {
          return res.subaccheadid == from.accheadid;
        });
        this.selectfrom(this.selectedfromdetails);
        var to = this.bankfind.ledgers[1];
        //   this.selectedtodetails = _.find(this.BankList, { label: to.accheadname })
        this.selectedtodetails = _.find(this.tolist, function (res) {
          return res.subaccheadid == to.accheadid;
        });
        this.selectto(this.selectedtodetails);
        this.ledger = this.bankfind.ledgers;
        //2017-09-13T00:00:00.000Z
        let momentdate = moment(this.bankfind.journaldt, "YYYY-MM-DD'T'HH:mm:ss.SSS'Z'");
        if (this.bankfind.journalno != '') {
          this.autogenyn = 'Y'
        }
        // this.bank.controls["DocmentNo"].disable();
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
    var fromdata: any = {};
    var docDate = this.dateFormatPipeFilter.transform(data.Docmentdata, this.date_apiformat);
    var crdata = this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat);
    var validation = true;
    var validationmsg = "";
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
      validationmsg = PrimengConstant.COMMONTRANSACTION.ACCOUNT
    } else if (_.isEmpty(data.selectedto)) {
      validation = false;
      validationmsg = PrimengConstant.COMMONTRANSACTION.SELECTBANK
    } else if (_.isEmpty(data.amount) || data.amount == "0" || data.amount == "0.00") {
      validation = false;
      validationmsg = PrimengConstant.COMMONTRANSACTION.AMOUNT
    }
    if (validation == true) {


      // var docmentno = this.bank.controls["DocmentNo"].value;
      if (this.bankfind) {


        this.ledger[0].accheadid = this.selectedfromdetails.subaccheadid;
        this.ledger[0].accheadname = this.selectedfromdetails.subaccheadname;
        this.ledger[0].leadaccheadid = this.selectedfromdetails.accheadid;
        this.ledger[0].leadaccheadname = this.selectedfromdetails.accheadname;
        this.ledger[0].lastupdatedby = this.userdetails.loginname;
        this.ledger[0].lastupdateddt = crdata;
        this.ledger[0].cramount = data.amount;
        this.ledger[0].contactname = this.selectedfromdetails.subaccheadname;
        this.ledger[0].contactid = this.selectedfromdetails.subaccheadid;
        this.ledger[0].companyname = this.selectedfromdetails.subaccheadname,

          this.ledger[1].accheadid = this.selectedtodetails.subaccheadid;
        this.ledger[1].accheadname = this.selectedtodetails.subaccheadname;
        this.ledger[1].leadaccheadid = this.selectedtodetails.accheadid;
        this.ledger[1].leadaccheadname = this.selectedtodetails.accheadname;
        this.ledger[1].lastupdatedby = this.userdetails.loginname;
        this.ledger[1].lastupdateddt = crdata;
        this.ledger[1].dramount = data.amount;
        this.ledger[1].contactname = this.selectedtodetails.subaccheadname;
        this.ledger[1].contactid = this.selectedtodetails.subaccheadid;
        this.ledger[1].companyname = this.selectedtodetails.subaccheadname;
        fromdata = {
          "header": {
            "journalid": this.bankfind.journalid,
            "type": "BANKTRANSFER",
            "journaldt": docDate,
            "finyear": this.finyear.finyear,
            "tenantid": this.userdetails.tenantid,
            "tenantname": this.userdetails.tenantname,
            "remarks": data.Remark,
            "ccyid": "1",
            "accheadname": this.selectedfromdetails.subaccheadname,
            "fromaccno": this.selectedfromdetails.accountno,
            "toaccno": this.selectedtodetails.accountno,
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
            "lastupdatedby": this.userdetails.loginname,
            "lastupdateddt": crdata,
          },
          "detailsForUpdate": {
            "delete": [],
            "update": this.ledger,
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
            "feature": "Contra",
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
            "feature": "Contra",
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
            "type": "BANKTRANSFER",
            "refkey": "TRNS",
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
            "toaccno": this.selectedtodetails.accountno,
            "createdby": this.userdetails.loginname,
            "createddt": crdata,
          },
          "journaldetails": this.journals,
          "ledgers": this.journals
        }
        if (this.autogenyn == 'N' && !_.isEmpty(data.DocmentNo)) {
          fromdata.header.journalno = data.DocmentNo
        }

        this.JournalsService.saveJournal(fromdata)
          .then((res) => {
            if (res.status == true) {
              if(! this.openedfromothers)
              {
                this.MessagesService.showMessage({ severity: 'success', summary: 'Success', detail: res.message })
              }
              this.callParent();
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
      refkey: 'TRNS',
      status: 'Active',
      autogenyn: 'Y'
    }
    this.sequenceService.getSequenceSettings(data).then(res => {
      if (res.status) {
        this.autogenyn = 'Y';
      } else {
        this.autogenyn = 'N';
      }
    });
  }
  displayaddbanks() {
    this.addbank_display = true;
    this.sundrygroup = PrimengConstant.COMMONTRANSACTION.SELECTBANK;
    this.sundrygroup = PrimengConstant.COMMON.SUNDRY_DEBTORS;
  }
  displayaddbanksTo() {
    this.addbankto_display = true;
    this.sundrygroup = PrimengConstant.COMMONTRANSACTION.SELECTBANK;
    this.sundrygroup = PrimengConstant.COMMON.SUNDRY_DEBTORS;
  }
  addbankDetection(contact: any) { // BK_SHT start
    this.data = {
      "tenantid": this.userdetails.tenantid,
      "refkey": "TRNS",
      "status": "Active"
    }
    console.log("ENTER")
    this.Journalsconfig(this.data, contact);
    this.addbank_display = false;
  } // BK_SHT end
  addbankDetectionTo(contact: any) {
    this.data = {
      "tenantid": this.userdetails.tenantid,
      "refkey": "TRNS",
      "status": "Active"
    }
    this.Journalconfig(this.data, contact);
    this.addbankto_display = false;
  }
  onhideBankpopup($event) {
    this.addbank_display = false; // BK_SHT end
  }
  onhideBankpopupTO($event){
    this.addbankto_display = false;    
  }
}
