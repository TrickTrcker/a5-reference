import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Router, NavigationExtras } from '@angular/router';
import * as _ from "lodash";
import { FeaturesService } from "./../services/features.service";
import { LocalStorageService } from './../shared/local-storage.service';
import { AppConstant } from './../app.constant';
@Component({
  selector: 'app-tenant-switching',
  templateUrl: './tenant-switching.component.html',
  styleUrls: ['./tenant-switching.component.scss']
})
export class TenantSwitchingComponent implements OnInit {
  userstoragedata: any = [];
  clientCredData: any = [];
  userowndata: any = [];
  clientswictched: any = "false";
  constructor(
    private route: ActivatedRoute,
    private FeaturesService: FeaturesService,
    private storageservice: LocalStorageService) {
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.userowndata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.OWN_DATA);
    this.clientswictched = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.CLIENT_SWITCHED);
    var owntenantid = this.userstoragedata.Tenant.tenantid;

    this.route.params.subscribe(params => {
      if (!_.isEmpty(params)) {
        if (params.clientid != 0 && params.clientid != null && params.clientid != undefined) {
          var reqdata: any = {
            "userid": this.userstoragedata.userid,
            "tenantid": owntenantid,
            "clientid": params.clientid
          };
          if (this.userowndata != null || this.userowndata != undefined) {
            reqdata.owntenantid = this.userowndata.Tenant.tenantid;
            console.log("swtiching params", params);
            let token: any = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN);
            this.FeaturesService.LogOut(token.token).then((res) => {
              this.initiateClientLogin(reqdata);
            })
          }
          else {
            this.initiateClientLogin(reqdata);
          }
        }
        else {
          this.resetOwnSession();
          window.location.href = "";
          return false;
        }
      }
      else{
        this.resetOwnSession();
        window.location.href = "";
        return false;
      }
    });
  }
  initiateClientLogin(reqdata) {
    this.FeaturesService.consultantLogin(reqdata)
      .then((res) => {
        if (res.status) {
          console.log();
          console.log("consultant client response:", res);
          this.clientCredData = res.data;
          this.resetOwnSession();
          this.initClientSession();
        }

      });
  }
  initClientSession() {
    var userdata: any = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    var owntkn = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN);
    // this.storageservice.removeItem(AppConstant.API_CONFIG.LOCALSTORAGE.CLIENT_SWITCHED);
    this.storageservice.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.CLIENT_SWITCHED, "true");
    this.storageservice.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.CLIENT_DATA, this.clientCredData);

    this.storageservice.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.OWN_DATA, _.clone(userdata));
    this.storageservice.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.OWN_TOKEN, _.clone(owntkn));
    // set new client sessions
    userdata.Tenant = this.clientCredData.Tenant;
    userdata.Role = this.clientCredData.Role;
    userdata.tenantid = this.clientCredData.clientid;
    userdata.dbname = this.clientCredData.dbname;
    //set new client token
    owntkn.token = this.clientCredData.consultantKey;
    this.storageservice.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER, userdata);
    this.storageservice.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN, _.clone(owntkn));

    window.location.href = "";
    return false;
    //this.clientCredData
    // this.storageservice.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER, this.userData);
  }
  resetOwnSession() {

    // remove client data 
    this.storageservice.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.CLIENT_SWITCHED, "false");
    this.storageservice.removeItem(AppConstant.API_CONFIG.LOCALSTORAGE.CLIENT_DATA);

    // get set own session data
    //get
    var owndata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.OWN_DATA);
    var owntoken = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.OWN_TOKEN);
    //set
    if(owndata != null)
    {
      this.storageservice.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER, _.clone(owndata));
    }
   if(owntoken != null)
   {
    this.storageservice.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN, _.clone(owntoken));
   }
    // remove temp own data
    this.storageservice.removeItem(AppConstant.API_CONFIG.LOCALSTORAGE.OWN_DATA);
    this.storageservice.removeItem(AppConstant.API_CONFIG.LOCALSTORAGE.OWN_TOKEN);
  }
  ngOnInit() {
  }

}
