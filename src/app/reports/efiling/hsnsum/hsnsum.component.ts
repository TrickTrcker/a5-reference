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
  selector: 'app-hsnsum',
  templateUrl: './hsnsum.component.html',
  styleUrls: ['./hsnsum.component.scss']
})
export class HsnsumComponent implements OnInit {
  private date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  disabled : boolean = false;  
  localstorageDetails: any = {};
  userdetails: any;
  mode: string;
  data:any;    
  finyear: any;
  hsnsumdata: any = [];
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
  selectedyear:any;
  startDate: string = '';
  endDate: string = '';
  url: string = '';
  isExist:boolean = false;
  constructor(private CommonService: CommonService,private route: ActivatedRoute,private router: Router,
    private location: Location, private masterservice: MasterService, private localStorageService: LocalStorageService, private organisationsettingservice: OrganizationSettingsService) {
    this.localstorageDetails = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
    this.placeoforigin = AppConstant.API_CONFIG.PLACEOFSUPPLYFORMAT;
    this.exporturl = AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.IDENTIFIER.HSNSUM;
    this.fin_year = AppConstant.API_CONFIG.FINYEARS;
    this.selectedyr = this.finyear;
    this.financialyearlist = this.masterservice.formatDataforDropdown("finyear", this.fin_year, null);
    this.download = 'N';
    this.route.queryParams.subscribe(queryParams => {
      if (!_.isEmpty(queryParams)) {
        this.selectedyear = queryParams.finyear;
        this.startDate = queryParams.startdt;
        this.endDate = queryParams.enddt;
        this.url = queryParams.url;
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
        this.getHSNList(this.selectedyr, this.download);

      }

    )
  }


  ngOnInit() {
    this.filename = AppConstant.API_CONFIG.IDENTIFIER.HSNSUM + this.localstorageDetails.tenantid + '.xlsx';
  }
  getHSNList(year, download) {
    this.data = {
      finyear: year.finyear,
      pos: this.pos,
      startdt:this.startDate,
      enddt:this.endDate,
      isdownload: download

    }
    if( this.url == undefined || this.url == ''){
      this.data.type = "GSTR1_HSN"      
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
          this.hsnsumdata = res.data;
          this.listsize = this.hsnsumdata.length;
        }

      }
      else {
        this.hsnsumdata = [];
      }
    });
  }
  ExporttoCSV() {
    if (this.listsize != 0 && this.listsize != undefined && this.listsize != '') {
      this.getHSNList(this.selectedyr, 'Y');
    }
  }
  redirecttoprev() {
    if (this.mode == "hsnsumdata") {
      this.router.navigate(['/inward/summary']);
    }
    else {
      this.router.navigate(['/']);
    }
    this.location.back();
  }
}
