import { Component, OnInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { Message } from 'primeng/primeng';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MasterService } from '../../../services/master.service';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { AppConstant } from '../../../app.constant';
import { PurchasesService } from '../../../services/purchases/purchases.service';
import { AccountsService } from '../../service/accounts.service';
import { DateformatPipe } from '../../../pipes/dateformat.pipe';
import { MessagesService } from '../../../shared/messages.service';
import { FeaturesService } from '../../../services/features.service';
import { UtilsService } from '../../../services/utils.service';
import * as _ from "lodash";
import * as moment from 'moment';
import { PrimengConstant } from '../../../app.primeconfig';
import { OrganizationSettingsService } from '../../../pages/settings/services/organization-settings.service';
import { CommonService } from '../../../pages/settings/services/common.service';

@Component({
  selector: 'app-new-debit-note',
  templateUrl: './new-debit-note.component.html',
  styleUrls: ['./new-debit-note.component.scss']
})
export class NewDebitNoteComponent implements OnInit {
  reasonlist: any;
  reason: any;
  public amtlength = AppConstant.API_CONFIG.AMOUNTFORMAT.MAXLENGTH;
  userdetails: any;
  journalno: any;
  autogenyn = 'Y';
  transno: any;
  invoiceList: Array<any> = [];
  customers: Array<any> = [];
  selectedinvoice: any;
  selectedinvoicedetils: any;
  filterinvoicelist: Array<any>
  balanceamount: any;
  date: any = new Date();
  selectedcontact: any;
  selectedcontactdetils: any;
  filteredContacts: any;
  selectedinvoicedata: any = {};
  paymentRemarks: string;
  selectedcontactid: any;
  dispDateFormat: string;
  accconfig: Array<any>;
  Refernce: string;
  submitted: boolean;
  finyear: any;
  viewdeatils: any = {};
  billFindAllData: any = {}
  paymantAmountTotal: any;
  updateLedgers: Array<any> = [];
  docDate: string;
  buttonText = "Save";
  currency_Symbol: string;
  tmpamount: string;
  creditamount_applyied: any;
  tempproducts: any[] = [];
  selectedProduct: any;
  displayDialog: boolean = false;
  oldbillproduct: any[] = [];
  billproduct: any[] = [];
  msgs: any[];
  returnQuntity: any
  tempGSTTaxTotal: any[] = []
  GSTTaxTotal: any[] = [];
  settinglist: any[] = [];
  orgpos: any;
  taxes: any[];
  GST_TaxTotal: any[];
  Temp_GST_TaxTotal: any[];
  selectedplaceofsupply: any;
  Invoicecategory: any = "goodsInvoice";//SEDT
  @Output() notifyNewDebitNote: EventEmitter<any> = new EventEmitter();
  @Input() debitidlist: any;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  private date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  private date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  public autocomplete_emptymessage = PrimengConstant.AUTOCOMPLETE.EMPTYMESSAGE;
  constructor(private MasterService: MasterService,
    private LocalStorageService: LocalStorageService,
    private PurchasesService: PurchasesService,
    private AccountsService: AccountsService,
    private dateFormatPipeFilter: DateformatPipe,
    private MessagesService: MessagesService,
    private FeaturesService: FeaturesService,
    private UtilsService: UtilsService,
    private sequenceService: CommonService,
    private orgservice: OrganizationSettingsService,
  ) {
    this.userdetails = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);;
    this.dispDateFormat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
    this.getSequence();

  }

  callParent() {
    this.notifyNewDebitNote.next();
  }
  ngOnInit() {
    this.buttonText = "Save";

    //call funcation for services
    this.DROPLISTALL();
    this.getacconfig();
    this.loadorgsettings();
    this.loadReasons();
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
  loadorgsettings() {
    this.orgservice.TenantSettingList({ tenantid: this.userdetails.tenantid }).then(
      res => {
        if (res.status) {
          this.settinglist = res.data;
          console.log("app setting list:", this.settinglist);
          if (this.settinglist.length > 0) {
            var pos = _.find(this.settinglist, (d) => {
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
  ngOnChanges() {
    this.buttonText = "Update";

  }

  loadBillDetails(reqdata) {

    this.PurchasesService.getBillById(reqdata)
      .then((res) => {
        if (res.status) {
          this.selectedplaceofsupply = res.data[0];
          this.billproduct = res.data[0].billDetails;
          this.GSTTaxTotal = res.data[0].billTaxes;
          this.oldbillproduct = _.cloneDeep(res.data[0].billDetails);
          this.loadgsttaxlist();
        }
      });
  }

  loadgsttaxlist() {
    var data = {
      feature: "Bill",
    };
    this.FeaturesService.TaxList(data)
      .then((res) => {
        this.taxes = res.data;
        var fdata = res.data;
        console.log("taxList:", fdata);
        // self.gsttaxlist = self.masterservice.formatDataforDropdown("taxname", fdata, "Select Tax");
        this.GST_TaxTotal = _.map(this.taxes, (tx) => {
          return { taxname: tx.taxname, taxvalues: tx.taxvalues, amt: 0, cgst: 0, sgst: 0, igst: 0, exist: false };
        });
        this.taxitemSeparation();
        // params name->formatting label name,fdata->value object,third param->empty selection or place holder value
      });
  }

  //billList service
  billFindAll(contactid): Promise<any> {
    if (this.debitidlist) {
      this.billFindAllData = {
        "tenantid": contactid.tenantid,
        "finyear": contactid.finyear,
        "feature": "bill",
        "billno": contactid.crdrrefno,
        "contactid": contactid.contactid
      }
    }
    else {
      this.billFindAllData = {
        "tenantid": this.userdetails.tenantid,
        "finyear": this.finyear.finyear,
        "contactid": contactid,
        "type": "DR"
      }
    }
    return this.PurchasesService.getBillList(this.billFindAllData).then((res) => {
      if (res.status) {

        if (!this.debitidlist) {
          this.invoiceList = _.filter(res.data, (value: any) => {
            // this.payingAmount = 0;
            return (Number(this.selectedcontactdetils.contactid) == Number(value.contactid))
          });
          this.invoiceList = _.filter(this.invoiceList, (value: any) => {
            return (0 < value.balamount)
          });
          this.invoiceList = _.sortBy(this.invoiceList, (val) => {
            return -(new Date(val.duedate).getTime());
          });
        } else {
          this.invoiceList = res.data;
        }
      }
    })
  };
  //customer service
  DROPLISTALL() {
    let data: any = {
      tenantid: this.userdetails.tenantid,
      status: "Active",
      contactype: "Vendor",
    }
    this.AccountsService.DROPLISTALL(data).then((res) => {
      this.customers = res.data;
      console.log("this.customers ", this.customers)

    })
  }
  //leager services
  getacconfig() {
    let data: any = {
      "feature": "Drnote",
    }
    this.FeaturesService.getacconfigList(data).then((res) => {
      if (res.status) {
        this.accconfig = res.data;
        console.log("accconfig", this.accconfig);
      }

    })
  }
  //selected invoice particular
  getselectedinvoice(item) {
    this.Invoicecategory = "";
    this.creditamount_applyied = 0;
    this.selectedinvoicedetils = [item];
    this.selectedinvoicedata = item;
    this.Invoicecategory = item.billtype;
    this.balanceamount = this.selectedinvoicedetils[0].balamount;
    var reqdata: any = {
      "feature": "bill",
      "billid": item.billid
    };
    this.loadBillDetails(reqdata);
  };
  //selected curstomer particular
  getselectedCustomer(item) {
    this.selectedinvoice = ""
    this.selectedinvoicedetils = ""
    this.creditamount_applyied = ""
    // this.selectedcontact = item.firstname + item.lastname
    this.selectedcontactdetils = item;
    this.selectedcontactid = item.contactid;
    this.billFindAll(this.selectedcontactid);
  }
  //calucation for debitnote
  onChangeAmount() {
    // if (this.amount != "0") {
    if (this.creditamount_applyied != "") {
      let diffAmount = this.selectedinvoicedetils[0].balamount - parseFloat(this.creditamount_applyied);
      diffAmount = isNaN(diffAmount) ? this.selectedinvoicedetils[0].balamount : diffAmount;
      if (diffAmount < 0) {
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
  //autocomplected  event
  handleDropdownClick(event, label) {
    if (label == "invoicelist") {
      setTimeout(() => {
        this.filterinvoicelist = this.invoiceList;
        this.filterinvoicelist = [...this.filterinvoicelist]
      }, 100)
    } else if (label == "contactlist") {
      setTimeout(() => {
        this.filteredContacts = this.customers;
        this.filteredContacts = [... this.filteredContacts]
      }, 100)
    }
  }
  //search invoice
  Searchinvoice(event) {
    this.filterinvoicelist = [];
    this.filterinvoicelist = _.filter(this.invoiceList, (res) => {
      var invoicedata = res.billno;
      return (invoicedata.toLowerCase().indexOf(event.query.toLowerCase()) == 0);
    })
  }
  //search customer
  searchContacts(event) {
    this.filteredContacts = [];
    this.filteredContacts = _.filter(this.customers, (res) => {
      var contactsdata = res.companyname;
      return (contactsdata.toLowerCase().indexOf(event.query.toLowerCase()) == 0);
    })
  }

  calcdiscAmount(index) {
    var bamt = parseFloat(this.tempproducts[index].mrp) * parseFloat(this.tempproducts[index].quantity);
    return bamt * parseFloat(this.tempproducts[index].discntprcnt) / 100;
  }
  //Inseart operaction
  createCDN() {
    //set date format
    this.docDate = this.dateFormatPipeFilter.transform(this.date, this.date_apiformat);
    var crtdate = this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat);
    var validatmsg: string = "";
    var Validator: boolean = true;
    if (_.isEmpty(this.selectedcontact)) {
      validatmsg = PrimengConstant.COMMONTRANSACTION.VENDOR;
      Validator = false;
    }
    else if (_.isEmpty(this.selectedinvoice)) {
      validatmsg = PrimengConstant.DEBITNOTE.SELECTBILLNO
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
      this.tempGSTTaxTotal = _.map(this.GSTTaxTotal, (tx: any) => {
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
      _.forEach(this.accconfig, (config) => {
        config.tenantid = this.userdetails.tenantid;
        config.tenantname = this.userdetails.tenantname;
        config.contactname = this.selectedcontactdetils.firstname;
        config.contactid = this.selectedcontactdetils.contactid;
        config.ledgerdate = this.docDate;
        config.txnid = this.selectedinvoicedata.invoiceid;
        config.feature = "Drnote";
        switch (_.trim(config.configname)) {
          case "Net Amount": {
            config.dramount = parseFloat(this.creditamount_applyied);
            config.accheadid = this.selectedcontactdetils.ledgerid;
            config.accheadname = this.selectedcontactdetils.ledgername;
            config.leadaccheadid = this.selectedcontactdetils.accheadid;
            config.leadaccheadname = this.selectedcontactdetils.accheadname;
            break;
          }
          case "Total Amount": {
            config.cramount = parseFloat(this.creditamount_applyied);
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
      let fromdata
      fromdata = {
        "crheader": {
          "amount": parseInt(this.creditamount_applyied),
          "tenantid": this.userdetails.tenantid,
          "tenantname": this.userdetails.tenantname,
          "createdby": this.userdetails.loginname,
          "createddt": crtdate,
          "finyear": this.finyear.finyear,
          "contactid": this.selectedcontactdetils.contactid,
          "contactname": this.selectedcontactdetils.firstname,
          "companyname": this.selectedcontactdetils.companyname,
          "crdrdate": this.docDate,
          "totalamount": this.selectedinvoicedata.billtotal,
          "remarks": this.paymentRemarks,
          "crdrrefno": this.selectedinvoicedata.billno,
          "refkey": "DRNOTE",
          "type": "DRNOTE",
          "remark": this.paymentRemarks,
          "reference": this.Refernce,
          "reason": this.reason.name,
          "crdetails": this.tempproducts,
          "crtaxes": this.tempGSTTaxTotal,
        },
        "ledgers": this.accconfig,
        "updateHeader": {
          "billid": this.selectedinvoicedata.billid,
          "tenantid": this.userdetails.tenantid,
          "debitamount": this.creditamount_applyied,
          "balamount": parseFloat(this.balanceamount).toFixed(2),
          "pymntamount": parseFloat(this.paymantAmountTotal).toFixed(2),
          "lastupdatedby": this.userdetails.loginname,
          "lastupdateddt": crtdate,
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
          this.MessagesService.showMessage({ severity: 'success', summary: "Success", detail: res.message })
        } else if (res.status == false) {
          this.submitted = false;
          this.MessagesService.showMessage({ severity: 'error', summary: "Error", detail: res.message });
        }
      });

    }
    else {
      this.MessagesService.showMessage({ severity: 'error', summary: "Error", detail: validatmsg });
    }

  }
  selectprod(item: any) {
    this.selectedProduct = [];
    this.selectedProduct = item;
    this.returnQuntity = item.returnqty;

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
      product = _.find(this.oldbillproduct, (res) => {
        if (this.Invoicecategory != 'ServiceInvoice') {
          return (res.prodid == item.prodid)
        }
        else {
          return (res.prodid == item.prodid && res.prodname == item.prodname)
        }
      });
    } else {
      product = _.find(this.oldbillproduct, (res) => {
        if (this.Invoicecategory != 'ServiceInvoice') {
          return (res.prodid == orgproduct.prodid)
        }
        else {
          return (res.prodid == orgproduct.prodid && res.prodname == orgproduct.prodname)
        }
      });
    }
    var findquntityproduct = _.find(this.oldbillproduct, (res) => {
      if (this.Invoicecategory != 'ServiceInvoice') {
        return (res.prodid == item.prodid)
      }
      else {
        return (res.prodid == item.prodid && res.prodname == item.prodname)
      }
    });
    if (parseInt(this.returnQuntity) == 0 || parseInt(this.returnQuntity) == NaN || this.returnQuntity == "") {
      this.MessagesService.showMessage({ severity: 'error', summary: "Error Message", detail: "Please Enter Quantity" });
      return false;
    }

    else if (product.quantity < (+ this.returnQuntity)) {
      this.MessagesService.showMessage({ severity: 'error', summary: "Error Message", detail: "Please check Product Quantity" });
      return false;
    } else if ((item.quantity - findquntityproduct.returnqty) < (+ this.returnQuntity)) {
      this.MessagesService.showMessage({ severity: 'error', summary: "Error Message", detail: "Please check Product Quantity" });
      return false;
    }

    else {
      this.returnQuntity = this.returnQuntity ? this.returnQuntity : item.quantity;
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
      _.forEach(this.tempproducts, (value) => {
        console.log("value", value)
        creditamount += value.basicamount
      });
      console.log("creditamount", creditamount);
      console.log("his.tempproducts", this.tempproducts)
      this.creditamount_applyied = (creditamount).toFixed(2);
      this.onDialogHide();
      this.displayDialog = false;
      this.onChangeAmount();
      this.taxitemSeparation();
    }
  }

  toggleVisibility(event, item) {
    if (event == true) {
      this.returnQuntity = item.quantity - item.returnqty;
      this.applycredits(item);
    } else {
      var index = _.indexOf(this.tempproducts, item);
      console.log("index", index)
      if (index > -1) {
        var findoldproduct = _.find(this.oldbillproduct, (res) => {
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
    for (var i = this.billproduct.length - 1; i >= 0; i--) {
      var va = this.billproduct[i];
      var quantity: any = va.quantity - va.returnqty;
      if ((this.billproduct[i].prodid != 0 && this.billproduct[i].prodid != undefined) || (this.Invoicecategory == "ServiceInvoice")) {
        var ptotal = parseFloat(quantity) * parseFloat(this.billproduct[i].mrp);
        var pdiscount = parseFloat(this.billproduct[i].discntprcnt) ? parseFloat(this.billproduct[i].discntprcnt) : 0;
        var discntvalue = ((ptotal * pdiscount) / 100)
        var taxval = ((ptotal - discntvalue) * parseFloat(this.billproduct[i].taxpercent)) / 100;
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
      refkey: 'DRNOTE',
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