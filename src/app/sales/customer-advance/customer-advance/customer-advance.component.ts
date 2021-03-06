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
import { UtilsService } from '../../../services/utils.service';
import { OrganizationSettingsService } from '../../../pages/settings/services/organization-settings.service';
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { CommonService } from '../../../pages/settings/services/common.service';

@Component({
  selector: 'app-customer-advance',
  templateUrl: './customer-advance.component.html',
  styleUrls: ['./customer-advance.component.scss']
})
export class CustomerAdvanceComponent implements OnInit {

  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  public date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  public amtlength = AppConstant.API_CONFIG.AMOUNTFORMAT.MAXLENGTH;
  public autocomplete_emptymessage = PrimengConstant.AUTOCOMPLETE.EMPTYMESSAGE;
  //variable declarction
  pymtrectno = '';
  autogenyn = 'Y';
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
  tempPayingAmount: any = 0.00;
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
  //add_parites start
  sundrygroup = "";
  addparties_display: boolean = false;
  //add_parites end
  addproduct_display : boolean = false;
  tempselectedproductPrp : any;
  selectedContactDetails: any = {};
  placeofsupplies: any = [];
  selectedreversecharge: any = {};
  contactlistDropdown: any[];
  // default products
  // selectedproductsList = [];
  //move next pag
  // @Output() notifyNewCreditNote: EventEmitter<any> = new EventEmitter();
  public customerinvoicesdetales: any[] = [];
  public filteredInvoice: any[];
  public selectedproductsList: any[] = [];
  public Temp_GST_TaxTotal: any[];
  public invoice: any;

