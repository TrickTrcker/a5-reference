import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MasterService } from '../../../services/master.service';
import { FeaturesService } from '../../../services/features.service';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { AppConstant } from '../../../app.constant';
import { SalesService } from '../../../services/sales/sales.service';
import { DateformatPipe } from '../../../pipes/dateformat.pipe';
import { AccountsService } from '../../service/accounts.service'
import { MessagesService } from '../../../shared/messages.service';
import { UtilsService } from '../../../services/utils.service'
import * as _ from "lodash";
import * as moment from 'moment';
import { PrimengConstant } from '../../../app.primeconfig'
import { OrganizationSettingsService } from '../../../pages/settings/services/organization-settings.service';
import { CommonService } from '../../../pages/settings/services/common.service';

@Component({
  selector: 'app-new-credit-note',
  templateUrl: './new-credit-note.component.html',
  styleUrls: ['./new-credit-note.component.scss']
})
export class NewCreditNoteComponent implements OnInit, OnChanges {
  reasonlist: any;

  public amtlength = AppConstant.API_CONFIG.AMOUNTFORMAT.MAXLENGTH;
  userdetails: any;
  journalno: any;
  autogenyn = 'Y';
  invoiceList: Array<any> = [];
  customers: Array<any> = [];
  selectedinvoice: any = [];
  selectedinvoicedetils: any;
  filterinvoicelist: Array<any>
  amount: string = "0";
  tmpamount: string;
  selectedItem: any;
  balanceamount: any;
  crno: any;
  seqid: any;
  date: Date = new Date();
  selectedcontact: any;
  transno: any;
  selectedcontactdetils: any = [];
  buttonText = "Save";
  filteredContacts: any;
  selectedinvoicedata: any = {};
  paymentRemarks: string;
  accconfig: Array<any>;
  Refernce: string;
  reason: any;
  dispDateFormat: string;
  submitted: boolean = false;
  finyear: any;
  paymantAmountTotal: any;
  viewdeatils: any;
  invoiceFindAllData: any;
  updateLedgers: Array<any> = [];
  docDate: string;
  currency_Symbol: string
  viewamount: any;
  enteramount: string;
  invoicetaxs: any
  invoiceData: any
  invoiceproduct: any[] = [];
  displayDialog: boolean = false;
  selectedProduct: any;
  quantityamount: any;
  selecteddetailsproduct: any;
  editmode: boolean = true;
  tempproducts: any[] = [];
  creditamount_applyied: any;
  selectedcreditamount: any[] = [];
  produutid: number;
  oldinvoiceproduct: any[] = []
  GSTTaxTotal: Array<any> = [];
  tempGSTTaxTotal: any[] = [];
  returnQuntity: any;
  Temp_GST_TaxTotal: any[] = [];
  orgpos: any
  settinglist: any[] = [];
  selectedplaceofsupply: any
  oldGSTTax: any[] = [];
  taxes: any[] = [];
  GST_TaxTotal: any[] = [];
  Invoicecategory: any = "goodsInvoice";//SEDT
  //move next page
  @Output() notifyNewCreditNote: EventEmitter<any> = new EventEmitter();
  @Input() creditls: any;
  private date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  private date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  public invoice_emptymessage = PrimengConstant.AUTOCOMPLETE.CREDITNOTE_invoice;
  public customer_emptymessage = PrimengConstant.AUTOCOMPLETE.CUSTOMER;

  constructor(private MasterService: MasterService,
    private LocalStorageService: LocalStorageService,
    private SalesService: SalesService,
    private AccountsService: AccountsService,
    private dateFormatPipeFilter: DateformatPipe,
    private MessagesService: MessagesService,
    private FeaturesService: FeaturesService,
    private UtilsService: UtilsService,
    private sequenceService: CommonService,
    private orgservice: OrganizationSettingsService,

  ) {
    //user services
    this.userdetails = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.dispDateFormat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
    this.getSequence();

  }
  //implements funcations
  ngOnInit() {
    this.buttonText = "Save";
    //call funcation for services
    this.DROPLISTALL();
    this.getacconfig();
    this.loadorgsettings();
    this.loadReasons();
  }

