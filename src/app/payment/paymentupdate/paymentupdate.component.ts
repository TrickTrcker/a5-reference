import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import * as _ from "lodash";
import { MasterService } from '../../services/master.service';
import { PurchasesService } from '../../services/purchases/purchases.service';
import { ProductallService } from '../../products/productall.service';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { DateformatPipe } from '../../pipes/dateformat.pipe';
import { PaymentService } from '../payment.service';
import { Message } from 'primeng/primeng';
import { Router, NavigationExtras } from '@angular/router';
import { MessagesService } from '../../shared/messages.service';
import { FeaturesService } from '../../services/features.service';
import { ActivatedRoute } from "@angular/router";
import { PrimengConstant } from '../../app.primeconfig';
import { UtilsService } from '../../services/utils.service'
import { Hotkey, HotkeysService } from "angular2-hotkeys";
@Component({
  selector: 'app-paymentupdate',
  templateUrl: './paymentupdate.component.html',
  styleUrls: ['./paymentupdate.component.scss']
})
export class PaymentupdateComponent implements OnInit {

  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  private dateformat = AppConstant.API_CONFIG.DATE.displayFormat;
  private date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  pymtrectid: any;
  filteredContacts: any[];
  contactlist: any[];
  productList: any[];
  Invoicetype: any[];
  recno: String;
  seqid: String;
  contact: any;
  userstoragedata: any;
  heads: any;
  allpaymode: any[];
  msgs: Message[] = [];
  finyear: any;
  invoiceDate: Date;
  selectedInvoiceType: any = {};
  menuItems: MenuItem[];
  payterm: any[];
  Selectedpaymode: any;
  Allinvoicelist: any[];
  contactdtls: any;
  customerinvoices: any[];
  payingAmount: any;
  tempPayingAmount: any;
  sugesstedSplits: any[];
  paymentApplied: any;
  paymentDate: Date = new Date();
  receiptdate: any;
  Selectedpayterm: any;
  accconfig: any;
  paymentRemarks: any;
  contacthead: any;
  menuitems: any;
  paymentReference: any;
  pymtrectdetails: any;
  Paymentlineitems: any;
  ledgerdetails: any;
  selectedaccount: any;
  deleteLedgerIds: any;
  paydate: any;
  paymentReceiptDtls: any = {
    "insert": [],
    "update": [],
    "delete": []
  };
  addbank_display: boolean = false;
  addbank_button: boolean = false ;
  sundrygroup = "";
  constructor(
    private masterservice: MasterService,
    private paymentService: PaymentService,
    private purchasesService: PurchasesService,
    private LocalStorageService: LocalStorageService,
    private productservice: ProductallService,
    private dateFormatPipeFilter: DateformatPipe,
    private router: Router,
    private featureService: FeaturesService,
    private messageService: MessagesService,
    private acroute: ActivatedRoute,
    private UtilsService: UtilsService,
    private _hotkeysService: HotkeysService
  ) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.userstoragedata = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.heads = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.HEADS);
    // Save Payment
    this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.SAVE.KEY, (event: KeyboardEvent): boolean => {
      this.AddPayment('');
      return false;
    }, [], shrtkeys.COMMON.SAVE.TXT));
    // Cancel
    this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['/payment/list']);
      return false;
    }, [], shrtkeys.COMMON.CLOSE.TXT));

    this.acroute.params.subscribe(params => {
      if (!_.isEmpty(params)) {
        this.pymtrectid = params.pymtrectid;
      }
    });
    if (!_.isEmpty(this.pymtrectid) && this.pymtrectid != null && this.pymtrectid != undefined) {
      this.loadPaymentdetails();
    }
  }
  getallcontacts(): Promise<any> {
    var data = {
      tenantid: this.userstoragedata.tenantid,
      status: 'Active',
      contactype: "Vendor"
    };
    var self = this;
    return self.featureService.contactGetAll(data)
      .then((res) => {
        if (res.status) {
          self.contactlist = res.data;
        }
        else {
          self.contactlist = [];
        }
      });
  }

  loadPaymentdetails() {
    var data =
      {
        "paymentReceiptid": this.pymtrectid,
        "feature": "Payment"
      }
    this.paymentService.PaymentgetbyID(data)
      .then(res => {
        if (res.status) {
          this.pymtrectdetails = res.data[0];
          this.Paymentlineitems = res.data[0].details;
          this.ledgerdetails = res.data[0].ledgers
          var lineitems = _.map(this.Paymentlineitems, function (key: any) {
            key.balamount = parseFloat(key.balamount) + parseFloat(key.pymntapplied)
            return key;
          });
          this.formateditmode();
        }
        else {
          this.pymtrectdetails = [];
          this.Paymentlineitems = [];
          this.ledgerdetails = [];
        }
      });
  }

  formateditmode() {
    this.contact = this.pymtrectdetails.companyname;
    this.getallcontacts().then(res => {
      this.contactdtls = _.find(this.contactlist, { contactid: this.pymtrectdetails.contactid });
    })
    this.paymentDate = this.dateFormatPipeFilter.transform(this.pymtrectdetails.pymtrectdt, this.date_dformat);
    this.loadpayterm().then(res => {
      let selectedpaymode: any = _.find(this.payterm, { value: { name: this.pymtrectdetails.pymtmethod } });
      this.Selectedpayterm = selectedpaymode.value;
      this.selpayterm(selectedpaymode.value,false).then(g => {
        this.selectedaccount = _.find(this.allpaymode, (data)=> {
          if(! _.isEmpty(data.value))
          {
            return (data.value.subaccheadid == this.ledgerdetails[1].accheadid);
            // if(this.ledgerdetails[1].leadaccheadname == "Current Asset")
            // {
            //   return (data.value.subaccheadid == this.ledgerdetails[1].accheadid);
            // }
            // else
            // {
            //   return (data.value.subaccheadid == this.ledgerdetails[1].leadaccheadid);
            // }
          } 
        }
        );
        if(! _.isEmpty(this.selectedaccount))
          {
            this.Selectedpaymode = this.selectedaccount.value
          }
        this.lineitems()
        this.extractdeleteLedgerIds();
      });
    })
  }

  lineitems() {
    this.customerinvoices = this.Paymentlineitems
  }
  extractdeleteLedgerIds() {
    this.deleteLedgerIds = [];
    for (var i = 0; i < this.pymtrectdetails.ledgers.length; i++) {
      this.deleteLedgerIds.push(this.pymtrectdetails.ledgers[i].ledgerid)
    }
  }

  ngOnInit() {

    this.loadpayterm();
    this.loadbilllist();
    this.allbook();
    this.accountconfig();
    this.menuItems = [
      // label: 'Save',
      // items: [
      {
        label: 'Save & List', icon: 'fa-check', command: () => {
          this.AddPayment('');
        }
      },
      {
        label: 'Save', icon: 'fa-check', command: () => {
          this.AddPayment("createnew");
        }
      },
      {
        label: 'Cancel', icon: 'fa-times', command: () => {
          this.router.navigate(['/payment/list']);
        }
      }
      // ]
    ];

  }


  accountconfig() {
    var data =
      {
        "feature": "Payment",
      }
    this.featureService.getacconfigList(data).then((res) => {
      if (res.status) {
        this.accconfig = res.data
      }
      else {
        this.accconfig = [];
      }
    });
  };

  bankledger: any;
  allbookaccs: any;

  allbook() {
    var data =
      {
        // tenantid: this.userstoragedata.tenantid,
        status: "Active"
      }
    this.bankledger = [];
    this.featureService.BookofAccList(data).then((res) => {
      if (res.status) {
        this.allbookaccs = res.data;
        var books = _.filter(this.allbookaccs, { "accheadname": "Bank" });
        this.bankledger.push(books);
      }
      else {
        this.allbookaccs = [];
      }
    })
  };

  loadbilllist() {
    var data = {
      tenantid: this.userstoragedata.tenantid,
      finyear: this.finyear.finyear,
    }
    this.purchasesService.getBillList(data).then((res) => {
      if (res.status) {
        this.Allinvoicelist = _.filter(res.data, function (v: any) {
          v.pymntapplied = 0
          return (0 < v.balamount)
        })
      }
    })
  }

  calcualtePayingSuggestion() {
    var self = this;
    if (self.payingAmount != undefined && typeof self.payingAmount == "string" && isNaN(parseInt(self.payingAmount))) {
      if ((self.payingAmount.indexOf(".") > -1) && ((self.payingAmount.length - 1) == (self.payingAmount.indexOf(".")))) {
        return false;
      }
      self.payingAmount = 0;
    }

    self.tempPayingAmount = +(self.payingAmount);
    self.payingAmount = +self.payingAmount;
    if (isNaN(self.payingAmount)) {
      _.each(self.customerinvoices, function (v, key) {
        self.customerinvoices[key].pymntapplied = 0.00;
      });
    }

    if (self.tempPayingAmount != undefined) {
      self.tempPayingAmount = self.tempPayingAmount;
    }
    else {
      self.tempPayingAmount = 0;
    }

    if (self.tempPayingAmount > 0) {
      self.sugesstedSplits = _.filter(self.customerinvoices, (v, k) => {
        var c = false;
        self.customerinvoices[k].pymntapplied = 0;
        if (0 < self.tempPayingAmount) {
          var substractAmt: any = 0;
          if (self.customerinvoices[k].balamount >= self.tempPayingAmount) {
            substractAmt = self.tempPayingAmount;
            self.customerinvoices[k].pymntapplied = substractAmt;
            substractAmt = 0;
          }
          else if (self.customerinvoices[k].balamount > 0) {
            substractAmt = (self.tempPayingAmount - self.customerinvoices[k].balamount);
            self.customerinvoices[k].pymntapplied = self.tempPayingAmount - substractAmt;
          }
          else {
            substractAmt = self.tempPayingAmount;
            self.customerinvoices[k].pymntapplied = substractAmt;
          }
        }
        self.tempPayingAmount = substractAmt;
        c = true;
        return (c == true)

      });
    }
    else {
      self.tempPayingAmount = 0.00;
      _.each(self.customerinvoices, function (v, key) {
        self.customerinvoices[key].pymntapplied = 0.00;
      });
    }
    self.customerinvoices = [...self.customerinvoices];
  }

  calcualtepymntapplied(index) {
    if (this.customerinvoices[index].pymntapplied == '') {
      this.customerinvoices[index].pymntapplied = 0;
    }
    var pmt = this.calcPayingTotal();
    if (this.payingAmount < this.customerinvoices[index].pymntapplied) {
      this.customerinvoices[index].pymntapplied = this.payingAmount;
    }
    else if (parseFloat(this.customerinvoices[index].pymntapplied) > parseFloat(this.customerinvoices[index].balamount)) {
      this.customerinvoices[index].pymntapplied = this.customerinvoices[index].balamount;
    }
  }
  total: any;
  calcPayingTotal() {
    var total = 0.00;
    _.forEach(this.customerinvoices, function (value, key: any) {
      if (!isNaN(value.pymntapplied)) {
        total += parseFloat(value.pymntapplied);
      }
      return total;
    });
    this.total = total
  }

  calcBalanceAmount(balance, applied) {
    if (!isNaN(applied)) {
      return balance - applied;
    }
  }

  loadpayterm(): Promise<any> {
    var data = {
      type: "PAYMENT"
    };
    return this.featureService.paytermGetAll(data)
      .then((res) => {
        if (res.status) {
          var paymode = res.data;
          this.payterm = this.masterservice.formatDataforDropdown("name", paymode, "Select Type"); // params name->formatting label name,fdata->value object,third param->empty selection or place holder value
        }
      })
  }

  selpayterm(item,mode): Promise<any> {
    this.Selectedpayterm = item;
    this.Selectedpaymode = '';
    var data = {
      "tenantid": this.userstoragedata.tenantid,
      "accountgroup": item.accountgroup,
      "groupname": item.groupname,
      "status": "Active"
    }
    if(item.name != "CASH" && !_.isEmpty(item) && item.name != null && item.name != undefined)
    {
      this.addbank_button = true;
    }
    else
    {
      this.addbank_button = false;
    }
    return this.featureService.paymodeGetAll(data)
      .then((res) => {
        if (res.status) {
          var paymodes = res.data;
          this.allpaymode = this.masterservice.formatDataforDropdown("subaccheadname", paymodes, "Select Type"); // params name->formatting label name,fdata->value object,third param->empty selection or place holder value
          if(mode)
          {
            var bank = _.orderBy(paymodes, ['subaccheadid'], ['desc']);
            this.Selectedpaymode = bank[0];
          }
        }
      })
  }

  selpaymode(item) {
    this.Selectedpaymode = item
  }

  filterContacts(event) {
    this.filteredContacts = [];
    this.filteredContacts = _.filter(this.contactlist, function (c) {
      var cname = c.companyname;
      return (cname.toLowerCase().indexOf(event.query.toLowerCase()) == 0);
    });
  }
  handleDropdownClick() {

    //mimic remote call
    setTimeout(() => {
      this.filteredContacts = this.contactlist;
      this.filteredContacts = [...this.filteredContacts]
    }, 100)
  }
  selectedCustomer(contact: any) {
    this.contactdtls = contact;
    this.contact = contact.firstname;
    this.filterInvoiceByCustomer(this.contactdtls.contactid);
  }
  filterInvoiceByCustomer(contactid) {
    if (contactid != undefined) {
      var data =
        {
          "tenantid": this.userstoragedata.tenantid,
          "finyear": this.finyear.finyear,
          "contactid": contactid,
          "feature": "BILL",
          "limit": 1000,
          "offset": 0
        }
      this.purchasesService.getBillList(data)
        .then((res) => {
          if (res.status) {
            this.customerinvoices = _.filter(res.data, function (v: any) {
              v.pymntapplied = 0
              return (0 < v.balamount)
            })
          }
        })
    }
  }

  AddPayment(flag) {
    var inDate: Date = this.dateFormatPipeFilter.transform(this.paymentDate, 'y-MM-dd');

    var validdata = true;
    if (!this.Selectedpayterm || !this.Selectedpaymode || !this.contactdtls.contactid || !this.paymentDate || !this.payingAmount)
      var validdata = false;
    if (validdata) {
      var paymentDtData: any = {
        insert: [],
        delete: [],
        update: []
      };
      let updateHeaderData = [];
      for (var i = this.customerinvoices.length - 1; i >= 0; i--) {
        if (this.customerinvoices[i].pymntapplied > 0) {
          var dt;
          var billdt;
          if (this.customerinvoices[i].externalentry) {
            dt = {
              "finyear": this.finyear,
              "tenantid": this.userstoragedata.tenantid,
              "tenantname": this.userstoragedata.tenantname,
              "contactid": this.contactdtls.contactid,
              "companyname": this.contactdtls.companyname,
              "pymntapplied": this.customerinvoices[i].pymntapplied
            }
          } else {
            dt = {
              "finyear": this.finyear.finyear,
              "tenantid": this.userstoragedata.tenantid,
              "tenantname": this.userstoragedata.tenantname,
              "pymtrectdtlid": this.customerinvoices[i].pymtrectdtlid,
              "pymtrectid": this.customerinvoices[i].pymtrectid,
              "contactid": this.customerinvoices[i].contactid,
              "companyname": this.customerinvoices[i].companyname,
              "refid": this.customerinvoices[i].refid,
              "refno": this.customerinvoices[i].refno,
              "refdt": this.customerinvoices[i].refdt,
              "reftotal": this.customerinvoices[i].reftotal,
              "pymntamount": this.customerinvoices[i].pymntamount,
              "pymntapplied": this.customerinvoices[i].pymntapplied,
              "balamount": (this.customerinvoices[i].balamount - this.customerinvoices[i].pymntapplied),
              "feature": "Payment"
            };
            var headerObj: any = {};
            headerObj.pymtrectid= this.customerinvoices[i].pymtrectid;
            headerObj.billid = this.customerinvoices[i].refid;
            headerObj.tenantid = this.userstoragedata.tenantid;
            headerObj.balamount = (this.customerinvoices[i].balamount - this.customerinvoices[i].pymntapplied);
            headerObj.pymntapplied = this.customerinvoices[i].pymntapplied;
            headerObj.pymntamount = parseFloat(this.customerinvoices[i].pymntapplied) + parseFloat(this.customerinvoices[i].pymntamount);

            updateHeaderData.push(headerObj);
          }
          paymentDtData.update.push(dt)
        }

        var calcPayingTotal = this.calcPayingTotal();
        var acchead = this.heads;
        var cashinhand = _.find(this.allbookaccs, { "subaccheadname": AppConstant.API_CONFIG.EXCLEDGER[0] });
        var bank = _.find(this.allbookaccs, { "subaccheadname": AppConstant.API_CONFIG.EXCLEDGER[3] });
        this.contacthead = _.find(this.allbookaccs, { "subaccheadid": this.contactdtls.accheadid });
        var crdr = '';
        if (this.contacthead.crdr == "C") {
          crdr = "D";
        } else {
          crdr = "C";
        }
        _.forEach(this.accconfig, (config) => {
          config.contactid = this.contactdtls.contactid;
          config.contactname = this.contactdtls.firstname;
          config.tenantid = this.userstoragedata.tenantid;
          config.tenantname = this.userstoragedata.tenantName;
          config.txnid = this.pymtrectid;
          config.txnrefno = this.pymtrectdetails.pymtrectno;
          config.ledgerdate = inDate;
          switch (_.trim(config.configname)) {
            case "Vendor Payment": {
              config.dramount = this.total;
              config.accheadid = this.contactdtls.ledgerid;
              config.accheadname = this.contactdtls.ledgername;
              config.leadaccheadid = this.contactdtls.accheadid;
              config.leadaccheadname = this.contactdtls.accheadname;
              break;
            }
            case "Cash": {
              config.accheadid = this.Selectedpaymode.subaccheadid;
              config.accheadname = this.Selectedpaymode.subaccheadname;
              config.leadaccheadid = this.Selectedpaymode.accheadid;
              config.leadaccheadname = this.Selectedpaymode.accheadname;
              // this.accconfig[1].dramount = this.total;
              if (config.crdr == "C") {
                config.cramount = this.total;
              } else {
                config.dramount = this.total;
              }
              break;
            }
            default: {
              console.log("Invalid choice");
              break;
            }
          }
        });
 
        if (this.Selectedpaymode.subaccheadname != "Cash In Hand") {
          var bankid = this.Selectedpaymode.subaccheadid;
          var bankname = this.Selectedpaymode.subaccheadname;
        }
      }

      if (!_.isEmpty(inDate)) {
        this.paydate = inDate
      }
      else {
        this.paydate = this.dateFormatPipeFilter.transform(this.pymtrectdetails.pymtrectdt, this.date_apiformat);
      }

      var headerDetails = {
        "pymtrectid": this.pymtrectid,
        "tenantid": this.userstoragedata.tenantid,
        "tenantname": this.userstoragedata.tenantname,
        "createdby": this.userstoragedata.loginname,
        "createddt": this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
        "finyear": this.finyear.finyear,
        "contactid": this.contactdtls.contactid,
        "contactname": this.contactdtls.firstname,
        "companyname": this.contactdtls.companyname,
        "pymtmethod": this.Selectedpayterm.name,
        "pymtrectdt": this.paydate,
        "pymtamount": this.total,
        "pymtref": this.paymentReference,
        "rectaccheadid": this.contacthead.accheadid,
        "rectaccheadname": this.contacthead.accheadname,
        "subaccheadid": this.contactdtls.accheadid,
        "subaccheadname": this.contactdtls.accheadname,
        "openingbalance": this.contacthead.openingbalance,
        "currentbalance": this.contacthead.currentbalance,
        "nativecrdr": this.contacthead.crdr,
        "crdr": crdr,
        "remarks": this.paymentRemarks,
        "refkey": "PYMT",
        "status": "Active",
        "feature": "Payment",
        "bankid": bankid,
        "bankname": bankname
      };

      var formData: any = {};
      formData.header = headerDetails;
      formData.ledgerUpdate = this.accconfig;
      formData.paymentReceiptDtls = paymentDtData;
      formData.deleteLedgerIds = this.deleteLedgerIds;
      formData.updateHeader = updateHeaderData;

      if (this.total > 0 && this.contactdtls.contactid != '') {
        this.paymentService.UpdatePayment(formData)
          .then((res) => {
            if (res.status == true) {
              this.messageService.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
              if (flag) {
                this.clearform();
              }
              else {
                this.router.navigate(['/payment/list']);
              }

            } else {
              this.msgs = [];
              this.messageService.showMessage({
                severity: 'success', summary: 'Success',
                detail: res.message
              });
            }
          })
      } else {

      }
    }
    else {
      if (!this.contactdtls || !this.contactdtls.contactid) {
        this.messageService.showMessage({
          severity: 'error', summary: 'Error',
          detail: PrimengConstant.COMMONTRANSACTION.CONTACT
        });
      }
      else if (!this.paymentDate) {
        this.messageService.showMessage({
          severity: 'error', summary: 'Error',
          detail: PrimengConstant.COMMONTRANSACTION.DATE
        });
      }
      else if (!this.Selectedpayterm) {
        this.messageService.showMessage({
          severity: 'error', summary: 'Error',
          detail: PrimengConstant.COMMONTRANSACTION.PAYMENTMODE
        });
      }
      else if (!this.Selectedpaymode) {
        this.messageService.showMessage({
          severity: 'error', summary: 'Error',
          detail: PrimengConstant.COMMONTRANSACTION.ACCOUNT
        });
      }
      else if (!this.payingAmount) {
        this.messageService.showMessage({
          severity: 'error', summary: 'Error',
          detail: PrimengConstant.RECIPT.ADDEDITFORM.RECEIPTAMOUNT
        });
      }
    }
  }

  clearform() {
    this.customerinvoices = [];
    this.contact = '';
    this.Selectedpayterm = '',
      this.Selectedpaymode = '',
      this.paymentRemarks = '';
    this.paymentApplied = '';
    this.payingAmount = 0;
    this.paymentReference = '';
    this.loadbilllist()
  };
  splitbtn_save(event) {
    if (event.target.className.indexOf("fa-caret-down") < 0) {
      this.AddPayment('');
    }
  }
  // function isNumberKey(evt) {
  //       var charCode = (evt.which) ? evt.which : event.keyCode;
  //       if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
  //           return false;
  //       } else {
  //           // If the number field already has . then don't allow to enter . again.
  //           if (evt.target.value.search(/\./) > -1 && charCode == 46) {
  //               return false;
  //           }
  //           return true;
  //       }
  //   }
  numberOnly(event: any) {
    this.UtilsService.allowNumberOnly(event);
  }
  displayaddbanks() {
    this.addbank_display = true;
    this.sundrygroup = PrimengConstant.COMMONTRANSACTION.SELECTBANK;
    this.sundrygroup = PrimengConstant.COMMON.SUNDRY_DEBTORS;
  }
  addbankDetection(bank: any) { // BK_SHT start
    this.addbank_display = false;
    console.log(this.Selectedpaymode);
    setTimeout(() => {
      if(! _.isEmpty(bank))
      {
        this.selpayterm(this.Selectedpayterm,true);
      }
    }, 1000)
  } // BK_SHT end
  onhideBankpopup($event) {
    this.addbank_display = false; // BK_SHT end
  }
}
