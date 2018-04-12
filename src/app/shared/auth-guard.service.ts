import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LocalStorageService } from '../shared/local-storage.service';
import { AppConstant } from '../app.constant';
import * as _ from 'lodash';
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private storageservice: LocalStorageService) { }

  canActivate() {
    var isAuthorized: any = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.STR_AUTHSUCCESS);
    if (!_.isEmpty(this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER))
      && (isAuthorized == true || isAuthorized == "true")) {
      return true;
    }

    // not logged in so redirect to login page
    // this.storageservice.clearAllItem();
    // window.location.href = "./assets/access.html";
   
    // return false;
  }
}
