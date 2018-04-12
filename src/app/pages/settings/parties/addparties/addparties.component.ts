import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PartiesService } from './../../services/parties.service';
import { CommonService } from './../../services/common.service';
import { LocalStorageService } from '../../../../shared/local-storage.service';
import { Message } from 'primeng/primeng';
import { AppConstant } from '../../../../../app/app.constant';
import { MasterService } from '../../../../services/master.service';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { OverlayPanel } from 'primeng/primeng';
import { UtilsService } from '../../../../services/utils.service';
import * as _ from 'lodash';
import { CheckboxModule } from 'primeng/primeng';
import { MessagesService } from '../../../../shared/messages.service';
import { DateformatPipe } from '../../../../pipes/dateformat.pipe';
import { PrimengConstant } from '../../../../../app/app.primeconfig';
import { Dropdown } from 'primeng/primeng';
import { FeaturesService } from '../../../../services/features.service';

@Component({
  selector: 'app-addparties',
  templateUrl: './addparties.component.html',
  styleUrls: ['./addparties.component.scss']
})
export class AddpartiesComponent implements OnInit {
  selectedtype: any;
  contactslist: any[];
  selectedAccountType: any;
  codemasterslist: any;
  group: any;
  finyear: any;
  @ViewChild('groupdropdown') groupdropdown: Dropdown;
  public phoneno = AppConstant.API_CONFIG.MAXLENGTH.PHONENUMBER;
  public max50 = AppConstant.API_CONFIG.MAXLENGTH.MAX50;
  public gstlength = AppConstant.API_CONFIG.MAXLENGTH.GST;
  public pinlength = AppConstant.API_CONFIG.MAXLENGTH.PINLENGTH;
  public amtlength = AppConstant.API_CONFIG.AMOUNTFORMAT.MAXLENGTH;

