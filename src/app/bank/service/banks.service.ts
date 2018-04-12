import { Injectable } from '@angular/core';
import { CommonHttpService} from '../../shared/common-http.service';
import{AppConstant}from '../../app.constant';
import * as _ from "lodash";
@Injectable()

export class BanksService {
  WS_BASE_URL:string;
  bankcreate: string;
  bankfindall:string;
  bankfindall_url:string;
  seqgenerator:string;
  from:string;
  findById:string;
  journalUpdate:string;
  viewbank:string;
  brsBankFindAll:string;
  deleteBank:string;
  //brs
  brslist_url:string;
  brscreste_url:string;
  brsupdate_url:string;
  brsupdatedetails_url:string;
  brsmatchlist_url:string;
  brsreport_url :string;
  brsdetailslist_url:string;
  brsledgerlist_url: string;
  constructor(private httpService:CommonHttpService) {
    this.WS_BASE_URL = AppConstant.API_ENDPOINT;
    this.bankcreate = this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.TNT_JOURNAL.CREATE;
    this.bankfindall = this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.TNT_JOURNAL.LISTALL;
    this.bankfindall_url =  this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.BANK.FINDALL;
    this.seqgenerator = this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.TNT_INVOICE.SEQ;
    this.from = this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.TNT_JOURNAL.CONFIG;
    this.findById=this.WS_BASE_URL+ AppConstant.API_CONFIG.API_URL.TNT_JOURNAL.FINDBYID;
    this.journalUpdate=this.WS_BASE_URL+ AppConstant.API_CONFIG.API_URL.TNT_JOURNAL.UPDATE;
    this.viewbank=this.WS_BASE_URL+ AppConstant.API_CONFIG.API_URL.TNT_JOURNAL.DETAILS;
    this.brsBankFindAll=this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.TNT_BANK.LISTALL;
    this.deleteBank = this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.TNT_JOURNAL.DELETE
    //BRS
    this.brslist_url=this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.BRS.LIST;
    this.brscreste_url = this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.BRS.CREATE;
    this.brsupdate_url = this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.BRS.UPDATE;
    this.brsupdatedetails_url = this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.BRS.UPDATEDETAILS;
    this.brsmatchlist_url = this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.BRS.MATCHLIST;
    this.brsreport_url  =  this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.BRS.REPORT;
    this.brsdetailslist_url = this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.BRS.DETAILLIST;
    this.brsledgerlist_url = this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.BRS.LEDGERLIST;
   }
   public addBank(data: any): Promise<any> {
    return this.httpService.globalPostService(this.bankcreate, data)
      .then(data => {
        return data;
      });

  };
  public getAllBanks(data: any): Promise<any> {
    return this.httpService.globalPostService(this.bankfindall_url, data)
      .then(data => {
        return data;
      });
  }
  public getBank(data: any): Promise<any> {
    return this.httpService.globalPostService(this.bankfindall, data)
      .then(data => {
        return data;
      });

  };
  public autogenerator(data: any): Promise<any> {
    return this.httpService.globalPostService(this.seqgenerator, data)
      .then(data => {
        return data;
      });

  }
  public Journalconfig(data: any): Promise<any> {
    return this.httpService.globalPostService(this.from, data)
      .then(data => {
        return data;
      });

  };
  public bankFindId(data: any): Promise<any> {
    return this.httpService.globalPostService(this.findById, data)
      .then(data => {
        return data;
      });

  };
  public journalupdates(data: any): Promise<any> {
    return this.httpService.globalPostService(this.journalUpdate, data)
      .then(data => {
        return data;
      });

  };
  public journalView(data: any): Promise<any> {
    return this.httpService.globalPostService(this.viewbank, data)
      .then(data => {
        return data;
      });

  };
  public bankListAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.brsBankFindAll, data)
      .then(data => {
        return data;
      });

  };
  public delete(data): Promise<any> {
    return this.httpService.globalPostService(this.deleteBank, data)
      .then(data => {
        return data;
      });
  }
  // BRS 
  public brsListAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.brslist_url, data)
      .then(data => {
        return data;
      });
  };
  public brsCreate(data: any): Promise<any> {
    return this.httpService.globalPostService(this.brscreste_url, data)
      .then(data => {
        return data;
      });
  };
  public brsMatchList(data: any): Promise<any> {
    return this.httpService.globalPostService(this.brsmatchlist_url, data)
      .then(data => {
        return data;
      });
  };
  public brsDetailsList(data: any): Promise<any> {
    return this.httpService.globalPostService(this.brsdetailslist_url, data)
      .then(data => {
        return data;
      });
  };
  public brsLedgerList(data: any): Promise<any> {
    return this.httpService.globalPostService(this.brsledgerlist_url, data)
      .then(data => {
        return data;
      });
  };
  public brsUpdate(data: any): Promise<any> {
    return this.httpService.globalPostService(this.brsupdatedetails_url, data)
      .then(data => {
        return data;
      });
  };
  public brsReport(data: any): Promise<any> {
    return this.httpService.globalPostService(this.brsreport_url, data)
      .then(data => {
        return data;
      });
  };
  public formatDataforDropdown(label,data,Placeholdervalue)
  {
    let formatdata=[];
    let customdata={
      label:null, 
      value:null
    };
    if(!_.isEmpty(Placeholdervalue))
      {
        formatdata.push({
          label:Placeholdervalue, 
          value:null
        });
      }
    
    _.forEach(data, function(value) {
      var shallow = _.clone(customdata);
      shallow.label = value[label];
      shallow.value = value;
      formatdata.push(shallow);
    });
  }
}
