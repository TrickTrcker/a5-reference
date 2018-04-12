import { Injectable } from '@angular/core';
import { AppConstant } from '../../app.constant';
import { CommonHttpService} from '../../shared/common-http.service';
@Injectable()
export class RoleService {
 mainUrl = AppConstant.API_ENDPOINT;
  constructor(private httpService: CommonHttpService) {}
    public getAll(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl+AppConstant.API_CONFIG.API_URL.ROLES.FINDALL,data)
    .then(data=> {
           console.log(data);          
          return data;
    });
  }
    public getbyid(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl+AppConstant.API_CONFIG.API_URL.ROLES.FINDBYID,data)
    .then(data=> {
           console.log(data);          
          return data;
    });
    
  }

    public create(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl+AppConstant.API_CONFIG.API_URL.ROLES.CREATE,data)
    .then(data=> {
           console.log(data);          
          return data;
    });
    
  }
    public update(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl+AppConstant.API_CONFIG.API_URL.ROLES.UPDATE,data)
    .then(data=> {
           console.log(data);          
          return data;
    });
    
  }


}
