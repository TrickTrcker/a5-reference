import { Injectable } from '@angular/core';
import { AppConstant } from '../../../app.constant';
import { CommonHttpService} from '../../../shared/common-http.service';
@Injectable()
export class BrandService {
mainUrl = AppConstant.API_ENDPOINT;
  constructor(private httpService: CommonHttpService) { }
  public getAll(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl+AppConstant.API_CONFIG.API_URL.BRAND.FINDALL,data)
    .then(data=> {        
          return data;
    });
  }
    public getbyid(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl+AppConstant.API_CONFIG.API_URL.TNT_BRANDS.FINDBYID,data)
    .then(data=> {
          return data;
    });
  }
    public create(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl+AppConstant.API_CONFIG.API_URL.BRAND.CREATE,data)
    .then(data=> {
          return data;
    });
  }
  public update(data: any):Promise<any> {
     return this.httpService.globalPostService(this.mainUrl+AppConstant.API_CONFIG.API_URL.BRAND.UPDATE,data)
    .then(data=> {
          return data;
    });
  }
}