  ngOnChanges() {
    this.buttonText = "Update";

  }
  loadorgsettings() {
    this.orgservice.TenantSettingList({ tenantid: this.userdetails.tenantid }).then(
      res => {
        if (res.status) {
          this.settinglist = res.data;
          console.log("app setting list:", this.settinglist);
          if (this.settinglist.length > 0) {
            var pos = _.find(this.settinglist, function (d) {
              return (d.settingref == "PLACE_OF_SUPPLY")
            });
            this.orgpos = pos.settingvalue;
            console.log(" this.orgpos", this.orgpos)
          }
        }

      },
      error => {
        console.log("service error - issue on app setting loading.");
      }
    )
  }
  loadReasons() {
    this.FeaturesService.getcodemasterList({ type: 'CRDR_REASON_TYPE' }).then(res => {
      if (res.status) {
        this.reasonlist = res.data;
      } else {
        this.reasonlist = [];
      }
    });
  }
  loadgsttaxlist() {
    var data = {
      feature: "Invoice",
    };
    this.FeaturesService.TaxList(data)
      .then((res) => {
        this.taxes = res.data;
        var fdata = res.data;
        console.log("taxList:", fdata);
        // self.gsttaxlist = self.masterservice.formatDataforDropdown("taxname", fdata, "Select Tax");
        this.GST_TaxTotal = _.map(this.taxes, function (tx) {
          return { taxname: tx.taxname, taxvalues: tx.taxvalues, amt: 0, cgst: 0, sgst: 0, igst: 0, exist: false };
        });
        this.taxitemSeparation();
        // params name->formatting label name,fdata->value object,third param->empty selection or place holder value
      });
  }

