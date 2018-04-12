import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import * as _ from "lodash";
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
import { ActivatedRoute } from "@angular/router";
import {PrimengConstant}from '../../../app/app.primeconfig'
@Component({
  selector: 'app-invmatching',
  templateUrl: './invmatching.component.html',
  styleUrls: ['./invmatching.component.scss']
})
export class InvmatchingComponent implements OnInit {
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  private date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  public autocomplete_emptymessage=PrimengConstant.AUTOCOMPLETE.EMPTYMESSAGE;
  pymtrectid: any;
  editmode: boolean = true;
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
  paymentDate: Date=new Date();
  receiptdate: any;
  Selectedpayterm: any;
  accconfig: any;
  paymentRemarks: any;
  contacthead: any;
  menuitems: any;
  paymentReference: any;
  placeofsupplies: any = [];
  selectedreversecharge: any = {};
  pymtrectdetails: any;
  receiptlineitems: any;
  ledgerdetails: any;
  selectedaccount: any;
  bankledger: any;
  allbookaccs: any;
  deleteLedgerIds: any;
  recdate: any;
  paymentReceiptDtls: any = {
    "insert": [],
    "update": [],
    "delete": []
  };

  date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
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
    private acroute: ActivatedRoute,
  ) {
    this.userstoragedata = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.heads = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.HEADS);

    this.acroute.params.subscribe(params => {
      if (!_.isEmpty(params)) {
        this.pymtrectid = params.pymtrectid;
        console.log("urlparams", params);
      }
    });

    if (!_.isEmpty(this.pymtrectid) && this.pymtrectid != null && this.pymtrectid != undefined) {
      this.loadreceiptdetails();
    }
  }

  getallcontacts(): Promise<any> {
    var data = {
      tenantid: this.userstoragedata.tenantid,
      status: "Active",
      contactype: "Customer"
    };
    // load contact list
    return this.featureService.contactGetAll(data)
      .then((res) => {
        if(res.status){
        this.contactlist = res.data;
        console.log("Contact list: ", this.contactlist);
      }
      else{
        this.contactlist = [];
      }
      });
  }
  loadreceiptdetails() {
    var data =
      {
        "paymentReceiptid": this.pymtrectid,
        "feature": "Receipt"
      }
    this.receiptService.ReceiptGetbyId(data)
      .then(res => {
        if (res.status) {
          this.pymtrectdetails = res.data[0];
          this.receiptlineitems = res.data[0].details;
          this.ledgerdetails = res.data[0].ledgers;
          this.payingAmount = this.pymtrectdetails.pymtamount;
          // var lineitems = _.map(this.receiptlineitems, function (key: any) {
          //   key.balamount = key.balamount + key.pymntapplied
          //   return key;
          // });
          // console.log("lineitems:", JSON.stringify(this.lineitems));
          this.formateditmode();
          console.log("date", this.pymtrectdetails)
        }
        else{
          this.pymtrectdetails =  [];
          this.receiptlineitems =  [];
          this.ledgerdetails = [];
        }
      });
  }
  formateditmode() {
    this.contact = this.pymtrectdetails.contactname;
    this.getallcontacts().then(res => {
      this.contactdtls = _.find(this.contactlist, { contactid: this.pymtrectdetails.contactid });
      console.log("contactlist", this.contactdtls);
    })
    this.paymentDate = this.dateFormatPipeFilter.transform(this.pymtrectdetails.pymtrectdt, this.date_dformat);
    this.loadpayterm().then(g => {
      let selectedpaymode: any = _.find(this.payterm, { value: { name: this.pymtrectdetails.pymtmethod } });
      this.Selectedpayterm = selectedpaymode.value;
      this.selpayterm(selectedpaymode.value).then(g => {
        this.selectedaccount = _.find(this.allpaymode, { value: { subaccheadid: this.ledgerdetails[1].leadaccheadid } });
        console.log("account", this.selectedaccount);
        this.Selectedpaymode = this.selectedaccount.value
        this.filterInvoiceByCustomer(this.pymtrectdetails.contactid);
        console.log("paymentdate", this.paymentDate)
        this.extractdeleteLedgerIds();
      });
    })


  }
  lineitems() {
    // this.customerinvoices = this.receiptlineitems
  }
  extractdeleteLedgerIds() {
    this.deleteLedgerIds = [];
    for (var i = 0; i < this.pymtrectdetails.ledgers.length; i++) {
      this.deleteLedgerIds.push(this.pymtrectdetails.ledgers[i].ledgerid)
      console.log("deletedids", this.deleteLedgerIds);
    }
  }

  ngOnInit() {
    this.getallcontacts()
    this.loadpayterm();
    this.loadinvoicelist();
    this.allbook();
    this.accountconfig();
    this.menuItems = [
      // {
      // label: 'Save',
      // items: [
        {
          label: 'Save & List', icon: 'fa-check', command: () => {
            this.AddPayment("");
          }
        },
        {
        label: 'Save', icon: 'fa-check', command: () => {
          this.AddPayment("createnew");
        }
      },
        {
          label: 'Cancel', icon: 'fa-times', command: () => {
            this.router.navigate(['/receipts/list']);
          }
        }
      // }]
    ];
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
      else{
        this.accconfig = []
      }
    });
  };

  allbook() {
    var data =
      {
        // tenantid: this.userstoragedata.tenantid,
        status: "Active"
      }
    this.bankledger = [];
    this.featureService.BookofAccList(data).then((res) => {
      if(res.status){
      console.log("res", res)
      this.allbookaccs = res.data;
      var books = _.filter(this.allbookaccs, { "accheadname": "Bank" });
      console.log("bankledger", books);
      this.bankledger.push(books);
      console.log("bankledgeraaaaaaaaaa", this.bankledger);
    }
    else{
      this.allbookaccs =[];      
    }
    })
  };


  loadinvoicelist() {
    var data = {
      tenantid: this.userstoragedata.tenantid,
      finyear: this.finyear.finyear,
    }
    this.SalesService.getInvoiceList(data).then((res) => {
      if(res.status){
      console.log("invoiceList", res.data);
      this.Allinvoicelist = _.filter(res.data, function (v: any) {
        v.pymntapplied = 0
        return (0 < v.balamount)
      })
      }
    })
  }

  calcualtePayingSuggestion() {
    var self = this;
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
            console.log("pyapplied", self.customerinvoices[k].pymntapplied);
            substractAmt = 0;
          }
          else if (self.customerinvoices[k].balamount > 0) {
            substractAmt = (self.tempPayingAmount - self.customerinvoices[k].balamount);
            self.customerinvoices[k].pymntapplied = self.tempPayingAmount - substractAmt;
            console.log("pyapplied2", self.customerinvoices[k].pymntapplied);
          }
          else {
            substractAmt = self.tempPayingAmount;
            self.customerinvoices[k].pymntapplied = substractAmt;
            console.log("pyapplied3", self.customerinvoices[k].pymntapplied);
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

  calcualtepaymentApplied(event, index) {
    console.log(index);
    if (this.customerinvoices[index].pymntapplied == "") {
      this.customerinvoices[index].pymntapplied = 0;
    }
    var pmt = this.calcPayingTotal();
    if (parseFloat(this.payingAmount) < parseFloat(this.customerinvoices[index].pymntapplied)) {
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

  // get name12() {
  //   return 123;
  // }
  calcBalanceAmount(balance, applied) {
    if (!isNaN(applied)) {
      return parseFloat(balance) - parseFloat(applied);
    }
  }

  loadpayterm(): Promise<any> {
    var data = {
      type: "RECEIPT"
    };
    return this.featureService.paytermGetAll(data)
      .then((res) => {
        if(res.status){
        console.log("paymode", res.data)
        var paymode = res.data;
        this.payterm = this.masterservice.formatDataforDropdown("name", paymode, "Select Type"); // params name->formatting label name,fdata->value object,third param->empty selection or place holder value
        console.log("payterm", this.payterm)
        }
      })
  }

  selpayterm(item): Promise<any> {
    this.Selectedpayterm = item;
    this.Selectedpaymode = "";
    var data = {
      "tenantid": this.userstoragedata.tenantid,
      "accountgroup": item.accountgroup,
      "groupname": item.groupname,
      "status":"Active",
    }
    return this.featureService.paymodeGetAll(data)
      .then((res) => {
        if(res.status){
        console.log("paymodefor selected payterm", res.data);
        var paymodes = res.data;
        this.allpaymode = this.masterservice.formatDataforDropdown("subaccheadname", paymodes, "Select Type"); // params name->formatting label name,fdata->value object,third param->empty selection or place holder value
        console.log("paymodes", this.allpaymode)
        }
      })
  }
  selpaymode(item) {
    this.Selectedpaymode = item
    console.log("paymode", item);
  }


  filterContacts(event) {
    this.filteredContacts = [];
    this.filteredContacts = _.filter(this.contactlist, function (c: any) {
      var cname = c.firstname + c.lastname;
      return (cname.toLowerCase().indexOf(event.query.toLowerCase()) == 0);
    });
  }

  handleDropdownClick() {
    this.filteredContacts = [];

    //mimic remote call
    setTimeout(() => {
      this.filteredContacts = this.contactlist;
    }, 100)
  }
  selectedCustomer(contact: any) {
    console.log("selected contact: ", contact);
    this.contactdtls = contact;
    // this.contact = contact.firstname;
    this.filterInvoiceByCustomer(this.contactdtls.contactid);
  }
  filterInvoiceByCustomer(contactid) {
    if (contactid != undefined) {
      var data =
        {
          "tenantid": this.userstoragedata.tenantid,
          "finyear": this.finyear.finyear,
          "contactid": contactid,
          "feature": "invoice",
          "limit": 1000,
          "offset": 0
        }
      this.SalesService.getInvoiceList(data)
        .then((res) => {
          if(res.status){
          this.customerinvoices = _.filter(res.data, function (v: any) {
            v.pymntapplied = 0
            return (0 < v.balamount)
          })
          console.log("customerinvoices", JSON.stringify(this.customerinvoices));
          }
        })
    }
  }

  AddPayment(flag) {
    var inDate: Date = this.dateFormatPipeFilter.transform(this.paymentDate, 'y-MM-dd');
    console.log("recdate", inDate);

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
              "contactid": this.customerinvoices[i].contactid,
              "companyname": this.customerinvoices[i].companyname,
              "pymtrectdtlid": this.customerinvoices[i].pymtrectdtlid,
              "pymtrectid": this.customerinvoices[i].pymtrectid,
              "refid": this.customerinvoices[i].invoiceid,
              "refno": this.customerinvoices[i].invoiceno,
              "refdt": this.customerinvoices[i].invoicedt,
              "reftotal": this.customerinvoices[i].invoicetotal,
              "pymntamount": this.customerinvoices[i].pymntamount,
              "pymntapplied": +this.customerinvoices[i].pymntapplied,
              "balamount": (this.customerinvoices[i].balamount - this.customerinvoices[i].pymntapplied),
              "feature": "Receipt"
            };

            var headerObj: any = {};
            headerObj.invoiceid = this.customerinvoices[i].invoiceid;
            headerObj.tenantid = this.userstoragedata.tenantid;
            headerObj.balamount = (this.customerinvoices[i].balamount - this.customerinvoices[i].pymntapplied);
            headerObj.pymntapplied = +this.customerinvoices[i].pymntapplied;
            headerObj.pymntamount = parseFloat(this.customerinvoices[i].pymntapplied) + parseFloat(this.customerinvoices[i].pymntamount);
            updateHeaderData.push(headerObj);
          }
          paymentDtData.update.push(dt)
          console.log("paymentdata", paymentDtData);
        }

        var calcPayingTotal = this.calcPayingTotal();
        var baladvamount = this.payingAmount - this.total;
        console.log("baladvamount", baladvamount);
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

        if (this.total > this.payingAmount) {
          validdata = false;
        }
        _.forEach(this.accconfig, (config) => {
          config.contactid = this.contactdtls.contactid;
          config.contactname = this.contactdtls.firstname;
          config.tenantid = this.userstoragedata.tenantid;
          config.tenantname = this.userstoragedata.tenantName;
          config.ledgerdate = inDate;
          config.txnid = this.pymtrectid;
          config.txnrefno = this.pymtrectdetails.pymtrectno;
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
      if (!_.isEmpty(inDate)) {
        this.recdate = inDate
      }
      else {
        this.recdate = this.dateFormatPipeFilter.transform(this.pymtrectdetails.pymtrectdt, this.date_apiformat);
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
        "pymtrectdt": this.recdate,
        "pymtamount": baladvamount,
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
        "status": "Active",
        "feature": "Receipt",
        "bankid": bankid,
        "bankname": bankname
      };

      var formData: any = {};
      formData.header = headerDetails;
      formData.ledgerUpdate = this.accconfig;
      formData.paymentReceiptDtls = paymentDtData;
      formData.deleteLedgerIds = this.deleteLedgerIds;
      formData.updateHeader = updateHeaderData;
      console.log("formdata", JSON.stringify(formData));
      if (this.total > 0 && this.contactdtls.contactid != "" && validdata) {
        this.receiptService.UpdateReceipt(formData)
          .then((res) => {
            if (res.status == true) {
              console.log("created", res)
              this.messageService.showMessage({
                severity: 'success', summary:'Success',detail: res.message 
              });
              if (flag) {
                this.clearform();
              }
              else {
                this.router.navigate(['/receipts/list']);
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
        if (!validdata) {
          this.messageService.showMessage({
            severity: 'error', summary: 'Error',
            detail: PrimengConstant.COMMONTRANSACTION.ADVANCEAMOUNT
          });
        }
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
      else if (!this.paymentApplied) {
        this.messageService.showMessage({
          severity: 'error', summary: 'Error',
          detail:PrimengConstant.COMMONTRANSACTION.NOTAPPLIEDTOINVOICE
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

}
