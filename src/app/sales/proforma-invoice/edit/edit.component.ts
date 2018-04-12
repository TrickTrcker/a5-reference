import { Component, OnInit, ViewEncapsulation, OnDestroy, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core'; //SEDT
import { LocalStorageService } from '../../../shared/local-storage.service';
import { AppConstant } from '../../../app.constant';
import * as _ from "lodash";
import { FeaturesService } from '../../../services/features.service';
import { OrganizationSettingsService } from '../../../pages/settings/services/organization-settings.service';
import { MasterService } from '../../../services/master.service';
import { ProductallService } from '../../../products/productall.service';
import { SalesService } from '../../../services/sales/sales.service';
import { UtilsService } from "../../../services/utils.service";
import { Invoice } from '../../invoice.interface';
import { Product } from '../../product.interface';
import { Message } from 'primeng/primeng';
import { MenuItem } from 'primeng/primeng';
import { DateformatPipe } from '../../../pipes/dateformat.pipe';
import { NotificationsService } from '../../../shared/notifications.service';
import { Router, NavigationExtras } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { MessagesService } from '../../../shared/messages.service';
import { PrimengConstant } from '../../../app.primeconfig';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-proforma-edit',
  templateUrl: '../addedit/proforma-invoice-addedit.component.html',
  styleUrls: ['../addedit/proforma-invoice-addedit.component.scss']
})
export class EditComponent implements OnInit, OnChanges, OnDestroy {
  visible: boolean = true;
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  public date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  CustomerorVendor: any = PrimengConstant.COMMON.CUSTOMER;  
  rerender = false;
  autogenyn = 'Y';  
  msgs: Message[] = [];
  menuItems: MenuItem[];
  filteredContacts: any[];
  contactlist: any[];
  addmorecharge:any;
  contactlistDropdown: any[];
  productList: any[];
  Invoicetype: any[];
  contact: any;
  selectedProductItems: any;
  userstoragedata: any;
  finyear: any;
  invoiceDate: Date;
  DueDate: Date;
  selectedInvoiceType: any = {};
  selectedInvoiceTypeLabel: string = "";
  selectedcontactname = "";
  // selectedCustomer: any = {};
  selectedContactDetails: any = {};
  reversecharge = [
    // { "label": "Select reverse charge", "value": "" },
    { "label": "Yes", "value": "Y" },
    { "label": "No", "value": "N" }
  ];
    //add_parites start
    sundrygroup = "";
    addproforma_display: boolean = false;
    //add_parites end
    addproduct_display : boolean = false;
    tempselectedproductPrp : any;
  referecefnumber: any;
  gsttaxlist = [];
  taxes = [];
  allbookaccs = [];
  placeofsupplies: any = [];
  selectedreversecharge: any = "N";
  // default products
  // selectedproductsList:Product[] = [];
  // selectedproduct:Product;
  defaultproduct: any;
  selectedproductsList = [];
  selectedproduct: any;
  productcol: any[];
  contactname: String;
  editableBillingaddress: String;
  editrestrict: boolean = false;
  BillEditorEnabled: boolean = false;
  editableShippingaddress: String = "";
  contactid = Number;
  //calc variables
  invoiceNumber: String;
  accconfig = [];
  seqid: String;
  ProductTotal = 0.00;
  invoiceAllSubTotal = 0.00;
  invoiceAllTaxTotal = 0.00;
  morecharges = 0.00;
  invoiceGrandTotal = 0.00;
  invoicegrand = 0.00;
  discounttotal = 0.00;
  selectedplaceofsupply: any;
  // hsncodelist = [];
  GST_TaxTotal: any = [];
  Temp_GST_TaxTotal: any = [];
  settinglist: any = [];
  orgpos: any;
  Invoicecategory: any = "goodsInvoice";//SEDT
  Taxeditable: boolean = false;//SEDT
  editmode: boolean = false; //SEDT
  invoiceid: number;
  invoiceDeta: any;
  deleteTaxIds: any = [];
  deleteLedgerIds: any = [];
  productsForUpdate: any = {
    "insert": [],
    "update": [],
    "delete": []
  };
  hotkeySave: Hotkey | Hotkey[];
  hotkeyProduct: Hotkey | Hotkey[];
  hotkeyContact: Hotkey | Hotkey[];
  constructor(
    private masterservice: MasterService,
    private featureservice: FeaturesService,
    private storageservice: LocalStorageService,
    private productservice: ProductallService,
    private utilservice: UtilsService,
    private salesservice: SalesService,
    private dateFormatPipeFilter: DateformatPipe,
    private notificationsService: NotificationsService,
    private router: Router,
    private acroute: ActivatedRoute,
    private messageservice: MessagesService,
    private orgservice: OrganizationSettingsService,
    private _hotkeysService: HotkeysService
  ) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeySave = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.SAVE.KEY, (event: KeyboardEvent): boolean => {
      this.GenarateInvoice("");
      return false; // Prevent bubbling
    }, [], shrtkeys.COMMON.SAVE.TXT));
    this.hotkeyProduct = this._hotkeysService.add(new Hotkey(shrtkeys.TRANSACTION.CONTACTS.KEY, (event: KeyboardEvent): boolean => {
      this.displayaddparies();
      return false;
    }, [], shrtkeys.TRANSACTION.CONTACTS.TXT));
    this.hotkeyContact = this._hotkeysService.add(new Hotkey(shrtkeys.TRANSACTION.PRODUCT.KEY, (event: KeyboardEvent): boolean => {
      this.displayaddproduct('', '', '');
      return false;
    }, [], shrtkeys.TRANSACTION.PRODUCT.TXT));

    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.acroute.params.subscribe(params => {
      if (!_.isEmpty(params)) {
        this.invoiceid = params.invoiceid;
        console.log("url params", params);
      }
    });
    if (!_.isEmpty(this.invoiceid) && this.invoiceid != null && this.invoiceid != undefined) {
      this.loadInvoiceDetails();
    }
    this.defaultproduct = {
      "invoiceid": this.invoiceid,
      "prodid": 0,
      "prodname": "Select Product",
      "tenantid": 0,
      "tenantname": "",
      "uomid": 0,
      "uomdesc": "",
      "mrp": 0,
      "quantity": 0,
      "selltaxname": 0,
      "selltaxLabelname": "VAT",
      "discntprcnt": 0,
      "discntvalue": 0,
      "taxpercent": 0,
      "taxname": "-",
      "taxvalue": 0,
      "taxamount": 0,
      "basicamount": 0,
      "status": "Active",
      "createddt": "",
      "lastupdatedby": "",
      "lastupdateddt": "",
      "discount": {
        "discntprcnt": 0,
        "discntvalue": 0
      },
      "prodselltax": {
        "taxpercent": 0
      },
      btotal: 0,
      hsncode: "",
      hsndesc: "",
      inv_status: 'new'
    };
  }

  loadInvoiceDetails() //for editinvoice *editmode
  {
    var self = this;
    self.invoiceDeta = [];
    var reqdata: any = {
      "feature": "proforma_invoice",
      "invoiceid": this.invoiceid
    };
    this.salesservice.getInvoiceById(reqdata)
      .then(res => {
        if (res.status) {
          self.invoiceDeta = res.data[0];
          console.log("Invoice data: ", self.invoiceDeta);
          if(res.data[0].invoicetype == "ServiceInvoice")
          {
            self.Invoicecategory = "ServiceInvoice";
            self.Taxeditable = true;
          // this.gethsncodelist();
          }
          else
          {
            self.Taxeditable = false;
            self.Invoicecategory = "goodsInvoice";
          }
          this.formateditmode();
          this.calculateTotals();
        }
      });

  }
  formateditmode() {
    this.morecharges=this.invoiceDeta.otherexpenses;
    this.referecefnumber = this.invoiceDeta.orderref;
    this.invoiceDate = this.dateFormatPipeFilter.transform(this.invoiceDeta.invoicedt, this.date_dformat);
    this.DueDate = this.dateFormatPipeFilter.transform(this.invoiceDeta.duedate, this.date_dformat);
    this.selectedreversecharge = this.invoiceDeta.revcharge;

    this.formatProducts();
    this.extractdeleteTaxIds();
    this.extractdeleteLedgerIds();
  }
  extractdeleteTaxIds() {
    this.deleteTaxIds = [];
    for (var i = 0; i < this.invoiceDeta.invoiceTaxes.length; i++) {
      this.deleteTaxIds.push(this.invoiceDeta.invoiceTaxes[i].invoicetaxid)
    }
  }
  extractdeleteLedgerIds() {
    this.deleteLedgerIds = [];
    for (var i = 0; i < this.invoiceDeta.ledgers.length; i++) {
      this.deleteLedgerIds.push(this.invoiceDeta.ledgers[i].ledgerid)
    }
  }
  formatProducts() {
    var products = this.invoiceDeta.invoiceDetails;
    // for (var num = 0; num <= products.length; num++) {
    //   products[num].inv_status = 'old';
    // }
    this.selectedproductsList = products;
  }
  loadeditedcontact() {
    var contact = _.find(this.contactlist, { "contactid": this.invoiceDeta.contactid });
    if (!_.isEmpty(contact)) {
      this.getselectedCustomer(contact);
    }
  }
  loadeditedinvoicetype() {
    this.selectedInvoiceTypeLabel = this.invoiceDeta.invtype;
    this.selectedreversecharge = this.invoiceDeta.revcharge;
    var invtype = _.find(this.Invoicetype, { "label": this.invoiceDeta.invtype });
    if (!_.isEmpty(invtype)) {
      this.selectedInvoiceType = invtype.value;
      //  this.onSelectInvoicetype = invtype.value;
    }
  }
  loadeditedplaceofsupply() {
    var pos: any = _.find(this.placeofsupplies, { "label": this.invoiceDeta.pos });
    if (!_.isEmpty(pos)) {
      this.selectedplaceofsupply = pos.value;
      //  this.onSelectInvoicetype = invtype.value;
    }
  }
  ngOnChanges(changes: SimpleChanges): void { //SEDT start

    if (changes != undefined) {
      console.log("Change Invoicecategory", this.Invoicecategory);
    }
  } //SEDT end
  ngOnInit() {
    this.menuItems = [
      // label: 'Save',
      // items: [
      {
        label: 'Update & View', icon: 'fa-plus', command: (event) => {
          //event.originalEvent: Browser event
          //event.item: menuitem metadata
          this.GenarateInvoice("");
        }
      },
      // {
      //   label: 'Save & Create', icon: 'fa-plus', command: (event) => {
      //     //event.originalEvent: Browser event
      //     //event.item: menuitem metadata
      //     this.GenarateInvoice("'createnew'");
      //   }
      // },
      {
        label: 'Cancel', icon: 'fa-close', command: (event) => {
          //event.originalEvent: Browser event
          //event.item: menuitem metadata
          // this.router.navigate(['/sales/list'],{});
          //   let navigationExtras: NavigationExtras = {
          //     queryParams: {
          //         "invoiceid": "2"
          //     }
          // };viewinvoice
          this.router.navigate(['sales/list']);
          // this.router.navigate(['/sales/viewinvoice'], { queryParams: { "invoiceid": "2" } });
        }
      }
      // ]
    ];

    var self = this;
    setTimeout(function () { self.getinitialized() }, 3000);
  }
  changeInvoiceCategory(event) { //SEDT start
    console.log(event);
    setTimeout(() => {
      console.log("Invoicecategory", this.Invoicecategory);
      switch (this.Invoicecategory) {
        case 'ServiceInvoice': {
          this.Taxeditable = true;
          // this.gethsncodelist();
          this.changesonInvoiceCategoryServiceBased();
          break;
        }
        case 'goodsInvoice': {
          this.Taxeditable = false;
          this.changesonInvoiceCategoryProductBased();
          break;
        }
      }
    }, 10)
  } //SEDT end
  isServicebased()
  {
    var servicebased = false;
    switch (this.Invoicecategory) {
      case 'ServiceInvoice': {
        servicebased  = true;
        break;
      }
      case 'goodsInvoice': {
        servicebased  = false;
        break;
      }
    }
    return servicebased;
  }
  getinitialized() {
    var self = this;

    var data = {
      tenantid: this.userstoragedata.tenantid,
      status: "Active",
      contactype: "Customer"
    };
    // load contact list
    this.featureservice.contactGetAll(data)
      .then(function (res) {
        self.contactlist = res.data;
        console.log("Contact list: ", self.contactlist);
        self.contactlistDropdown = self.masterservice.formatDataforDropdown("companyname", self.contactlist, "Select Contact");
        self.loadeditedcontact();
      });
    // load invoice type list
    var invoicetypeReq = {
      "type": "INVOICE_TYPE"
    };
    self.Invoicetype = [];
    this.featureservice.getcodemasterList(invoicetypeReq)
      .then(function (res) {
        var fdata = res.data;
        console.log("Invoicetype: ", fdata);
        self.Invoicetype = self.masterservice.formatDataforDropdown("name", fdata, "Select Type"); // params name->formatting label name,fdata->value object,third param->empty selection or place holder value
        console.log("formated Invoicetype: ", self.Invoicetype);
        self.loadeditedinvoicetype();
      });
    this.loadproductlist();
    var placeofsuppliesreq = {
      "type": "pos"
    };
    this.featureservice.getcodemasterList(placeofsuppliesreq)
      .then(function (res) {
        var fdata = res.data;
        console.log("placeofsupplies: ", fdata);
        self.placeofsupplies = self.masterservice.formatDataforDropdown("name", fdata, "Select Type"); // params name->formatting label name,fdata->value object,third param->empty selection or place holder value
        console.log("formated placeofsupplies: ", self.placeofsupplies);
        self.loadeditedplaceofsupply();
      });
    // this.loaddefaultproducts();
    // this.gethsncodelist();
    this.loadgsttaxlist();
    this.seqgenerator();
    this.getaccconfig();
    this.loadorgsettings();
    // this.loadBookofAcc();
    // calc totals
  }
  //add_parites start
  displayaddparies() {
    this.addproforma_display = true;
    this.sundrygroup = PrimengConstant.COMMON.SUNDRY_DEBTORS;
  }
  addcustomerDetection(contact: any) {
    console.log(contact);
    var newcontact = {
      label: contact.companyname,
      value: contact
    }
    this.sundrygroup = "";
    this.addproforma_display = false;

    this.loadcustomer(contact);
  }
  onhideContactpopup($event) {
    this.sundrygroup = "";
  }
  //add_parites end
  // add product start
  displayaddproduct(selectedproduct,ridx,productTable) {
    this.addproduct_display = true;
    this.tempselectedproductPrp = {
      selectedproduct : selectedproduct,
      ridx : ridx,
      productTable : productTable
    }
  }
  addProductDetection(data)
  {
    console.log(data);
    this.tempselectedproductPrp.selectedproduct = data;
    var pro = {
      value : data
    }
    this.onProductSelect(pro, this.tempselectedproductPrp.selectedproduct, this.tempselectedproductPrp.ridx, this.tempselectedproductPrp.productTable);
    this.addproduct_display = false;
  }
  onhideProductpopup($event) {
    this.tempselectedproductPrp = null;
    this.addproduct_display = false;
  }
  // add product end
  //add_parites start 
  loadcustomer(modevalue) {
    var data = {
      tenantid: this.userstoragedata.tenantid,
      status: "Active",
      contactype: "Customer",
      contactcategory : "B2B"
    };
    // load contact list
    this.featureservice.contactGetAll(data)
      .then((res) => {
        this.contactlist = res.data;
        console.log("Contact list: ", this.contactlist);
        this.contactlistDropdown = this.masterservice.formatDataforDropdown("companyname", this.contactlist, "Select Contact");
        if (modevalue != null) {
          var contact = _.find(this.contactlist, { "contactid": modevalue.contactid });
          // this.selectedContactDetails = contact;
          this.getselectedCustomer(contact);
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
  // gethsncodelist() {
  //   this.featureservice.hsnGetAll({})
  //     .then((res) => {
  //       if (res.status) {
  //         this.hsncodelist = res.data;
  //         console.log("HSN code list: ", this.hsncodelist);
  //       }

  //     });
  // }
  
  getaccconfig() {
    var self = this;
    var data = {
      // tenantid: this.userstoragedata.tenantid,
      "feature": "Invoice"
    };
    this.featureservice.getacconfigList(data)
      .then(function (res) {
        self.accconfig = res.data;
        console.log("acconfig", res.data);
      });
  }
  seqgenerator() {
    // var self = this;
    // var data = {
    //   tenantid: this.userstoragedata.tenantid,
    //   "refkey": "INV"
    // };
    // this.masterservice.seqgenerator(data)
    //   .then(function (res) {
    //     self.invoiceNumber = res.data[0].Nextseqno;
    //     self.seqid = res.data[0].seqid
    //   });
  }
  // loadBookofAcc() {
  //   var self = this;
  //   var data = {
  //     tenantid: this.userstoragedata.tenantid,
  //     status: "Active"
  //   };
  //   self.allbookaccs = [];
  //   this.featureservice.BookofAccList(data)
  //     .then(function (res) {
  //       self.allbookaccs = res.data;
  //       self.calculateTotals();
  //     });
  // }
  loadproductlist() {
    var self = this;
    var data = {
      tenantid: this.userstoragedata.tenantid,
      status: "Active",
      limit: 1000,
      offset: 0
    };
    this.featureservice.ProductList(data)
      .then(function (res) {
        var fdata = res.data;
        console.log("productList:", self.productList);
        self.productList = self.masterservice.formatDataforDropdown("prodname", fdata, "Select Product");
        // params name->formatting label name,fdata->value object,third param->empty selection or place holder value
      });
  }
  loadgsttaxlist() {
    var self = this;
    var data = {
      feature: "Invoice",
    };
    this.featureservice.TaxList(data)
      .then(function (res) {
        self.taxes = res.data;
        var fdata = res.data;
        console.log("taxList:", fdata);
        self.gsttaxlist = self.masterservice.formatDataforDropdown("taxname", fdata, "Select Tax");
        self.GST_TaxTotal = _.map(self.taxes, function (tx) {
          return { taxname: tx.taxname, taxvalues: tx.taxvalues, amt: 0, cgst: 0, sgst: 0, igst: 0, exist: false };
        });
        self.taxitemSeparation();
        // params name->formatting label name,fdata->value object,third param->empty selection or place holder value
      });
  }
  loaddefaultproducts() { //SEDT start 
    this.selectedproductsList = [];
    for (var i = 1; i < 5; i++) {
      var p = _.clone(this.defaultproduct);
      if (this.Invoicecategory == "ServiceInvoice") {
        p.prodname = "";
        p.quantity = 1;
      }
      else {
        p.prodname = "Select Product";
      }

      this.selectedproductsList.push(_.clone(p));
    }
  } //SEDT end
  filterContacts(event) {
    this.filteredContacts = [];
    this.filteredContacts = _.filter(this.contactlist, function (c) {
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
  addnewproduct() {
    var osource = _.clone(this.selectedproductsList);
    var product = _.clone(this.defaultproduct);
    if (this.Invoicecategory == "ServiceInvoice") {
      product.prodname = "";
      product.quantity = 1;
    }
    else {
      product.prodname = "Select Product";
    }
    osource.push(_.clone(product));
    this.selectedproductsList = [..._.clone(osource)];
  }
  updateVisibility(): void {
    this.visible = false;
    setTimeout(() => this.visible = true, 0);
  }
  removeproduct(item) {
    this.selectedproductsList.splice(this.selectedproductsList.indexOf(item), 1);
    this.selectedproductsList = [...this.selectedproductsList];
    this.productsForUpdate.delete = item;
    this.calculateTotals();
    this.updateVisibility();
  }
  getselectedCustomer(item: any) {
    console.log("selected contact: ", item);
    this.contact = item.firstname;

    if (!_.isEmpty(item)) {
      if (item.firstname == 'Miscellaneous contact') {
        this.contactname = "";
        // this.editrestrict = false;
      } else {
        this.contactname = item.firstname;
        this.contactid = item.contactid;
        this.editrestrict = true;
      }
      this.selectedContactDetails = item;
      console.log("selectedcontaxt", this.selectedContactDetails);
      this.BillEditorEnabled = false;
      var billadress = this.utilservice.isUndefinedReturner(this.selectedContactDetails.billaddress, "\n"),
        billcityname = this.utilservice.isUndefinedReturner(this.selectedContactDetails.billcityname, "\n"),
        billstatename = this.utilservice.isUndefinedReturner(this.selectedContactDetails.billstatename, "\n"),
        billcountryname = this.utilservice.isUndefinedReturner(this.selectedContactDetails.billcountryname, "\n"),
        billzipcode = this.utilservice.isUndefinedReturner(this.selectedContactDetails.billzipcode, "\n"),
        shipaddress = this.utilservice.isUndefinedReturner(this.selectedContactDetails.shipaddress, "\n"),
        shipcityname = this.utilservice.isUndefinedReturner(this.selectedContactDetails.shipcityname, "\n"),
        shipstatename = this.utilservice.isUndefinedReturner(this.selectedContactDetails.shipstatename, "\n"),
        shipcountryname = this.utilservice.isUndefinedReturner(this.selectedContactDetails.shipcountryname, "\n"),
        shipzipcode = this.utilservice.isUndefinedReturner(this.selectedContactDetails.shipzipcode, "\n");
      this.editableBillingaddress = billadress
        + billcityname
        + billstatename
        + billcountryname
        + billzipcode;
      // this.editableShippingaddress = shipaddress
      // + shipcityname
      // + shipstatename
      // + shipcountryname
      // + shipzipcode;
      ;
    }

  }
  setCustomSelectedTax(event, selectedproduct, index) { //SEDT start
    var item: any = event.value;
    if (item.taxname != '--') {
      this.selectedproductsList[index].taxname = item.taxname;
      this.selectedproductsList[index].taxvalue = item.taxvalues;
      this.selectedproductsList[index].taxpercent = item.taxvalues;
      // this.selectedproductsList[index].hsncode = "";
      // this.selectedproductsList[index].hsndesc = "";
      this.producteditingObserve(event, selectedproduct, index);
      this.calcTaxAmount(index);
    } 
  } //SEDT end
  setSelectedTax(event, selectedproduct, index) { //SEDT start
    var item: any = event.value;
    if (item.taxname == '--') {
      this.selectedproductsList[index].taxvalue = 0;
    } else {
      var taxaccount = _.find(this.taxes, function (tx) {
        if (tx.taxvalues != null && item.gstpercent != null) {
          return (parseFloat(tx.taxvalues) == parseFloat(item.gstpercent));
        }
      });
      if (!_.isEmpty(taxaccount)) {
        this.selectedproductsList[index].taxname = taxaccount.taxname;
        this.selectedproductsList[index].taxvalue = taxaccount.taxvalues;
        this.selectedproductsList[index].taxpercent = taxaccount.taxvalues;
        this.selectedproductsList[index].hsncode = item.hsncode;
        this.selectedproductsList[index].hsndesc = item.description;
        this.producteditingObserve(event, selectedproduct, index);
        this.calcTaxAmount(index);
      }
      // this.selectedproductsList[index].taxname = item.taxname;
      // this.selectedproductsList[index].taxvalue = item.tax;
      // this.producteditingObserve(event, selectedproduct, index);
      // this.calcTaxAmount(index);
    }
  } //SEDT end
  onSelectInvoicetype(event) {
    var item = event.value;
    this.selectedInvoiceType = item;

  }
  onProductSelect(event, selectedproduct, index, datatable: any) {
    var item = event.value;
    var self = this;
    console.log("selected prod event: ", event);
    console.log("selected row: ", index);
    console.log("selected row value: ", item);

    if (item.prodid != "0" && (self.selectedproductsList[index].prodid != item.prodid)) {
      var product = _.find(self.selectedproductsList, { "prodid": Number(item.prodid) });
      if (_.isEmpty(product)) {
        // self.selectedproductsList[index] = item;
        self.selectedproductsList[index].prodid = item.prodid;
        self.selectedproductsList[index].prodname = item.prodname;
        self.selectedproductsList[index].tenantid = item.tenantid;
        self.selectedproductsList[index].tenantname = item.tenantname;
        self.selectedproductsList[index].uomid = item.uomid;
        self.selectedproductsList[index].uomdesc = item.uomdesc;
        self.selectedproductsList[index].mrp = item.mrp;
        self.selectedproductsList[index].quantity = 0;
        self.selectedproductsList[index].taxvalue = 0;
        self.selectedproductsList[index].taxpercent = 0;
        self.selectedproductsList[index].taxname = "--";
        self.selectedproductsList[index].basicamount = 0;
        self.selectedproductsList[index].btotal = 0;
        self.selectedproductsList[index].discount = {
          "discntprcnt": 0,
          "discntvalue": 0,
        };
        self.selectedproductsList[index].discntprcnt = 0;
        self.selectedproductsList[index].discntvalue = 0;
        var data = {
          "status": "Active",
          "tenantid": self.userstoragedata.tenantid,
          "taxid": self.selectedproductsList[index].selltaxid
        };
        self.selectedproductsList[index].hsncode = item.hsncode;
        self.selectedproductsList[index].hsndesc = item.hsndesc;
        if (item.hsncode) {
          // var hsncodedetails = _.find(this.hsncodelist, function (hsn) {
          //   return (hsn.hsncode == item.hsncode);
          // });
          if (item.hsnsactaxpercent !== "" && item.hsnsactaxpercent !== undefined) {
            var taxaccount = _.find(this.taxes, function (tx) {
              if (tx.taxvalues != null && item.hsnsactaxpercent != null) {
                return (parseFloat(tx.taxvalues) == parseFloat(item.hsnsactaxpercent));
              }
            });
            console.log("tax account: ", taxaccount);
            if (!_.isEmpty(taxaccount)) {
              self.selectedproductsList[index].taxname = taxaccount.taxname;
              self.selectedproductsList[index].taxvalue = taxaccount.taxvalues;

              self.selectedproductsList[index].taxpercent = taxaccount.taxvalues;
              self.selectedproductsList[index].selltaxname = taxaccount.taxpercent;
              self.selectedproductsList[index].selltaxLabelname = taxaccount.taxname;
              // self.calcTaxAmount(index);
            }
          }
        }
        this.calculateTotals();
        // self.featureservice.TaxList(data)
        //   .then(function (res) {
        //     if (res.status) {
        //       self.selectedproductsList[index].taxpercent = res.data[0];
        //       self.selectedproductsList[index].selltaxname = res.data[0].taxpercent;
        //       // $scope.selectedproductsList[index].prodselltax = {"taxpercent": 0};
        //       self.selectedproductsList[index].selltaxLabelname = res.data[0].taxname;
        //     } else {
        //       self.selectedproductsList[index].taxpercent = 0;
        //       self.selectedproductsList[index].selltaxname = "-";
        //       self.selectedproductsList[index].selltaxLabelname = "-";
        //     }
        //   });
      } else {
        self.messageservice.showMessage({ severity: 'error', summary: 'Error', detail: "Product already exist. " }, true);
      }
    }
  }
  selectedpos(event) {
    var item = event.value;
    this.selectedplaceofsupply = item;
    this.taxitemSeparation();
  }
  onEdit(event) {
    console.log("edit:", event);
  }
  onEditProduct(event) {
    console.log("oneditproduct:", event);
  }
  editquantity(event, selectedproduct, index, col, model) {
    console.log(model);
  }
  discountKeyup(event, selectedproduct, index) {

    if (selectedproduct.discntprcnt.toString().indexOf(".") == -1) {
      selectedproduct.discntprcnt = parseFloat(selectedproduct.discntprcnt);
      if (isNaN(selectedproduct.discntprcnt)) {
        selectedproduct.discntprcnt = 0
      }
      else if (parseFloat(selectedproduct.discntprcnt) >= 100) {
        selectedproduct.discntprcnt = 99;
      }
      this.producteditingObserve(event, selectedproduct, index);
    }
  }
  productmrpObserve(event, selectedproduct, index) {
    this.producteditingObserve(event, selectedproduct, index);
  }
  producteditingObserve(event, selectedproduct, index) {
    if (!_.isEmpty(selectedproduct) && selectedproduct != undefined) {
      if ((selectedproduct.prodid != 0 && selectedproduct.prodid != undefined) || (this.Invoicecategory == "ServiceInvoice")) { //SEDT start
        // calculate basic totoal without tax and discount
        this.selectedproductsList[index].discntprcnt = Number(this.selectedproductsList[index].discntprcnt);
        this.selectedproductsList[index].btotal = this.selectedproductsList[index].mrp * this.selectedproductsList[index].quantity;
        var discount = this.selectedproductsList[index].discntprcnt ? this.selectedproductsList[index].discntprcnt : 0;
        this.selectedproductsList[index].discntvalue = this.selectedproductsList[index].btotal * parseFloat(discount) / 100;
      }
    }
    this.calculateTotals();
  }
  calculateTotals() {
    this.invoiceProductTotal();
    this.invoiceSubTotal();
    this.CalcInvoicegrandTotal();
    this.calculateTotalTax();
    this.taxitemSeparation();
    this.discounttotal = this.ProductTotal - this.invoiceAllSubTotal;
  }
  // calculate total without tax and discout
  calcbasictotalwithouttaxdiscount(index) {
    this.selectedproductsList[index].btotal = this.selectedproductsList[index].mrp * this.selectedproductsList[index].quantity;

  }
  calcTaxAmount(index) {
    var bamt = parseFloat(this.selectedproductsList[index].mrp) * parseFloat(this.selectedproductsList[index].quantity);
    var disc = bamt * parseFloat(this.selectedproductsList[index].discntprcnt) / 100;
    if ((((bamt - (disc)) * this.selectedproductsList[index].taxpercent / 100).toFixed(2)) == 'NaN') {
      this.selectedproductsList[index].taxamount = 0.00;
    } else {
      this.selectedproductsList[index].taxamount = ((bamt - (disc)) *
        this.selectedproductsList[index].taxpercent / 100).toFixed(2);
    }
  }
  invoiceProductTotal() {
    var total = 0.00;
    _.forEach(this.selectedproductsList, function (item, key) {
      var sum = item.quantity * item.mrp;
      sum = sum ? sum : 0;
      total += sum;
    });
    if (isNaN(total)) {
      this.ProductTotal = 0;
    } else {
      this.ProductTotal = total;
    }

  };
  invoiceSubTotal() {
    var total = 0.00;
    _.forEach(this.selectedproductsList, function (item, key) {
      var btotal = item.quantity * item.mrp;
      btotal = btotal ? btotal : 0;
      var discount = item.discntprcnt ? item.discntprcnt : 0;
      total += (btotal) - (btotal * parseFloat(discount) / 100);
    });
    if (isNaN(total)) {
      this.invoiceAllSubTotal = 0;
    } else {
      this.invoiceAllSubTotal = total;
    }
  }
  calculateTotalTax() {
    var tax = 0;
    var self=this;
    _.forEach(this.selectedproductsList, function (item, key) {
      var total = 0;
      var btotal = item.quantity * item.mrp;
      btotal = btotal ? btotal : 0;
      var discount = item.discntprcnt ? item.discntprcnt : 0;
      total += (btotal) - (btotal * parseFloat(discount) / 100);
      tax += ((total * item.taxpercent) / 100);
      // if (self.morecharges != 0 ) {
      //   tax += ((self.addmorecharge * item.taxpercent) / 100);
      // } else {
      //   tax += ((total * item.taxpercent) / 100);
      // }
    });

    if (isNaN(tax)) {
      this.invoiceAllTaxTotal = 0.00;
    } else {
      this.invoiceAllTaxTotal = tax;
    }
  }
  CalcInvoicegrandTotal() {
  
    this.invoiceGrandTotal = 0.00;
    this.invoicegrand = 0.00;
  
    this.morecharges = + this.morecharges;
    if (this.morecharges.toString().indexOf(".") == -1) {  
      this.morecharges = + this.morecharges;
      this.addmorecharge = this.invoiceAllSubTotal + this.morecharges;
      this.calculateTotalTax();

    this.invoiceGrandTotal = this.addmorecharge + this.invoiceAllTaxTotal;
    var roundoff = Math.round(this.invoiceGrandTotal) - this.invoiceGrandTotal;
    this.morecharges = Number(this.morecharges);
    if (this.morecharges) {
      if (isNaN(this.invoiceGrandTotal )) {
        this.invoiceGrandTotal = 0;
      } else {
        this.invoicegrand = this.invoiceGrandTotal ;
        console.log("tt", this.invoicegrand);
        this.invoiceGrandTotal = this.invoiceGrandTotal;
      }
    } else {
      this.invoicegrand = this.invoiceGrandTotal;
    }
  }
  
  }
  //calcdiscAmount
  calcdiscAmount(index) {
    var bamt = parseFloat(this.selectedproductsList[index].mrp) * parseFloat(this.selectedproductsList[index].quantity);
    return bamt * parseFloat(this.selectedproductsList[index].discntprcnt) / 100;
  }
  // generate invoice 
  GenarateInvoice(flag) {
    var validdata: Boolean = true;
    this.invoiceDate = this.dateFormatPipeFilter.transform(this.invoiceDate, this.date_apiformat);
    this.DueDate = this.dateFormatPipeFilter.transform(this.DueDate, this.date_apiformat);
    if (typeof this.invoiceDate == "object" && typeof this.DueDate == "object") {
      if (this.invoiceDate.getTime() < this.invoiceDate.getTime()) {
        validationerrorMsg.push(PrimengConstant.INVOICE.ADDEDITFORM.DATEPICKER);
        validdata = false;
      }
    }
    var productData = [];
    var taxData = [];
    var Taxes = [];
    var invoicetotal = this.invoicegrand;
    var validationerrorMsg = []
    var prod_count = _.filter(this.selectedproductsList,  (pro)=> {
      return ((pro.prodid != 0) || (this.Invoicecategory == "ServiceInvoice") && (parseInt(pro.quantity) > 0)); //SEDT start
    });
    if (prod_count.length == 0) {
      validdata = false;
      validationerrorMsg.push(PrimengConstant.COMMONTRANSACTION.PARTICULAR);
    }
    if (_.isEmpty(this.selectedplaceofsupply)) {
      validdata = false;
      validationerrorMsg.push(PrimengConstant.COMMONTRANSACTION.PLACESUPPLY);
    }
    if (this.selectedInvoiceType.id == "" || this.selectedInvoiceType.id == undefined) {
      validdata = false;
      validationerrorMsg.push(PrimengConstant.INVOICE.ADDEDITFORM.INVOICETYPE);
    }
    if (this.selectedreversecharge === "") {
      validdata = false;
      validationerrorMsg.push(PrimengConstant.COMMONTRANSACTION.REVERSECHARGE);
    }

    if (typeof this.DueDate == "string") {
      if (this.DueDate == "") {
        this.DueDate = this.dateFormatPipeFilter.transform(this.invoiceDeta.duedate, this.date_apiformat);
      }
    }

    if (typeof this.invoiceDate == "string") { // _.isEmpty(inDate)
      if (this.invoiceDate == "") {
        this.invoiceDate = this.dateFormatPipeFilter.transform(this.invoiceDeta.invoicedt, this.date_apiformat);
        // validdata = false;
        // validationerrorMsg.push("Please select Invoice date.");
      }
    }

    if (!this.selectedContactDetails.contactid) {
      validdata = false;
      validationerrorMsg.push(PrimengConstant.COMMONTRANSACTION.CUSTOMER);
    }
    if (validdata) {
      var discountTotal = 0;
      var interastate = true;
      if (this.orgpos == this.selectedplaceofsupply.name) {
        interastate = true;
      } else if (this.orgpos != this.selectedplaceofsupply.name) {
        interastate = false;
      }
      for (var i = this.selectedproductsList.length - 1; i >= 0; i--) {
        if ((this.selectedproductsList[i].prodid != 0) || (this.Invoicecategory == "ServiceInvoice") && (parseInt(this.selectedproductsList[i].quantity) > 0)
        && (this.selectedproductsList[i].prodname != "") && (this.selectedproductsList[i].prodname != "Select Product") ) { //SEDT start
          var ptotal = parseFloat(this.selectedproductsList[i].quantity) * parseFloat(this.selectedproductsList[i].mrp);
          var discntvalue = this.calcdiscAmount(i);
          var taxval = ((ptotal - discntvalue) * parseFloat(this.selectedproductsList[i].taxpercent)) / 100;
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
          this.selectedproductsList[i].basicamount = (ptotal + taxval - discntvalue).toFixed(2);
          this.selectedproductsList[i].taxvalue = taxval;
          var productItem = {
            "prodid": this.selectedproductsList[i].prodid,
            "prodname": this.selectedproductsList[i].prodname,
            "sku": "Item",
            "quantity": this.selectedproductsList[i].quantity,
            "uomid": this.selectedproductsList[i].uomid,
            "uomdesc": this.selectedproductsList[i].uomdesc,
            "mrp": this.selectedproductsList[i].mrp,
            "parentaccheadid": "",
            "parentaccheadname": "",
            "sellaccheadid": "",
            "sellaccheadname": "",
            "openingbalance": 0,
            "currentbalance": 0,
            "selltaxid": this.selectedproductsList[i].selltaxid,
            "selltaxname": this.selectedproductsList[i].taxname,
            "crdr": "C",
            "discntvalue": discntvalue.toFixed(2),
            "discntprcnt": this.selectedproductsList[i].discntprcnt,
            "taxpercent": this.selectedproductsList[i].taxpercent,
            "taxname": this.selectedproductsList[i].taxname,
            "taxvalue": taxval,
            "cgst": CGST.toFixed(2),
            "sgst": SGST.toFixed(2),
            "igst": IGST.toFixed(2),
            "amount": ptotal,
            "basicamount": (ptotal + taxval - discntvalue).toFixed(2),
            "hsncode" : this.selectedproductsList[i].hsncode
          };
          if (this.selectedproductsList[i].taxname != "--"
            && this.selectedproductsList[i].quantity != 0
            && this.selectedproductsList[i].mrp != 0
            && this.selectedproductsList[i].hsncode != "" 
            && this.selectedproductsList[i].taxname != "") {
            productData.push(productItem);
          } else {
            if (this.selectedproductsList[i].taxname == "--") {
              validdata = false;
              validationerrorMsg.push(PrimengConstant.COMMONTRANSACTION.TAX);
            } else if (this.selectedproductsList[i].quantity == 0) {
              validdata = false;
              validationerrorMsg.push(PrimengConstant.COMMONTRANSACTION.QUANTITY);
            } else if (this.selectedproductsList[i].mrp == 0) {
              validdata = false;
              validationerrorMsg.push(PrimengConstant.COMMONTRANSACTION.COST);
            }
            else if (this.selectedproductsList[i].hsncode == "") {
              validdata = false;
              validationerrorMsg.push(PrimengConstant.COMMONTRANSACTION.HSNCODE);
            }
          }
          var invoicesubvalue = 0;
          _.forEach(productData, function (value, key: any) {
            invoicesubvalue += value.amount;
          });
          console.log("incoicetotal", invoicesubvalue);
          // var tax;
          // if (_.isObject(this.selectedproductsList[i].prodselltax) || _.isString(this.selectedproductsList[i].prodselltax)
          //   || _.isNumber(this.selectedproductsList[i].prodselltax)) {
          //   tax = this.selectedproductsList[i].prodselltax.taxpercent;
          // } else {
          //   tax = JSON.parse(this.selectedproductsList[i].prodselltax);
          // }
          var taxhead = _.find(this.taxes, { "taxname": this.selectedproductsList[i].taxname });
          var taxaccheadid = "", taxaccheadname = "", taxsubaccheadid = "", taxsubaccheadname = "", taxcrdr = "-",
            taxcurrentbalance = 0.00, taxopening = 0.00;
          if (!_.isEmpty(taxhead)) {
            taxaccheadid = taxhead.accheadid, taxaccheadname = taxhead.accheadname,
              taxsubaccheadid = taxhead.subaccheadid, taxsubaccheadname = taxhead.subaccheadname, taxcrdr = taxhead.crdr;
            taxopening = taxhead.openingbalance, taxcurrentbalance = taxhead.currentbalance;
          }
          var taxItem = {
            "sellaccheadid": taxaccheadid,
            "sellaccheadname": taxaccheadname,
            "sellsubaccheadid": taxsubaccheadid,
            "sellsubaccheadname": taxsubaccheadname,
            "selltaxid": "0",
            "selltaxname": this.selectedproductsList[i].taxname,
            "taxpercent": this.selectedproductsList[i].taxpercent,
            "taxname": this.selectedproductsList[i].taxname,
            "taxvalue": taxval,
            "crdr": taxcrdr,
            "openingbalance": taxopening,
            "currentbalance": taxcurrentbalance,
          };
          taxData.push(taxItem);
          console.log("taxItem", taxItem);
        }
      }

      var GST0total = 0;
      var GST025total = 0;
      var GST3total = 0;
      var GST5total = 0;
      var GST12total = 0;
      var GST18total = 0;
      var GST28total = 0;
      var gst0name: String, gst025name: String, gst3name: String, gst5name: String, gst12name: String,
        gst18name: String, gst28name: String;
      var gst0disname: String, gst025disname: String, gst3disname: String, gst5disname: String, gst12disname: String,
        gst18disname: String, gst28disname: String;
      var gst0id: Number, gst025id: Number, gst3id: Number, gst5id: Number, gst12id: Number,
        gst18id: Number, gst28id: Number;
        var gst0txpercent: Number, gst025txpercent: Number, gst3txpercent: Number, gst5txpercent: Number, gst12txpercent: Number,
        gst18txpercent: Number, gst28txpercent: Number;
      _.forEach(taxData, function (va) {
        console.log("va", va);
        if (va.selltaxname == "GST 0.00%") {
          GST0total += va.taxvalue;
          gst0name = va.sellsubaccheadname;
          gst0disname = va.taxname;
          gst0id = va.sellsubaccheadid;
          gst0txpercent = va.taxpercent;
        } else if (va.selltaxname == "GST 0.25%") {
          GST025total += va.taxvalue;
          gst025name = va.sellsubaccheadname;
          gst025disname = va.taxname;
          gst025id = va.sellsubaccheadid;
          gst025txpercent = va.taxpercent;
        } else if (va.selltaxname == "GST 3.00%") {
          GST3total += va.taxvalue;
          gst3name = va.sellsubaccheadname;
          gst3disname = va.taxname;
          gst3id = va.sellsubaccheadid;
          gst3txpercent = va.taxpercent;
        } else if (va.selltaxname == "GST 5.00%") {
          GST5total += va.taxvalue;
          gst5name = va.sellsubaccheadname;
          gst5disname = va.taxname;
          gst5id = va.sellsubaccheadid;
          gst5txpercent = va.taxpercent;
        } else if (va.selltaxname == "GST 12.00%") {
          GST12total += va.taxvalue;
          gst12name = va.sellsubaccheadname;
          gst12disname = va.taxname;
          gst12id = va.sellsubaccheadid;
          gst12txpercent = va.taxpercent;
        } else if (va.selltaxname == "GST 18.00%") {
          GST18total += va.taxvalue;
          gst18name = va.sellsubaccheadname;
          gst18disname = va.taxname;
          gst18id = va.sellsubaccheadid;
          gst18txpercent = va.taxpercent;
        } else if (va.selltaxname == "GST 28.00%") {
          GST28total += va.taxvalue;
          gst28name = va.sellsubaccheadname;
          gst28disname = va.taxname;
          gst28id = va.sellsubaccheadid;
          gst28txpercent = va.taxpercent;
        }
      });
      if (interastate == true) {
        var CGST0 = GST0total / 2;
        var SGST0 = GST0total / 2;
        var CGST025 = GST025total / 2;
        var SGST025 = GST025total / 2;
        var CGST3 = GST3total / 2;
        var SGST3 = GST3total / 2;
        var CGST5 = GST5total / 2;
        var SGST5 = GST5total / 2;
        var CGST12 = GST12total / 2;
        var SGST12 = GST12total / 2;
        var CGST18 = GST18total / 2;
        var SGST18 = GST18total / 2;
        var CGST28 = GST28total / 2;
        var SGST28 = GST28total / 2;
        var IGST0 = 0;
        var IGST025 = 0;
        var IGST3 = 0;
        var IGST5 = 0;
        var IGST12 = 0;
        var IGST18 = 0;
        var IGST28 = 0;
      } else if (interastate == false) {
        var IGST0 = GST0total;
        var IGST025 = GST025total;
        var IGST3 = GST3total;
        var IGST5 = GST5total;
        var IGST12 = GST12total;
        var IGST18 = GST18total;
        var IGST28 = GST28total;
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
      var Taxvalues = [

        {
          "invoiceid": this.invoiceid,
          "accheadname": gst0name,
          "accheadid": gst0id,
          "parentaccheadname": taxaccheadname,
          "parentaccheadid": taxaccheadid,
          "leadaccheadname": taxaccheadname,
          "leadaccheadid": taxaccheadid,
          "sellaccheadname": taxaccheadid,
          "sellaccheadid": taxaccheadname,
          "taxname": gst0disname,
          "taxpercent" :gst0txpercent,
          "taxvalue": (GST0total).toFixed(2),
          "crdr": taxcrdr,
          "selltaxid": gst0id,
          "selltaxname": gst0name,
          "cramount": GST0total,
          "openingbalance": taxopening,
          "currentbalance": taxcurrentbalance,
          "finyear": this.finyear.finyear,
          "amount": (GST0total).toFixed(2),
          "cgst": (CGST0).toFixed(2),
          "sgst": (SGST0).toFixed(2),
          "igst": (IGST0).toFixed(2),
          "feature": "proforma_invoice",
          "txnrefno": this.invoiceNumber,
          "status": "Active"
        },
        {
          "invoiceid": this.invoiceid,
          "accheadname": gst025name,
          "accheadid": gst025id,
          "parentaccheadname": taxaccheadname,
          "parentaccheadid": taxaccheadid,
          "leadaccheadname": taxaccheadname,
          "leadaccheadid": taxaccheadid,
          "sellaccheadname": taxaccheadid,
          "sellaccheadid": taxaccheadname,
          "taxname": gst025disname,
          "taxpercent" :gst025txpercent,
          "taxvalue": (GST025total).toFixed(2),
          "crdr": taxcrdr,
          "selltaxid": gst025id,
          "selltaxname": gst025name,
          "cramount": GST025total,
          "openingbalance": taxopening,
          "currentbalance": taxcurrentbalance,
          "finyear": this.finyear.finyear,
          "amount": (GST025total).toFixed(2),
          "cgst": (CGST025).toFixed(2),
          "sgst": (SGST025).toFixed(2),
          "igst": (IGST025).toFixed(2),
          "feature": "proforma_invoice",
          "txnrefno": this.invoiceNumber,
          "status": "Active"
        },
        {
          "invoiceid": this.invoiceid,
          "accheadname": gst3name,
          "accheadid": gst3id,
          "parentaccheadname": taxaccheadname,
          "parentaccheadid": taxaccheadid,
          "leadaccheadname": taxaccheadname,
          "leadaccheadid": taxaccheadid,
          "sellaccheadname": taxaccheadid,
          "sellaccheadid": taxaccheadname,
          "taxname": gst3disname,
          "taxpercent" :gst3txpercent,
          "taxvalue": (GST3total).toFixed(2),
          "crdr": taxcrdr,
          "selltaxid": gst3id,
          "selltaxname": gst3name,
          "cramount": GST3total,
          "openingbalance": taxopening,
          "currentbalance": taxcurrentbalance,
          "finyear": this.finyear.finyear,
          "amount": (GST3total).toFixed(2),
          "cgst": (CGST3).toFixed(2),
          "sgst": (SGST3).toFixed(2),
          "igst": (IGST3).toFixed(2),
          "feature": "proforma_invoice",
          "txnrefno": this.invoiceNumber,
          "status": "Active"
        },

        {
          "invoiceid": this.invoiceid,
          "accheadname": gst5name,
          "accheadid": gst5id,
          "parentaccheadname": taxaccheadname,
          "parentaccheadid": taxaccheadid,
          "leadaccheadname": taxaccheadname,
          "leadaccheadid": taxaccheadid,
          "sellaccheadname": taxaccheadid,
          "sellaccheadid": taxaccheadname,
          "taxname": gst5disname,
          "taxpercent" :gst5txpercent,
          "taxvalue": (GST5total).toFixed(2),
          "crdr": taxcrdr,
          "selltaxid": gst5id,
          "selltaxname": gst5name,
          "cramount": GST5total,
          "openingbalance": taxopening,
          "currentbalance": taxcurrentbalance,
          "finyear": this.finyear.finyear,
          "amount": (GST5total).toFixed(2),
          "cgst": (CGST5).toFixed(2),
          "sgst": (SGST5).toFixed(2),
          "igst": (IGST5).toFixed(2),
          "feature": "proforma_invoice",
          "txnrefno": this.invoiceNumber,
          "status": "Active"
        },
        {
          "invoiceid": this.invoiceid,
          "accheadname": gst12name,
          "accheadid": gst12id,
          "parentaccheadname": taxaccheadname,
          "parentaccheadid": taxaccheadid,
          "leadaccheadname": taxaccheadname,
          "leadaccheadid": taxaccheadid,
          "sellaccheadname": taxaccheadid,
          "sellaccheadid": taxaccheadname,
          "taxname": gst12disname,
          "taxpercent" :gst12txpercent,
          "taxvalue": (GST12total).toFixed(2),
          "crdr": taxcrdr,
          "selltaxid": gst12id,
          "selltaxname": gst12name,
          "cramount": (GST12total).toFixed(2),
          "openingbalance": taxopening,
          "currentbalance": taxcurrentbalance,
          "finyear": this.finyear.finyear,
          "amount": (GST12total).toFixed(2),
          "cgst": (CGST12).toFixed(2),
          "sgst": (SGST12).toFixed(2),
          "igst": (IGST12).toFixed(2),
          "feature": "proforma_invoice",
          "txnrefno": this.invoiceNumber,
          "status": "Active"
        },
        {
          "invoiceid": this.invoiceid,
          "accheadname": gst18name,
          "accheadid": gst18id,
          "parentaccheadname": taxaccheadname,
          "parentaccheadid": taxaccheadid,
          "leadaccheadname": taxaccheadname,
          "leadaccheadid": taxaccheadid,
          "sellaccheadname": taxaccheadid,
          "sellaccheadid": taxaccheadname,
          "taxname": gst18disname,
          "taxpercent" :gst18txpercent,
          "taxvalue": (GST18total).toFixed(2),
          "crdr": taxcrdr,
          "selltaxid": gst18id,
          "selltaxname": gst18name,
          "cramount": (GST18total).toFixed(2),
          "openingbalance": taxopening,
          "currentbalance": taxcurrentbalance,
          "finyear": this.finyear.finyear,
          "amount": (GST18total).toFixed(2),
          "cgst": (CGST18).toFixed(2),
          "sgst": (SGST18).toFixed(2),
          "igst": (IGST18).toFixed(2),
          "feature": "proforma_invoice",
          "txnrefno": this.invoiceNumber,
          "status": "Active"
        },
        {
          "invoiceid": this.invoiceid,
          "accheadname": gst28name,
          "accheadid": gst28id,
          "parentaccheadname": taxaccheadname,
          "parentaccheadid": taxaccheadid,
          "leadaccheadname": taxaccheadname,
          "leadaccheadid": taxaccheadid,
          "sellaccheadname": taxaccheadid,
          "sellaccheadid": taxaccheadname,
          "taxname": gst28disname,
          "taxpercent" :gst28txpercent,
          "taxvalue": (GST28total).toFixed(2),
          "crdr": taxcrdr,
          "selltaxid": gst28id,
          "selltaxname": gst28name,
          "cramount": (GST28total).toFixed(2),
          "openingbalance": taxopening,
          "currentbalance": taxcurrentbalance,
          "finyear": this.finyear.finyear,
          "amount": (GST28total).toFixed(2),
          "cgst": (CGST28).toFixed(2),
          "sgst": (SGST28).toFixed(2),
          "igst": (IGST28).toFixed(2),
          "feature": "proforma_invoice",
          "txnrefno": this.invoiceNumber,
          "status": "Active"
        }
      ];
      var contactname = this.selectedContactDetails.contactname;
      var contactid = this.selectedContactDetails.contactid;
      //-------------------------------------------------------------- Acconfig Setup -------------------------------------------------------------------------
     
      _.forEach(this.accconfig, (config) => {
        config.tenantid = this.userstoragedata.tenantid;
        config.tenantname = this.userstoragedata.tenantname;
        config.contactname = contactname;
        config.contactid = contactid;
        config.ledgerdate = this.invoiceDate;
        config.txnid = this.invoiceid;
        config.feature = "proforma_invoice";
        switch (_.trim(config.configname)) {
          case "Gross": {
            config.cramount = invoicesubvalue;
            break;
          }
          case "Discount": {
            config.dramount = (discountTotal).toFixed(2);
            break;
          }
          case "Total Amount": {
            config.cramount = 0;
            break;
          }
          case "GST 0.00%": {
            config.cramount = (GST0total).toFixed(2);
            break;
          }
          case "GST 0.25%": {
            config.cramount = (GST025total).toFixed(2);
            break;
          }
          case "GST 3.00%": {
            config.cramount = (GST3total).toFixed(2);
            break;
          } case "GST 5.00%": {
            config.cramount = (GST5total).toFixed(2);
            break;
          } case "GST 12.00%": {
            config.cramount = (GST12total).toFixed(2);
            break;
          } case "GST 18.00%": {
            config.cramount = (GST18total).toFixed(2);
            break;
          } case "GST 28.00%": {
            config.cramount = (GST28total).toFixed(2);
            break;
          } case "Other Charges": {
            config.dramount = (this.morecharges).toFixed(2);
            break;
          } case "Net Amount": {
            config.dramount = (this.invoicegrand).toFixed(2);
            config.accheadid = this.selectedContactDetails.ledgerid;
            config.accheadname = this.selectedContactDetails.ledgername;
            config.leadaccheadid = this.selectedContactDetails.accheadid;
            config.leadaccheadname = this.selectedContactDetails.accheadname;
            // config.accheadid = this.selectedContactDetails.ledgerid;
            // config.accheadname = this.selectedContactDetails.ledgername;
            // config.leadaccheadid = this.selectedContactDetails.accheadid;
            // config.leadaccheadname = this.selectedContactDetails.accheadname;
            break;
          } case "Cost of goods sold": {
            break;
          }
          default: {
            console.log("Invalid choice");
            break;
          }
        }
      });
      console.log("config", this.accconfig)
      //     ------------------------------------------------------------- Acconfig Setup end -------------------------------------------------------------------------                    
      var lastname = "";
      if (!_.isEmpty(this.selectedContactDetails.lastname)) {
        lastname = this.selectedContactDetails.lastname;
      }

      this.productsForUpdate = this.formatProductsForUpdate();
      var invdate = this.invoiceDate;
      var ddate = this.DueDate;
      var formData = {
        "header": {
          "invoiceid": this.invoiceid,
          "invoicedt": invdate,
          "finyear": this.finyear.finyear,
          "tenantid": this.userstoragedata.tenantid,
          "tenantname": this.userstoragedata.tenantname,
          "invoicetype": this.Invoicecategory, //SEDT start
          "contactname": this.selectedContactDetails.firstname + ' ' + lastname,
          "contactid": this.selectedContactDetails.contactid,
          "companyname": this.selectedContactDetails.companyname,
          "orderref": this.referecefnumber,
          "paymenttermid": this.selectedContactDetails.paymenttermid,
          "paymentterms": this.selectedContactDetails.paymentterms,
          "billingaddress": this.editableBillingaddress,
          "shipingaddress": this.editableShippingaddress,
          "duedate": ddate,
          "ccyid": this.selectedContactDetails.ccyid,
          "ccyname": "INR",
          "subtotal": this.ProductTotal,
          "discntprcnt": "0",
          "discntvalue": discountTotal.toFixed(2),
          "shipingprcnt": "0",
          "shipingvalue": "0",
          "taxtotal": (this.invoiceAllTaxTotal).toFixed(2),
          "roundoff": "0",
          "invoicetotal": (invoicetotal).toFixed(2),
          "pymntamount": "0",
          "balamount": (this.invoicegrand).toFixed(2),
          "pymtlink": "http://link.in",
          "templtid": "1",
          "templtname": "HTL",
          "emailyn": "Y",
          "status": "Active",
          "createdby": this.userstoragedata.loginname,
          "createddt": this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
          "lastupdatedby": this.userstoragedata.loginname,
          "lastupdateddt": this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
          // "taxdetails": taxData,
          "pos": this.selectedplaceofsupply.name,
          "nod": "",
          "invtype": this.selectedInvoiceType.name,
          "urtype": "B2C",
          "gstno": this.selectedContactDetails.gstno,
          "ecomgstno": "fghjk",
          "cessamount": 0,
          // "seqid": 77,
          "refkey": "INV",
          "revcharge": "N",
          "otherexpenses": (this.morecharges).toFixed(2),
        },
        "productsForUpdate": this.productsForUpdate,
        "deleteTaxIds": this.deleteTaxIds,
        "taxesForUpdate": Taxvalues,
        "deleteLedgerIds": this.deleteLedgerIds,
        "ledgerUpdate": this.accconfig
      };
    }
    if (validdata) {
      var self = this;
      this.salesservice.InvoiceUpdate(formData)
        .then(function (res) {
          self.msgs = [];
          if (res.status) {
            self.messageservice.showMessage({
              severity: 'success',
              summary: 'Success', detail: res.message
            });

            if (flag) {
              self.clearform();
            } else {
              self.router.navigate(['sales/viewinvoice', 'proforma', self.invoiceid]);
            }
          }
          else {
            self.messageservice.showMessage({
              severity: 'error',
              summary: 'Error', detail: res.message
            }, true);
          }

        });
    }
    else {
      var self = this;
      self.msgs = [];
      _.forEach(validationerrorMsg, function (value) {
        // self.notificationsService.notify('error', 'Error', value);
        self.messageservice.showMessage({
          severity: 'error',
          summary: 'Error', detail: value
        }, true);
      });

    }

  }
  formatProductsForUpdate() {
    var formatedproduct: any = {
      insert: [],
      delete: [],
      update: []
    };
    var newlyinserted = _.difference(this.selectedproductsList, this.invoiceDeta.invoiceDetails);

    var deletedproducts = _.difference(this.invoiceDeta.invoiceDetails, this.selectedproductsList);
    var updatedProduct = [];
    var old_existingarray = _.pullAll(this.selectedproductsList, newlyinserted);
    // _.forEach(old_existingarray, function (sItem: any) {
    //   var uv = _.find(old_existingarray, function (v: any) {
    //     return ((v.quantity !== sItem.quantity)
    //       || (v.discntprcnt !== sItem.discntprcnt)
    //       || (v.taxpercent !== sItem.taxpercent)
    //       || (v.taxvalue !== sItem.taxvalue));
    //   });
    //   if (!_.isEmpty(uv)) {
    //     updatedProduct.push(uv);
    //   }
    // });
    formatedproduct.insert = newlyinserted;
    formatedproduct.delete = deletedproducts;
    formatedproduct.update = old_existingarray;
    return formatedproduct;
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
      if (this.orgpos != this.selectedplaceofsupply.name) {
        interastate = false;
      }
    }
    for (var i = this.selectedproductsList.length - 1; i >= 0; i--) {
      var va = this.selectedproductsList[i];
      if ((this.selectedproductsList[i].prodid != 0) || (this.Invoicecategory == "ServiceInvoice")) { //SEDT start
        var ptotal = parseFloat(this.selectedproductsList[i].quantity) * parseFloat(this.selectedproductsList[i].mrp);
        var discntvalue = this.calcdiscAmount(i);
        var taxval = ((ptotal - discntvalue) * parseFloat(this.selectedproductsList[i].taxpercent)) / 100;
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
        var gst0name: String, gst025name: String, gst3name: String, gst5name: String, gst12name: String,
          gst18name: String, gst28name: String;
        var gst0id: Number, gst025id: Number, gst3id: Number, gst5id: Number, gst12id: Number,
          gst18id: Number, gst28id: Number;
        var total = 0;
        var btotal = va.quantity * va.mrp;
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
      var CGST0 = GST0total / 2;
      var SGST0 = GST0total / 2;
      var CGST025 = GST025total / 2;
      var SGST025 = GST025total / 2;
      var CGST3 = GST3total / 2;
      var SGST3 = GST3total / 2;
      var CGST5 = GST5total / 2;
      var SGST5 = GST5total / 2;
      var CGST12 = GST12total / 2;
      var SGST12 = GST12total / 2;
      var CGST18 = GST18total / 2;
      var SGST18 = GST18total / 2;
      var CGST28 = GST28total / 2;
      var SGST28 = GST28total / 2;
      var IGST0 = 0;
      var IGST025 = 0;
      var IGST3 = 0;
      var IGST5 = 0;
      var IGST12 = 0;
      var IGST18 = 0;
      var IGST28 = 0;
    } else if (interastate == false) {
      var IGST0 = GST0total;
      var IGST025 = GST025total;
      var IGST3 = GST3total;
      var IGST5 = GST5total;
      var IGST12 = GST12total;
      var IGST18 = GST18total;
      var IGST28 = GST28total;
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
    this.selectedContactDetails = {};
    this.invoiceDate = new Date();
    this.DueDate = new Date();
    this.editableBillingaddress = "";
    this.selectedproductsList = [];
    this.contact = "";
    this.contactname = "";
    this.contactid = null;
    this.invoiceNumber = "";
    this.referecefnumber = "";
    this.selectedInvoiceType = {};
    this.selectedreversecharge = {};
    this.placeofsupplies = {};
    this.seqgenerator();
    this.loaddefaultproducts();
    this.ProductTotal = 0.0;
    this.discounttotal = 0.0;
    this.invoiceAllTaxTotal = 0.0;
    this.morecharges = 0.0;
    this.invoiceGrandTotal = 0.0;
  }
  numberOnly(event: any) {
    this.utilservice.allowNumberOnly(event);
  }
  splitbtn_save(event) {
    if (event.target.className.indexOf("fa-caret-down") < 0) {
      this.GenarateInvoice("");
    }
  }
  changesonInvoiceCategoryProductBased() //SEDT start 
  {
    this.loaddefaultproducts();
    this.ProductTotal = 0.0;
    this.discounttotal = 0.0;
    this.invoiceAllTaxTotal = 0.0;
    this.morecharges = 0.0;
    this.invoiceGrandTotal = 0.0;
    this.Temp_GST_TaxTotal = [];
  }
  changesonInvoiceCategoryServiceBased() {
    this.loaddefaultproducts();
    this.ProductTotal = 0.0;
    this.discounttotal = 0.0;
    this.invoiceAllTaxTotal = 0.0;
    this.morecharges = 0.0;
    this.invoiceGrandTotal = 0.0;
    this.Temp_GST_TaxTotal = [];
  } //SEDT end
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyContact);
    this._hotkeysService.remove(this.hotkeyProduct);
    this._hotkeysService.remove(this.hotkeySave);
  }
}
