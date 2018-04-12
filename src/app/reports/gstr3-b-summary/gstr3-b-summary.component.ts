import { Component, OnInit, OnDestroy } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { PrimengConstant } from '../../app.primeconfig';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import { CurrencyPipe } from "@angular/common";
import { Location } from '@angular/common';

import { CommonService } from '../../services/common.service';
import { MasterService } from '../../services/master.service';
import { DateformatPipe } from '../../pipes/dateformat.pipe';
import { OrganizationSettingsService } from '../../services/organization-settings.service';
import { UtilsService } from '../../services/utils.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-gstr3-b-summary',
  templateUrl: './gstr3-b-summary.component.html',
  styleUrls: ['./gstr3-b-summary.component.scss']
})
export class Gstr3BSummaryComponent implements OnInit {
  private date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  datalist: any = [];
  data: any;
  localstorageDetails: any = {};
  finyear: any;
  currency_Symbol: string;
  selectedtrf: Array<any> = [];
  financialyearlist: any;
  fin_year: any;
  settinglist: any = [];
  selectedyr: any = [];
  selectedfinyear: any;
  placeoforigin: any;
  pos: any;
  outwardlist: any = [];
  startDate: Date;
  endDate: Date;
  inward: any;
  outward: any;
  gst2List: any;
  gst3List: any;
  get4List: any;
  currencyFilter: CurrencyPipe;
  constructor(private CommonService: CommonService,
    private router: Router,
    private location: Location,
    private dateformatpipe: DateformatPipe,
    private localStorageService: LocalStorageService,
    private organisationsettingservice: OrganizationSettingsService,
    private masterservice: MasterService,
    private UtilsService: UtilsService,
    private Router: Router) {
    this.localstorageDetails = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
    this.currencyFilter = new CurrencyPipe("en-in");
    this.placeoforigin = AppConstant.API_CONFIG.PLACEOFSUPPLYFORMAT;
    this.fin_year = AppConstant.API_CONFIG.FINYEARS;
    this.selectedyr = this.finyear;
    this.financialyearlist = this.masterservice.formatDataforDropdown('finyear', this.fin_year, null);
    const data = {
      tenantid: this.localstorageDetails.tenantid,
      settingref: this.placeoforigin
    }
    this.organisationsettingservice.TenantSettingList(data).then(
      res => {
        if (res.status) {
          this.settinglist = res.data;
          this.pos = this.settinglist[0].settingvalue;
        }
        this.pos = this.settinglist[0].settingvalue;
        this.getList(this.selectedyr);
        this.getGST2List(this.selectedyr);
        this.getGST3List(this.selectedyr);
        this.getGST4List(this.selectedyr);
      }

    )
  }

  getList(year) {
    this.selectedfinyear = year.finyear;
    var data = {
      type: "GSTR3_3_1",
      finyear: year.finyear,
      pos: this.pos,
      startdt: this.dateformatpipe.transform(this.startDate, 'yyyy-MM-dd'),
      enddt: this.dateformatpipe.transform(this.endDate, 'yyyy-MM-dd')
    }
    this.CommonService.getGSTRList(data).then((res) => {
      if (res.status) {
        this.datalist = res.data;
        // this.getInwardOutwardList(year);
      } else {
        this.datalist = [];
      }
    });
  }
  getGST2List(year) {
    this.selectedfinyear = year.finyear;
    var data = {
      type: "GSTR3_3_2",
      finyear: year.finyear,
      pos: this.pos,
      startdt: this.dateformatpipe.transform(this.startDate, 'yyyy-MM-dd'),
      enddt: this.dateformatpipe.transform(this.endDate, 'yyyy-MM-dd')
    }
    this.CommonService.getGSTRList(data).then((res) => {
      if (res.status) {
        this.gst2List = res.data;
        // this.getInwardOutwardList(year);
      } else {
        this.gst2List = [];
      }
    });
  }
  getGST3List(year) {
    this.selectedfinyear = year.finyear;
    var data = {
      type: "GSTR3_4",
      finyear: year.finyear,
      pos: this.pos,
      startdt: this.dateformatpipe.transform(this.startDate, 'yyyy-MM-dd'),
      enddt: this.dateformatpipe.transform(this.endDate, 'yyyy-MM-dd')
    }
    this.CommonService.getGSTRList(data).then((res) => {
      if (res.status) {
        this.gst3List = res.data;
        // this.getInwardOutwardList(year);
      } else {
        this.gst3List = [];
      }
    });
  }
  getGST4List(year) {
    this.selectedfinyear = year.finyear;
    var data = {
      type: "GSTR3_5",
      finyear: year.finyear,
      pos: this.pos,
      startdt: this.dateformatpipe.transform(this.startDate, 'yyyy-MM-dd'),
      enddt: this.dateformatpipe.transform(this.endDate, 'yyyy-MM-dd')
    }
    this.CommonService.getGSTRList(data).then((res) => {
      if (res.status) {
        this.get4List = res.data;
        // this.getInwardOutwardList(year);
      } else {
        this.get4List = [];
      }
    });
  }
  viewDetails(url) {
    this.router.navigate(['/reports/gstfiling/' + url],
      {
        queryParams: {
          finyear: this.selectedfinyear, startdt:
          this.dateformatpipe.transform(this.startDate, 'yyyy-MM-dd'),
          enddt: this.dateformatpipe.transform(this.endDate, 'yyyy-MM-dd')
        }
      });
  }
  redirecttoprev() {
    this.location.back();
  }
  getAll(selectedyr) {
    this.getList(selectedyr);
    this.getGST2List(selectedyr);
    this.getGST3List(selectedyr);
    this.getGST4List(selectedyr);
  }
  ngOnInit() {
    var currentDate = new Date();
    this.startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);;
    this.endDate = currentDate;
  }
  ngOnDestroy() {
  }
}
