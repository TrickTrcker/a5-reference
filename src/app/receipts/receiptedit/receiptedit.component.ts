import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import * as _ from 'lodash';
import { MasterService } from '../../services/master.service';
import { FeaturesService } from '../../services/features.service';
import { SalesService } from '../../services/sales/sales.service';
import { ProductallService } from '../../products/productall.service';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { DateformatPipe } from '../../pipes/dateformat.pipe';
import { ReceiptService } from '../receipt.service';
import { Message } from 'primeng/primeng';
import { Router, NavigationExtras } from '@angular/router';
import { MessagesService } from '../../shared/messages.service';
import { UtilsService } from '../../services/utils.service'
import { PrimengConstant } from '../../app.primeconfig'
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { CommonService } from '../../pages/settings/services/common.service';

@Component({
  selector: 'app-receiptedit',
  templateUrl: './receiptedit.component.html',
  styleUrls: ['./receiptedit.component.scss']
})
export class ReceipteditComponent implements OnInit {
  pymtrectno = '';
  autogenyn = 'Y';
  private dateformat = AppConstant.API_CONFIG.DATE.displayFormat;
  filteredContacts: any[];
  //add_parites start
  sundrygroup = '';
  addparties_display: boolean = false;
  //add_parites end
  addproduct_display: boolean = false;
  tempselectedproductPrp: any;

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
  editmode: boolean = false;

