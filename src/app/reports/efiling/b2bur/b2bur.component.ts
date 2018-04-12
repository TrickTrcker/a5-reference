import { Component, OnInit } from '@angular/core';
import { AppConstant } from '../../../app.constant';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { CommonService } from '../../../services/common.service';
import { OrganizationSettingsService } from '../../../services/organization-settings.service';
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import { saveAs } from 'file-saver/FileSaver';
import { Buffer } from 'buffer';
@Component({
  selector: 'app-b2bur',
  templateUrl: './b2bur.component.html',
  styleUrls: ['./b2bur.component.scss']
})
export class B2burComponent implements OnInit {
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  private date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  localstorageDetails: any = {};
  finyear: any;
  b2burdata: any = [];
  financialyearlist: any;
  fin_year: any;
  currency_Symbol: string;
  selectedyr: any = [];
  settinglist: any = [];
  list: any = [];
  mode: string;
  listsize: any;
  selectedyear: any;
  exporturl: any;
  placeoforigin: any;
  pos: any;
  filename: string;
  download: string;  
  startDate: string = '';
  endDate: string = '';
  constructor(private CommonService: CommonService, private route: ActivatedRoute, private localStorageService: LocalStorageService, private router: Router, private location: Location,
    private organisationsettingservice: OrganizationSettingsService) {
    this.finyear = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
    this.placeoforigin = AppConstant.API_CONFIG.PLACEOFSUPPLYFORMAT;
    this.exporturl = AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.IDENTIFIER.B2BUR;
    this.localstorageDetails = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.route.queryParams.subscribe(queryParams => {
      if (!_.isEmpty(queryParams)) {
        this.selectedyear = queryParams.finyear;
        this.startDate = queryParams.startdt;
        this.endDate = queryParams.enddt;
      }
    });
    this.download = 'N';    
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
        this.getB2BURList(this.selectedyear, 'N');
      });

  }

  ngOnInit() {
    this.filename = AppConstant.API_CONFIG.IDENTIFIER.B2BUR + this.localstorageDetails.tenantid + '.xlsx';
  }

  redirecttoprev() {
    if (this.mode == "b2burdata") {
      this.router.navigate(['/inward/summary']);
    }
    else {
      this.router.navigate(['/']);
    }
    this.location.back();
  }
  getB2BURList(selectedyr, download) {
    var data = {
      type : "GSTR2_B2BUR",
      finyear: selectedyr,
      pos: this.pos,
      startdt:this.startDate,
      enddt:this.endDate,
      isdownload: download
    }
    
    this.CommonService.getGSTRList(data).then((res) => {
      if (res.status) {
        if (download === 'Y') {
          const buff = new Buffer(res.data);
          const blob = new Blob([new Buffer(buff)], { type: '' });
          saveAs(blob, this.filename);
        } else {
          this.b2burdata = res.data;
          this.listsize = this.b2burdata.length;
        }
      }
      else {
        this.b2burdata = [];
      }
    });
  }
  ExporttoCSV() {
    if (this.listsize != 0 && this.listsize != undefined && this.listsize != '') {
      this.getB2BURList(this.selectedyear, 'Y');
    }
  }
}
