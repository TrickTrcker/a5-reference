import { Component, OnInit } from '@angular/core';
import { Spinkit } from '../http-loader/spinkits';
import { LocalStorageService } from '../shared/local-storage.service';
import { AppConstant } from '../app.constant';
import { NgxPermissionsService } from 'ngx-permissions';
@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.scss']
})
export class LogOutComponent implements OnInit {

  constructor(public localStorage: LocalStorageService,private permissionsService: NgxPermissionsService) {
    this.permissionsService.flushPermissions();
    let token: any = this.localStorage.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN);
    this.localStorage.clearAllItem();
    window.location.href = AppConstant.ACCOUNT.ACC_URL + "login";
  }

  ngOnInit() {
  }

}
