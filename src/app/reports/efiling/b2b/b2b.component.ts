/**
 * Description
 * @authors Your Name (you@example.org)
 * @date    2017-11-06 13:11:02
 * @version 1.0.0
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { AppConstant } from '../../../app.constant';
import { OrganizationSettingsService } from '../../../services/organization-settings.service';
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { saveAs } from 'file-saver/FileSaver';
import { Buffer } from 'buffer';
import * as _ from "lodash";
@Component({
  selector: 'app-b2b',
  templateUrl: './b2b.component.html',
  styleUrls: ['./b2b.component.scss']
})
export class B2bComponent implements OnInit {
  private date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  b2bdata: any = [];
  data: any;
  localstorageDetails: any = {};
  finyear: any;
  financialyearlist: any;
  fin_year: any;
  currency_Symbol: string;
  selectedyr: any;
  settinglist: any = [];
  list: any = [];
  mode: string;
  listsize: any;
  selectedyear: any;
  exporturl: any;
  placeoforigin: any;
  pos: any;
  download: string = 'N';
  filename: string;
  startDate: string = '';
  endDate: string = '';
  url: string = '';
  isExist:boolean = false;
  constructor(private CommonService: CommonService, private route: ActivatedRoute,
    private localStorageService: LocalStorageService, private router: Router,
    private location: Location,
    private organisationsettingservice: OrganizationSettingsService) {
    this.localstorageDetails = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
    this.placeoforigin = AppConstant.API_CONFIG.PLACEOFSUPPLYFORMAT;
    this.exporturl = AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.IDENTIFIER.B2B;
    this.localstorageDetails = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.route.queryParams.subscribe(queryParams => {
      if (!_.isEmpty(queryParams)) {
        this.selectedyear = queryParams.finyear;
        this.startDate = queryParams.startdt;
        this.endDate = queryParams.enddt;
        this.url = queryParams.url
      }
    });
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
        this.getB2BList(this.selectedyear, this.download);
      });
  }

  ngOnInit() {
    if( this.url == undefined ||  this.url == ''){
      this.filename = AppConstant.API_CONFIG.IDENTIFIER.B2BA + this.localstorageDetails.tenantid + '.xlsx';            
    }else{
      this.filename = AppConstant.API_CONFIG.IDENTIFIER.B2B + this.localstorageDetails.tenantid + '.xlsx';            
    }
  }

  redirecttoprev() {
    if (this.mode == "b2bdata") {
      this.router.navigate(['/inward/summary']);
    }
    else {
      this.router.navigate(['/']);
    }
    this.location.back();
  }
  getB2BList(selectedyr, download) {
    this.data = {
      finyear: selectedyr,
      pos: this.pos,
      startdt:this.startDate,
      enddt:this.endDate,
      isdownload: download
    }
    if( this.url == undefined || this.url == ''){
      this.data.type = "GSTR1_B2B"      
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
          this.b2bdata = res.data;
          this.listsize = res.data.length;
        }
      }
      else {
        this.b2bdata = [];
      }
    });
  }
  ExporttoCSV() {
    if (this.listsize != 0 && this.listsize != undefined && this.listsize != '') {
      this.getB2BList(this.selectedyear, 'Y');
    }
  }
}
