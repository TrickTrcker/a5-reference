import { Component, OnInit, Directive } from '@angular/core';
import { BanksService } from './../service/banks.service';
import { MasterService } from '../../services/master.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import { Http, Response } from '@angular/http';
import { UtilsService } from "../../services/utils.service";
import { JournalsService } from './../../accounts/service/journals.service';
import { Message } from 'primeng/primeng';
import * as _ from "lodash";
import { BRSUploadComponent } from './csvupload/brsupload.component';
import { BRSMatchingComponent } from './brsmatching/brsmatching.component';
import { Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-brs',
  templateUrl: './brs.component.html',
  styleUrls: ['./brs.component.scss']
})

export class BRSComponent implements OnInit {
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  private date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  private paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES;
  userdetails: any
  finyear: any;
  datafromat: string;
  brslist: any = [];
  activeIndex: number = 0;
  show: boolean = false;
  BankList: any =[];
  constructor(private BanksService: BanksService,
    private LocalStorageService: LocalStorageService,
    private router: Router,
    private JournalsService: JournalsService, ) {
    this.userdetails = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.datafromat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.getAllBankList();
    
  }
  getAllBankList() {
    var self = this;
    this.BanksService.getAllBanks({ tenantid: this.userdetails.tenantid })
      .then(res => {
        if (res.status) {
          self.BankList = res.data;
        }
        else {
          console.log("no bank found");
        }
        this.getbrslist();
      });
  }
  getbankdetails(bankid)
  {
    var bank = _.find(this.BankList ,{"bankid" : bankid});
    return bank;
  }
  getbankname(bankid)
  {
    var bankname = "";
    var bank : any = this.getbankdetails(bankid);
    if(! _.isEmpty(bank))
    {
      bankname = bank.bankname;
    }
    return bankname;
  }
  getbrslist() {
    var self = this;
    // var data = {
    //   "offset": 0,
    //   "limit": 1000,
    //   "startdate": "",
    //   "enddate": "",
    //   "startCreatedDt": "",
    //   "endCreatedDt": "",
    //   "gtAmount": "",
    //   "ltAmount": "",
    //   "amountKey": "",
    //   "query": {
    //     tenantid: this.userdetails.tenantid,
    //   }
    // };
    var data = {
      "finyear": this.finyear.finyear,
    };
    self.brslist = [];
    this.BanksService.brsListAll(data)
      .then(function (res) {
        if (res.status) {
          self.brslist = res.data;
        }
      });
  }
  brsUpdateEvent(event) {
    if (event.update) {
      this.getbrslist();
      this.activeIndex = 0;
    }

  }
  openpage(path)
  {
    this.router.navigate([path]);
    return false;
  }
  openmatchingpage(headerdata)
  {
    this.router.navigate(['banks/brsmatching'], 
    {
       queryParams: { "finyear": headerdata.finyear,"accheadid" :headerdata.accheadid,
      "stmtfromdt" : headerdata.stmtfromdt,"stmttodt" : headerdata.stmttodt ,
      "bankstmtid" : headerdata.bankstmtid
      }
   });
  }
  refreshbrslist($event)
  {
    console.log("event from child component: ",$event);
    this.getbrslist();
  }
  ngOnInit() {


  }
  showhidefilter() {
    if (this.show == true) {
      this.show = false
    }
    else {
      this.show = true;
    }
  }

}
