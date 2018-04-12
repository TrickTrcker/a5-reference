import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BankService } from '../services/bank.service';
import { LocalStorageService } from '../../../../app/shared/local-storage.service';
import { AppConstant } from '../../../app.constant';
import { MasterService } from '../../../services/master.service';
import { Message } from 'primeng/primeng';
import { CommonService } from '../services/common.service';
import { UtilsService } from '../../../services/utils.service';
import { MessagesService } from '../../../shared/messages.service';
import { PrimengConstant } from '../../../app.primeconfig';
import { RadioButton } from 'primeng/primeng';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { DateformatPipe } from './../../../pipes/dateformat.pipe';
@Component({
  selector: 'app-addbank',
  templateUrl: './addbank.component.html',
  styleUrls: ['./addbank.component.scss']
})
export class AddbankComponent implements OnInit, OnDestroy {
  groups: any=[];
  finyear: any;
  public max30 = AppConstant.API_CONFIG.MAXLENGTH.MAX30;
  public max50 = AppConstant.API_CONFIG.MAXLENGTH.MAX50;
  public max11 = AppConstant.API_CONFIG.MAXLENGTH.MAX11;
  public amtlength = AppConstant.API_CONFIG.AMOUNTFORMAT.MAXLENGTH;
  localstorageDetails: any;
  bankDetails: any = {};
  selectedbank: any;
  selectedbankDetails: any;
  bankList: any = [];
  countryList: any = [];
  stateList: any = [];
  cityList: any = [];
  buttonText = 'Save';
  buttonclick = false;
  validation = 'true';
  validationmsg = '';
  msgs: Message[] = [];
  bankForm: FormGroup;
  bankname: FormControl;
  accountno: FormControl;
  ifsccode: FormControl;
  swiftcode: FormControl;
  branchname: FormControl;
  branchcode: FormControl;
  countryname: FormControl;
  statename: FormControl;
  cityname: FormControl;
  address: FormControl;
  zipcode: FormControl;
  allbanks: any[];
  formdata = {};
  Indate: any;
  selectstate: any[];
  selectcountry: any[];
  stateValue: any;
  changestatus: any[] = [];
  status: any = [];
  countries: any = [];
  hotkeySave: Hotkey | Hotkey[];
  crdr_opt = [
    {label: 'C', value: 'C'},
    {label: 'D', value: 'D'},
  ];
  @Input() banklist: any;
  @Input() openedfromothers: boolean = false;
  @Output() notifyNewBank: EventEmitter<any> = new EventEmitter();

