import { Component, OnInit, OnDestroy } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { PrimengConstant } from '../../app.primeconfig';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import { CurrencyPipe } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';

import { CommonService } from '../../services/common.service';
import { MasterService } from '../../services/master.service';
import { DateformatPipe } from '../../pipes/dateformat.pipe';
import { OrganizationSettingsService } from '../../services/organization-settings.service';
import { UtilsService } from '../../services/utils.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-gstr2-summary',
  templateUrl: './gstr2-summary.component.html',
  styleUrls: ['./gstr2-summary.component.scss']
})
export class Gstr2SummaryComponent implements OnInit {
  inwardlist: any = [];
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
  startDate: Date;
  endDate: Date;
  constructor(private CommonService: CommonService,  private location: Location,private router: Router,private dateformatpipe: DateformatPipe, private organisationsettingservice: OrganizationSettingsService,
    private masterservice: MasterService, private localStorageService: LocalStorageService) {
    this.localstorageDetails = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
    this.placeoforigin = AppConstant.API_CONFIG.PLACEOFSUPPLYFORMAT;
    this.fin_year = AppConstant.API_CONFIG.FINYEARS;
    this.selectedyr = this.finyear;
    this.financialyearlist = this.masterservice.formatDataforDropdown("finyear", this.fin_year, null)
    var data = {
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
        this.getInwardList(this.selectedyr);             
      }

    )
  }

  ngOnInit() {
    var currentDate = new Date();
    this.startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);;
    this.endDate = currentDate;
  }
  getInwardList(year) {
    this.selectedfinyear = year.finyear;
    var data = {
      type: "GSTR2", 
      finyear: year.finyear,
      pos: this.pos,
      startdt: this.dateformatpipe.transform(this.startDate, 'yyyy-MM-dd'),
      enddt: this.dateformatpipe.transform(this.endDate, 'yyyy-MM-dd')

    }
    this.CommonService.getGSTRList(data).then((res) => {
      if (res.status) {
        this.inwardlist = res.data;
      }
      else {
        this.inwardlist = [];
      }
    });
  }
 
  viewDetails(url) {
    this.router.navigate(['/reports/gstr2/' + url],
      {
        queryParams: {
          url: (url == 'GSTR2_B2B' || url == 'GSTR2_CDNR' || url == 'GSTR2_ATADJ' || url == 'GSTR2_AT' || url == 'GSTR2_EXEMPT' || url == 'GSTR2_HSNSUM')?url:'',
          finyear: this.selectedfinyear, startdt:
          this.dateformatpipe.transform(this.startDate, 'yyyy-MM-dd'),
          enddt: this.dateformatpipe.transform(this.endDate, 'yyyy-MM-dd')
        }
      });
  }
  redirecttoprev() {
    this.location.back();
  }
}
