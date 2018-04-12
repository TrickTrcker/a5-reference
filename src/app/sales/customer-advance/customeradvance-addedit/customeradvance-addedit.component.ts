import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { AppConstant } from '../../../app.constant';
import * as _ from "lodash";
import { MasterService } from '../../../services/master.service';
import { FeaturesService } from '../../../services/features.service';
import { SalesService } from '../../../services/sales/sales.service';
import { ProductallService } from '../../../products/productall.service';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { DateformatPipe } from '../../../pipes/dateformat.pipe';
import { ReceiptService } from '../../../receipts/receipt.service';
import { Message } from 'primeng/primeng';
import { Router, NavigationExtras } from '@angular/router';
import { MessagesService } from '../../../shared/messages.service';
import { PrimengConstant } from '../../../app.primeconfig'
import { UtilsService } from '../../../services/utils.service'
import { HotkeysService, Hotkey } from "angular2-hotkeys";

@Component({
  selector: 'app-customeradvance-addedit',
  templateUrl: './customeradvance-addedit.component.html',
  styleUrls: ['./customeradvance-addedit.component.scss']
})
export class CustomeradvanceAddeditComponent implements OnInit {
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  public date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  public amtlength = AppConstant.API_CONFIG.AMOUNTFORMAT.MAXLENGTH;
  public autocomplete_emptymessage = PrimengConstant.AUTOCOMPLETE.EMPTYMESSAGE;
  //variable declarction
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
  payingAmount: number;
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