  //call parent funcation
  callParent() {
    this.notifyNewCreditNote.next();
  }
  //invoice findall services
  invoiceFindAll(contactid: any): Promise<any> {
    if (this.creditls) {
      this.invoiceFindAllData = {
        "tenantid": contactid.tenantid,
        "finyear": contactid.finyear,
        "feature": ["invoice", "cai_invoice"],
        "invoiceno": contactid.crdrrefno,
        "contactid": contactid.contactid
      }
    }
    else {
      this.invoiceFindAllData = {
        tenantid: this.userdetails.tenantid,
        finyear: this.finyear.finyear,
        "contactid": contactid,
        "feature": ["invoice", "cai_invoice"],
        // "limit":2,
        // "offset":0
      };
    }
    return this.SalesService.getInvoiceList(this.invoiceFindAllData).then((res) => {
      if (res.status) {
        this.invoiceList = res.data;
        if (!this.creditls) {
          this.invoiceList = _.filter(res.data, (value: any) => {
            return ((Number(this.selectedcontactdetils.contactid) == Number(value.contactid)) && (0 < value.balamount))
          });
          this.invoiceList = _.sortBy(this.invoiceList, function (val) {
            return -(new Date(val.duedate).getTime());
          });

        }
      }
    });


  };
  //getinvoiceid data
  invoiceGetById(passid) {
    this.SalesService.getInvoiceById(passid)
      .then((res) => {
        if (res.status) {
          this.selectedplaceofsupply = res.data[0];
          var product = res.data[0].invoiceDetails;
          this.invoiceproduct = product;
          this.oldinvoiceproduct = _.cloneDeep(res.data[0].invoiceDetails);
          this.oldGSTTax = res.data[0].invoiceTaxes
          this.loadgsttaxlist();
        }
      });
  }
  //leager service
  getacconfig() {
    let data: any = {
      "feature": "Crnote",
    }
    this.FeaturesService.getacconfigList(data).then((res) => {
      if (res.status) {
        this.accconfig = res.data;
      }

    })
  }
  //customer service
  DROPLISTALL() {
    let data: any = {
      tenantid: this.userdetails.tenantid,
      status: "Active",
      contactype: "Customer",
    }
    this.AccountsService.DROPLISTALL(data).then((res) => {
      this.customers = res.data;

    })
  }
  //invoice selected particular
  getselectedinvoice(item) {
    this.Invoicecategory = "";
    this.creditamount_applyied = 0
    this.selectedinvoicedetils = []
    this.invoiceproduct = [];
    this.oldinvoiceproduct = [];
    this.invoiceGetById(item);
    this.selectedinvoicedetils = [item];
    this.selectedinvoicedata = item;
    this.Invoicecategory = item.invoicetype;
    this.balanceamount = this.selectedinvoicedetils[0].balamount;
  };
  //customer selected particular
  getselectedCustomer(item) {
    this.amount = "0";
    this.selectedinvoicedetils = [];
    this.invoiceproduct = [];
    this.selectedinvoice = ""
    this.date = new Date();
    this.selectedcontactdetils = item;
    this.invoiceFindAll(this.selectedcontactdetils.contactid);

  }
  // calucation for credit note
  onChangeAmount() {
    // this.amount=this.enteramount;
    // if (this.creditamount_applyied != "0") {
    if (this.creditamount_applyied != "") {
      let diffAmount = this.selectedinvoicedetils[0].balamount - parseFloat(this.creditamount_applyied);
      diffAmount = isNaN(diffAmount) ? this.selectedinvoicedetils[0].balamount : diffAmount;
      if (diffAmount <= 0) {
        this.balanceamount = 0;
        this.creditamount_applyied = this.selectedinvoicedetils[0].balamount;
      }
      else {
        if (diffAmount % 1 != 0)
          this.balanceamount = parseFloat(diffAmount.toFixed(2));
        else
          this.balanceamount = diffAmount;
      }
    }
  }
  // }
  balanceAmount() {
    return this.balanceamount;
  }
  //autocomplete for dropdown funcation
  handleDropdownClick(event, label) {
    if (label == "invoicelist") {
      setTimeout(() => {
        this.filterinvoicelist = this.invoiceList;
        this.filterinvoicelist = [...this.filterinvoicelist]
      }, 100)
    } else if (label == "contactlist") {
      setTimeout(() => {
        this.filteredContacts = this.customers;
        this.filteredContacts = [...this.filteredContacts]
      }, 100)
    }
  }
  //search invoice 
  Searchinvoice(event) {
    this.filterinvoicelist = [];
    this.filterinvoicelist = _.filter(this.invoiceList, function (res) {
      var invoicedata = res.invoiceno;
      return (invoicedata.toLowerCase().indexOf(event.query.toLowerCase()) == 0);
    })
  }
  //search customer
  searchContacts(event) {
    this.filteredContacts = [];
    this.filteredContacts = _.filter(this.customers, function (res) {
      var contactsdata = res.companyname;
      return (contactsdata.toLowerCase().indexOf(event.query.toLowerCase()) == 0);
    })
  }
  addCreditamount() {
    console.log("credit amount", this.selectedcreditamount);
    _.forEach(this.selectedcreditamount, (value) => {
      this.creditamount_applyied += parseFloat(value.basicamount)
    })
  }
  calcdiscAmount(index) {
    var bamt = parseFloat(this.tempproducts[index].mrp) * parseFloat(this.tempproducts[index].crdrquantity);
    return bamt * parseFloat(this.tempproducts[index].discntprcnt) / 100;
  }
  //insert service
  createCDN() {
    let paymentDtData: Array<any> = [];
    var validatmsg: string = "";
    var Validator: boolean = true;
    this.docDate = this.dateFormatPipeFilter.transform(this.date, this.date_apiformat);
    var crdata = this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat);
    if (_.isEmpty(this.selectedcontact)) {
      validatmsg = PrimengConstant.COMMONTRANSACTION.CONTACT;
      Validator = false;
    }
    else if (_.isEmpty(this.selectedinvoice)) {
      validatmsg = PrimengConstant.CREDITNOTE.SELECTINVOICENO;
      Validator = false;
    }
    else if (_.isEmpty(this.date) && _.isEmpty(this.docDate)) {
      validatmsg = PrimengConstant.COMMONTRANSACTION.DATE;
      Validator = false;
    } else if (_.isEmpty(this.reason) || _.isUndefined(this.reason) || _.isNull(this.reason)) {
      validatmsg = PrimengConstant.COMMONTRANSACTION.REASON;
      Validator = false;
    }
    else if (this.autogenyn == 'N' && _.isEmpty(this.transno)) {
      validatmsg = PrimengConstant.COMMONTRANSACTION.SEQNO;
      Validator = false;
    }
    else if (_.isEmpty(this.creditamount_applyied) || this.creditamount_applyied == "0" || this.creditamount_applyied == "0.00") {
      validatmsg = PrimengConstant.COMMONTRANSACTION.AMOUNT;
      Validator = false;
    }

