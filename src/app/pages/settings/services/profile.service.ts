import { Injectable } from '@angular/core';
import { AppConstant } from '../../../app.constant';

import { CommonHttpService } from "../../../shared/common-http.service";
@Injectable()
export class ProfileService {

 constructor(private httpService: CommonHttpService) { }
  mainUrl = AppConstant.API_ENDPOINT;
   public ChangePassword(data: any):Promise<any> {
   return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.PROFILE.CHANGEPWD,data)
      .then(data => {
        return data;
      });
  }

}
