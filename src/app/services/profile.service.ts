import { Injectable } from '@angular/core';
import { AppConstant } from '../app.constant';
import { CommonHttpService } from "../shared/common-http.service";

@Injectable()
export class ProfileService {
  acc_mainUrl = AppConstant.ACCOUNT.BASE_URL;
  constructor(private httpService: CommonHttpService) { }
  public getprofile(data: any):Promise<any> {
    return this.httpService.globalGetServiceByUrl(this.acc_mainUrl + AppConstant.API_CONFIG.API_URL.PROFILE.EDIT,data)
       .then(data => {
         return data;
       });
   }
}