    if (typeof this.date == "string") {
      if (this.docDate == "") {

        this.docDate = this.dateFormatPipeFilter.transform(this.viewdeatils.crdrdate, this.date_apiformat);
      }
    }
    if (Validator == true) {
      var GST0total: any = 0;
      var GST025total: any = 0;
      var GST3total: any = 0;
      var GST5total: any = 0;
      var GST12total: any = 0;
      var GST18total: any = 0;
      var GST28total: any = 0;
      var discountTotal: any = 0;
      for (var i = this.tempproducts.length - 1; i >= 0; i--) {
        var va = this.tempproducts[i];
        var ptotal = parseFloat(this.tempproducts[i].crdrquantity) * parseFloat(this.tempproducts[i].mrp);
        var discount = this.tempproducts[i].discntprcnt ? this.tempproducts[i].discntprcnt : 0
        var discntvalue = this.calcdiscAmount(i);
        var taxval = ((ptotal - discntvalue) * parseFloat(this.tempproducts[i].taxpercent)) / 100;
        discountTotal += ptotal - discntvalue;
        var total = 0;
        var btotal = va.returnqty * va.mrp;
        btotal = btotal ? btotal : 0;
        var discount = va.discntprcnt ? va.discntprcnt : 0;
        total = (btotal) - (btotal * parseFloat(discount) / 100);
        var tax = ((total * va.taxpercent) / 100);
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
      this.tempGSTTaxTotal = [];
      this.tempGSTTaxTotal = _.map(this.oldGSTTax, (tx: any) => {
        if (tx.taxname == "GST 12.00%") {
          if (tx.cgst > 0 || tx.sgst > 0 || tx.igst <= 0) {
            tx.cgst -= ((GST12total).toFixed(2) / 2);
            tx.sgst -= ((GST12total).toFixed(2) / 2);
            tx.igst = 0;
            tx.taxvalue -= (GST12total).toFixed(2)
          } else {
            tx.cgst = 0;
            tx.sgst = 0;
            tx.igst -= (GST12total).toFixed(2);
            tx.taxvalue -= (GST12total).toFixed(2)
          }
        }
        if (tx.taxname == "GST 0.25%") {
          if (tx.cgst > 0 || tx.sgst > 0 || tx.igst <= 0) {
            tx.cgst -= ((GST025total).toFixed(2) / 2);
            tx.sgst -= ((GST025total).toFixed(2) / 2);
            tx.igst = 0;
            tx.taxvalue -= (GST025total).toFixed(2)
          } else {
            tx.cgst = 0;
            tx.sgst = 0;
            tx.igst -= (GST025total).toFixed(2);
            tx.taxvalue -= (GST025total).toFixed(2)
          }
        }
        if (tx.taxname == "GST 0.00%") {
          if (tx.cgst > 0 || tx.sgst > 0 || tx.igst <= 0) {
            tx.cgst -= ((GST0total).toFixed(2) / 2);
            tx.sgst -= ((GST0total).toFixed(2) / 2);
            tx.igst = 0;
            tx.taxvalue -= (GST0total).toFixed(2)
          } else {
            tx.cgst = 0;
            tx.sgst = 0;
            tx.igst -= (GST0total).toFixed(2);
            tx.taxvalue -= (GST0total).toFixed(2)
          }
        }
        if (tx.taxname == "GST 3.00%") {
          if (tx.cgst > 0 || tx.sgst > 0 || tx.igst <= 0) {
            tx.cgst -= ((GST3total).toFixed(2) / 2);
            tx.sgst -= ((GST3total).toFixed(2) / 2);
            tx.igst = 0;
            tx.taxvalue -= (GST3total).toFixed(2)
          } else {
            tx.cgst = 0;
            tx.sgst = 0;
            tx.igst -= (GST3total).toFixed(2);
            tx.taxvalue -= (GST3total).toFixed(2)
          }
        }
        if (tx.taxname == "GST 5.00%") {
          if (tx.cgst > 0 || tx.sgst > 0 || tx.igst <= 0) {
            tx.cgst -= ((GST5total).toFixed(2) / 2);
            tx.sgst -= ((GST5total).toFixed(2) / 2);
            tx.igst = 0;
            tx.taxvalue -= (GST5total).toFixed(2)
          } else {
            tx.cgst = 0;
            tx.sgst = 0;
            tx.igst -= (GST5total).toFixed(2);
            tx.taxvalue -= (GST5total).toFixed(2)
          }
        }
        if (tx.taxname == "GST 18.00%") {
          if (tx.cgst > 0 || tx.sgst > 0 || tx.igst <= 0) {
            tx.cgst -= ((GST18total).toFixed(2) / 2);
            tx.sgst -= ((GST18total).toFixed(2) / 2);
            tx.igst = 0;
            tx.taxvalue -= (GST18total).toFixed(2)
          } else {
            tx.cgst = 0;
            tx.sgst = 0;
            tx.igst -= (GST18total).toFixed(2);
            tx.taxvalue -= (GST18total).toFixed(2)
          }
        }
        if (tx.taxname == "GST 28.00%") {
          if (tx.cgst > 0 || tx.sgst > 0 || tx.igst <= 0) {
            tx.cgst -= ((GST28total).toFixed(2) / 2);
            tx.sgst -= ((GST28total).toFixed(2) / 2);
            tx.igst = 0;
            tx.taxvalue -= (GST28total).toFixed(2)
          } else {
            tx.cgst = 0;
            tx.sgst = 0;
            tx.igst -= (GST28total).toFixed(2);
            tx.taxvalue -= (GST28total).toFixed(2)
          }
        }
        return tx;
      })

      console.log("  this.tempGSTTaxTotal ", this.tempGSTTaxTotal);
      _.forEach(this.accconfig, (config) => {
        config.tenantid = this.userdetails.tenantid;
        config.tenantname = this.userdetails.tenantname;
        config.contactname = this.selectedcontactdetils.firstname;
        config.contactid = this.selectedcontactdetils.contactid;
        config.ledgerdate = this.docDate;
        config.txnid = this.selectedinvoicedata.invoiceid;
        config.feature = "Crnote";
        switch (_.trim(config.configname)) {
          case "Net Amount": {
            config.cramount = parseFloat(this.creditamount_applyied);
            config.accheadid = this.selectedcontactdetils.ledgerid;
            config.accheadname = this.selectedcontactdetils.ledgername;
            config.leadaccheadid = this.selectedcontactdetils.accheadid;
            config.leadaccheadname = this.selectedcontactdetils.accheadname;
            break;
          }
          case "Gross": {
            config.dramount = parseFloat(this.creditamount_applyied);
            break;
          }
          // case "Discount": {
          //   config.dramount = (discountTotal).toFixed(2);
          //   break;
          // }
          // case "Total Amount": {
          //   config.cramount = 0;
          //   break;
          // }
          // case "GST 0.00%": {
          //   config.dramount = (GST0total).toFixed(2);
          //   break;
          // }
          // case "GST 0.25%": {
          //   config.dramount = (GST025total).toFixed(2);
          //   break;
          // }
          // case "GST 3.00%": {
          //   config.dramount = (GST3total).toFixed(2);
          //   break;
          // } case "GST 5.00%": {
          //   config.dramount = (GST5total).toFixed(2);
          //   break;
          // } case "GST 12.00%": {
          //   config.dramount = (GST12total).toFixed(2);
          //   break;
          // } case "GST 18.00%": {
          //   config.dramount = (GST18total).toFixed(2);
          //   break;
          // } case "GST 28.00%": {
          //   config.dramount = (GST28total).toFixed(2);
          //   break;
          // } case "Other Charges": {
          //   break;
          // }  case "Cost of goods sold": {
          //   break;
          // }
          default: {
            console.log("Invalid choice");
            break;
          }
        }
      });

      this.paymantAmountTotal = parseFloat(this.selectedinvoicedata.pymntamount) + parseFloat(this.creditamount_applyied);

      var fromdata: any = {}
      fromdata = {
        "crheader": {
          "amount": parseFloat(this.creditamount_applyied).toFixed(2),
          "tenantid": this.userdetails.tenantid,
          "tenantname": this.userdetails.tenantname,
          "createdby": this.userdetails.loginname,
          "createddt": crdata,
          "finyear": this.finyear.finyear,
          "contactid": this.selectedcontactdetils.contactid,
          "contactname": this.selectedcontactdetils.firstname,
          "companyname": this.selectedcontactdetils.companyname,
          "crdrdate": this.docDate,
          "totalamount": this.selectedinvoicedata.invoicetotal,
          "remarks": this.paymentRemarks,
          "crdrrefno": this.selectedinvoicedata.invoiceno,
          "type": "CRNOTE",
          "refkey": "CRNOTE",
          "reference": this.Refernce,
          "reason": this.reason.name,
          "crdetails": this.tempproducts,
          "crtaxes": this.tempGSTTaxTotal,
        },
        "ledgers": this.accconfig,
        "updateHeader": {
          "invoiceid": this.selectedinvoicedata.invoiceid,
          "tenantid": this.userdetails.tenantid,
          "creditamount": this.creditamount_applyied,
          "balamount": parseFloat(this.balanceamount).toFixed(2),
          "pymntamount": parseFloat(this.paymantAmountTotal).toFixed(2),
          "lastupdatedby": this.userdetails.loginname,
          "lastupdateddt": crdata,
        }
      }
      if (this.autogenyn == 'N' && !_.isEmpty(this.transno)) {
        fromdata.crheader.transno = this.transno
      }
      this.submitted = true;
      this.AccountsService.saveAccounts(fromdata).then((res) => {
        if (res.status == true) {
          this.submitted = false;
          this.callParent();
          this.MessagesService.showMessage({ severity: 'success', summary: "Success Message", detail: res.message })
        }
        else if (res.status == false) {
          this.submitted = false;
          this.MessagesService.showMessage({ severity: 'error', summary: "Error Message", detail: res.message });
        }
      });
    }
    else {
      this.MessagesService.showMessage({ severity: 'error', summary: "Error Message", detail: validatmsg });
    }

  }
  selectprod(item: any) {
    this.selectedProduct = [];
    this.returnQuntity = item.returnqty;
    this.selectedProduct = item;
    this.displayDialog = true
  }
  onDialogHide() {
    this.selectedProduct = null;
  }
  applycredits(item: any) {
    var product;

    var orgproduct = _.find(this.tempproducts, (res) => {
      if (this.Invoicecategory != 'ServiceInvoice') {
        return (res.prodid == item.prodid)
      }
      else {
        return (res.prodid == item.prodid && res.prodname == item.prodname)
      }
    })
    if (_.isEmpty(orgproduct)) {
      product = _.find(this.oldinvoiceproduct, (res) => {
        if (this.Invoicecategory != 'ServiceInvoice') {
          return (res.prodid == item.prodid)
        }
        else {
          return (res.prodid == item.prodid && res.prodname == item.prodname)
        }
      });
    } else {
      product = _.find(this.oldinvoiceproduct, (res) => {
        if (this.Invoicecategory != 'ServiceInvoice') {
          return (res.prodid == orgproduct.prodid)
        }
        else {
          return (res.prodid == orgproduct.prodid && res.prodname == orgproduct.prodname)
        }
      });
    }
    var findquntityproduct = _.find(this.oldinvoiceproduct, (res) => {
      if (this.Invoicecategory != 'ServiceInvoice') {
        return (res.prodid == item.prodid)
      }
      else {
        return (res.prodid == item.prodid && res.prodname == item.prodname)
      }
    });
    if (parseInt(this.returnQuntity) == 0 || parseInt(this.returnQuntity) == NaN || this.returnQuntity == "") {
      item.detailid = false;
      this.MessagesService.showMessage({ severity: 'error', summary: "Error Message", detail: "Please Enter Quantity" });
      return false;
    }
    else if ((item.quantity - findquntityproduct.returnqty) < (+ this.returnQuntity)) {
      this.MessagesService.showMessage({ severity: 'error', summary: "Error Message", detail: "Please check Product Quantity" });
      return false;
    }

    else {
      // this.returnQuntity=this.returnQuntity ? this.returnQuntity:item.quantity;
      var subtotal = item.mrp * this.returnQuntity;
      var discount = item.discntprcnt ? item.discntprcnt : 0
      var discountvalue = ((subtotal * discount) / 100);
      var totalamount = subtotal - discountvalue;
      item.discntvalue = discountvalue
      var tax = ((subtotal - discountvalue) * item.taxpercent) / 100;
      item.taxvalue = tax;
      var basicamount = totalamount + tax;
      item.basicamount = basicamount;
      var retunquntiy = 0;
      retunquntiy = (findquntityproduct.returnqty + parseFloat(this.returnQuntity));
      item.returnqty = retunquntiy;
      item.crdrquantity = this.returnQuntity;

      item.detailid = true;

      if (orgproduct) {
        var findparticular = _.find(this.tempproducts, (res) => {
          if (this.Invoicecategory != 'ServiceInvoice') {
            return (res.prodid == orgproduct.prodid)
          }
          else {
            return (res.prodid == orgproduct.prodid && res.prodname == orgproduct.prodname)
          }

        });
        findparticular.basicamount = item.basicamount
        findparticular.discntvalue = discountvalue;
        findparticular.taxvalue = tax;
        findparticular.returnqty = item.returnqty;
        findparticular.crdrquantity = item.crdrquantity
      } else {
        this.tempproducts.push(item);
      }
      var creditamount = 0;
      _.forEach(this.tempproducts, function (value) {
        console.log("value", value)
        creditamount += value.basicamount
      });
      this.creditamount_applyied = (creditamount).toFixed(2);
      this.onDialogHide();
      this.displayDialog = false;
      this.onChangeAmount();
      console.log("this.invoiceproduct", this.invoiceproduct);
      this.taxitemSeparation();
    }
  }
  // crcalacut(item){
  //   //  this.returnQuntity=this.returnQuntity ? this.returnQuntity:item.quantity;
  //   var subtotal = item.mrp * this.returnQuntity;
  //   var discount = item.discntprcnt ? item.discntprcnt : 0
  //   var discountvalue = ((subtotal * discount) / 100);
  //   var totalamount = subtotal - discountvalue;
  //   var tax = ((subtotal - discountvalue) * item.taxpercent) / 100;
  //   item.taxvalue = tax;
  //   var basicamount=totalamount + tax;
  //   item.basicamount = basicamount;
  //   var retunquntiy=0;
  //    retunquntiy =(item.returnqty + parseFloat(this.returnQuntity))
  //   if (isNaN(retunquntiy)) {
  //     item.returnqty = item.returnqty;
  //   } else {
  //     item.returnqty = retunquntiy;;
  //   }
  // }

