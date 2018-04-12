import { Injectable } from '@angular/core';
import { CommonHttpService} from '../../../shared/common-http.service';
import {AppConstant}from '../../../../app/app.constant'

@Injectable()
export class LedgerService {
mainUrl =AppConstant.API_ENDPOINT;
  constructor(private httpService: CommonHttpService) { }
  public getAll(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.BOOKOFACCOUNTS.LIST,data)
    .then(data=> {        
          return data;
    });
  }
    public group(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.ACC_BOOKOFACCOUNTS.LIST,data)
    .then(data=> {         
          return data;
    });
  }
    public getbyid(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.ACC_BOOKOFACCOUNTS.LIST,data)
    .then(data=> {         
          return data;
    });
  }
    public create(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.BOOKOFACCOUNTS.CREATE,data)
    .then(data=> {         
          return data;
    });
  }
  public update(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.BOOKOFACCOUNTS.UPDATE,data)
    .then(data=> {         
          return data;
    });
  }
}
