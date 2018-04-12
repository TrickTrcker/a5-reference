import { Injectable } from '@angular/core';
import { AppConstant } from '../../../app.constant';
import { CommonHttpService } from "../../../shared/common-http.service";

@Injectable()
export class CommonService {

  constructor(private httpService: CommonHttpService) { }
 mainUrl = AppConstant.API_ENDPOINT;
 public FindAllCountry(data: any):Promise<any> {
   return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.COUNTRY.FINDALL,data)
      .then(data => {
        return data;
      });
  }
  public FindAllCity(data: any):Promise<any> {
   return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.CITY.FINDBYID , data)
      .then(data => {
        return data;
      });
  }
  public FindAllState(data: any):Promise<any> {
   return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.STATE.FINDALL,data)
      .then(data => {
        return data;
      });
  }
  public FindAllIndustryType(data: any):Promise<any> {
   return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.INDUSTRY_TYPE.FINDALL,data)
      .then(data => {
        return data;
      });
  }
    public FindAllGroups(data: any):Promise<any> {
   return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.ACC_BOOKOFACCOUNTS.LIST,data)
      .then(data => {
        return data;
      });
  }
  public status(data: any):Promise<any> {
    return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.status,data)
       .then(data => {
         return data;
       });
   }

   public getSequenceSettings(data: any):Promise<any> {
    return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.SEQUENCE.FINDALL,data)
       .then(data => {
         return data;
       });
   }
   public updateSequenceSettings(data: any):Promise<any> {
    return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.SEQUENCE.UPDATE,data)
       .then(data => {
         return data;
       });
   }
}
