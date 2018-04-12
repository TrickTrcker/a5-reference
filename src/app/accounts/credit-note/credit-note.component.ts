import { Component, OnInit, Output, EventEmitter, Input,OnChanges } from '@angular/core';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MasterService } from '../../services/master.service';
import { FeaturesService } from '../../services/features.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import { SalesService } from '../../services/sales/sales.service';
import { DateformatPipe } from '../../pipes/dateformat.pipe';
import { AccountsService } from '../service/accounts.service'
import { MessagesService } from '../../shared/messages.service';
import{UtilsService} from '../../services/utils.service'
import * as _ from "lodash";
import * as moment from 'moment';
import {PrimengConstant}from '../../app.primeconfig'

@Component({
  selector: 'app-credit-note',
  templateUrl: './credit-note.component.html',
  styleUrls: ['./credit-note.component.scss']
})
export class CreditNoteComponent implements OnInit,OnChanges {
  //variable declarction
  public amtlength = AppConstant.API_CONFIG.AMOUNTFORMAT.MAXLENGTH;
  userdetails: any;
  invoiceList: Array<any> = [];
  customers: Array<any> = [];
  selectedinvoice: any=[];
  selectedinvoicedetils: any;
  filterinvoicelist: Array<any>
  amount: string="0";
  tmpamount:string;
  selectedItem: any;
  balanceamount: any;
  crno: any;
  seqid: any;
  date: Date = new Date();
  selectedcontact: any;
  selectedcontactdetils: any=[];
  buttonText = "Save";
  filteredContacts: any;
  selectedinvoicedata: any;
  paymentRemarks: string;
  accconfig: Array<any>;
  Refernce: string;
  dispDateFormat: string;
  submitted: boolean = false;
  finyear: any;
  paymantAmountTotal: any;
  viewdeatils: any;
  invoiceFindAllData: any;
  updateLedgers:Array<any>=[];
  docDate:string;
  currency_Symbol:string
  viewamount:any;
  enteramount:string;
  //move next page
  @Output() notifyNewCreditNote: EventEmitter<any> = new EventEmitter();
  @Input() creditls: any;
  private date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  private date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  public invoice_emptymessage=PrimengConstant.AUTOCOMPLETE.CREDITNOTE_invoice;
  public customer_emptymessage=PrimengConstant.AUTOCOMPLETE.CUSTOMER;
  constructor(private MasterService: MasterService,
    private LocalStorageService: LocalStorageService,
    private SalesService: SalesService,
    private AccountsService: AccountsService,
    private dateFormatPipeFilter: DateformatPipe,
    private MessagesService: MessagesService,
    private FeaturesService: FeaturesService,private UtilsService:UtilsService

  ) {
    //user services
    this.userdetails = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.dispDateFormat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  }
  //call parent funcation
  callParent() {
    this.notifyNewCreditNote.next();
  }
  //implements funcations
  ngOnInit() {
    this.buttonText = "Save";
    //set value form defult 
    //edit calling funcation
    if (this.creditls) {
      this.viewCreditNote(this.creditls);
    } else {
      //call funcation for services
      this.DROPLISTALL();
      this.getacconfig();
    }

  }

