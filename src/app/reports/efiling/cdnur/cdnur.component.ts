import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { AppConstant } from '../../../app.constant';
import { OrganizationSettingsService } from '../../../services/organization-settings.service';
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import { saveAs } from 'file-saver/FileSaver';
import { Buffer } from 'buffer';
@Component({
  selector: 'app-cdnur',
  templateUrl: './cdnur.component.html',
  styleUrls: ['./cdnur.component.scss']
})
export class CdnurComponent implements OnInit {
  private date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  cdnurdata: any = [];
  data: any;
  localstorageDetails: any = {};
  finyear: any;
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
    this.exporturl = AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.IDENTIFIER.CDNUR;
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
        this.getCDNURList(this.selectedyear, 'N');
      });
  }

  ngOnInit() {
    this.filename = AppConstant.API_CONFIG.IDENTIFIER.CDNUR + this.localstorageDetails.tenantid + '.xlsx';
  }

  redirecttoprev() {
    this.location.back();
  }
  getCDNURList(selectedyr, download) {
    var data = {
      type: "GSTR1_CDNUR", 
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
          this.cdnurdata = res.data;
          this.listsize = this.cdnurdata.length;          
        }
      } else {
        this.cdnurdata = [];
      }
    });
  }
  ExporttoCSV() {
    if (this.listsize != 0 && this.listsize != undefined && this.listsize != '') {
      this.getCDNURList(this.selectedyear, 'Y');
    }
  }

}
