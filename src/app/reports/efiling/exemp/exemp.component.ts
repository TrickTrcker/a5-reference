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
  selector: 'app-exemp',
  templateUrl: './exemp.component.html',
  styleUrls: ['./exemp.component.scss']
})
export class ExempComponent implements OnInit {
  exempdata: any = [];
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
  selectedyear: any;
  placeoforigin: any;
  pos: any;
  listsize: any;
  exporturl: any;
  filename: string;
  download: string;
  startDate: string = '';
  endDate: string = '';
  url: string = '';
  isExist:boolean = false;
  constructor(private CommonService: CommonService, private route: ActivatedRoute, private localStorageService: LocalStorageService, private router: Router, private location: Location,
    private organisationsettingservice: OrganizationSettingsService) {
    this.localstorageDetails = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
    this.placeoforigin = AppConstant.API_CONFIG.PLACEOFSUPPLYFORMAT;
    this.exporturl = AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.IDENTIFIER.EXEMP;
    this.route.queryParams.subscribe(queryParams => {
      if (!_.isEmpty(queryParams)) {
        this.selectedyear = queryParams.finyear;
        this.startDate = queryParams.startdt;
        this.endDate = queryParams.enddt;
        this.url = queryParams.url;
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
        this.getEXEMPList(this.selectedyear, this.download);
      });
  }

  ngOnInit() {
    if(this.url == undefined || this.url == ''){
      this.filename = AppConstant.API_CONFIG.IDENTIFIER.EXEMPA + this.localstorageDetails.tenantid + '.xlsx';      
    }else{
      this.filename = AppConstant.API_CONFIG.IDENTIFIER.EXEMP + this.localstorageDetails.tenantid + '.xlsx';      
    }

  }
  ExporttoCSV() {
    if (this.listsize != 0 && this.listsize != undefined && this.listsize != '') {
      this.getEXEMPList(this.selectedyear, 'Y');

    }
  }
  redirecttoprev() {
    this.location.back();
  }
  getEXEMPList(selectedyr, download) {
    this.data = {
      finyear: selectedyr,
      pos: this.pos,
      startdt:this.startDate,
      enddt:this.endDate,
      isdownload: download
    }
    if( this.url == undefined || this.url == ''){
      this.data.type = "GSTR1_EXEMP"      
    }else{
      this.isExist = true;
      this.data.type =  this.url;
    }
    this.CommonService.getGSTRList(this.data).then((res) => {
      if (res.status) {
        if (download === 'Y') {
          const buff = new Buffer(res.data);
          const blob = new Blob([new Buffer(buff)], { type: '' });
          saveAs(blob, this.filename);
        } else {
          this.exempdata = res.data;
          this.listsize = this.exempdata.length;
        }
      }
      else {
        this.exempdata = [];
      }
    });
  }
}