  private settinglist: any[] = [];
  private orgpos: any;
  private taxes: any[] = [];
  private GST_TaxTotal: any[] = [];
  private selectedinvoicedetils: any;
  private amount: any;
  private balanceamount: any;
  CustomerorVendor: any = PrimengConstant.COMMON.CUSTOMER;
  date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  constructor(
    private masterservice: MasterService,
    private receiptService: ReceiptService,
    private SalesService: SalesService,
    private featureservice: FeaturesService,
    private LocalStorageService: LocalStorageService,
    private productservice: ProductallService,
    private dateFormatPipeFilter: DateformatPipe,
    private router: Router,
    private messageService: MessagesService,
    private featureService: FeaturesService,
    private UtilsService: UtilsService,
    private sequenceService: CommonService,    
    private orgservice: OrganizationSettingsService,
    private _hotkeysService: HotkeysService
  ) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.SAVE.KEY, (event: KeyboardEvent): boolean => {
      this.AddPayment("");
      return false;
    }, [], shrtkeys.COMMON.SAVE.TXT));
    this.userstoragedata = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.heads = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.HEADS);
  }
  //call parent funcation

  //implements funcations

  ngOnInit() {
    this.getSequence();    
    this.loadpayterm();
    this.allbook();
    this.accountconfig();
    this.loadorgsettings();
    this.menuItems = [
      // label: 'Save',
      // items: [
      {
        label: 'Save & Add New', icon: 'fa-plus', command: () => {
          this.AddPayment("createnew");
        }
      },
      {
        label: 'Save & View', icon: 'fa-eye', command: () => {
          this.AddPayment("");
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
    this.sundrygroup = "";
    this.addparties_display = false;

    this.loadcustomer(contact);
  }
  onhideContactpopup($event) {
    this.sundrygroup = "";
  }
  //add_parites end
  // add product start
  // displayaddproduct(selectedproduct,ridx,productTable) {
  //   this.addproduct_display = true;
  //   this.tempselectedproductPrp = {
  //     selectedproduct : selectedproduct,
  //     ridx : ridx,
  //     productTable : productTable
  //   }
  // }
  // addProductDetection(data)
  // {
  //   console.log(data);
  //   this.tempselectedproductPrp.selectedproduct = data;
  //   var pro = {
  //     value : data
  //   }
  //   this.onProductSelect(pro, this.tempselectedproductPrp.selectedproduct, this.tempselectedproductPrp.ridx, this.tempselectedproductPrp.productTable);
  //   this.addproduct_display = false;
  // }
  // onhideProductpopup($event) {
  //   this.tempselectedproductPrp = null;
  //   this.addproduct_display = false;
  // }
  // add product end
  //add_parites start 
  loadcustomer(modevalue) {
    var data = {
      tenantid: this.userstoragedata.tenantid,
      status: "Active",
      contactype: "Customer"
    };
    // load contact list
    this.featureservice.contactGetAll(data)
      .then((res) => {
        this.contactlist = res.data;
        console.log("Contact list: ", this.contactlist);
        this.contactlistDropdown = this.masterservice.formatDataforDropdown("companyname", this.contactlist, "Select Contact");
        if (modevalue != null) {
          var contact = _.find(this.contactlist, { "contactid": modevalue.contactid });
          this.selectedContactDetails = contact;
          // this.getselectedCustomer(contact);
        }
      });
  }
//add_parites end
  loadorgsettings() {
    this.orgservice.TenantSettingList({ tenantid: this.userstoragedata.tenantid }).then(
      res => {
        if (res.status) {
          this.settinglist = res.data;
          console.log("app setting list:", this.settinglist);
          if (this.settinglist.length > 0) {
            var pos = _.find(this.settinglist, function (d) {
              return (d.settingref == "PLACE_OF_SUPPLY")
            });
            this.orgpos = pos.settingvalue;
          }
        }

      },
      error => {
        console.log("service error - issue on app setting loading.");
      }
    )
  }

  loadgsttaxlist() {
    var self = this;
    var data = {
      feature: "Invoice",
    };
    this.featureService.TaxList(data)
      .then(function (res) {
        self.taxes = res.data;
        var fdata = res.data;
        console.log("taxList:", fdata);
        // self.gsttaxlist = self.masterservice.formatDataforDropdown("taxname", fdata, "Select Tax");
        self.GST_TaxTotal = _.map(self.taxes, function (tx) {
          return { taxname: tx.taxname, taxvalues: tx.taxvalues, amt: 0, cgst: 0, sgst: 0, igst: 0, exist: false };
        });
        self.taxitemSeparation();
        // params name->formatting label name,fdata->value object,third param->empty selection or place holder value
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
    if (this.payingAmount.toString().indexOf(".") == -1) {
      self.tempPayingAmount = +(self.payingAmount);
      self.payingAmount = +self.payingAmount;


      if (isNaN(self.payingAmount)) {
        self.payingAmount = 0;
        _.each(self.customerinvoicesdetales, function (v, key) {
          self.customerinvoicesdetales[key].paymentApplied = 0.00;
        });
      }

      if (self.tempPayingAmount != undefined) {
        self.tempPayingAmount = self.tempPayingAmount;
      }
      else {
        self.tempPayingAmount = 0;
      }

      if (self.tempPayingAmount > 0) {
        self.sugesstedSplits = _.filter(self.customerinvoicesdetales, (v, k) => {
          var c = false;
          self.customerinvoicesdetales[k].paymentApplied = 0;
          if (0 < self.tempPayingAmount) {
            var substractAmt: any = 0;
            if (self.customerinvoicesdetales[k].balamount >= self.tempPayingAmount) {
              substractAmt = self.tempPayingAmount;
              self.customerinvoicesdetales[k].paymentApplied = (substractAmt).toFixed(2);
              console.log("pyapplied", self.customerinvoicesdetales[k].paymentApplied);
              substractAmt = 0;
            }
            else if (self.customerinvoicesdetales[k].balamount > 0) {
              substractAmt = (self.tempPayingAmount - self.customerinvoicesdetales[k].balamount);
              self.customerinvoicesdetales[k].paymentApplied = self.tempPayingAmount - (substractAmt).toFixed(2);
              console.log("pyapplied2", self.customerinvoicesdetales[k].paymentApplied);
            }
            else {
              substractAmt = self.tempPayingAmount;
              self.customerinvoicesdetales[k].paymentApplied = substractAmt;
              console.log("pyapplied3", self.customerinvoicesdetales[k].paymentApplied);
            }
          }
          self.tempPayingAmount = substractAmt;
          c = true;
          return (c == true)

        });
      }
      else {
        self.tempPayingAmount = 0.00;
        _.each(self.customerinvoicesdetales, function (v, key) {
          self.customerinvoicesdetales[key].paymentApplied = 0.00;
        });
      }
      self.customerinvoicesdetales = [...self.customerinvoicesdetales];
      this.calcualtepaymentApplied(event, 0)
    }

  }
  calcualtepaymentApplied(event, index) {
    console.log(index);
    if (this.customerinvoicesdetales[index].paymentApplied == "") {
      this.customerinvoicesdetales[index].paymentApplied = 0;
    }
    var pmt = this.calcPayingTotal();
    if (this.payingAmount < this.customerinvoicesdetales[index].paymentApplied) {
      this.customerinvoicesdetales[index].paymentApplied = this.payingAmount;
    }
    else if (parseFloat(this.customerinvoicesdetales[index].paymentApplied) > parseFloat(this.customerinvoicesdetales[index].balamount)) {
      this.customerinvoicesdetales[index].paymentApplied = this.customerinvoicesdetales[index].balamount;
    }
    this.taxitemSeparation();
  }
  total: any;
  calcPayingTotal() {
    var total = 0.00;
    _.forEach(this.customerinvoicesdetales, function (value, key: any) {
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
  filterInvoice(event) {
    this.filteredInvoice = [];
    this.filteredInvoice = _.filter(this.customerinvoices, function (c) {
      var cname = c.invoiceno;
      return (cname.toLowerCase().indexOf(event.query.toLowerCase()) == 0);
    });
  }

  handleDropdownClick(label) {
    if (label == 'contactlist') {
      setTimeout(() => {
        this.filteredContacts = this.contactlist;
        this.filteredContacts = [...this.filteredContacts]
      }, 100)
    } else if (label == 'invoicelist') {
      setTimeout(() => {
        this.filteredInvoice = this.customerinvoices;
        this.filteredInvoice = [... this.filteredInvoice]
      }, 100)
    }

  }
  selectedCustomer(contact: any) {
    console.log("selected contact: ", contact);
    this.contactdtls = contact;
    // this.contact = contact.firstname;
    this.filterInvoiceByCustomer(this.contactdtls.contactid);
  }
  selectedInvoice(item: any) {
    this.selectedinvoicedetils = item;
    this.loadInvoiceDetails(item);
  }
  loadInvoiceDetails(item: any) {
    var reqdata: any = {
      "invoiceid": item.invoiceid,
      "feature": item.feature
    };
    this.SalesService.getInvoiceById(reqdata).then((res) => {
      var self = this;
      if (res.status) {
        self.customerinvoicesdetales = _.map(res.data, function (value: any) {
          (value.paymentApplied = 0);
          return value
        });
        self.selectedproductsList = res.data[0].invoiceDetails;
        this.loadgsttaxlist();
      }
    });
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
        if (res.status) {
          this.customerinvoices = _.filter(res.data, function (v: any) {
            v.paymentApplied = 0
            return (0 < v.balamount)
          })
        }

      })
      console.log("customerinvoices", JSON.stringify(this.customerinvoices));
    }
  }

  AddPayment(flag) {
    var inDate: Date = this.dateFormatPipeFilter.transform(this.paymentDate, 'y-MM-dd');
    console.log("recdate", inDate);

    var validdata = true;
    if (_.isEmpty(this.pymtrectno) && this.autogenyn === 'N') {
      this.messageService.showMessage({
        severity: 'error', summary: 'Error',
        detail: PrimengConstant.PAYMENT.ADDEDITFORM.TRANS_NUMBER
      });
      return;
    }
    if (!this.Selectedpayterm || !this.Selectedpaymode || !this.contactdtls.contactid || !this.paymentDate || !this.payingAmount)
      var validdata = false;
    if (validdata) {
      var paymentDtData = [];
      let updateHeaderData = [];
      for (var i = this.customerinvoicesdetales.length - 1; i >= 0; i--) {
        if (this.customerinvoicesdetales[i].paymentApplied > 0) {
          var dt;
          if (this.customerinvoicesdetales[i].externalentry) {
            dt = {
              "finyear": this.finyear,
              "tenantid": this.userstoragedata.tenantid,
              "tenantname": this.userstoragedata.tenantname,
              "contactid": this.contactdtls.contactid,
              "companyname": this.contactdtls.companyname,
              "pymntapplied": this.customerinvoicesdetales[i].paymentApplied
            }
          } else {
            dt = {
              "finyear": this.finyear.finyear,
              "tenantid": this.userstoragedata.tenantid,
              "tenantname": this.userstoragedata.tenantname,
              "contactid": this.customerinvoicesdetales[i].contactid,
              "companyname": this.customerinvoicesdetales[i].companyname,
              "refid": this.customerinvoicesdetales[i].invoiceid,
              "refno": this.customerinvoicesdetales[i].invoiceno,
              "refdt": this.customerinvoicesdetales[i].duedate,
              "reftotal": this.customerinvoicesdetales[i].invoicetotal,
              "duedate": this.dateFormatPipeFilter.transform(this.customerinvoicesdetales[i].duedate, this.date_apiformat),
              "pymntamount": this.customerinvoicesdetales[i].pymntamount,
              "pymntapplied": this.customerinvoicesdetales[i].paymentApplied,
              "balamount": (this.customerinvoicesdetales[i].balamount - this.customerinvoicesdetales[i].paymentApplied),
              "feature": "Receipt"
            };

            var headerObj: any = {};
            headerObj.invoiceid = this.customerinvoicesdetales[i].invoiceid;
            headerObj.tenantid = this.userstoragedata.tenantid;
            headerObj.balamount = (this.customerinvoicesdetales[i].balamount - this.customerinvoicesdetales[i].paymentApplied);
            headerObj.pymntapplied = this.customerinvoicesdetales[i].paymentApplied;
            headerObj.pymntamount = parseFloat(this.customerinvoicesdetales[i].paymentApplied) + parseFloat(this.customerinvoicesdetales[i].pymntamount);
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
      if (this.autogenyn === 'N') {
        formData.header.pymtrectno = this.pymtrectno;
      }
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
                let paymentid = res.data.header.pymtrectid;
                this.router.navigate(['/sales/viewcustomeradvance', paymentid]);
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
  calcdiscAmount(index) {
    var bamt = parseFloat(this.selectedproductsList[index].mrp) * parseFloat(this.selectedproductsList[index].quantity);
    return bamt * parseFloat(this.selectedproductsList[index].discntprcnt) / 100;
  }
  taxitemSeparation() {
    var discountTotal = 0;
    var GST0total = 0;
    var GST025total = 0;
    var GST3total = 0;
    var GST5total = 0;
    var GST12total = 0;
    var GST18total = 0;
    var GST28total = 0;
    var interastate = true;
    if (!_.isEmpty(this.customerinvoicesdetales[0])) {
      if (this.orgpos != this.customerinvoicesdetales[0].pos) {
        interastate = false;
      }
    }
    for (var i = this.selectedproductsList.length - 1; i >= 0; i--) {
      var va = this.selectedproductsList[i];
      if ((this.selectedproductsList[i].prodid != 0)) {
        var ptotal = 0;
        var discntvalue;
        var taxval: any = 0;
        ptotal = parseFloat(this.selectedproductsList[i].quantity) * parseFloat(this.selectedproductsList[i].mrp);
        discntvalue = this.calcdiscAmount(i);
        taxval = ((ptotal - discntvalue) * parseFloat(this.selectedproductsList[i].taxpercent)) / 100;
        discountTotal += discntvalue;


        // var sellacchead = _.find(this.allbookaccs, { "subaccheadid": Number(this.selectedproductsList[i].subaccheadid) });

        var CGST = 0;
        var SGST = 0;
        var IGST: any = 0

        if (interastate == true) {
          var CGST = taxval / 2;
          var SGST = taxval / 2;
          var IGST: any = 0
        } else if (interastate == false) {
          var IGST = taxval;
          var CGST = 0;
          var SGST = 0;
        }
        var gst0name: String, gst025name: String, gst3name: String, gst5name: String, gst12name: String,
          gst18name: String, gst28name: String;
        var gst0id: Number, gst025id: Number, gst3id: Number, gst5id: Number, gst12id: Number,
          gst18id: Number, gst28id: Number;
        var tax;
        var invoceheader = this.customerinvoicesdetales[0];
        if (invoceheader.paymentApplied > 0) {
          var payableamount = (+(parseFloat(invoceheader.paymentApplied) / parseFloat(invoceheader.balamount) * 100)).toFixed(2);
          var subvalue = va.quantity * va.mrp;
          var discntvalu = this.calcdiscAmount(i);
          var taxvalue = ((subvalue - discntvalu) * parseFloat(va.taxpercent)) / 100;
          var subtotal = (ptotal - discntvalu);
          var product = (+(subtotal / 100) * parseFloat((payableamount))).toFixed(2);
          var taxpro = (+(parseFloat(product) / 100) * parseFloat(va.taxpercent)).toFixed(2);
          tax = (+taxpro)
        } else {
          var total = 0;
          var btotal = va.quantity * va.mrp;
          btotal = btotal ? btotal : 0;
          var discount = va.discntprcnt ? va.discntprcnt : 0;
          total = (btotal) - (btotal * parseFloat(discount) / 100);
          tax = ((total * va.taxpercent) / 100);
        }

        if (va.taxname == "GST 0.00%") {
          GST0total += tax;
        } else if (va.taxname == "GST 0.25%") {
          GST025total += tax;
        } else if (va.taxname == "GST 3.00%") {
          GST3total += tax;
        } else if (va.taxname == "GST 5.00%") {
          GST5total += tax;
        } else if (va.taxname == "GST 12.00%") {
          GST12total += tax;
        } else if (va.taxname == "GST 18.00%") {
          GST18total += tax;
        } else if (va.taxname == "GST 28.00%") {
          GST28total += tax;
        }

      }
    }
    if (interastate == true) {
      var CGST0 = (+(GST0total / 2).toFixed(2));
      var SGST0 = (+(GST0total / 2).toFixed(2));
      var CGST025 = (+(GST025total / 2).toFixed(2));
      var SGST025 = (+(GST025total / 2).toFixed(2));
      var CGST3 = (+(GST3total / 2).toFixed(2));
      var SGST3 = (+(GST3total / 2).toFixed(2));
      var CGST5 = (+(GST5total / 2).toFixed(2));
      var SGST5 = (+(GST5total / 2).toFixed(2));
      var CGST12 = (+(GST12total / 2).toFixed(2));
      var SGST12 = (+(GST12total / 2).toFixed(2));
      var CGST18 = (+(GST18total / 2).toFixed(2));
      var SGST18 = (+(GST18total / 2).toFixed(2));
      var CGST28 = (+(GST28total / 2).toFixed(2));
      var SGST28 = (+(GST28total / 2).toFixed(2));
      var IGST0 = 0;
      var IGST025 = 0;
      var IGST3 = 0;
      var IGST5 = 0;
      var IGST12 = 0;
      var IGST18 = 0;
      var IGST28 = 0;
    } else if (interastate == false) {
      var IGST0 = (+(GST0total).toFixed(2));
      var IGST025 = (+(GST025total).toFixed(2));
      var IGST3 = (+(GST3total).toFixed(2));
      var IGST5 = (+(GST5total).toFixed(2));
      var IGST12 = (+(GST12total).toFixed(2));
      var IGST18 = (+(GST18total).toFixed(2));
      var IGST28 = (+(GST28total).toFixed(2));
      var CGST0 = 0;
      var SGST0 = 0;
      var CGST025 = 0;
      var SGST025 = 0;
      var CGST3 = 0;
      var SGST3 = 0;
      var CGST5 = 0;
      var SGST5 = 0;
      var CGST12 = 0;
      var SGST12 = 0;
      var CGST18 = 0;
      var SGST18 = 0;
      var CGST28 = 0;
      var SGST28 = 0;
    }
    this.GST_TaxTotal = _.map(this.GST_TaxTotal, function (tx: any) {
      var cgst = 0, sgst = 0, igst = 0, amt;
      if (tx.taxname == "GST 0.00%") {
        cgst = CGST0;
        sgst = SGST0;
        igst = IGST0;
        amt = CGST0 + SGST0 + IGST0;
      } else if (tx.taxname == "GST 0.25%") {
        cgst = CGST025;
        sgst = SGST025;
        igst = IGST025;
        amt = CGST025 + SGST025 + IGST025;
      } else if (tx.taxname == "GST 3.00%") {
        cgst = CGST3;
        sgst = SGST3;
        igst = IGST3;
        amt = CGST3 + SGST3 + IGST3;
      } else if (tx.taxname == "GST 5.00%") {
        cgst = CGST5;
        sgst = SGST5;
        igst = IGST5;
        amt = CGST5 + SGST5 + IGST5;
      } else if (tx.taxname == "GST 12.00%") {
        cgst = CGST12;
        sgst = SGST12;
        igst = IGST12;
        amt = CGST12 + SGST12 + IGST12;
      } else if (tx.taxname == "GST 18.00%") {
        cgst = CGST18;
        sgst = SGST18;
        igst = IGST18;
        amt = CGST18 + SGST18 + IGST18;
      } else if (tx.taxname == "GST 28.00%") {
        cgst = CGST28;
        sgst = SGST28;
        igst = IGST28;
        amt = CGST28 + SGST28 + IGST28;
      }
      tx.cgst = cgst;
      tx.sgst = sgst;
      tx.igst = igst;
      tx.amt = amt;
      return tx;
    });
    this.Temp_GST_TaxTotal = [];
    this.Temp_GST_TaxTotal = _.filter(this.GST_TaxTotal, function (tx: any) {
      if (tx.cgst > 0 || tx.sgst > 0 || tx.igst > 0 || tx.amt > 0) {
        return tx;
      }
    });
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
    this.customerinvoicesdetales = [];
    this.invoice = "";
    this.Temp_GST_TaxTotal = [];
    this.selectedproductsList = [];
    this.allpaymode = [];
    this.pymtrectno = "";
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