  placeofsupplies: any = [];
  selectedreversecharge: any = {};
  // default products
  selectedproductsList = [];
  date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  //move next pag
  // @Output() notifyNewCreditNote: EventEmitter<any> = new EventEmitter();
  constructor(
    private masterservice: MasterService,
    private receiptService: ReceiptService,
    private SalesService: SalesService,
    private LocalStorageService: LocalStorageService,
    private productservice: ProductallService,
    private dateFormatPipeFilter: DateformatPipe,
    private router: Router,
    private messageService: MessagesService,
    private featureService: FeaturesService,
    private UtilsService: UtilsService,
    private _hotkeysService: HotkeysService
  ) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.SAVE.KEY, (event: KeyboardEvent): boolean => {
      this.AddPayment("");
      return false; // Prevent bubbling
    }, [], shrtkeys.COMMON.SAVE.TXT));
    this.userstoragedata = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.heads = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.HEADS);
  }
  //call parent funcation

  //implements funcations

  ngOnInit() {
    this.loadpayterm();
    this.loadinvoicelist();
    this.allbook();
    this.accountconfig();
    this.menuItems = [
      // label: 'Save',
      // items: [
      {
        label: 'Save & List', icon: 'fa-list', command: () => {
          this.AddPayment("");
        }
      },
      {
        label: 'Save', icon: 'fa-check', command: () => {
          this.AddPayment("createnew");
        }
      },
      {
        label: 'Cancel', icon: 'fa-close', command: () => {
          this.router.navigate(['/sales/customeradvance']);
        }
      }
      // ]
    ];

    var self = this;

    var data = {
      tenantid: this.userstoragedata.tenantid,
      status: "Active",
      contactype: "Customer"
    };
    // load contact list
    this.featureService.contactGetAll(data)
      .then(function (res) {
        self.contactlist = res.data;
        console.log("Contact list: ", self.contactlist);
      });
  }

  accountconfig() {
    var data =
      {
        "feature": "Receipt",
        //"tenantid": this.userstoragedata.tenantid
      }
    this.featureService.getacconfigList(data).then((res) => {
      if (res.status) {
        console.log("res", JSON.stringify(res));
        this.accconfig = res.data
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
      console.log("res", res)
      this.allbookaccs = res.data;
      var books = _.filter(this.allbookaccs, { "accheadname": "Bank" });
      console.log("bankledger", books);
      this.bankledger.push(books);
      console.log("bankledgeraaaaaaaaaa", this.bankledger);
    })
  };


  loadinvoicelist() {
    var data = {
      tenantid: this.userstoragedata.tenantid,
      finyear: this.finyear.finyear,
    }
    this.SalesService.getInvoiceList(data).then((res) => {
      console.log("invoiceList", res.data);
      this.Allinvoicelist = _.filter(res.data, function (v: any) {
        v.paymentApplied = 0
        return (0 < v.balamount)
      })
    })
  }

  calcualtePayingSuggestion() {
    var self = this;
    self.tempPayingAmount = +(self.payingAmount);
    self.payingAmount = +self.payingAmount;
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
            self.customerinvoices[k].paymentApplied = (substractAmt).toFixed(2);
            console.log("pyapplied", self.customerinvoices[k].paymentApplied);
            substractAmt = 0;
          }
          else if (self.customerinvoices[k].balamount > 0) {
            substractAmt = (self.tempPayingAmount - self.customerinvoices[k].balamount);
            self.customerinvoices[k].paymentApplied = self.tempPayingAmount - (substractAmt).toFixed(2);
            console.log("pyapplied2", self.customerinvoices[k].paymentApplied);
          }
          else {
            substractAmt = self.tempPayingAmount;
            self.customerinvoices[k].paymentApplied = substractAmt;
            console.log("pyapplied3", self.customerinvoices[k].paymentApplied);
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
        self.customerinvoices[key].paymentApplied = 0.00;
      });
    }
    self.customerinvoices = [...self.customerinvoices];
  }
  calcualtepaymentApplied(event, index) {
    console.log(index);
    if (this.customerinvoices[index].paymentApplied == "") {
      this.customerinvoices[index].paymentApplied = 0;
    }
    var pmt = this.calcPayingTotal();
    if (this.payingAmount < this.customerinvoices[index].paymentApplied) {
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

  calcBalanceAmount(balance, applied) {
    if (!isNaN(applied)) {
      return balance - applied;
    }
  }

  loadpayterm() {
    var data = {
      type: "RECEIPT"
    };
    this.featureService.paytermGetAll(data)
      .then((res) => {
        console.log("paymode", res.data)
        var paymode = res.data;
        this.payterm = this.masterservice.formatDataforDropdown("name", paymode, "Select Type"); // params name->formatting label name,fdata->value object,third param->empty selection or place holder value
        console.log("payterm", this.payterm)
      })
  }

  selpayterm(item) {
    this.Selectedpayterm = item;
    this.Selectedpaymode = "";
    var data = {
      "tenantid": this.userstoragedata.tenantid,
      "accountgroup": item.accountgroup,
      "groupname": item.groupname,
      "status": "Active",
    }
    this.featureService.paymodeGetAll(data)
      .then((res) => {
        console.log("paymodefor selected payterm", res.data);
        var paymodes = res.data;
        this.allpaymode = this.masterservice.formatDataforDropdown("subaccheadname", paymodes, "Select Type"); // params name->formatting label name,fdata->value object,third param->empty selection or place holder value
        console.log("paymodes", this.allpaymode)
      })
  }
  selpaymode(item) {
    this.Selectedpaymode = item
    console.log("paymode", item);
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
    console.log("selected contact: ", contact);
    this.contactdtls = contact;
    // this.contact = contact.firstname;
    this.filterInvoiceByCustomer(this.contactdtls.contactid);
  }
  filterInvoiceByCustomer(contactid) {
    if (this.contactdtls.contactid != undefined) {
      var data =
        {
          tenantid: this.userstoragedata.tenantid,
          finyear: this.finyear.finyear,
          contactid: contactid,
          feature: "proforma_invoice",
          limit: 1000,
          offset: 0
        }
      this.SalesService.getInvoiceList(data).then((res) => {
        console.log("proformainvoicelists", res)
        this.customerinvoices = _.filter(res.data, function (v: any) {
          v.paymentApplied = 0
          return (0 < v.balamount)
        })
      })
      console.log("customerinvoices", JSON.stringify(this.customerinvoices));
    }
  }

  AddPayment(flag) {
    var inDate: Date = this.dateFormatPipeFilter.transform(this.paymentDate, 'y-MM-dd');
    console.log("recdate", inDate);

    var validdata = true;
    if (!this.Selectedpayterm || !this.Selectedpaymode || !this.contactdtls.contactid || !this.paymentDate || !this.payingAmount)
      var validdata = false;
    if (validdata) {
      var paymentDtData = [];
      let updateHeaderData = [];
      for (var i = this.customerinvoices.length - 1; i >= 0; i--) {
        if (this.customerinvoices[i].paymentApplied > 0) {
          var dt;
          if (this.customerinvoices[i].externalentry) {
            dt = {
              "finyear": this.finyear,
              "tenantid": this.userstoragedata.tenantid,
              "tenantname": this.userstoragedata.tenantname,
              "contactid": this.contactdtls.contactid,
              "companyname": this.contactdtls.companyname,
              "pymntapplied": this.customerinvoices[i].paymentApplied
            }
          } else {
            dt = {
              "finyear": this.finyear.finyear,
              "tenantid": this.userstoragedata.tenantid,
              "tenantname": this.userstoragedata.tenantname,
              "contactid": this.customerinvoices[i].contactid,
              "companyname": this.customerinvoices[i].companyname,
              "refid": this.customerinvoices[i].invoiceid,
              "refno": this.customerinvoices[i].invoiceno,
              "refdt": this.customerinvoices[i].duedate,
              "reftotal": this.customerinvoices[i].invoicetotal,
              "duedate": this.dateFormatPipeFilter.transform(this.customerinvoices[i].duedate, this.date_apiformat),
              "pymntamount": this.customerinvoices[i].pymntamount,
              "pymntapplied": this.customerinvoices[i].paymentApplied,
              "balamount": (this.customerinvoices[i].balamount - this.customerinvoices[i].paymentApplied),
              "feature": "Receipt"
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
          console.log("paymentdata", paymentDtData);
        }

        var calcPayingTotal = this.calcPayingTotal();
        var acchead = this.heads;
        var cashinhand = _.find(this.allbookaccs, { "subaccheadname": AppConstant.API_CONFIG.EXCLEDGER[0] });
        var bank = _.find(this.allbookaccs, { "subaccheadname": AppConstant.API_CONFIG.EXCLEDGER[3] });
        this.contacthead = _.find(this.allbookaccs, { "subaccheadid": this.contactdtls.accheadid });
        var crdr = "";
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
          config.ledgerdate = inDate;
          config.feature = "Receipt";
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
 
        if (this.Selectedpaymode.subaccheadname != "Cash In Hand") {
          var bankid = this.Selectedpaymode.subaccheadid;
          var bankname = this.Selectedpaymode.subaccheadname;
        }
        console.log("config", this.accconfig);
      }

      var headerDetails = {
        "tenantid": this.userstoragedata.tenantid,
        "tenantname": this.userstoragedata.tenantname,
        "status": "Active",
        "createdby": this.userstoragedata.loginname,
        "createddt": this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
        "finyear": this.finyear.finyear,
        "contactid": this.contactdtls.contactid,
        "contactname": this.contactdtls.firstname,
        "companyname": this.contactdtls.companyname,
        "pymtmethod": this.Selectedpayterm.name,
        "pymtrectdt": inDate,
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
        "refkey": "RECEIPT_NO",
        "feature": "Receipt",
        "bankid": bankid,
        "bankname": bankname,
        "balamount": headerObj.balamount,
        "pymtrecttype": "ADVANCE"
      };

      var formData: any = {};
      formData.header = headerDetails;
      formData.ledgers = this.accconfig;
      formData.paymentReceiptDetails = paymentDtData;
      formData.updateHeader = updateHeaderData;
      // "ledgers": this.accconfig,
      //   "paymentReceiptDetails": paymentDtData,
      //   "updateHeader":updateHeaderData
      console.log("formdata", JSON.stringify(formData));

      if (this.total > 0 && this.contactdtls.contactid != "") {

        this.receiptService.ReceiptCreate(formData)
          .then((res) => {
            if (res.status == true) {
              console.log("created", res)
              this.messageService.showMessage({
                severity: 'success', summary: 'Success',
                detail: res.message
              });
              if (flag) {
                this.clearform();
              }
              else {
                this.router.navigate(['/sales/customeradvance']);
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
    this.contact = "";
    this.Selectedpayterm = "",
      this.Selectedpaymode = "",
      this.paymentRemarks = "";
    this.paymentApplied = "";
    this.payingAmount = 0;
    this.paymentReference = "";
    this.loadinvoicelist()
  };
  // splitcreate(event){
  //   if(event.target.className.indexOf("fa-caret-down") < 0 )
  //     {
  //       this.AddPayment("");
  //     }
  // }
  numberOnly(event) {
    this.UtilsService.allowNumberOnly(event)
  }

}
