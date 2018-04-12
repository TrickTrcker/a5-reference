import { Injectable } from '@angular/core';
import { CommonHttpService} from '../../../shared/common-http.service';
import{AppConstant}from '../../../../app/app.constant'
@Injectable()
export class PartiesService {
mainUrl =AppConstant.API_ENDPOINT;
  constructor(private httpService: CommonHttpService) { }
  public getAll(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.CONTACT.LIST,data)
    .then(data=> {          
          return data;
    });
  }
    public create(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.CONTACT.CREATE,data)
    .then(data=> {        
          return data;
    });
  }
      public update(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.CONTACT.UPDATE,data)
    .then(data=> {        
          return data;
    });
  }
  
}
