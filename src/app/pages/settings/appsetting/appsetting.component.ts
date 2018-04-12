/*
PROJECT : eFinance
MODULE: App Setting
PURPOSE: To customize the application preferences
AUTHOR: Reshma R
SERVICE: WEB
CREATED DATE: 27-10-2017
STATUS: Functionalities Added
ENVIRONMENT: WEB
*/
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FeaturesService } from '../../../services/features.service';
import { MasterService } from '../../../services/master.service';
import { OrganizationSettingsService } from '../services/organization-settings.service';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AppConstant } from '../../../app.constant';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { MessagesService } from '../../../shared/messages.service';
import { PrimengConstant } from '../../../app.primeconfig';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
import { DateformatPipe } from './../../../pipes/dateformat.pipe';
@Component({
  selector: 'app-appsetting',
  templateUrl: './appsetting.component.html',
  styleUrls: ['./appsetting.component.scss']
})
export class AppsettingComponent implements OnInit, OnDestroy {
  placeofsupplies: any = [];
  disabled: boolean = true;
  localStorageDetails: any;
  Details: any = {};
  decimals: any;
  time: any;
  dateFormats: any;
  dateformatValue: any;
  decimalValue: any;
  fin_year: any;
  formdata: any = {};
  finyearlist: any = [];
  currency: any = [];
  prevfinyearlist: any = [];
  settinglist: any[] = [];
  settingList: any = [];
  SettingObj = {};
  hotkeyClose: Hotkey | Hotkey[];
  hotkeySave: Hotkey | Hotkey[];
  currentDateStr: any;
  constructor(private formbuilder: FormBuilder, private localStorageService: LocalStorageService, private featureservice: FeaturesService,
    private masterservice: MasterService,
    private organisationsettingservice: OrganizationSettingsService,
    private messageService: MessagesService, private router: Router, private _hotkeysService: HotkeysService,
    private dateFormatPipeFilter: DateformatPipe
  ) {
    this.currentDateStr= this.dateFormatPipeFilter.transform(new Date(), AppConstant.API_CONFIG.ANG_DATE.apiTSFormat);
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeyClose = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['getstarted']);
      return false;
    }, [], shrtkeys.COMMON.CLOSE.TXT));

    this.hotkeySave = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.SAVE.KEY, (event: KeyboardEvent): boolean => {
      this.update(this.settingList);
      return false;
    }, [], shrtkeys.COMMON.SAVE.TXT));
  }
  ngOnInit() {
    this.localStorageDetails = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.showDetails();
    this.timezones();
    this.placeOfsupply();
    this.DecimalValues();
    this.dateFormat();
    this.financialYear();
    this.currencyList();
  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyClose);
    this._hotkeysService.remove(this.hotkeySave);
  }
  getsettingLabels(settingname)
  {
    var label=settingname;
    switch (_.trim( _.upperCase(settingname ) )) {
      case "CINNO": {
        label = "CIN NO";
        break;
      }
      case "GSTIN": {
        label = "GST NO";
        break;
      }
      case "PLACE OF SUPPLY": {
        label = "Place of Origin";
        break;
      }
    }
    return label;
  }
  edit(exis_data) {
    this.disabled = !this.disabled;
    for (var i = 0; i < exis_data.length; i++) {
      if (exis_data[i].settingref == 'DATE_FORMAT') {
        this.settingList.DATE_FORMAT = exis_data[i].settingvalue;
        this.settingList.DATE_FORMAT_ID = exis_data[i].settingid;
      } if (exis_data[i].settingref == 'PLACE_OF_SUPPLY') {
        this.settingList.PLACE_OF_SUPPLY = exis_data[i].settingvalue;
        this.settingList.PLACE_OF_SUPPLY_ID = exis_data[i].settingid;
      } if (exis_data[i].settingref == 'CUR_FIN_YR') {
        this.settingList.CUR_FIN_YR = exis_data[i].settingvalue;
        this.settingList.CUR_FIN_YR_ID = exis_data[i].settingid;
      }
      //  if (exis_data[i].settingref == 'PREV_FIN_YR') {
      //   this.settingList.PREV_FIN_YR = exis_data[i].settingvalue;
      //   this.settingList.PREV_FIN_YR_ID = exis_data[i].settingid;
      // }
      if (exis_data[i].settingref == 'GST') {
        this.settingList.GST = exis_data[i].settingvalue;
        this.settingList.GST_ID = exis_data[i].settingid;
      } if (exis_data[i].settingref == 'CIN') {
        this.settingList.CIN = exis_data[i].settingvalue;
        this.settingList.CIN_ID = exis_data[i].settingid;
      } if (exis_data[i].settingref == 'TIME_ZONE') {
        this.settingList.TIME_ZONE = exis_data[i].settingvalue;
        this.settingList.TIME_ZONE_ID = exis_data[i].settingid;
      }
      //  if (exis_data[i].settingref == 'CURRENCY') {
      //   this.settingList.CURRENCY = exis_data[i].settingvalue;
      //   this.settingList.CURRENCY_ID = exis_data[i].settingid;
      // } 
      if (exis_data[i].settingref == 'NO_OF_DECIMAL_PNT') {
        this.settingList.NO_OF_DECIMAL_PNT = exis_data[i].settingvalue;
        this.settingList.NO_OF_DECIMAL_PNT_ID = exis_data[i].settingid;
      } if (exis_data[i].settingref == 'PAY_TERMS') {
        this.settingList.PAY_TERMS = exis_data[i].settingvalue;
        this.settingList.PAY_TERMS_ID = exis_data[i].settingid;
      }
    }
  }
  placeOfsupply() {
    this.placeofsupplies = [];
    this.featureservice.getcodemasterList({ type: 'pos' }).then(res => {
      if (res.status) {
        this.placeofsupplies.push({ label: 'Select Place of Supply', value: null });
        for (var i = 0; i < res.data.length; i++) {
          this.placeofsupplies.push({
            label: res.data[i].name, value: res.data[i].name
          });
        }
      }
    }, error => {
      console.log('service error');
    });
  }
  timezones() {
    this.masterservice.timeZoneGetAll({}).then(res => {
      if (res.status) {
        this.time = [];
        for (var i = 0; i < res.data.length; i++) {
          this.time.push({
            label: res.data[i].id, value: res.data[i].id
          });
        }
      }
    }, error => {
      console.log('service error');
    });

  }
  currencyList() {
    this.masterservice.currencyGetAll({}).then(res => {
      if (res.status) {
        this.currency = [];
        for (var i = 0; i < res.data.length; i++) {
          this.currency.push({
            label: res.data[i].ccyname + ' (' + res.data[i].ccycode + ')', value: res.data[i].ccycode
          });
        }
      }
    }, error => {
      console.log('service error');
    });

  }
  DecimalValues() {
    this.decimalValue = AppConstant.API_CONFIG.DECIMAL_PLACES;
    this.decimals = [];
    for (var i = 0; i < this.decimalValue.length; i++) {
      this.decimals.push({
        label: this.decimalValue[i].places, value: this.decimalValue[i].places
      });
    }
  }
  financialYear() {
    this.fin_year = AppConstant.API_CONFIG.FINYEARS;
    this.finyearlist = [];
    this.prevfinyearlist = [];
    for (var i = 0; i < this.fin_year.length; i++) {
      this.finyearlist.push({
        label: this.fin_year[i].finyear, value: this.fin_year[i].finyear
      });
    }
    for (var j = 0; j < this.fin_year.length; j++) {
      this.prevfinyearlist.push({
        label: this.fin_year[j].prevfinyear, value: this.fin_year[j].prevfinyear
      });
    }

  }
  dateFormat() {
    this.dateformatValue = AppConstant.API_CONFIG.DATE_FORMATS;
    this.dateFormats = [];
    for (var i = 0; i < this.dateformatValue.length; i++) {
      this.dateFormats.push({
        label: this.dateformatValue[i].format, value: this.dateformatValue[i].format
      });
    }
  }
  toggleDisabled() {
    this.disabled = !this.disabled;
  }
  formObj: any = {
    'gstno': PrimengConstant.APP_SETTING.GST_NO,
  }
  update(newData) {
    this.formdata = {
      'tenantid': this.localStorageDetails.tenantid,
      'status': 'Active',
      'lastupdatedby': this.localStorageDetails.loginname,
      'lastupdateddt': this.currentDateStr,
      'settings': [
        {
          'tenantid': this.localStorageDetails.tenantid,
          'settingid': newData.TIME_ZONE_ID,
          'settingref': 'TIME_ZONE',
          'settingname': 'Time Zone',
          'settingvalue': newData.TIME_ZONE,
          'lastupdatedby': this.localStorageDetails.loginname,
          'status': 'Active',
          'lastupdateddt': this.currentDateStr
        },
        {
          'tenantid': this.localStorageDetails.tenantid,
          'settingid': newData.DATE_FORMAT_ID,
          'settingref': 'DATE_FORMAT',
          'settingname': 'Date Format',
          'settingvalue': newData.DATE_FORMAT,
          'lastupdatedby': this.localStorageDetails.loginname,
          'status': 'Active',
          'lastupdateddt': this.currentDateStr
        },
        {
          'tenantid': this.localStorageDetails.tenantid,
          'settingid': newData.NO_OF_DECIMAL_PNT_ID,
          'settingref': 'NO_OF_DECIMAL_PNT',
          'settingname': 'Number of decimal point',
          'settingvalue': newData.NO_OF_DECIMAL_PNT,
          'lastupdatedby': this.localStorageDetails.loginname,
          'status': 'Active',
          'lastupdateddt': this.currentDateStr
        },
        {
          'tenantid': this.localStorageDetails.tenantid,
          'settingid': newData.CUR_FIN_YR_ID,
          'settingref': 'CUR_FIN_YR',
          'settingname': 'Current Financial Year',
          'settingvalue': newData.CUR_FIN_YR,
          'lastupdatedby': this.localStorageDetails.loginname,
          'status': 'Active',
          'lastupdateddt': this.currentDateStr
        },
        // {
        //   'tenantid': this.localStorageDetails.tenantid,
        //   'settingid': newData.PREV_FIN_YR_ID,
        //   'settingref': 'PREV_FIN_YR',
        //   'settingname': 'Previous Financial Year',
        //   'settingvalue': newData.PREV_FIN_YR,
        //   'lastupdatedby': this.localStorageDetails.loginname,
        //   'status': 'Active',
        //   'lastupdateddt':this.currentDateStr
        // },
        {
          'tenantid': this.localStorageDetails.tenantid,
          'settingid': newData.GST_ID,
          'settingref': 'GST',
          'settingname': 'GSTNO',
          'settingvalue': newData.GST ? newData.GST : '',
          'lastupdatedby': this.localStorageDetails.loginname,
          'status': 'Active',
          'lastupdateddt': this.currentDateStr
        }, {
          'tenantid': this.localStorageDetails.tenantid,
          'settingid': newData.CIN_ID,
          'settingref': 'CIN',
          'settingname': 'CINNO',
          'settingvalue': newData.CIN ? newData.CIN : '',
          'lastupdatedby': this.localStorageDetails.loginname,
          'status': 'Active',
          'lastupdateddt': this.currentDateStr
        },
        // {
        //   'tenantid': this.localStorageDetails.tenantid,
        //   'settingid': newData.CURRENCY_ID,
        //   'settingref': 'CURRENCY',
        //   'settingname': 'Currency',
        //   'settingvalue': newData.CURRENCY,
        //   'lastupdatedby': this.localStorageDetails.loginname,
        //   'status': 'Active',
        //   'lastupdateddt': this.currentDateStr
        // },
        {
          'tenantid': this.localStorageDetails.tenantid,
          'settingid': newData.PLACE_OF_SUPPLY_ID,
          'settingref': 'PLACE_OF_SUPPLY',
          'settingname': 'Place Of Origin',
          'settingvalue': newData.PLACE_OF_SUPPLY,
          'lastupdatedby': this.localStorageDetails.loginname,
          'status': 'Active',
          'lastupdateddt': this.currentDateStr
        },
        {
          'tenantid': this.localStorageDetails.tenantid,
          'settingid': newData.PAY_TERMS_ID,
          'settingref': 'PAY_TERMS',
          'settingname': 'Payment terms',
          'settingvalue': newData.PAY_TERMS,
          'lastupdatedby': this.localStorageDetails.loginname,
          'status': 'Active',
          'lastupdateddt': this.currentDateStr
        }
      ]

    }
    this.organisationsettingservice.Updatesetting(this.formdata).then(
      res => {
        if (res.status) {
          var app_settings: any = _.groupBy(this.formdata.settings, (d: any) => { return d.settingref });
          this.localStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.APPSETTING, this.formdata);
          var finyear = _.find(AppConstant.API_CONFIG.FINYEARS, { 'finyear': app_settings.CUR_FIN_YR[0].settingvalue });
          this.localStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR, finyear);
          this.localStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.RESOURCE, finyear);
          this.messageService.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
          this.toggleDisabled();
          this.showDetails();
        }
        else {
          this.messageService.showMessage({ severity: 'error', summary: 'Error ', detail: res.message });
        }
      },
      error => {
        console.log('service err');
        return false;
      })
  }

  close() {
    this.toggleDisabled();
    this.showDetails();
  }
  showDetails() {
    const data = {
      tenantid: this.localStorageDetails.tenantid,
      settingslist: ['GST', 'CIN', 'PLACE_OF_SUPPLY', 'CUR_FIN_YR']
    }
    this.organisationsettingservice.TenantSettingList(data)
      .then(
      res => {
        if (res.status) {
          this.settinglist[0] = _.find(res.data, { 'settingref': 'CIN' });
          this.settinglist[1] = _.find(res.data, { 'settingref': 'GST' });
          this.settinglist[2] = _.find(res.data, { 'settingref': 'PLACE_OF_SUPPLY' });
          this.settinglist[3] = _.find(res.data, { 'settingref': 'CUR_FIN_YR' });
        }
        else {
          this.settinglist = [];
        }

      },
      error => {
        console.log('service error');
      }
      )
  }
}

