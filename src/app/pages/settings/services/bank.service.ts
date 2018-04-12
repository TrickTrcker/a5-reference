import { Injectable } from '@angular/core';
import { AppConstant } from '../../../app.constant';
import { CommonHttpService } from '../../../shared/common-http.service';
@Injectable()
export class BankService {
  mainUrl = AppConstant.API_ENDPOINT;
  constructor(private httpService: CommonHttpService) { }
  public getAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.BANK.FINDALL, data)
      .then(data => {
        return data;
      });
  }
  public getByID(data: any): Promise<any> {
    return this.httpService.globalGetServiceByUrl(this.mainUrl + AppConstant.API_CONFIG.API_URL.BANK.FINDBYID, data)
      .then(data => {
        return data;
      });
  }
   public getAllBanks(data: any): Promise<any> {
    return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.ACC_BOOKOFACCOUNTS.LIST, data)
      .then(data => {
        return data;
      });
  }
  public saveBankDetails(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.BANK.CREATE,data)
      .then(data => {
        return data;
      });
  }
  public updateBankDetails(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.BANK.UPDATE,data)
      .then(data => {
        return data;
      });
  }
}
