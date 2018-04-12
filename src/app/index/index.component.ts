import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppConstant } from '../app.constant';
import { FeaturesService } from '../services/features.service';
import { AppTopBar } from '../app.topbar.component';
import { LocalStorageService } from '../shared/local-storage.service';
import { AuthCheckService } from '../shared/auth-check.service';
import { NgxPermissionsService } from 'ngx-permissions';
import 'rxjs/add/operator/switchMap';
import * as _ from 'lodash';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  userData: any;
  sessionrefkey: string;
  block_text: string = "Loading...";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
    private featureservice: FeaturesService,
    public localStorage: LocalStorageService,
    private authcheckservice: AuthCheckService,
    private permissionsService: NgxPermissionsService
  ) { }

  ngOnInit() {

    this.route.paramMap
      .subscribe((params: ParamMap) => {

        this.sessionrefkey = params.get("sessionrefkey");
        if (this.sessionrefkey.indexOf("ibacus") > -1) {
          this.localStorage.clearAllItem();
          console.log("-----------localstorage cleared------------");
          let queryParam = { "sessionKey": this.sessionrefkey };
          let url = AppConstant.ACCOUNT.BASE_URL + AppConstant.ACCOUNT.API.SESSION_INFO + queryParam.sessionKey;
          this.block_text = "Checking..";
          this.authcheckservice.checkSession(url).then((response: any) => {
            console.log("index called");
            if (response.status) {
              this.userData = response.data;
              this.initSession();

            }
            else {
              this.localStorage.clearAllItem();
              window.location.href = AppConstant.ACCOUNT.ACC_URL + "login";
            }
          });
        }
      });
  }

  checkSession(queryParam) {
    let url = AppConstant.ACCOUNT.BASE_URL + AppConstant.ACCOUNT.API.SESSION_INFO + queryParam.sessionKey;
    return this.httpClient.get(url).toPromise().
      catch(e => {
        console.log("error happend", e);
      });
  }

  initSession() {
    this.block_text = "Resource loading..";
    this.localStorage.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.STR_AUTH, "true");
    this.localStorage.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.CLIENT_SWITCHED, "false");
    this.localStorage.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.STR_AUTHSUCCESS, "true");
    this.userData.tenantname = this.userData.fullname ? this.userData.fullname : 'GNTS';
    this.localStorage.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER, this.userData);

    var session = this.userData;
    var app_settings:any =_.groupBy(session.Tenant.settings,function(d){ return d.settingref});
    this.localStorage.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.APPSETTING, app_settings);
        // find fin year
    var finyear= _.find(AppConstant.API_CONFIG.FINYEARS,{'finyear' :app_settings.CUR_FIN_YR[0].settingvalue});

    this.localStorage.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR, finyear);
    // if (this.userData.rolename != 'SuperAdmin')
    // {
    //     localStorage.setItem(prefix+AppConstant.API_CONFIG.LOCALSTORAGE.HEADS, JSON.stringify(this.sessionData.heads));
    // }
    var token = { 'token': this.sessionrefkey }
    //localStorage.setItem(prefix+AppConstant.API_CONFIG.LOCALSTORAGE.USERROLE, JSON.stringify(this.sessionData.roles));
    var resources = finyear;

    this.localStorage.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.RESOURCE, resources);
    this.localStorage.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN, token);
    let user: any = this.localStorage.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    console.log("userdata from app comp", user);
    this.permissionsService.flushPermissions();
    this.featureservice.featurescreen_list(user.roleid).then((res: any) => {

      console.log("screens: ", res);
      if (res.status) {
        this.permissionsService.loadPermissions(res.data.features);
        this.block_text = "Loading permissions..";
        this.router.navigate(['']);
        window.location.href = "";
        return false;
      }

      //    this.permissionsService.loadPermissions(res,(permissionName, permissionStore) => {
      //     return !!permissionStore[permissionName];
      // });
    });

    // Redirect to Dashboard Page

    return false;
  }

}
