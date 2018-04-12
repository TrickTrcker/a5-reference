import { Injectable } from '@angular/core';
import { CommonHttpService } from '../shared/common-http.service';
import { AppConstant } from '../app.constant';

@Injectable()
export class ProductallService {
  mainUrl =AppConstant.API_ENDPOINT;
  constructor(private httpService: CommonHttpService) { }
public getAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.TNT_UOM.FINDALL, data)
      .then(data => {
        return data;
      });
  }
  public ProductCreate(data: any): Promise<any> {
    return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.TNT_PRODUCTS.CREATE, data)
      .then(data => {
        return data;
      });
  }
    public ProductUpdate(data: any): Promise<any> {
    return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.TNT_PRODUCTS.UPDATE, data)
      .then(data => {
        return data;
      });
  }
  public ProductGetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.TNT_PRODUCTS.LIST, data)
      .then(data => {
        return data;
      });
  }

  public brandGetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.BRAND.FINDALL, data)
      .then(data => {
        return data;
      });
  }

   public categoryGetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.TNT_CATEGORY.FINDALL, data)
      .then(data => {
        return data;
      });
  }
  public hsnGetAll(data: any): Promise<any> {
    return this.httpService.globalPostService(this.mainUrl + AppConstant.API_CONFIG.API_URL.TNT_PRODUCTS.HSNCODE, data)
      .then(data => {
        return data;
      });
  }

}
