import { Injectable } from '@angular/core';
import { CommonHttpService } from '../../shared/common-http.service';
import { AppConstant } from '../../app.constant';

@Injectable()
export class JournalsService {

  constructor(private httpService: CommonHttpService) { }

  public getAllLedgerNames(data: any): Promise<any> {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.API_URL.ACC_BOOKOFACCOUNTS.LIST, data)
      .then(data => {
        return data;
      });
  }

  public getAllJournals(data: any): Promise<any> {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.API_URL.TNT_JOURNAL.LISTALL, data)
      .then(data => {
        return data;
      });
  }
  public getJournalDetails(data: any): Promise<any> {
    return this.httpService.globalGetServiceByUrl(AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.API_URL.TNT_JOURNAL.FINDBYID, data)
      .then(data => {
        return data;
      });
  }
  public saveJournal(data): Promise<any> {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.API_URL.TNT_JOURNAL.CREATE, data)
      .then(data => {
        return data;
      });
  }

  public updateJournal(data): Promise<any> {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.API_URL.TNT_JOURNAL.UPDATE, data)
      .then(data => {
        return data;
      });
  }
  public config(data): Promise<any> {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.API_URL.TNT_JOURNAL.CONFIG, data)
      .then(data => {
        return data;
      });
  }

  public deleteJournal(data): Promise<any> {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.API_URL.TNT_JOURNAL.DELETE, data)
      .then(data => {
        return data;
      });
  }
  public getLedgerlist(data: any): Promise<any> {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.API_URL.REPORTS.LEDGERLIST, data)
      .then(data => {
        console.log(data);
        return data;
      });
  }
}
