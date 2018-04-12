import { Injectable } from '@angular/core';
import { AppConstant } from '../app.constant';
import { CommonHttpService} from '../shared/common-http.service';

@Injectable()
export class UserService {
 
  constructor(private httpService: CommonHttpService) { }
  mainUrl = AppConstant.API_ENDPOINT;
 public FindAll(data: any):Promise<any> {
   return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.TNTUSER.FINDALL,data)
      .then(data => {
        return data;
      });
  }
public saveUser(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.TNTUSER.CREATE,data)
      .then(data => {
        return data;
      });
  }
  public updateUser(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.TNTUSER.UPDATE,data)
      .then(data => {
        return data;
      });
  }
extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
  private handleError(error: Response | any) {
    console.error("error");
    return "error";
  }
}