  placeofsupplies: any = [];
  selectedreversecharge: any = {};
  // default products
  selectedproductsList = [];
  addbank_display: boolean = false;
  addbank_button: boolean = false ;
  public autocomplete_emptymessage = PrimengConstant.AUTOCOMPLETE.EMPTYMESSAGE;
  CustomerorVendor: any = PrimengConstant.COMMON.CUSTOMER;
  date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  constructor(private masterservice: MasterService,
    private receiptService: ReceiptService, private SalesService: SalesService,
    private LocalStorageService: LocalStorageService,
    private productservice: ProductallService, private dateFormatPipeFilter: DateformatPipe,
    private router: Router, private messageService: MessagesService,
    private featureService: FeaturesService,
    private UtilsService: UtilsService, private _hotkeysService: HotkeysService,
    private sequenceService: CommonService
  ) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.SAVE.KEY, (event: KeyboardEvent): boolean => {
      this.AddPayment('');
      return false;
    }, [], shrtkeys.COMMON.SAVE.TXT));
    this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['/receipts/list']);
      return false;
    }, [], shrtkeys.COMMON.CLOSE.TXT));
    this.userstoragedata = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.heads = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.HEADS);
  }

  ngOnInit() {
    this.getSequence();
    this.loadpayterm();
    this.loadinvoicelist();
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
          this.AddPayment('createnew');
        }
      },
      {
        label: 'Cancel', icon: 'fa-times', command: () => {
          this.router.navigate(['/receipts/list']);
        }
      }
      // ]
    ];

    var self = this;

    var data = {
      tenantid: this.userstoragedata.tenantid,
      status: 'Active',
      contactype: 'Customer'
    };

    // load contact list
    this.featureService.contactGetAll(data)
      .then(function (res) {
        if (res.status) {
          self.contactlist = res.data;
        }
        else {
          self.contactlist = [];
        }
      });

  }
  //add_parites start
  displayaddparies() {
    this.addparties_display = true;
    this.sundrygroup = PrimengConstant.COMMON.SUNDRY_DEBTORS;
  }
  addcustomerDetection(contact: any) {
    console.log(contact);
    var newcontact = {
      label: contact.companyname,
      value: contact
    }
    this.sundrygroup = '';
    this.addparties_display = false;

    // this.loadcustomer(contact);
  }
  onhideContactpopup($event) {
    this.sundrygroup = '';
  }
  //add_parites end
  accountconfig() {
    var data =
      {
        'feature': 'Receipt',
        //'tenantid': this.userstoragedata.tenantid
      }
    this.featureService.getacconfigList(data).then((res) => {
      if (res.status) {
        console.log('res', JSON.stringify(res));
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
        status: 'Active'
      }
    this.bankledger = [];
    this.featureService.BookofAccList(data).then((res) => {
      if (res.status) {
        this.allbookaccs = res.data;
        var books = _.filter(this.allbookaccs, { 'accheadname': 'Bank' });
        this.bankledger.push(books);
      }
      else {
        this.allbookaccs = [];
      }
    })
  };


  loadinvoicelist() {
    var data = {
      tenantid: this.userstoragedata.tenantid,
      finyear: this.finyear.finyear,
    }
    this.SalesService.getInvoiceList(data).then((res) => {
      if (res.status) {
        this.Allinvoicelist = _.filter(res.data, function (v: any) {
          v.paymentApplied = 0
          return (0 < v.balamount)
        })
      }
    })
  }

  calcualtePayingSuggestion() {
    var self = this;
    if ((self.payingAmount.indexOf('.') > -1) && ((self.payingAmount.length - 1) == (self.payingAmount.indexOf('.')))) {
      return false;
    }
    self.tempPayingAmount = parseFloat(self.payingAmount);
    self.payingAmount = parseFloat(self.payingAmount);
    if (isNaN(self.payingAmount)) {
      self.payingAmount = 0;
      _.each(self.customerinvoices, function (v, key) {
        self.customerinvoices[key].paymentApplied = 0.00;
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
        self.customerinvoices[k].paymentApplied = 0;
        if (0 < self.tempPayingAmount) {
          var substractAmt: any = 0;
          if (self.customerinvoices[k].balamount >= self.tempPayingAmount) {
            substractAmt = self.tempPayingAmount;
            self.customerinvoices[k].paymentApplied = substractAmt;
            substractAmt = 0;
          }
          else if (self.customerinvoices[k].balamount > 0) {
            substractAmt = (self.tempPayingAmount - self.customerinvoices[k].balamount);
            self.customerinvoices[k].paymentApplied = (self.tempPayingAmount - substractAmt).toFixed(2);
          }
          else {
            substractAmt = self.tempPayingAmount;
            self.customerinvoices[k].paymentApplied = substractAmt.toFixed(2);;
          }
        }
        self.tempPayingAmount = substractAmt.toFixed(2);
        c = true;
        return (c == true)

      });
    }
    else {
      self.tempPayingAmount = 0.00;
      _.each(self.customerinvoices, function (v, key) {
        self.customerinvoices[key].paymentApplied = 0.00;
      });
    }
    self.customerinvoices = [...self.customerinvoices];
  }

  calcualtepaymentApplied(event, index) {
    console.log(index);
    if (this.customerinvoices[index].paymentApplied == '') {
      this.customerinvoices[index].paymentApplied = 0;
    }
    var pmt = this.calcPayingTotal();
    if (parseFloat(this.payingAmount) < parseFloat(this.customerinvoices[index].paymentApplied)) {
      this.customerinvoices[index].paymentApplied = this.payingAmount;
    }
    else if (parseFloat(this.customerinvoices[index].paymentApplied) > parseFloat(this.customerinvoices[index].balamount)) {
      this.customerinvoices[index].paymentApplied = this.customerinvoices[index].balamount;
    }
  }
  total: any;
  calcPayingTotal() {
    var total = 0.00;
    _.forEach(this.customerinvoices, function (value, key: any) {
      if (!isNaN(value.paymentApplied)) {
        total += parseFloat(value.paymentApplied);
      }
      return total;
    });
    this.total = total
  }

  // get name12() {
  //   return 123;
  // }
  calcBalanceAmount(balance, applied) {
    if (!isNaN(applied)) {
      return parseFloat(balance) - parseFloat(applied);
    }
  }

  loadpayterm() {
    var data = {
      type: 'RECEIPT'
    };
    this.featureService.paytermGetAll(data)
      .then((res) => {
        if (res.status) {
          var paymode = res.data;
          this.payterm = this.masterservice.formatDataforDropdown('name', paymode, 'Select Type'); // params name->formatting label name,fdata->value object,third param->empty selection or place holder value
        }
      })
  }

  selpayterm(item,mode) {
    this.Selectedpayterm = item;
    this.Selectedpaymode = '';
    var data = {
      'tenantid': this.userstoragedata.tenantid,
      'accountgroup': item.accountgroup,
      'groupname': item.groupname,
      'status': 'Active',
    }
    if(item.name != "CASH" && !_.isEmpty(item) && item.name != null && item.name != undefined)
    {
      this.addbank_button = true;
    }
    else
    {
      this.addbank_button = false;
    }
    this.featureService.paymodeGetAll(data)
      .then((res) => {
        if (res.status) {
          var paymodes = res.data;
          this.allpaymode = this.masterservice.formatDataforDropdown('subaccheadname', paymodes, 'Select Type'); // params name->formatting label name,fdata->value object,third param->empty selection or place holder value
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
      this.filteredContacts = [... this.filteredContacts]
    }, 100)
  }
  selectedCustomer(contact: any) {
    this.contactdtls = contact;
    // this.contact = contact.firstname;
    this.filterInvoiceByCustomer(this.contactdtls.contactid);
  }
  filterInvoiceByCustomer(contactid) {
    if (contactid != undefined) {
      var data =
        {
          'tenantid': this.userstoragedata.tenantid,
          'finyear': this.finyear.finyear,
          'contactid': contactid,
          'feature': 'invoice',
          'limit': 1000,
          'offset': 0
        }
      this.SalesService.getInvoiceList(data)
        .then((res) => {
          if (res.status) {
            this.customerinvoices = _.filter(res.data, function (v: any) {
              v.paymentApplied = 0
              return (0 < v.balamount)
            })
          }
        })
    }
  }

  AddPayment(flag) {
    var inDate: Date = this.dateFormatPipeFilter.transform(this.paymentDate, 'y-MM-dd');
    console.log('recdate', inDate);
    if (_.isEmpty(this.pymtrectno) && this.autogenyn === 'N') {
      this.messageService.showMessage({
        severity: 'error', summary: 'Error',
        detail: PrimengConstant.PAYMENT.ADDEDITFORM.TRANS_NUMBER
      });
      return;
    }
    var validdata = true;
    if (!this.Selectedpayterm || !this.Selectedpaymode || !this.contactdtls.contactid || !this.paymentDate || !this.payingAmount || !this.customerinvoices.length)
      var validdata = false;
    if (validdata) {
      var paymentDtData = [];
      let updateHeaderData = [];
      for (var i = this.customerinvoices.length - 1; i >= 0; i--) {
        if (this.customerinvoices[i].paymentApplied > 0) {
          var dt;
          if (this.customerinvoices[i].externalentry) {
            dt = {
              'finyear': this.finyear,
              'tenantid': this.userstoragedata.tenantid,
              'tenantname': this.userstoragedata.tenantname,
              'contactid': this.contactdtls.contactid,
              'companyname': this.contactdtls.companyname,
              'pymntapplied': this.customerinvoices[i].paymentApplied
            }
          } else {
            dt = {
              'finyear': this.finyear.finyear,
              'tenantid': this.userstoragedata.tenantid,
              'tenantname': this.userstoragedata.tenantname,
              'contactid': this.customerinvoices[i].contactid,
              'companyname': this.customerinvoices[i].companyname,
              'duedate': this.customerinvoices[i].duedate,
              'refid': this.customerinvoices[i].invoiceid,
              'refno': this.customerinvoices[i].invoiceno,
              'refdt': this.customerinvoices[i].duedate,
              'reftotal': this.customerinvoices[i].invoicetotal,
              'pymntamount': this.customerinvoices[i].pymntamount,
              'pymntapplied': this.customerinvoices[i].paymentApplied,
              'balamount': (this.customerinvoices[i].balamount - this.customerinvoices[i].paymentApplied),
              'feature': 'Receipt'
            };

            var headerObj: any = {};
            headerObj.invoiceid = this.customerinvoices[i].invoiceid;
            headerObj.tenantid = this.userstoragedata.tenantid;
            headerObj.balamount = (this.customerinvoices[i].balamount - this.customerinvoices[i].paymentApplied);
            headerObj.pymntapplied = this.customerinvoices[i].paymentApplied;
            headerObj.pymntamount = parseFloat(this.customerinvoices[i].paymentApplied) + parseFloat(this.customerinvoices[i].pymntamount);

            updateHeaderData.push(headerObj);

          }
          paymentDtData.push(dt);
        }

        var calcPayingTotal = this.calcPayingTotal();
        var acchead = this.heads;
        var cashinhand = _.find(this.allbookaccs, { 'subaccheadname': AppConstant.API_CONFIG.EXCLEDGER[0] });
        var bank = _.find(this.allbookaccs, { 'subaccheadname': AppConstant.API_CONFIG.EXCLEDGER[3] });
        this.contacthead = _.find(this.allbookaccs, { 'subaccheadid': this.contactdtls.accheadid });
        var crdr = '';
        if (this.contacthead.crdr == 'C') {
          crdr = 'D';
        } else {
          crdr = 'C';
        }
        _.forEach(this.accconfig, (config) => {
          config.contactid = this.contactdtls.contactid;
          config.contactname = this.contactdtls.firstname;
          config.tenantid = this.userstoragedata.tenantid;
          config.tenantname = this.userstoragedata.tenantName;
          config.ledgerdate = inDate;

          switch (_.trim(config.configname)) {
            case "Customer Receipt": {
              config.cramount = this.total;
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
              if (config.crdr == 'C') {
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
        if (this.Selectedpaymode.subaccheadname != 'Cash In Hand') {
          var bankid = this.Selectedpaymode.subaccheadid;
          var bankname = this.Selectedpaymode.subaccheadname;
        }
        console.log('config', this.accconfig);
      }

      var headerDetails = {
        'tenantid': this.userstoragedata.tenantid,
        'tenantname': this.userstoragedata.tenantname,
        'createdby': this.userstoragedata.loginname,
        'createddt':this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
        'finyear': this.finyear.finyear,
        'contactid': this.contactdtls.contactid,
        'contactname': this.contactdtls.firstname,
        'companyname': this.contactdtls.companyname,
        'pymtmethod': this.Selectedpayterm.name,
        'pymtrectdt': inDate,
        'pymtamount': this.total,
        'pymtref': this.paymentReference,
        'rectaccheadid': this.contacthead.accheadid,
        'rectaccheadname': this.contacthead.accheadname,
        'subaccheadid': this.contactdtls.accheadid,
        'subaccheadname': this.contactdtls.accheadname,
        'openingbalance': this.contacthead.openingbalance,
        'currentbalance': this.contacthead.currentbalance,
        'nativecrdr': this.contacthead.crdr,
        'crdr': crdr,
        'remarks': this.paymentRemarks,
        'refkey': 'RECEIPT_NO',
        'status': 'Active',
        'feature': 'Receipt',
        'bankid': bankid,
        'bankname': bankname
      };

      var formData: any = {};
      formData.header = headerDetails;
      formData.ledgers = this.accconfig;
      formData.paymentReceiptDetails = paymentDtData;
      formData.updateHeader = updateHeaderData;
      // 'ledgers': this.accconfig,
      //   'paymentReceiptDetails': paymentDtData,
      //   'updateHeader':updateHeaderData
      if (this.autogenyn === 'N') {
        formData.header.pymtrectno = this.pymtrectno;
      }
      if (this.total > 0 && this.contactdtls.contactid != '' && this.customerinvoices.length) {

        this.receiptService.ReceiptCreate(formData)
          .then((res) => {
            if (res.status == true) {
              this.messageService.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
              if (flag) {
                this.clearform();
              }
              else {
                this.router.navigate(['/receipts/list']);
              }

            } else {
              this.messageService.showMessage({
                severity: 'error', summary: 'Error',
                detail: res.message
              });
            }
          })
      } else {
        if (this.total == 0) {
          this.messageService.showMessage({
            severity: 'error', summary: 'Error',
            detail: PrimengConstant.RECIPT.ADDEDITFORM.NOTAPPLIED
          });
        }
      }
    }
    else {
      if (!this.contactdtls || !this.contactdtls.contactid) {
        this.messageService.showMessage({
          severity: 'error', summary: 'Error',
          detail: PrimengConstant.COMMONTRANSACTION.CUSTOMER
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
      else if (!this.customerinvoices.length) {
        this.messageService.showMessage({
          severity: 'error', summary: 'Error',
          detail: PrimengConstant.RECIPT.ADDEDITFORM.NOINVOICE
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
    this.pymtrectno = "";
    this.loadinvoicelist()
  };
  numberOnly(event: any) {
    this.UtilsService.allowNumberOnly(event);
  }
  // splitbtn_save(event){
  //   if(event.target.className.indexOf('fa-caret-down') < 0 )
  //   {
  //     this.AddPayment('');
  //   }
  // }
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
  getSequence() {
    const data = {
      refkey: 'RECEIPT_NO',
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
}
