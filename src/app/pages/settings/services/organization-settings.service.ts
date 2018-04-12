import { Injectable } from '@angular/core';
import { AppConstant } from '../../../app.constant';
import { CommonHttpService } from "../../../shared/common-http.service";

@Injectable()
export class OrganizationSettingsService {

 constructor(private httpService: CommonHttpService) { }
  mainUrl = AppConstant.API_ENDPOINT;
 public FindAll(data: any):Promise<any> {
   return this.httpService.globalGetServiceByUrl(AppConstant.ACCOUNT.BASE_URL + AppConstant.API_CONFIG.API_URL.TNT.FINDBYID,data)
      .then(data => {
        return data;
      });
  }
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
  public tenantlist(data: any): Promise<any> {
    /**
     * req data to consultantid from email id : {	
       "emailid": "shibu@gnts.in"
     }
     Client List for a Consultant :
          -------------------
  URL :http://localhost:5000/ibacapi/tenant/list
  Request Object : 
  {
  "consultantid": 500
  }
     *  []
     */


    return this.httpService.globalPostService(AppConstant.ACCOUNT.BASE_URL + AppConstant.API_CONFIG.API_URL.TNT.FINDALL, data)
      .then(data => {
        return data;
      });
  }
}
