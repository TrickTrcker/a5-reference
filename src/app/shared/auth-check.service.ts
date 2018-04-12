import { Injectable } from '@angular/core';
import {LocalStorageService} from '../shared/local-storage.service';
import { AppConstant } from '../app.constant';
import { CommonHttpService } from '../shared/common-http.service';
@Injectable()
export class AuthCheckService {

  constructor(private localStorage:LocalStorageService,private httpService: CommonHttpService) { }
  public checkSession(queryParam) {
    return this.httpService.globalGetServiceByUrl(queryParam, "")
    .then(data => {
      console.log(data);
      return data;
    });
}
  checkTenant(): Promise<boolean> {
      console.log(this.localStorage);
    return new Promise<boolean>((resolve,reject) => {
       var tokenExists:any =  this.localStorage.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN);
       
       if(!tokenExists || !tokenExists.token)
       {           
           window.location.href ="/"; 
           reject(true);
       }
       else
       {
           resolve(true);
       }


    });

  };
  checkTenantExists (){
       var tokenExists:any =  this.localStorage.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN);
       
       if(!tokenExists || !tokenExists.token)
       {  
           return false;
       }
       else
       {
           return true;
       }
  }

}
