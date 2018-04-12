import { Injectable } from '@angular/core';
import { CommonHttpService } from '../shared/common-http.service';
import { AppConstant } from '../app.constant';
@Injectable()
export class CommonService {

  constructor(private httpService: CommonHttpService) { }
  
  public getGSTRList(data: any): Promise<any> {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.API_URL.GST_FILING.GSTR, data)
      .then(data => {
        return data;
      });
  }

 
}