  country: SelectItem[];
  validation = 'true';
  validationmsg = '';
  formdata = {} as any;
  msgs: Message[] = [];
  par: FormGroup;
  Indate: any;
  userdetails: any;
  allcountry: any[];
  countrys: any[];
  billcities: any[];
  shipcities: any[];
  billstates: any[];
  shipstates: any[];
  cities: any[];
  states: any[];
  groups: any[];
  industries: any[];
  filteredcountry: any[];
  selectbillstate: any[];
  selectshipstate: any[];
  selectedcountrydetails: any;
  selectedcitydetails: any;
  selectedstatedetails: any;
  selectedshipcountrydetails: any;
  selectedshipcitydetails: any;
  selectedshipstatedetails: any;
  selectedindustry: any;
  selectedgroup: any;
  selectedcitybdetails: any;
  selectedstatebdetails: any;
  selectedcontacttype: any;
  selectedledgerData: any;
  selectedstatesdetails: any;
  checkstate: any;
  checkstates: any;
  changestatus: any[] = [];
  status: any = [];
  selectedcountry: any;
  counties: any = [];
  selected: any;
  // disabled: boolean=false;
  buttonText = 'Save';
  crdr_opt = [
    {label: 'C', value: 'C'},
    {label: 'D', value: 'D'},
  ];
  contactcategory = "B2B";
  @Input() partiesdetails: any;
  @Output() notifyNewProduct: EventEmitter<any> = new EventEmitter();
  @Input() openedfromothers: boolean = false;
  @Input() ext_sundryGrop: string = '';
  @Input() CustomerorVendor: any = '';
  @Input() ext_customerCategory: any ='';
  formObj: any = {
    firstname: PrimengConstant.PARTIES.ADDEDITFORM.F_NAME,
    // accheadname: PrimengConstant.PARTIES.ADDEDITFORM.ACCHEAD_NAME,
    emailid: PrimengConstant.PARTIES.ADDEDITFORM.EMAIL_ID,
    companyname: PrimengConstant.PARTIES.ADDEDITFORM.COMPANY_NAME,
    mobileno: PrimengConstant.PARTIES.ADDEDITFORM.MOBILE_NO,
    billaddress: PrimengConstant.PARTIES.ADDEDITFORM.BILL_ADDR,
    billzipcode: PrimengConstant.PARTIES.ADDEDITFORM.BILL_ZIP,
    shipaddress: PrimengConstant.PARTIES.ADDEDITFORM.SHIP_ADDR,
    shipzipcode: PrimengConstant.PARTIES.ADDEDITFORM.SHIP_ZIP,
    socialids: PrimengConstant.PARTIES.ADDEDITFORM.SOCIAL_IDS,
    status: PrimengConstant.COMMON.STATUS,
    gstno: PrimengConstant.PARTIES.ADDEDITFORM.GST_NO,
    // tinno: PrimengConstant.PARTIES.ADDEDITFORM.TIN_NO,
    cntctdeprtmnt: PrimengConstant.PARTIES.ADDEDITFORM.CONTACT_DEPT,
    cntctdesignation: PrimengConstant.PARTIES.ADDEDITFORM.CONTACT_DESIGN,
    openingbalance: PrimengConstant.SUBLEDGER.ADDEDITFORM.OPEN_BAL,
    contactype: PrimengConstant.PARTIES.ADDEDITFORM.CONTACT_TYPE,
  }
  currentDateStr: any;
  constructor(private fb: FormBuilder,
    private partiesservice: PartiesService,
    private LocalStorageService: LocalStorageService,
    private commonservice: CommonService,
    private masterservice: MasterService,
    private messageService: MessagesService,
    private UtilsService: UtilsService,
    private featuresService: FeaturesService,
    private dateFormatPipeFilter: DateformatPipe) {
    this.currentDateStr= this.dateFormatPipeFilter.transform(new Date(), AppConstant.API_CONFIG.ANG_DATE.apiTSFormat);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR).finyear;
    this.par = fb.group({
      'companyname': [null, Validators.required],
      // 'accheadname': [null, Validators.required],
      'firstname': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      'mobileno': [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(20)])],
      'emailid': [null, Validators.compose([Validators.pattern('([a-z0-9&_\.-]*[@][a-z0-9]+((\.[a-z]{2,3})?\.[a-z]{2,3}))')])],
      'billaddress': [null, Validators.compose([Validators.minLength(10), Validators.maxLength(150)])],
      'billcityid': [null],
      'billcityname': [null],
      'billstatename': [null],
      'billcountryname': [null],
      'billzipcode': [null, Validators.compose([Validators.minLength(4), Validators.maxLength(6)])],
      'shipaddress': [null, Validators.compose([Validators.minLength(10), Validators.maxLength(150)])],
      'shipcityid': [null],
      'shipcityname': [null],
      'shipstatename': [null],
      'shipcountryname': [null],
      'shipzipcode': [null, Validators.compose([Validators.minLength(4), Validators.maxLength(6)])],
      'industryname': [null],
      'industryid': [null],
      'gstno': [null, Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(15)])],
      'cntctdeprtmnt': [null, Validators.compose([Validators.minLength(3), Validators.maxLength(50)])],
      'cntctdesignation': [null, Validators.compose([Validators.minLength(3), Validators.maxLength(50)])],
      'socialids': [null, Validators.compose([Validators.minLength(5), Validators.maxLength(50), Validators.pattern('((?:https?\:\/\/|www\.)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)')])],
      'status': [null],
      'agreed': [false],
      'openingbalance': [0, Validators.required],
      'ob_crdr': ['C', Validators.required],
      'contactype': [null, Validators.required],
      'contactcategory' : ['B2B']
    })
    this.loadcountry();
    this.selectedcountry = AppConstant.API_CONFIG.SELECTEDCOUNTRY;
    this.userdetails = LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.status = AppConstant.API_CONFIG.status;
    for (var i = 0; i < this.status.length; i++) {
      this.changestatus.push({
        label: this.status[i].stat, value: this.status[i].stat
      });
    }
    console.log('openfrom: ', this.openedfromothers);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('cheatsheet changes: ', changes);
    if (changes.ext_sundryGrop) {
      if (changes.ext_sundryGrop.currentValue != '') {
        // this.selectedgroup.value
        if (changes.ext_sundryGrop.currentValue == PrimengConstant.COMMON.SUNDRY_DEBTORS) {
          this.CustomerorVendor = PrimengConstant.COMMON.CUSTOMER;
        }
        else if (changes.ext_sundryGrop.currentValue == PrimengConstant.COMMON.SUNDRY_DEBTORS) {
          this.CustomerorVendor = PrimengConstant.COMMON.VENDOR;
        }
        this.contactcategory = this.ext_customerCategory;
        this.setCustomerorVendor();
      }
      console.log('openfrom changes: ', changes);
    }
    if(changes.CustomerorVendor)
    {
      this.CustomerorVendor = changes.CustomerorVendor.currentValue;
      console.log(changes.CustomerorVendor);
      if(! _.isEmpty(this.contactslist))
      {
        this.setCustomerorVendor();
      }
    }
  }
  numberOnly(event) {
    this.UtilsService.allowNumberOnlyWithoutDecimal(event);
  }

  ngOnInit() {
    this.buttonText = PrimengConstant.COMMON.BUTTON_TXT.SAVE;
    this.groups = [];
    var self = this;
    this.commonservice.FindAllGroups({ contactshowyn: 'Y', status: 'Active' })
      .then((res) => {
        if (res.status) {
          this.group = res.data;
          if(this.selectedAccountType == undefined)
          {
            this.setCustomerorVendor();
          }
          self.groups = self.masterservice.formatDataforDropdown('subaccheadname', res.data, PrimengConstant.COMMON.DROPDOWNS.SELCT_GRP);
          this.commonservice.FindAllCountry({})
            .then((res) => {
              if (res.status) {
                this.counties = res.data;
                self.countrys = _.find(this.counties, function (o: any) { return (o.countryname == AppConstant.API_CONFIG.SELECTEDCOUNTRY) })
              }
              this.viewproduct();
            });

        }
      });
    this.featuresService.getcodemasterList({ type: 'CONTACT_TYPE' })
      .then((res) => {
        if (res.status) {
          this.codemasterslist = res.data;
          this.contactslist = this.masterservice.formatDataforDropdown('name',
            res.data, PrimengConstant.COMMON.DROPDOWNS.SELCT_CONTACT_TYPE);
          if(! _.isEmpty(this.CustomerorVendor) )
          {
            this.setCustomerorVendor();
          }
        }
      });
    this.loadindustry();
    setTimeout(() => {
      // this.viewproduct()
    }, 1000);
  }
  setCustomerorVendor()
  {
    var contacttype = _.find(this.contactslist,{ 'label' : this.CustomerorVendor });
            if(! _.isEmpty(contacttype) )
            {
              this.par.controls.contactype.setValue(contacttype.value);
              this.setContactType(contacttype);
              this.setcontactCategory();
            }
  }
  checkbox() {

    if (this.par['controls'].agreed.value) {
      this.par.controls.shipaddress.setValue(this.par.getRawValue().billaddress);
      this.par.controls.shipzipcode.setValue(this.par.getRawValue().billzipcode);
      this.par.controls.shipcountryname.setValue(this.par.getRawValue().billcountryname);
      this.checkstate = this.par.getRawValue().billstatename;
      this.shipstates = this.billstates;
      this.par.controls.shipstatename.setValue(this.checkstate);
      this.checkstates = this.par.getRawValue().billcityname;
      this.shipcities = this.billcities;
      this.par.controls.shipcityname.setValue(this.checkstates);
    } else {

    }
  }
  loadcountry() {
    this.countrys = [];
    var self = this;
    this.commonservice.FindAllCountry({})
      .then((res) => {
        if (res.status) {
          this.counties = res.data;
          self.countrys = _.find(this.counties, function (o: any) { return (o.countryname == AppConstant.API_CONFIG.SELECTEDCOUNTRY) })
          this.loadstate(self.countrys, '');
          // self.countrys = self.masterservice.formatDataforDropdown('countryname',this.selected,  PrimengConstant.COMMON.DROPDOWNS.SELCT_COUNTRY);
        }
      });
  }
  loadstate(selectcountry, mode) {
    if (!_.isEmpty(selectcountry)) {
      return this.commonservice.FindAllState({ countryname: selectcountry.countryname })
        .then((res) => {
          console.log(res.data)
          if (res.status) {
            this.billstates = this.masterservice.formatDataforDropdown('statename', res.data, PrimengConstant.COMMON.DROPDOWNS.SELCT_STATE);
            this.shipstates = this.masterservice.formatDataforDropdown('statename', res.data, PrimengConstant.COMMON.DROPDOWNS.SELCT_STATE);

          }
          else {
            if (mode == 'B') {
              this.billstates = [];
              this.billcities = [];
            }
            else if (mode == 'S') {
              this.shipstates = [];
              this.shipcities = [];
            }
            this.billstates = [];
            this.billcities = [];
            this.shipstates = [];
            this.shipcities = [];
          }
        });
    }


  }
  loadindustry() {
    this.industries = [];
    var self = this;
    this.commonservice.FindAllIndustryType({})
      .then((res) => {
        if (res.status) {
          var industry = res.data;
          self.industries = self.masterservice.formatDataforDropdown('industryname', industry, PrimengConstant.COMMON.DROPDOWNS.SELCT_INDUSTRY);
        }
      });
  }

  loadcities(selectstate, mode): Promise<any> {
    return this.commonservice.FindAllCity({ stateid: selectstate.value.stateid })
      .then((res) => {
        if (res.status) {
          if (mode == 'B') {
            this.billcities = [];
            this.billcities = this.masterservice.formatDataforDropdown('cityname', res.data, PrimengConstant.COMMON.DROPDOWNS.SELCT_CITY);
          }
          else if (mode == 'S') {
            this.shipcities = [];
            this.shipcities = this.masterservice.formatDataforDropdown('cityname', res.data, PrimengConstant.COMMON.DROPDOWNS.SELCT_CITY);
          }
        } else {
          if (mode == 'B') {
            this.billcities = [];
          }
          else if (mode == 'S') {
            this.shipcities = [];
          }
        }
      });

  }
  clearform() {
    // this.disabled=false;
    this.par.reset();
    this.buttonText = PrimengConstant.COMMON.BUTTON_TXT.SAVE;
  }

  callParent(data) {
    this.notifyNewProduct.next(data);
  }
  viewproduct() {
    if (!_.isEmpty(this.partiesdetails)) {
      this.buttonText = PrimengConstant.COMMON.BUTTON_TXT.UPDATE;
      this.partiesdetails.contactid = this.partiesdetails.contactid;
      var self = this;
      this.selected = this.countrys
      this.selectedgroup = _.find(self.groups, { value: { subaccheadid: self.partiesdetails.accheadid } });
      this.selectedAccountType = _.find(self.codemasterslist, { name: this.partiesdetails.contactype });
      this.selectedcountrydetails = this.selected.countryname;
      this.selectedshipcountrydetails = this.selected.countryname;
      this.selectedindustry = _.find(self.industries, { value: { industryid: self.partiesdetails.industryid } });
      this.selectedcontacttype = this.partiesdetails.contactype;
      this.selectedledgerData = this.partiesdetails.ledger;
      var ob_crdr = 'C';
      var openingbalance = 0;
      if (this.selectedledgerData.crdr != undefined) {
        ob_crdr = this.selectedledgerData.crdr;
        openingbalance = this.selectedledgerData.openingbalance;
      }
      this.CustomerorVendor = this.partiesdetails.contactype;
      var contactcategory= _.isEmpty(this.partiesdetails.contactcategory) ?  "B2B" : this.partiesdetails.contactcategory;
      this.contactcategory = contactcategory;
      
      this.par = new FormGroup({
        'firstname': new FormControl(this.partiesdetails.firstname, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        'companyname': new FormControl(this.partiesdetails.companyname, Validators.required),
        'contactype': new FormControl(this.selectedAccountType, Validators.required),
        'emailid': new FormControl(this.partiesdetails.emailid, [Validators.pattern('([a-z0-9&_\.-]*[@][a-z0-9]+((\.[a-z]{2,3})?\.[a-z]{2,3}))')]),
        'mobileno': new FormControl(this.partiesdetails.mobileno, [Validators.required, Validators.minLength(10), Validators.maxLength(20)]),
        'billaddress': new FormControl(this.partiesdetails.billaddress, [Validators.minLength(10), Validators.maxLength(150)]),
        'billcityname': new FormControl(null),
        'billstatename': new FormControl(null),
        'billcountryname': new FormControl(_.isEmpty(this.selectedcountrydetails) ? null : this.selectedcountrydetails.value),
        'billzipcode': new FormControl(this.partiesdetails.billzipcode, [Validators.minLength(4), Validators.maxLength(6)]),
        'shipaddress': new FormControl(this.partiesdetails.shipaddress, [Validators.minLength(10), Validators.maxLength(150)]),
        'shipcityname': new FormControl(null),
        'shipstatename': new FormControl(null),
        'shipcountryname': new FormControl(_.isEmpty(this.selectedshipcountrydetails) ? null : this.selectedshipcountrydetails.value),
        'shipzipcode': new FormControl(this.partiesdetails.shipzipcode, [Validators.minLength(4), Validators.maxLength(6)]),
        'cntctdeprtmnt': new FormControl(this.partiesdetails.cntctdeprtmnt, [Validators.minLength(3), Validators.maxLength(50)]),
        'cntctdesignation': new FormControl(this.partiesdetails.cntctdesignation, [Validators.minLength(3), Validators.maxLength(50)]),
        'socialids': new FormControl(this.partiesdetails.socialids, [Validators.minLength(5), Validators.maxLength(50), Validators.pattern('((?:https?\:\/\/|www\.)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)')]),
        'industryname': new FormControl(_.isEmpty(this.selectedindustry) ? null : this.selectedindustry.value),
        'gstno': new FormControl(this.partiesdetails.gstno, [Validators.required,Validators.minLength(3), Validators.maxLength(15)]),
        'status': new FormControl(this.partiesdetails.status),
        'agreed': new FormControl(null),
        'openingbalance': new FormControl(openingbalance, Validators.required),
        'ob_crdr': new FormControl(ob_crdr, Validators.required),
        'contactcategory' : new FormControl(contactcategory),
        //  'openingbalance': new FormControl(this.partiesdetails.ledger.openingbalance, Validators.required)
       
      })
      this.setcontactCategory();
      if (!_.isEmpty(this.partiesdetails.ledger)) {
        this.par.controls['openingbalance'].setValue(this.partiesdetails.ledger.openingbalance);
      }
      if (this.selectedcountrydetails) {
        this.loadstate(this.selectedcountrydetails, 'B').then(() => {
          let selectedstatebdetails = _.find(this.billstates, { value: { stateid: this.partiesdetails.billstateid } });
          if (!_.isEmpty(selectedstatebdetails)) {
            this.selectedstatebdetails = selectedstatebdetails;
            this.par.controls['billstatename'].setValue(selectedstatebdetails.value);
            this.loadcities(this.selectedstatebdetails, 'B').then(() => {
              let selectedcitybdetails = _.find(this.billcities, { value: { cityid: this.partiesdetails.billcityid } });
              if (!_.isEmpty(selectedcitybdetails)) {
                this.par.controls['billcityname'].setValue(selectedcitybdetails.value);
              }
            })
          }
        })
        this.loadstate(this.selectedshipcountrydetails, 'S').then(() => {
          let selectedstatesdetails = _.find(this.shipstates, { value: { stateid: this.partiesdetails.shipstateid } });
          this.selectedstatesdetails = selectedstatesdetails;
          if (!_.isEmpty(selectedstatesdetails)) {

            this.par.controls['shipstatename'].setValue(selectedstatesdetails.value);
            this.loadcities(this.selectedstatesdetails, 'S').then(() => {
              let selectedcitysdetails = _.find(this.shipcities, { value: { cityid: this.partiesdetails.shipcityid } });
              if (!_.isEmpty(selectedcitysdetails)) {
                this.par.controls['shipcityname'].setValue(selectedcitysdetails.value);
              }
            });
          }

        })
      }
    }
  }

  save(data) {
    if (this.par.status == 'INVALID') {
      var errorMessage = this.masterservice.getFormErrorMessage(this.par, this.formObj);
      this.messageService.showMessage({ severity: 'error', summary: 'Error', detail: errorMessage });
      return false;
    }
    if(data.contactcategory == PrimengConstant.COMMON.VENDOR)
    {
      data.contactcategory = "";
    }
    var comname = (data.contactcategory == 'B2C') ? data.firstname : data.companyname;
    this.formdata = {
      // 'contactid': this.partiesdetails.contactid,
      'tenantid': this.userdetails.tenantid,
      'tenantname': this.userdetails.tenantname,
      'accheadid': this.selectedAccountType.subaccheadid,
      'accheadname': this.selectedAccountType.subaccheadname,
      'firstname': data.firstname,
      'lastname': '',
      'companyname': comname,
      'emailid': data.emailid,
      'mobileno': data.mobileno,
      'billaddress': _.isEmpty(data.billaddress) ? null : data.billaddress,
      'billcityid': _.isEmpty(data.billcityname) ? null : data.billcityname.cityid,
      'billcityname': _.isEmpty(data.billcityname) ? null : data.billcityname.cityname,
      'billstateid': _.isEmpty(data.billstatename) ? null : data.billstatename.stateid,
      'billstatename': _.isEmpty(data.billstatename) ? null : data.billstatename.statename,
      'billcountryid': _.isEmpty(data.billcountryname) ? null : data.billcountryname.countryid,
      'billcountryname': _.isEmpty(data.billcountryname) ? null : data.billcountryname.countryname,
      'billzipcode': _.isEmpty(data.billzipcode) ? null : data.billzipcode,
      'shipaddress': _.isEmpty(data.shipaddress) ? null : data.shipaddress,
      'shipcityid': _.isEmpty(data.shipcityname) ? null : data.shipcityname.cityid,
      'shipcityname': _.isEmpty(data.shipcityname) ? null : data.shipcityname.cityname,
      'shipstateid': _.isEmpty(data.shipstatename) ? null : data.shipstatename.stateid,
      'shipstatename': _.isEmpty(data.shipstatename) ? null : data.shipstatename.statename,
      'shipcountryid': _.isEmpty(data.shipcountryname) ? null : data.shipcountryname.countryid,
      'shipcountryname': _.isEmpty(data.shipcountryname) ? null : data.shipcountryname.countryname,
      'shipzipcode': _.isEmpty(data.shipzipcode) ? null : data.shipzipcode,
      'cntctdeprtmnt': _.isEmpty(data.cntctdeprtmnt) ? null : data.cntctdeprtmnt,
      'cntctdesignation': _.isEmpty(data.cntctdesignation) ? null : data.cntctdesignation,
      'socialids': _.isEmpty(data.socialids) ? null : data.socialids,
      'TYPE': 'Party',
      'industryid': _.isEmpty(data.industryname) ? null : data.industryname.industryid,
      'industryname': _.isEmpty(data.industryname) ? null : data.industryname.industryname,
      'status': data.status,
      'lastupdatedby': this.userdetails.loginname,
      'lastupdateddt': this.currentDateStr,
      'gstno': _.isEmpty(data.gstno) ? null : data.gstno,
      // 'tinno': _.isEmpty(data.tinno) ? null : data.tinno,
      'ccyid': _.isEmpty(data.ccyid) ? null : data.ccyid,
      'ccyname': _.isEmpty(data.ccyname) ? null : data.ccyname,
      'paymenttermid': _.isEmpty(data.paymenttermid) ? null : data.paymenttermid,
      'paymentterms': _.isEmpty(data.paymentterms) ? null : data.paymentterms,
      'contactype': this.selectedcontacttype,
      'openingbalance': data.openingbalance,
      'opencrdr': data.ob_crdr,
      'contactcategory' : data.contactcategory,
      'finyear': this.finyear,
      'ALIE': this.selectedAccountType.ALIE
    }
    if (this.partiesdetails) {
      this.formdata.contactid = this.partiesdetails.contactid;
      this.formdata.status = data.status;
      if (!_.isEmpty(this.partiesdetails.ledger)) {

        this.formdata.ledger = this.partiesdetails.ledger;
      }
      this.partiesservice.update(this.formdata)
        .then((res) => {
          if (res.status == true) {
            this.messageService.showMessage({ severity: 'success', summary: 'Success ', detail: res.message });
            this.callParent(res.message);
            this.clearform();
          }
          else if (res.status == false) {
            // this.clearform();
            this.messageService.showMessage({ severity: 'error', summary: 'Error ', detail: res.message });
          }
        });
    }
    else {
      this.formdata.createddt = this.currentDateStr;
      this.formdata.createdby = this.userdetails.loginname;
      this.formdata.status = 'Active';
      this.partiesservice.create(this.formdata)
        .then((res) => {
          if (res.status == true) {
            if(! this.openedfromothers)
            {
              this.messageService.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
            }
            this.callParent(res.data);
            this.clearform();
          }
          else if (res.status == false) {
            //  this.clearform();
            this.messageService.showMessage({ severity: 'error', summary: 'Error ', detail: res.message });
          }
        });
    }

  }
  setContactType(event) {
    this.selectedcontacttype = event.value.name;
    if(this.group != undefined)
    {
      this.selectedAccountType = _.find(this.group, { subaccheadname: event.value.groupname });
    }
    if (event.value.name === PrimengConstant.COMMON.VENDOR) {
      $('.gstcontainer').removeClass('required');
      this.contactcategory = "";
      this.par.controls['gstno'].setValidators([Validators.minLength(3), Validators.maxLength(15)]);
      this.CustomerorVendor = PrimengConstant.COMMON.VENDOR;
      this.par.controls['ob_crdr'].setValue("C");
      this.par.controls['companyname'].enable();
    } else {
      this.CustomerorVendor = PrimengConstant.COMMON.CUSTOMER;
      if(this.contactcategory == "" && this.ext_customerCategory != "B2C")
      {
        this.contactcategory = "B2B";
      }
      this.par.controls['contactcategory'].setValue(this.contactcategory);
      this.par.controls['ob_crdr'].setValue("D");
    }
    this.par.controls['gstno'].updateValueAndValidity();
  }
  onchangeCategory(event)
  {
    setTimeout(() => {
      console.log(event);
      console.log(this.par.controls['contactcategory']);
      this.contactcategory = this.par.controls['contactcategory'].value;
      this.setcontactCategory();
    }, 100);
   
  }
  setcontactCategory()
  {
    if(this.CustomerorVendor == "Vendor")
    {
        $('.gstcontainer').removeClass('required');
        this.par.controls['gstno'].setValidators([Validators.minLength(3), Validators.maxLength(15)]);
    }
    else
    {
      if(this.contactcategory == "B2B")
      {
        $('.gstcontainer').addClass('required');
        this.par.controls['companyname'].enable();
        this.par.controls['gstno'].setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(15)]);
      }
      else if(this.contactcategory == "B2C")
      {
        this.par.controls['companyname'].disable();
        $('.gstcontainer').removeClass('required');
        this.par.controls['gstno'].setValidators([Validators.minLength(3), Validators.maxLength(15)]);
      }
    }
    this.par.controls['contactcategory'].setValue(this.contactcategory);
    this.par.controls['gstno'].updateValueAndValidity();
  }
  getcrdrLabel(item)
  {
    var label = "";
    if(item.label != undefined)
    {
      if(item.label == "C")
      {
        label = "Credit";
      }
      else  if(item.label == "D")
      {
        label = "Debit";
      }
    }
    return label;
  }
}
