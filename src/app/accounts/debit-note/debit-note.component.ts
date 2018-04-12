import { Component, OnInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { Message } from 'primeng/primeng';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MasterService } from '../../services/master.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import { PurchasesService } from '../../services/purchases/purchases.service';
import { AccountsService } from '../service/accounts.service';
import { DateformatPipe } from '../../pipes/dateformat.pipe';
import { MessagesService } from '../../shared/messages.service';
import { FeaturesService } from '../../services/features.service';
import { UtilsService } from '../../services/utils.service'
import * as _ from "lodash";
import * as moment from 'moment';
import { PrimengConstant } from '../../app.primeconfig'


@Component({
  selector: 'app-debit-note',
  templateUrl: './debit-note.component.html',
  styleUrls: ['./debit-note.component.scss']
})
export class DebitNoteComponent implements OnInit, OnChanges {
  public amtlength = AppConstant.API_CONFIG.AMOUNTFORMAT.MAXLENGTH;
  userdetails: any;
  invoiceList: Array<any> = [];
  customers: Array<any> = [];
  selectedinvoice: any;
  selectedinvoicedetils: any;
  filterinvoicelist: Array<any>
  amount: string;
  selectedItem: any;
  balanceamount: any;
  crno: any;
  seqid: any;
  date: any = new Date();
  selectedcontact: any;
  selectedcontactdetils: any;
  filteredContacts: any;
  selectedinvoicedata: any;
  Indate: any
  paymentRemarks: string;
  selectedcontactid: any;
  msgs: Array<any>
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
  tmpamount:string;
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
    private UtilsService: UtilsService
  ) {
    this.userdetails = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);;
    this.dispDateFormat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;

  }

  callParent() {
    this.notifyNewDebitNote.next();
  }
  ngOnInit() {
    this.buttonText = "Save";

    //call funcation for services
    if (this.debitidlist) {
      this.viewdDepitNote(this.debitidlist);
    } else {
      this.DROPLISTALL();
      this.getacconfig();
    }

  }
  ngOnChanges() {
    this.buttonText = "Update";
    if (this.debitidlist) {
      this.viewdDepitNote(this.debitidlist);
    }
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
          this.invoiceList = _.sortBy(this.invoiceList, function (val) {
            return -(new Date(val.duedate).getTime());
          });
          if (_.isEmpty(this.invoiceList)) {
            this.MessagesService.showMessage({ severity: 'error', summary: "Error Message", detail: PrimengConstant.DEBITNOTE.NOBILL });
          }
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
      "feature": "Payment",


    }
    this.FeaturesService.getacconfigList(data).then((res) => {
      if (res.status) {
        this.accconfig = res.data;
      }

    })
  }

  //selected invoice particular
  getselectedinvoice(item) {
    this.amount = ""
    // this.selectedinvoice = item.billno;
    this.selectedinvoicedetils = [item];
    this.selectedinvoicedata = item;
    this.balanceamount = this.selectedinvoicedetils[0].balamount;
  };
  //selected curstomer particular
  getselectedCustomer(item) {
    this.selectedinvoice = ""
    this.selectedinvoicedetils = ""
    this.amount = ""
    // this.selectedcontact = item.firstname + item.lastname
    this.selectedcontactdetils = item;
    this.selectedcontactid = item.contactid;
    this.billFindAll(this.selectedcontactid);
  }
  //calucation for debitnote
  onChangeAmount() {
    if (this.amount != "0") {
      if (this.amount != "") {
        let diffAmount = this.selectedinvoicedetils[0].balamount - parseFloat(this.amount);
        diffAmount = isNaN(diffAmount) ? this.selectedinvoicedetils[0].balamount : diffAmount;
        if (diffAmount < 0) {
          this.balanceamount = 0;
          this.amount = this.selectedinvoicedetils[0].balamount;
        }
        else {
          if (diffAmount % 1 != 0)
            this.balanceamount = parseFloat(diffAmount.toFixed(2));
          else
            this.balanceamount = diffAmount;
        }
      }
    }
  }
  balanceAmount() {
    return this.balanceamount;
  }
  //autocomplected  event
  handleDropdownClick(event, label) {
    if (label == "invoicelist") {
      this.filterinvoicelist = [];
      setTimeout(() => {
        this.filterinvoicelist = this.invoiceList;
      }, 100)
    } else if (label == "contactlist") {
      this.filteredContacts = [];
      setTimeout(() => {
        this.filteredContacts = this.customers;
      }, 100)
    }
  }
  //search invoice
  Searchinvoice(event) {
    this.filterinvoicelist = [];
    this.filterinvoicelist = _.filter(this.invoiceList, function (res) {
      var invoicedata = res.billno;
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
  //view depoist particular id
  viewdDepitNote(depositId) {
    this.buttonText = "Update";
    let dataforview: any = {
      "feature": "DRNOTE",
      "crdrid": depositId.crdrid,
    }
    this.AccountsService.FindByIDAccounts(dataforview).then((res) => {
      this.viewdeatils = res.data[0];
      this.updateLedgers = this.viewdeatils.ledgers
      this.selectedinvoice = this.viewdeatils.crdrrefno;
      this.selectedcontact = this.viewdeatils.companyname;
      this.Refernce = this.viewdeatils.reference
      this.amount = this.viewdeatils.amount;
      this.tmpamount=this.viewdeatils.amount;
      this.date = null;
      this.date = this.dateFormatPipeFilter.transform(this.viewdeatils.crdrdate, this.date_dformat);
      this.billFindAll(this.viewdeatils).then(v => {
        this.invoiceList[0].pymntamount=parseFloat(this.invoiceList[0].pymntamount) - parseFloat(this.tmpamount)
        this.invoiceList[0].balamount = parseFloat(this.invoiceList[0].balamount)+parseFloat(this.tmpamount);
        this.selectedinvoicedetils = this.invoiceList;
        this.onChangeAmount();
        // this.balanceamount = this.selectedinvoicedetils[0].balamount;
      })

    })

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
    }
    else if (_.isEmpty(this.amount) || this.amount == "0" || this.amount == "0.00") {
      validatmsg = PrimengConstant.COMMONTRANSACTION.ENTERAMOUNT;
      Validator = false;
    }
    if (typeof this.date == "string") {
      if (this.docDate == "") {

        this.docDate = this.dateFormatPipeFilter.transform(this.viewdeatils.crdrdate, this.date_apiformat);
      }
    }

    if (Validator == true) {
      if (!this.debitidlist) {
        this.accconfig[0].dramount = parseInt(this.amount);
        this.accconfig[0].tenantid = this.userdetails.tenantid;
        this.accconfig[0].tenantname = this.userdetails.tenantname;
        this.accconfig[0].contactname = this.selectedcontactdetils.firstname;
        this.accconfig[0].contactid = this.selectedcontactdetils.contactid;
        this.accconfig[0].createddt = crtdate;
        this.accconfig[0].lastupdatedby = this.userdetails.loginname;
        this.accconfig[0].lastupdateddt = crtdate;
        this.accconfig[0].ledgerdate = this.docDate;
        this.accconfig[0].finyear = this.finyear.finyear;
        this.accconfig[0].companyname = this.selectedinvoicedata.companyname;
        this.paymantAmountTotal = parseFloat(this.selectedinvoicedata.pymntamount) + parseFloat(this.amount);
      } else {
        this.updateLedgers[0].dramount = parseInt(this.amount);
        this.updateLedgers[0].tenantid = this.userdetails.tenantid;
        this.updateLedgers[0].tenantname = this.userdetails.tenantname;
        this.updateLedgers[0].createddt = crtdate;
        this.updateLedgers[0].lastupdatedby = this.userdetails.loginname;
        this.updateLedgers[0].lastupdateddt = crtdate;
        this.updateLedgers[0].ledgerdate = this.docDate;
        this.updateLedgers[0].finyear = this.finyear.finyear;
        this.paymantAmountTotal = parseFloat(this.selectedinvoicedetils[0].pymntamount) + parseFloat(this.amount);
      }
      //send deatils 
      if (this.debitidlist) {

        let updateData = {
          "header": {
            "crdrid": this.viewdeatils.crdrid,
            "transno": this.viewdeatils.transno,
            "crdrdate": this.docDate,
            "type": "DRNOTE",
            "tenantid": this.userdetails.tenantid,
            "tenantname": this.userdetails.tenantname,
            "contactid": this.viewdeatils.contactid,
            "crdrrefno": this.viewdeatils.crdrrefno,
            "finyear": this.viewdeatils.finyear,
            "totalamount": this.viewdeatils.totalamount,
            "amount": this.amount,
            "createdby": this.userdetails.loginname,
            "createddt": crtdate,
            "contactname": this.viewdeatils.contactname,
            "companyname": this.viewdeatils.companyname,
            "reference": this.Refernce
          },
          "ledgers": this.updateLedgers[0],
          "updateHeader": {
            "billid": this.selectedinvoicedetils[0].billid,
            "tenantid": this.userdetails.tenantid,
            "creditamount": this.amount,
            "balamount": parseFloat(this.balanceamount).toFixed(2),
            "pymntamount": parseFloat(this.paymantAmountTotal).toFixed(2)
          }

        }
        this.submitted = true;
        this.AccountsService.UpdateByIDAccounts(updateData).then((res) => {
          if (res.status == true) {
            this.submitted = false;
            this.MessagesService.showMessage({ severity: 'success',summary: "Success", detail: res.message })
            this.callParent();
          } else if (res.status == false) {
            this.submitted = false;
            this.MessagesService.showMessage({ severity: 'error', summary: "Error", detail: res.message });
          }
        });

      } else {
        let fromdata = {
          "header": {
            "amount": parseInt(this.amount),
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
            "reference": this.Refernce
          },
          "ledgers": this.accconfig[0],
          "updateHeader": {
            "billid": this.selectedinvoicedata.billid,
            "tenantid": this.userdetails.tenantid,
            "debitamount": this.amount,
            "balamount": parseFloat(this.balanceamount).toFixed(2),
            "pymntamount": parseFloat(this.paymantAmountTotal).toFixed(2)
          }
        }
        console.log("json",JSON.stringify(fromdata))
        this.submitted = true;
        this.AccountsService.saveAccounts(fromdata).then((res) => {
          if (res.status == true) {
            this.submitted = false;
            this.MessagesService.showMessage({ severity: 'success', summary: "Success", detail: res.message })
            this.callParent();
          } else if (res.status == false) {
            this.submitted = false;
            this.MessagesService.showMessage({ severity: 'error', summary: "Error", detail: res.message });
          }
        });
      }
    }
    else {
      this.MessagesService.showMessage({ severity: 'error', summary: "Error", detail: validatmsg });
    }

  }
  numberOnly(event) {
    this.UtilsService.allowNumberOnly(event);

  }

}
