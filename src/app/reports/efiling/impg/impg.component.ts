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
import { MasterService } from '../../../services/master.service';
import { ActivatedRoute } from "@angular/router";
import { saveAs } from 'file-saver/FileSaver';
import { Buffer } from 'buffer';
import * as _ from "lodash";

@Component({
  selector: 'app-impg',
  templateUrl: './impg.component.html',
  styleUrls: ['./impg.component.scss']
})
export class ImpgComponent implements OnInit {
  private date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  impgdata: any = [];
  data: any;
  localstorageDetails: any = {};
  finyear: any;
  financialyearlist: any;
  currency_Symbol: string;
  selectedyr: any = [];
  settinglist: any = [];
  list: any = [];
  mode: string;
  listsize: any;
  selectedyear: any;
  placeoforigin: any;
  pos: any;
  filename: string;
  download: string;
  startDate: string = '';
  endDate: string = '';
  constructor(private CommonService: CommonService, private route: ActivatedRoute, private localStorageService: LocalStorageService, private masterservice: MasterService,

    private router: Router, private location: Location,
    private organisationsettingservice: OrganizationSettingsService) {
    this.localstorageDetails = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
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
        this.getIMPGList(this.selectedyear, this.download);
      });

  }

  ngOnInit() {
    this.filename = AppConstant.API_CONFIG.IDENTIFIER.IMPG + this.localstorageDetails.tenantid + '.xlsx';

  }
  ExporttoCSV() {
    if (this.listsize != 0 && this.listsize != undefined && this.listsize != '') {
      this.getIMPGList(this.selectedyear, 'Y');
    }
  }
  redirecttoprev() {
    this.location.back();
  }

  getIMPGList(selectedyr, download) {
    var data = {
      type: "GSTR2_IMPG",
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
          this.impgdata = res.data;
          this.listsize = this.impgdata.length;
        }
      } else {
        this.impgdata = [];
      }
    });
  }

}
