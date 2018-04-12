import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import * as _ from "lodash";
import { MasterService } from '../../services/master.service';
import { PurchasesService } from '../../services/purchases/purchases.service';
import { ProductallService } from '../../products/productall.service';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { DateformatPipe } from '../../pipes/dateformat.pipe';
// import { PaymentService } from '../payment.service';
import { Message } from 'primeng/primeng';
import { Router, NavigationExtras } from '@angular/router';
import { MessagesService } from '../../shared/messages.service';
import { FeaturesService } from '../../services/features.service';
import { PrimengConstant } from '../../app.primeconfig';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-general-payment',
  templateUrl: './general-payment.component.html',
  styleUrls: ['./general-payment.component.scss']
})
export class GeneralPaymentComponent implements OnInit {
  
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
  public autocomplete_emptymessage = PrimengConstant.AUTOCOMPLETE.EMPTYMESSAGE;
  constructor(
    private masterservice: MasterService,
    // private paymentService: PaymentService,
    private purchasesService: PurchasesService,
    private LocalStorageService: LocalStorageService,
    private productservice: ProductallService,
    private dateFormatPipeFilter: DateformatPipe,
    private router: Router,
    private featureService: FeaturesService,
    private messageService: MessagesService,
    private UtilsService: UtilsService) {
    this.userstoragedata = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.heads = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.HEADS);
  }

  ngOnInit() {
    // this.seqgenerator();
    this.loadpayterm();
    this.loadbilllist();
    this.allbook();
    this.accountconfig();
    this.menuItems = [
      // label: 'Save',
      // items: [
      {
        label: 'Save & List', icon: 'fa-check', command: () => {
          // this.AddPayment("");
        }
      },
      {
        label: 'Save', icon: 'fa-check', command: () => {
          // this.AddPayment("createnew");
        }
      },
      {
        label: 'Cancel', icon: 'fa-times', command: () => {
          this.router.navigate(['/payment/list']);
        }
      }
      // ]
    ];

    var self = this;

    var data = {
      tenantid: this.userstoragedata.tenantid,
      status: "Active",
      contactype: "Vendor"
    };
    // load contact list
    this.featureService.contactGetAll(data)
      .then(function (res) {
        if(res.status){
        self.contactlist = res.data;
      }
       else{
          self.contactlist = [];
       }
      });
  }

  // seqgenerator() {
  //   var data = {
  //     tenantid: this.userstoragedata.tenantid,
  //     "refkey": "PYMT"
  //   };
  //   this.masterservice.seqgenerator(data)
  //     .then((res) => {
  //       console.log("recno", res);
  //       this.recno = res.data[0].Nextseqno;
  //       this.seqid = res.data[0].seqid
  //     });
  // }

  accountconfig() {
    var data =
      {
        "feature": "Payment",
      }
    this.featureService.getacconfigList(data).then((res) => {
      if (res.status) {
        this.accconfig = res.data
      }
       else{
          this.accconfig =[];
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
       if(res.status){
      this.allbookaccs = res.data;
      var books = _.filter(this.allbookaccs, { "accheadname": "Bank" });
      this.bankledger.push(books);
       }
       else{
          this.allbookaccs =[];
       }
    })
  };

  loadbilllist() {
    var data = {
      tenantid: this.userstoragedata.tenantid,
      finyear: this.finyear.finyear,
    }
    this.purchasesService.getBillList(data).then((res) => {
       if(res.status){
      this.Allinvoicelist = _.filter(res.data, function (v: any) {
        v.paymentApplied = 0
        return (0 < v.balamount)
      })
       }
    })
  }

  calcualtePayingSuggestion() {
    var self = this;
    if ((self.payingAmount.indexOf(".") > -1) && ((self.payingAmount.length - 1) == (self.payingAmount.indexOf(".")))) {
      return false;
    }
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
            self.customerinvoices[k].paymentApplied = substractAmt;
            substractAmt = 0;
          }
          else if (self.customerinvoices[k].balamount > 0) {
            substractAmt = (self.tempPayingAmount - self.customerinvoices[k].balamount);
            self.customerinvoices[k].paymentApplied = self.tempPayingAmount - substractAmt;
          }
          else {
            substractAmt = self.tempPayingAmount;
            self.customerinvoices[k].paymentApplied = substractAmt;
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
    if (this.customerinvoices[index].paymentApplied == "") {
      this.customerinvoices[index].paymentApplied = 0;
    }
    var pmt = this.calcPayingTotal();
    if (this.payingAmount < this.customerinvoices[index].paymentApplied) {
      this.customerinvoices[index].paymentApplied = this.payingAmount;
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
      type: "PAYMENT"
    };
    this.featureService.paytermGetAll(data)
      .then((res) => {
         if(res.status){
        var paymode = res.data;
        this.payterm = this.masterservice.formatDataforDropdown("name", paymode, "Select Type");
         }
      })
  }

  selpayterm(item) {
    this.Selectedpayterm = item;
    this.Selectedpaymode = "";
    var data = {
      "tenantid": this.userstoragedata.tenantid,
      "accountgroup": item.accountgroup,
      "groupname": item.groupname,
      "status": "Active"
    }
    this.featureService.paymodeGetAll(data)
      .then((res) => {
         if(res.status){
            var paymodes = res.data;
            this.allpaymode = this.masterservice.formatDataforDropdown("subaccheadname", paymodes, "Select Type");
         }
      })
  }

  selpaymode(item) {
    this.Selectedpaymode = item;
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
      this.filteredContacts=[...this.filteredContacts];
    }, 100)
  }
  selectedCustomer(contact) {
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
          "feature": "BILL",
          "limit": 1000,
          "offset": 0
        }
      this.purchasesService.getBillList(data)
        .then((res) => {
           if(res.status){
          this.customerinvoices = _.filter(res.data, function (v: any) {
            v.paymentApplied = 0
            return (0 < v.balamount)
          })
           }
        })
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
    this.loadbilllist()
  };
  splitbtn_save(event) {
    if (event.target.className.indexOf("fa-caret-down") < 0) {
      // this.AddPayment("");
    }
  }
  numberOnly(event: any) {
    this.UtilsService.allowNumberOnly(event);
  }

}