  formObj: any = {
    bankname: PrimengConstant.BANK.ADDEDITFORM.BANK_NAME,
    accountno: PrimengConstant.BANK.ADDEDITFORM.ACC_NO,
    ifsccode: PrimengConstant.BANK.ADDEDITFORM.IFSC_CODE,
    openingbalance: PrimengConstant.BANK.ADDEDITFORM.OPEN_BAL,
    ob_crdr :  PrimengConstant.BANK.ADDEDITFORM.OB_CRDR,
  }
  currentDateStr: any;
  constructor(private formbuilder: FormBuilder,
    private bankservice: BankService,
    private localstorageservice: LocalStorageService,
    private masterservice: MasterService,
    private commonservice: CommonService,
    private UtilsService: UtilsService,
    private messageService: MessagesService,
    private _hotkeysService: HotkeysService,
    private dateFormatPipeFilter: DateformatPipe ) {
    this.currentDateStr= this.dateFormatPipeFilter.transform(new Date(), AppConstant.API_CONFIG.ANG_DATE.apiTSFormat);
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeySave = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.SAVE.KEY, (event: KeyboardEvent): boolean => {
      this.formsubmit(this.bankForm.value)
      return false;
    }, [], shrtkeys.COMMON.SAVE.TXT));
    this.finyear = this.localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR).finyear;
    this.localstorageDetails = this.localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.bankForm = formbuilder.group({
      'bankname': [null, Validators.required],
      'accountno': [null, Validators.required],
      'ifsccode': [null, Validators.required],
      'openingbalance': [0, Validators.required],
      'ob_crdr': ['D', Validators.required],
      'swiftcode': [null],
      'branchname': [null],
      'branchcode': [null],
      'countryname': [null],
      'statename': [null],
      'cityname': [null],
      'zipcode': [null],
      'address': [null],
      'status': [null]
    })
    this.status = AppConstant.API_CONFIG.status;
    for (var i = 0; i < this.status.length; i++) {
      this.changestatus.push({
        label: this.status[i].stat, value: this.status[i].stat
      });
    }
  }
  callParent(data) {
    this.notifyNewBank.next(data);
  }
  numberOnly(event) {
    this.UtilsService.allowNumberOnly(event);
  }
  ngOnInit() {
    this.buttonText = 'Save';
    // this.findAllBanks();
    this.loadcountries();
    this.commonservice.FindAllGroups({ mbankshowyn: 'Y', status: 'Active' })
      .then((res) => {
        if (res.status) {
          this.groups = res.data;
        }
      });
    var dateS = [];
    var today = new Date().toISOString()
    this.Indate = formatDate(today);
    function formatDate(date) {
      if (date) {
        dateS = date.split('-');
        var d = new Date();
        d.setMonth(dateS[1]);
        d.setFullYear(dateS[0]);
        d.setDate(parseInt(dateS[2]));
        var
          month = '' + (d.getMonth()),
          day = '' + d.getDate(),
          year = d.getFullYear();
        if (month.length < 2)
          month = '0' + month;
        if (day.length < 2)
          day = '0' + day;
        return [year, month, day].join('-');
      }
    }
    setTimeout(() => {
      this.update()
    }, 1000);
  }
  childEvent(data, bankDetails) {
  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeySave);
  }
  loadcountries() {
    this.countryList = [];
    var self = this;
    this.commonservice.FindAllCountry({})
      .then((res) => {
        if (res.status) {
          this.countries = res.data;
          self.countryList = self.masterservice.formatDataforDropdown('countryname', this.countries, PrimengConstant.COMMON.DROPDOWNS.SELCT_COUNTRY);
        }
      });
  }
  loadstates(selectcountry): Promise<any> {
    if (!_.isEmpty(selectcountry)) {
      this.stateList = [];
      var self = this;
      return this.commonservice.FindAllState({ countryname: selectcountry })
        .then((res) => {
          if (res.status) {
            var state = res.data;
            self.stateList = self.masterservice.formatDataforDropdown('statename', state, PrimengConstant.COMMON.DROPDOWNS.SELCT_STATE);
          }
        });
    }
  }
  loadcities(selectstate): Promise<any> {
    this.cityList = [];
    var self = this;
    return this.commonservice.FindAllCity({ stateid: selectstate })
      .then((res) => {
        if (res.status) {
          var city = res.data;
          self.cityList = self.masterservice.formatDataforDropdown('cityname', city, PrimengConstant.COMMON.DROPDOWNS.SELCT_CITY);
        }

      });
  }
  // findAllBanks(): Promise<any> {
  //   var bankList = [];
  //   var self = this;
  //   return this.bankservice.getAllBanks({ accheadslist: ['BANK BALANCES'] })
  //     .then((res) => {
  //       if (res.status) {
  //         this.bankList = [];
  //         this.bankList.push({ label: PrimengConstant.COMMON.DROPDOWNS.SELCT_BANK, value: null });
  //         for (var i = 0; i < res.data.length; i++) {
  //           this.bankList.push({
  //             label: res.data[i].subaccheadname, value: {
  //               bankname: res.data[i].subaccheadname,
  //               bankcode: res.data[i].subaccheadid,
  //               data: res.data[i]
  //             }
  //           });
  //         }
  //       }
  //     });
  // }
  clearform() {
    this.bankForm.reset();
    this.bankForm.controls["ob_crdr"].setValue("D");
    this.bankForm.controls["openingbalance"].setValue(0);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('cheatsheet changes: ', changes);
    // this.banklist 
    if (changes.openedfromothers) {
      if (changes.openedfromothers.currentValue == true) {

      }
      else if (changes.openedfromothers.currentValue == false) {
        this.clearform();
      }
      console.log('openfrom changes: ', changes);
    }
  }
  oncountryChange(selectcountry) {
    this.selectcountry = _.isEmpty(selectcountry) ? null : selectcountry.countryname;
    this.loadstates(this.selectcountry);
  }
  onstateChange(statechange) {
    this.selectstate = _.isEmpty(statechange) ? null : statechange.stateid;
    this.loadcities(this.selectstate);
  }
  update() {
    //console.log(this.banklist.ledger.openingbalance);
    if (this.banklist.bankid) {
      this.buttonText = 'Update';
      var opencrdr = 'C';
      var openingbalance = 0;
      if (this.banklist.ledger.crdr != undefined) {
        opencrdr = this.banklist.ledger.crdr;
        openingbalance = this.banklist.ledger.openingbalance;
      }
      this.bankForm = new FormGroup({
        'bankname': new FormControl(null, Validators.required),
        'accountno': new FormControl(this.banklist.accountno, Validators.required),
        'ifsccode': new FormControl(this.banklist.ifsccode, Validators.required),
        'swiftcode': new FormControl(this.banklist.swiftcode),
        'branchname': new FormControl(this.banklist.branchname),
        'branchcode': new FormControl(this.banklist.branchcode),
        'countryname': new FormControl(null),
        'statename': new FormControl(null),
        'cityname': new FormControl(null),
        'zipcode': new FormControl(this.banklist.zipcode),
        'address': new FormControl(this.banklist.address),
        'status': new FormControl(this.banklist.status),
        'openingbalance': new FormControl(openingbalance),
        'ob_crdr': new FormControl(opencrdr, Validators.required),
      });
      this.bankForm.controls['bankname'].setValue(this.banklist.bankname);
      let filterValue: any = _.find(this.countryList, { value: { countryid: this.banklist.countryid } });
      let countryValue: any = _.find(this.countries, { countryid: this.banklist.countryid });
      if (!_.isEmpty(countryValue)) {
        this.bankForm.controls['countryname'].setValue(countryValue);
        this.loadstates(countryValue.countryname).then(() => {
          let stateValue: any = _.find(this.stateList, { value: { stateid: this.banklist.stateid, statename: this.banklist.statename } });
          this.stateValue = stateValue;
          if (!_.isEmpty(stateValue)) {
            this.bankForm.controls['statename'].setValue(stateValue.value);
          }
        })
        this.loadcities(this.stateValue).then(() => {
          let cityValue: any = _.find(this.cityList, { value: { cityid: this.banklist.cityid, cityname: this.banklist.cityname } });
          if (!_.isEmpty(cityValue)) {
            this.bankForm.controls['cityname'].setValue(cityValue.value);
          }
        })
      }
      // this.findAllBanks().then(() => {
      //   let bankValue: any = _.find(this.bankList, { value: { bankname: this.banklist.bankname, bankcode: this.banklist.bankcode } });

      // })

    }
  }

  formsubmit(data) {

    if (this.bankForm.status == 'INVALID') {
      var errorMessage = this.masterservice.getFormErrorMessage(this.bankForm, this.formObj);
      this.messageService.showMessage({ severity: 'error', summary: 'Error', detail: errorMessage });
      return false;
    }
    if (!_.isUndefined(this.banklist.bankid) && !_.isNull(this.banklist.bankid)) {
      this.formdata = {
        'bankid': this.banklist.bankid,
        'bankname': data.bankname.bankname,
        'bankcode': data.bankname.bankcode,
        'countryname': _.isEmpty(data.countryname) ? null : data.countryname.countryname,
        'countryid': _.isEmpty(data.countryname) ? null : data.countryname.countryid,
        'statename': _.isEmpty(data.statename) ? null : data.statename.statename,
        'stateid': _.isEmpty(data.statename) ? null : data.statename.stateid,
        'cityname': _.isEmpty(data.cityname) ? null : data.cityname.cityname,
        'cityid': _.isEmpty(data.cityname) ? null : data.cityname.cityid,
        'accountno': data.accountno,
        'ifsccode': data.ifsccode,
        'swiftcode': _.isEmpty(data.swiftcode) ? null : data.swiftcode,
        'branchname': _.isEmpty(data.branchname) ? null : data.branchname,
        'branchcode': _.isEmpty(data.branchcode) ? null : data.branchcode,
        'tenantid': this.localstorageDetails.tenantid,
        'tenantname': this.localstorageDetails.tenantname,
        'zipcode': _.isEmpty(data.zipcode) ? null : data.zipcode,
        'address': _.isEmpty(data.address) ? null : data.address,
        'status': data.status,
        'lastupdatedby': this.localstorageDetails.loginname,
        'lastupdateddt': this.currentDateStr,
        'openingbalance': this.bankForm.controls['openingbalance'].value,
        'opencrdr': data.ob_crdr,
        'accheadid': this.groups[0].subaccheadid,
        'accheadname': this.groups[0].subaccheadname,
        'finyear': this.finyear,
        'ledger': this.banklist.ledger,
        'ALIE': this.groups[0].ALIE
      }
      this.bankservice.updateBankDetails(this.formdata)
        .then((res) => {

          if (res.status == true) {
            this.messageService.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
            this.clearform();
            this.callParent(res.message);
          }
          else if (res.status == false) {
            this.messageService.showMessage({ severity: 'error', summary: 'Error ', detail: res.message });
          }
        });
    }
    else {
      this.formdata = {
        'bankname': data.bankname,
        //'bankcode': data.bankname.bankcode,
        'countryname': _.isEmpty(data.countryname) ? null : data.countryname.countryname,
        'countryid': _.isEmpty(data.countryname) ? null : data.countryname.countryid,
        'statename': _.isEmpty(data.statename) ? null : data.statename.statename,
        'stateid': _.isEmpty(data.statename) ? null : data.statename.stateid,
        'cityname': _.isEmpty(data.cityname) ? null : data.cityname.cityname,
        'cityid': _.isEmpty(data.cityname) ? null : data.cityname.cityid,
        'accountno': data.accountno,
        'ifsccode': data.ifsccode,
        'swiftcode': _.isEmpty(data.swiftcode) ? null : data.swiftcode,
        'branchname': _.isEmpty(data.branchname) ? null : data.branchname,
        'branchcode': _.isEmpty(data.branchcode) ? null : data.branchcode,
        'tenantid': this.localstorageDetails.tenantid,
        'tenantname': this.localstorageDetails.tenantname,
        'zipcode': _.isEmpty(data.zipcode) ? null : data.zipcode,
        'address': _.isEmpty(data.address) ? null : data.address,
        'status': 'Active',
        'createdby': this.localstorageDetails.loginname,
        'createddt': this.currentDateStr,
        'lastupdatedby': this.localstorageDetails.loginname,
        'lastupdateddt':this.currentDateStr,
        'openingbalance': data.openingbalance,
        'opencrdr': data.ob_crdr,
        'accheadid': this.groups[0].subaccheadid,
        'accheadname': this.groups[0].subaccheadname,
        'finyear': this.finyear,
        'ALIE': this.groups[0].ALIE
      }
      console.log(data.bankname);
      this.bankservice.saveBankDetails(this.formdata)
        .then((res) => {
          if (res.status == true) {
            if(! this.openedfromothers)
            {
              this.messageService.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
            }
            this.clearform();
            this.callParent(res.data);
          }
          else if (res.status == false) {
            this.messageService.showMessage({ severity: 'error', summary: 'Error ', detail: res.message });
            this.clearform();
          }
        });
    }
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