import { Injectable } from '@angular/core';
import { CommonHttpService } from '../../shared/common-http.service';
import { AppConstant } from '../../app.constant';

@Injectable()
export class AccountsService {
  WS_BASE_URL: any;
  createaccounts: string;
  DROPLIST: string;
  findAll: string;
  findById: string;
  update: string;
  constructor(private httpService: CommonHttpService) {
    this.WS_BASE_URL = AppConstant.API_ENDPOINT;
    this.DROPLIST = this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.CONTACT.LIST;
    this.createaccounts = this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.TNT_ACCOUNT.CREATE;
    this.findAll = this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.TNT_ACCOUNT.FINDALL;
    this.findById = this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.TNT_ACCOUNT.FINDBYID;
    this.update = this.WS_BASE_URL + AppConstant.API_CONFIG.API_URL.TNT_ACCOUNT.UPDATE;
  }


  public getall(): Promise<any> {
    return this.httpService.globalGetService('assets/data/chart.json', {})
      .then(data => {
        return data;
      });
  }
  public FindAllAccounts(data: any): Promise<any> {
    return this.httpService.globalPostService(this.findAll, data)
      .then(data => {
        return data;

      });
  }
  public saveAccounts(data: any): Promise<any> {
    return this.httpService.globalPostService(this.createaccounts, data)
      .then(data => {
        return data;
      });
  }

  public DROPLISTALL(data: any): Promise<any> {
    return this.httpService.globalPostService(this.DROPLIST, data)
      .then(data => {
        return data;

      });
  }
  public FindByIDAccounts(data: any): Promise<any> {
    return this.httpService.globalPostService(this.findById, data)
      .then(data => {
        return data;

      });
  }
  public UpdateByIDAccounts(data: any): Promise<any> {
    return this.httpService.globalPostService(this.update, data)
      .then(data => {
        return data;

      });
  }
  public deleteJournal(data): Promise<any> {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.API_URL.TNT_ACCOUNT.DELETE, data)
      .then(data => {
        return data;
      });
  }
}
