/**
 * Description
 * @authors Your Name (you@example.org)
 * @date    2017-11-06 13:11:02
 * @version 1.0.0
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
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
  selector: 'app-imps',
  templateUrl: './imps.component.html',
  styleUrls: ['./imps.component.scss']
})
export class ImpsComponent implements OnInit {
  private date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  impsdata: any = [];
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
  download: string;
  filename: string;
  startDate: string = '';
  endDate: string = '';
  constructor(private CommonService: CommonService, private route: ActivatedRoute, private localStorageService: LocalStorageService, private router: Router, private location: Location,
    private organisationsettingservice: OrganizationSettingsService) {
    this.localstorageDetails = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.exporturl = AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.IDENTIFIER.IMPS;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
    this.placeoforigin = AppConstant.API_CONFIG.PLACEOFSUPPLYFORMAT;
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
        this.getIMPSList(this.selectedyear, this.download);
      });
  }
  ngOnInit() {
    this.filename = AppConstant.API_CONFIG.IDENTIFIER.IMPS + this.localstorageDetails.tenantid + '.xlsx';
  }
  redirecttoprev() {
   
    this.location.back();
  }
  getIMPSList(selectedyr, download) {

    var data = {
      type: "GSTR2_IMPS",
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
          this.impsdata = res.data;
        }
        this.listsize = res.data.length;        
      }
      else {
        this.impsdata = [];
      }
    });
  }
  ExporttoCSV() {
    if (this.listsize != 0 && this.listsize != undefined && this.listsize != '') {
      this.getIMPSList(this.selectedyear, 'Y');
    }
  }
}
