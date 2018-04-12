/*
 * Created on Sat Nov 18 2017
 *
 * Copyright (c) 2017 GNTS Technologies Pvt. Ltd.,
 */
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { LocalStorageService } from './../../shared/local-storage.service';
import * as _ from "lodash";
import * as $ from 'jquery';
import { MasterService } from './../../services/master.service';
import { AccountsService } from './../service/accounts.service';
import { JournalsService } from './../service/journals.service'
import { AppConstant } from './../../app.constant'
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { UtilsService } from './../../services/utils.service';
@Component({
  selector: 'app-viewtransactions',
  templateUrl: './viewtransactions.component.html',
  styleUrls: ['./viewtransactions.component.scss']
})
export class ViewtransactionsComponent implements OnInit {
  
  @Input() journalid: any;
  @Input() journalno: any;
  @Input() journalFeature: any;
  @Input() viewfrom: any;
  showbacknavigate :any=true;
  journaldatalist: any;
  userstoragedata: any = {};
  resources: any = {};
  reqdata: any = {};
  finyear: any = {};
  journalData: any;
  journaldatas: Array<any> = [];
  journaltaxs: Array<any> = [];
  journal_feature: string = "Journals";
  backnav_url :string = '/accounts/journals/list';
  journalList: any; 
  dataFormat: string; 
  currency_Symbol: string;
  journalTotal: any;
  flag: string;
  // journalFeature : string;
  routerParams: any;
  queryparams : any;
  constructor(private masterservice: MasterService, private storageservice: LocalStorageService,private location: Location,
    private route: ActivatedRoute, private journalservice: JournalsService, private router: Router,private utilservices : UtilsService ) {
    this.route.params.subscribe(params => {
      if (!_.isEmpty(params)) {
        this.journalid = params.journalid;
        this.journalno = params.journalno;
        this.journalFeature = params.feature;
        // this.flag = params.journal;
        console.log("Route params: ",params);
        this.routerParams = params;
      }
      var qryparams:any = utilservices.getqueryparams();
      console.log("qury params: ",qryparams);
      if(! _.isEmpty(qryparams))
      {
        this.queryparams = qryparams;

        this.journalid = qryparams.journalid;
        this.journalno = qryparams.journalno;
        this.viewfrom = qryparams.viewfrom;
        // this.flag = qryparams.journal;
        console.log("Route params: ",params);
      }
    });
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.resources = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.RESOURCE);
    this.finyear = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.dataFormat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  }

  ngOnInit() {
    this.reqdata = {
      "journalid": this.journalid,
      "feature" : this.journalFeature
    };
    if (this.journalid && this.journalid != undefined) {
      this.loadjournalDetails();
    }
  }

  redirecttoprev(url) {
    // this.router.navigate([url]);
    if (this.flag == "fromledger") {
      this.router.navigate(['/reports/trailbalance']);
    }
    else if (this.flag == "journal") {
      this.router.navigate(['/journals/list']);
    }
    this.location.back();
  }
  loadjournalDetails() {
    this.journalData = [];
    let url = this.journalid + "/" +this.journalFeature;
    this.journalservice.getJournalDetails(url)
      .then((res) => {

        if (res.status) {
          this.journalData = res.data[0];
          this.journaldatas = res.data[0].ledgers;
          this.journalTotal = this.journalData.journaltotal;
          this.journalFeature = this.journalData.feature;
          this.formatViews();
        }
        
      });

  }
  formatViews()
  {
    
    switch(this.journalFeature) { 
      case 'gnrl_receipt': { 
         this.journal_feature = "General Receipt";
         this.backnav_url = "../../receipts/list";
         break; 
      } 
      case 'gnrl_payment': { 
        this.journal_feature = "General Payment";
        this.backnav_url = "../../payments/list";
         break; 
      } 
      default: { 
         //statements; 
         break; 
      } 
   } 
   switch(this.viewfrom) { 
    case 'receipt': { 
       this.backnav_url = "../../receipts/list";
       break; 
    } 
    case 'payment': { 
      this.backnav_url = "../../payments/list";
       break; 
    }
    case 'Ledger_tb': { 
      this.showbacknavigate=false;
       break; 
    } 
    default: { 
      this.backnav_url="";
       //statements; 
       break; 
    } 
 } 
  }
}
