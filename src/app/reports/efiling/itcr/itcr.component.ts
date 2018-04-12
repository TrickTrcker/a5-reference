import { Component, OnInit } from '@angular/core';
import { AppConstant } from '../../../app.constant';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { CommonService } from '../../../services/common.service';
import { OrganizationSettingsService } from '../../../services/organization-settings.service';
import { MasterService } from '../../../services/master.service';
import { saveAs } from 'file-saver/FileSaver';
import { Buffer } from 'buffer';
import { ActivatedRoute } from "@angular/router";
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import * as _ from "lodash";

@Component({
  selector: 'app-itcr',
  templateUrl: './itcr.component.html',
  styleUrls: ['./itcr.component.scss']
})
export class ItcrComponent implements OnInit {
  private date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  disabled : boolean = false;
  localstorageDetails: any = {};
  finyear: any;
  mode: string;  
  itcrdata: any = [];
  financialyearlist: any;
  fin_year: any;
  currency_Symbol: string;
  selectedyr: any = [];
  settinglist: any = [];
  list: any = [];
  listsize: any;
  exporturl: any;
  placeoforigin: any;
  pos: any;
  filename: string;
  download: string;
  selectedyear: any;
  startDate: string = '';
  endDate: string = '';
  constructor(private CommonService: CommonService, private masterservice: MasterService,  private location: Location, private router: Router,private route: ActivatedRoute, private localStorageService: LocalStorageService, private organisationsettingservice: OrganizationSettingsService) {
    this.finyear = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
    this.placeoforigin = AppConstant.API_CONFIG.PLACEOFSUPPLYFORMAT;
    this.exporturl = AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.IDENTIFIER.ITCR;
    this.localstorageDetails = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.fin_year = AppConstant.API_CONFIG.FINYEARS;
    this.selectedyr = this.finyear;
    this.financialyearlist = this.masterservice.formatDataforDropdown("finyear", this.fin_year, null)
    this.download = 'N';
    this.route.queryParams.subscribe(queryParams => {
      if (!_.isEmpty(queryParams)) {
        this.selectedyear = queryParams.finyear;
        this.startDate = queryParams.startdt;
        this.endDate = queryParams.enddt;
        this.disabled = true;
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
        this.getITCRList(this.selectedyr, this.download);

      }

    )

  }

  ngOnInit() {
    this.filename = AppConstant.API_CONFIG.IDENTIFIER.ITCR + this.localstorageDetails.tenantid + '.xlsx';
  }
  ExporttoCSV() {
    if (this.listsize != 0 && this.listsize != undefined && this.listsize != '') {
      this.getITCRList(this.selectedyr, 'Y');
    }
  }
  getITCRList(param, download) {
    var data = {
      type: "GSTR2_ITCR",
      finyear: param.finyear,
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
          this.itcrdata = res.data;
          this.listsize = this.itcrdata.length;
        }
      }
      else {
        this.itcrdata = [];
      }
    });
  }
  redirecttoprev() {
    if (this.mode == "itcrdata") {
      this.router.navigate(['/inward/summary']);
    }
    else {
      this.router.navigate(['/']);
    }
    this.location.back();
  }

}