  toggleVisibility(event, item) {
    if (event == true) {
      this.returnQuntity = item.quantity - item.returnqty;
      this.applycredits(item);
    } else {
      var index = _.indexOf(this.tempproducts, item);
      console.log("index", index)
      if (index > -1) {
        var findoldproduct = _.find(this.oldinvoiceproduct, (res) => {
          if (this.Invoicecategory != 'ServiceInvoice') {
            return (res.prodid == item.prodid)
          }
          else {
            return (res.prodid == item.prodid && res.prodname == item.prodname)
          }
        });
        item.quantity = findoldproduct.quantity;
        var subtotal = findoldproduct.mrp * item.quantity;
        var discount = findoldproduct.discntprcnt ? findoldproduct.discntprcnt : 0
        var discountvalue = ((subtotal * discount) / 100);
        var totalamount = subtotal - discountvalue;
        var tax = ((subtotal - discountvalue) * findoldproduct.taxpercent) / 100;
        item.taxvalue = tax;
        item.returnqty = findoldproduct.returnqty;
        var totalvalue: any = totalamount + tax;
        this.creditamount_applyied -= item.basicamount;
        item.basicamount = totalvalue;
        item.detailid = false;
        this.tempproducts.splice(index, 1);
        this.onChangeAmount()
        this.taxitemSeparation();
      }
    }
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
    if (!_.isEmpty(this.selectedplaceofsupply)) {
      if (this.orgpos != this.selectedplaceofsupply.pos) {
        interastate = false;
      }
    }
    for (var i = this.invoiceproduct.length - 1; i >= 0; i--) {
      var va = this.invoiceproduct[i];
      var quantity: any = va.quantity - va.returnqty;
      if ((this.invoiceproduct[i].prodid != 0 && this.invoiceproduct[i].prodid != undefined) || (this.Invoicecategory == "ServiceInvoice")) {
        var ptotal = parseFloat(quantity) * parseFloat(this.invoiceproduct[i].mrp);
        var pdiscount = parseFloat(this.invoiceproduct[i].discntprcnt) ? parseFloat(this.invoiceproduct[i].discntprcnt) : 0;
        var discntvalue = ((ptotal * pdiscount) / 100)
        var taxval = ((ptotal - discntvalue) * parseFloat(this.invoiceproduct[i].taxpercent)) / 100;
        discountTotal += discntvalue;
        // var sellacchead = _.find(this.allbookaccs, { "subaccheadid": Number(this.selectedproductsList[i].subaccheadid) });

        var CGST = 0;
        var SGST = 0;
        var IGST = 0

        if (interastate == true) {
          var CGST = taxval / 2;
          var SGST = taxval / 2;
          var IGST = 0
        } else if (interastate == false) {
          var IGST = taxval;
          var CGST = 0;
          var SGST = 0;
        }
        var total = 0;
        var btotal = quantity * va.mrp;
        btotal = btotal ? btotal : 0;
        var discount = va.discntprcnt ? va.discntprcnt : 0;
        total = (btotal) - (btotal * parseFloat(discount) / 100);
        var tax = ((total * va.taxpercent) / 100);
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
  numberOnly(event) {
    this.UtilsService.allowNumberOnly(event);
  }
  getSequence() {
    const data = {
      refkey: 'CRNOTE',
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
