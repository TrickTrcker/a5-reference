import { Injectable } from '@angular/core';
import { AppConstant } from '../app.constant';
import { CommonHttpService } from "../shared/common-http.service";

@Injectable()
export class OrganizationSettingsService {

 constructor(private httpService: CommonHttpService) { }
  mainUrl = AppConstant.API_ENDPOINT;
  public TenantSettingList(data: any):Promise<any> {
   return this.httpService.globalPostService(AppConstant.ACCOUNT.BASE_URL + AppConstant.API_CONFIG.API_URL.TNT.SETTING,data)
      .then(data => {
        return data;
      });
  }
  public Updatesetting(data: any):Promise<any> {
   return this.httpService.globalPostService(AppConstant.ACCOUNT.BASE_URL + AppConstant.API_CONFIG.API_URL.TNT.TENANTUPDATE,data)
      .then(data => {
        return data;
      });
  }
}