  ngOnChanges(){
    this.buttonText = "Update";
    if (this.creditls) {
      this.viewCreditNote(this.creditls);
    }
  }
  //invoice findall services
  invoiceFindAll(contactid: any): Promise<any> {
    if (this.creditls) {
      this.invoiceFindAllData = {
        "tenantid": contactid.tenantid,
        "finyear": contactid.finyear,
        "feature": "invoice",
        "invoiceno": contactid.crdrrefno,
        "contactid": contactid.contactid
      }
    }
    else {
      this.invoiceFindAllData = {
        tenantid: this.userdetails.tenantid,
        finyear: this.finyear.finyear,
        "contactid": contactid,
        "feature": "invoice",
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
      // if (_.isEmpty(this.invoiceList)){
      //   this.MessagesService.showMessage({ severity: 'error', summary: "Error Message", detail: PrimengConstant.CREDITNOTE.NOINVOICE }); 
      //  }
    });
    
   
  };
  //leager service
  getacconfig() {
    let data: any = {
      "feature": "Receipt",
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
      if(res.status){
      this.customers = res.data;
      }
    });
  }
  //invoice selected particular
  getselectedinvoice(item) {
    this.amount="0";
    this.selectedinvoicedetils=[]
    this.date=new Date();
    // this.selectedinvoice = item.invoiceno;
    this.selectedinvoicedetils = [item];
    this.selectedinvoicedata = item;
    console.log("invoice item",item)
    this.balanceamount = this.selectedinvoicedetils[0].balamount;
  };
  //customer selected particular
  getselectedCustomer(item) {
    this.amount="0";
    this.selectedinvoicedetils=[]
    this.selectedinvoice=""
    this.date=new Date();
    // this.selectedcontact = item.firstname + item.lastname;
    this.selectedcontactdetils = item;
    this.invoiceFindAll(this.selectedcontactdetils.contactid);

  }
  viewCreditNote(creditls: any) {
    this.buttonText = "Update";
    let dataforview: any = {
      "feature": "CRNOTE",
      "crdrid": creditls.crdrid,
    }
    this.AccountsService.FindByIDAccounts(dataforview).then((res) => {
      if(res.status){
      this.viewdeatils = res.data[0];
      console.log(" this.viewdeatils" ,this.viewdeatils)
      this.updateLedgers=this.viewdeatils.ledgers
      this.Refernce=this.viewdeatils.reference
      this.selectedinvoice = this.viewdeatils.crdrrefno;
      this.selectedcontact = this.viewdeatils.companyname;
      this.amount=this.viewdeatils.amount;
      this.tmpamount=this.viewdeatils.amount
      this.date = null;
      this.date = this.dateFormatPipeFilter.transform(this.viewdeatils.crdrdate, this.date_dformat);
      this.invoiceFindAll(this.viewdeatils).then(v => {
        this.invoiceList[0].pymntamount=parseFloat(this.invoiceList[0].pymntamount) - parseFloat(this.tmpamount)
        this.invoiceList[0].balamount = parseFloat(this.invoiceList[0].balamount)+parseFloat(this.tmpamount);
        this.selectedinvoicedetils = this.invoiceList;
        // this.amount="0";
        this.onChangeAmount();
      })
    }
    })
  }
  //calucation for credit note
  onChangeAmount() {
    // this.amount=this.enteramount;
    if(this.amount != "0"){
      if(this.amount != ""){
    let diffAmount = this.selectedinvoicedetils[0].balamount - parseFloat(this.amount);
    diffAmount = isNaN(diffAmount) ?  this.selectedinvoicedetils[0].balamount : diffAmount;
    if (diffAmount <= 0) {
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
  //autocomplete for dropdown funcation
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
  //insert service
  createCDN() {
    let paymentDtData: Array<any> = [];
    var validatmsg: string = "";
    var Validator: boolean = true;
    this.docDate = this.dateFormatPipeFilter.transform(this.date,this.date_apiformat);
    var crdata = this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat);
    if (_.isEmpty(this.selectedcontact)) {
      validatmsg = PrimengConstant.COMMONTRANSACTION.CONTACT;
      Validator = false;
    }
    else if (_.isEmpty(this.selectedinvoice)) {
      validatmsg = PrimengConstant.CREDITNOTE.SELECTINVOICENO;
      Validator = false; 
    }
    else if(_.isEmpty(this.date) && _.isEmpty(this.docDate) ){
      validatmsg = PrimengConstant.COMMONTRANSACTION.DATE;
      Validator = false;
    }
    else if (_.isEmpty(this.amount) || this.amount=="0" ||  this.amount=="0.00"){
      validatmsg = PrimengConstant.COMMONTRANSACTION.AMOUNT;
      Validator = false;
    }
   
    if (typeof this.date == "string") {
      if (this.docDate == "") {
     
        this.docDate=   this.dateFormatPipeFilter.transform(this.viewdeatils.crdrdate, this.date_apiformat);
      }
    }
    if (Validator == true) {
   
      if(!this.creditls){
      this.accconfig[0].cramount = parseFloat(this.amount);
      this.accconfig[0].tenantid = this.userdetails.tenantid;
      this.accconfig[0].tenantname = this.userdetails.tenantname;
      this.accconfig[0].contactname = this.selectedcontactdetils.firstname;
      this.accconfig[0].contactid = this.selectedcontactdetils.contactid;
      this.accconfig[0].createddt = crdata;
      this.accconfig[0].lastupdatedby = this.userdetails.loginname;
      this.accconfig[0].lastupdateddt = crdata;
      this.accconfig[0].ledgerdate = this.docDate;
      this.accconfig[0].finyear = this.finyear.finyear;
      this.accconfig[0].companyname = this.selectedinvoicedata.companyname;
      this.paymantAmountTotal = parseFloat(this.selectedinvoicedata.pymntamount) + parseFloat(this.amount);
      }
      else{
        this.updateLedgers[0].cramount = parseInt(this.amount);
        this.updateLedgers[0].tenantid = this.userdetails.tenantid;
        this.updateLedgers[0].tenantname = this.userdetails.tenantname;
        this.updateLedgers[0].createddt = crdata;
        this.updateLedgers[0].lastupdatedby = this.userdetails.loginname;
        this.updateLedgers[0].lastupdateddt = crdata;
        this.updateLedgers[0].ledgerdate = this.docDate;
        this.updateLedgers[0].finyear = this.finyear.finyear;
        this.paymantAmountTotal = parseFloat(this.selectedinvoicedetils[0].pymntamount) + parseFloat(this.amount);
      }
      if(this.creditls){
        let updateData={
          "header": {
           "crdrid": this.viewdeatils.crdrid,
           "transno": this.viewdeatils.transno,
           "crdrdate": this.docDate,
           "type": "CRNOTE",
           "tenantid":   this.userdetails.tenantid,
           "tenantname": this.userdetails.tenantname,
           "contactid":this.viewdeatils.contactid,
           "crdrrefno":this.viewdeatils.crdrrefno,
           "finyear": this.viewdeatils.finyear,
           "totalamount":this.viewdeatils.totalamount,
           "amount": this.amount,
           "createdby": this.userdetails.loginname,
           "createddt":crdata,
           "contactname": this.viewdeatils.contactname,
           "companyname":this.viewdeatils.companyname,
           "reference":this.Refernce
         },
         "ledgers": this.updateLedgers[0],
         "updateHeader": {
           "invoiceid":this.selectedinvoicedetils[0].invoiceid,
           "tenantid": this.userdetails.tenantid,
           "creditamount": this.amount,
           "balamount": parseFloat(this.balanceamount).toFixed(2),
           "pymntamount": parseFloat(this.paymantAmountTotal).toFixed(2)
         }
       
         }
         this.submitted = true;
         this.AccountsService.UpdateByIDAccounts(updateData).then((res) => {
           if (res.status) {
             this.submitted = false;
             this.MessagesService.showMessage({ severity: 'success', summary: 'Success',detail: res.message  })
             this.callParent();
           }
         });
 
      }
      else{
      let fromdata = {
        "header": {
          "amount": parseFloat(this.amount).toFixed(2),
          "tenantid": this.userdetails.tenantid,
          "tenantname": this.userdetails.tenantname,
          "createdby": this.userdetails.loginname,
          "createddt": crdata,
          "finyear": this.finyear.finyear,
          "contactid": this.selectedcontactdetils.contactid,
          "contactname": this.selectedcontactdetils.firstname,
          "companyname":this.selectedcontactdetils.companyname,
          "crdrdate": this.docDate,
          "totalamount": this.selectedinvoicedata.invoicetotal,
          "remarks": this.paymentRemarks,
          "crdrrefno": this.selectedinvoicedata.invoiceno,
          "type": "CRNOTE",
          "refkey": "CRNOTE",
          "reference":this.Refernce
        },
        "ledgers": this.accconfig[0],
        "updateHeader": {
          "invoiceid": this.selectedinvoicedata.invoiceid,
          "tenantid": this.userdetails.tenantid,
          "crebitamount": this.amount,
          "balamount": parseFloat(this.balanceamount).toFixed(2),
          "pymntamount": parseFloat(this.paymantAmountTotal).toFixed(2)
        }
      }
      this.submitted = true;
      this.AccountsService.saveAccounts(fromdata).then((res) => {
        if (res.status) {
          this.submitted = false;
          this.MessagesService.showMessage({ severity: 'success', summary:'Success',detail: res.message })
          this.callParent();
        }
      });
    }
    } else {
      this.MessagesService.showMessage({ severity: 'error', summary: "Error", detail: validatmsg });
    }

  }
  numberOnly(event){
    this.UtilsService.allowNumberOnly(event);
  }
}
