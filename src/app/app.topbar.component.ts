import { Component, Inject, forwardRef, } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { AppComponent } from './app.component';
import { LocalStorageService } from './shared/local-storage.service';
import { FeaturesService } from './services/features.service';
import { MasterService } from './services/master.service';
import { AppConstant } from './app.constant';
import { ProfileService } from './services/profile.service';
import { OrganizationSettingsService } from './pages/settings/services/organization-settings.service';
import * as _ from 'lodash';
import { DropdownModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBar {
    public userstoragedata: any = {};
    tenantfullname: any = "";
    AppcenterList: any = [];
    activeApps: any[] = [];
    imagesrcpath = "assets/layout/images/appcenter/";
    avatar = "assets/layout/images/avatar.png";
    allmoduleList: any;
    tenantmoduleList: any;
    defaultapplist: any;
    consultantTenantsList: SelectItem[];
    consultantClientExist = false;
    selectedclient: any;
    constructor( @Inject(forwardRef(() => AppComponent)) public app: AppComponent,
        private storageservice: LocalStorageService, private profileservice: ProfileService,
        private featureservice: FeaturesService, public _DomSanitizationService: DomSanitizer,
        private OrgSettingsService: OrganizationSettingsService, private masterservice: MasterService, private router: Router, ) {
        // this.AppcenterList = [
        //     // { title: "eFinance", description: "", status: true, modulepath: "EFINANCE", image_enabled: this.imagesrcpath + "e-finance.png" },
        //     { title: "eCatalogue", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "e-catalogue.png" },
        //     { title: "Customer Connect", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "customer-connect.png" },
        //     { title: "People Connect", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "people-connect.png" },
        //     { title: "eFile", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "e-file.png" },
        //     { title: "eKart", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "e-kart.png" },
        //     { title: "eStore", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "e-store.png" },
        //     { title: "iProcure", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "i-procure.png" },
        //     { title: "iRetail", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "i-retail.png" },
        //     { title: "mPos", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "m-pos.png" },
        //     { title: "Settings", description: "", status: true, modulepath: "SETTINGS", image_enabled: this.imagesrcpath + "settings.png" },
        //     { title: "App-Center", description: "", status: true, modulepath: "APPCENTER", image_enabled: this.imagesrcpath + "app-center.png" },
        //     // { title: "mPos", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "app-icon-10.png", image_disabled: this.imagesrcpath + "m-pos.png" },
        // ];
        this.defaultapplist = {
            "moduleid": 0,
            "modulecode": "ADMINISTRATION",
            "modulename": "Administration",
            "title": "Administration",
            "iconpath": this.imagesrcpath + "admin.png",
            "status": "Active",
            "createdby": 0,
            "createddt": "2017-10-31T09:57:34.000Z",
            "lastupdatedby": 0,
            "lastupdateddt": "2017-10-31T09:57:34.000Z"
        };
        this.AppcenterList.push(this.defaultapplist);
        //this.tenantfullname = this.userstoragedata.fullname;

        setTimeout(() => {
            this.subscribeUserSessionData();
            this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
            this.tenantfullname = this.userstoragedata ? this.userstoragedata.fullname : null;
            this.getprofileimage();
            this.loadmodulelist();
            this.consultantdata();
        }, 100)

    }
    consultantdata() {
        // consultantTenantsList
        var self = this;
        var owndata: any = self.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.OWN_DATA);
        var consultantid = this.userstoragedata.tenantid;
        if (owndata != null) {
            consultantid = owndata.tenantid;
        }
        if (!_.isEmpty(this.userstoragedata)) {
            var reqdata = {
                "consultantid": consultantid
            };
            this.OrgSettingsService.tenantlist(reqdata)
                .then((res) => {
                    if (res.status) {
                        var owntenantname = self.userstoragedata.Tenant.tenantname;
                        self.consultantClientExist = true;
                        if (owndata != null) {
                            owntenantname = owndata.Tenant.tenantname;
                        }
                        self.consultantTenantsList = self.masterservice.formatDataforDropdown("tenantname", res.data, owntenantname);
                        // self.consultantTenantsList = res.data;
                        console.log("consultant's company list: ", self.consultantTenantsList);
                        if (owndata != null) {
                            var selectedclient = _.find(res.data, (data) => {
                                return (data.tenantid == this.userstoragedata.tenantid)
                            });
                            if (selectedclient != undefined) {
                                this.selectedclient = selectedclient;
                            }
                        }
                    }
                    else {
                        self.consultantClientExist = false;
                    }
                    console.log("profile response:", res);
                });
        }
    }
    onSelectConsultantsClient(item) {
        if (item.value != null) {
            this.router.navigate(['./switching', item.value["tenantid"], item.value["consultantid"]]);
            // this.router.navigate([]);
        }
        else {
            this.router.navigate(['./switching', 0, 0]);
        }
    }
    getprofileimage() {
        var self = this;
        if (!_.isEmpty(this.userstoragedata)) {
            this.profileservice.getprofile(this.userstoragedata.userid)
                .then(function (res) {
                    if (res.status) {
                        if (res.data.thumbnailUrl != "" && res.data.thumbnailUrl != undefined) {
                            self.avatar = res.data.thumbnailUrl;
                        }
                    }
                    console.log("profile response:", res);
                });
        }

    }
    loadmodulelist() {
        var data = {};
        this.featureservice.AllModuleList(data).then((response: any) => {
            if (response.status) {
                this.allmoduleList = response.data;
                this.loadtenantmodulelist();
            }
        });
    }
    loadtenantmodulelist() {
        var data = {
            'tenantid': this.userstoragedata.tenantid
        };
        this.featureservice.TenantModuleList(data).then((response: any) => {
            if (response.status) {
                this.tenantmoduleList = response.data;
            }
            this.loadAppcenters();
        });
    }
    loadAppcenters() {
        var appList = [
            { modulecode: "E_FINANCE", iconpath: this.imagesrcpath + "accounting.png" },
            { modulecode: "E_CATALOGUE", iconpath: this.imagesrcpath + "catalogue.png" },
            { modulecode: "E_FILE", iconpath: this.imagesrcpath + "dom.png" },
            { modulecode: "CUST_CON", iconpath: this.imagesrcpath + "crm.png" },
            { modulecode: "PEP_CON", iconpath: this.imagesrcpath + "payroll.png" },
            { modulecode: "E_STORE", iconpath: this.imagesrcpath + "warehouse.png" },
            { modulecode: "I_PROCURE", iconpath: this.imagesrcpath + "e-commerce.png" },
            { modulecode: "I_RETAIL", iconpath: this.imagesrcpath + "retail.png" },
            { modulecode: "E_KART", iconpath: this.imagesrcpath + "purchase.png" },
            { modulecode: "M_POS", iconpath: this.imagesrcpath + "pos.png" },
            // { modulecode: "ADMINISTRATION", iconpath: this.imagesrcpath + "admin.png" },
        ];;
        // var applist = [
        //   { title: "eFinance", description: "", status: true, modulepath: "EFINANCE", image_enabled: this.imagesrcpath + "e-finance.png", image_disabled: this.imagesrcpath + "e-finance-v2.png" },
        //   { title: "eCatalogue", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "e-catalogue.png", image_disabled: this.imagesrcpath + "e-catalogue-v2.png" },
        //   { title: "eFile", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "e-file.png", image_disabled: this.imagesrcpath + "customer-connect-v2.png" },
        //   { title: "Customer Connect", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "customer-connect.png", image_disabled: this.imagesrcpath + "people-connect-v2.png" },
        //   { title: "People Connect", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "people-connect.png", image_disabled: this.imagesrcpath + "e-file-v2.png" },
        //   { title: "eStore", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "e-store.png", image_disabled: this.imagesrcpath + "e-kart-v2.png" },
        //   { title: "iProcure", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "i-procure.png", image_disabled: this.imagesrcpath + "e-store-v2.png" },
        //   { title: "iRetail", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "i-retail.png", image_disabled: this.imagesrcpath + "i-procure-v2.png" },
        //   { title: "eKart", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "e-kart.png", image_disabled: this.imagesrcpath + "i-retail-v2.png" },
        //   { title: "mPOS", description: "", status: false, modulepath: "", image_enabled: this.imagesrcpath + "m-pos.png", image_disabled: this.imagesrcpath + "m-pos-v2.png" },
        //   { title: "Settings", description: "", status: true, modulepath: "SETTINGS", image_enabled: this.imagesrcpath + "settings.png", image_disabled: this.imagesrcpath + "settings.png" },
        // ];
        var self = this;
        self.activeApps = [];
        let appcenterlist = [] as any;
        // tenantmoduleList
        _.map(self.allmoduleList, function (data: any) {
            var exist = _.find(self.tenantmoduleList, function (o) {
                return o == data.modulecode;
            });
            if (exist != undefined) {
                data.iconpath = self.imagesrcpath + data.iconpath;
                data.title = data.modulename;
                data.status = true;
                appcenterlist.push(data);
            }
        });
        // var appcenterlist = _.map(self.allmoduleList, function (data: any) {
        //     if (data.modulecode == "E_FINANCE" || data.modulecode == "E_FILE"
        //         || data.modulecode == "CUST_CON" || data.modulecode == "PEP_CON"
        //         || data.modulecode == "ADMINISTRATION"
        //     ) {
        //         data.title = data.modulename;
        //     } else {
        //         data.title = "Will be available soon";
        //     }
        //     let d = _.filter(self.tenantmoduleList, function (mdl) {
        //         return (mdl == data.modulecode)
        //     });
        //     let dapp: any = _.filter(appList, function (mdl) {
        //         return (mdl.modulecode == data.modulecode)
        //     });
        //     if (d != undefined) {
        //         data.status = true;
        //     }
        //     else
        //         data.status = false;
        //     if (dapp != undefined) {
        //         if (data.iconpath == null) {
        //             data.iconpath = dapp[0].iconpath;
        //         }
        //     }
        //     if (data.modulecode != "E_FINANCE") {

        //     }
        //     return data;
        // });
        this.AppcenterList = _.filter(appcenterlist, function (data) {
            return (data.modulecode != AppConstant.APP.MODULE_NAME);
        });
        this.AppcenterList.push({
            "moduleid": 0,
            "modulecode": "ADMINISTRATION",
            "modulename": "Administration",
            "title": "Administration",
            "iconpath": this.imagesrcpath + "admin.png",
            "status": "Active",
            "createdby": 0,
            "createddt": "2017-10-31T09:57:34.000Z",
            "lastupdatedby": 0,
            "lastupdateddt": "2017-10-31T09:57:34.000Z"
        });
        this.AppcenterList.push({
            "moduleid": 0,
            "modulecode": "APPCENTER",
            "modulename": "APPCENTER",
            "title": "App Center",
            "iconpath": this.imagesrcpath + "app-center.png",
            "status": "Active",
            "createdby": 0,
            "createddt": "2017-10-31T09:57:34.000Z",
            "lastupdatedby": 0,
            "lastupdateddt": "2017-10-31T09:57:34.000Z"
        });

    }
    navigateToApp(app: any) {
        var url = "";
        if (app.status) {
            if (app.modulecode == "APPCENTER") {
                url = AppConstant.ACCOUNT.ACC_URL + "appcenter";
            }
            else if (app.modulecode == "ADMINISTRATION") {
                url = AppConstant.ACCOUNT.ACC_URL;
            }
            else {
                var features = AppConstant.FEATURES;
                var d = _.find(features, function (value, key) {
                    return (app.modulecode == key)
                });
                if (!_.isEmpty(d)) {
                    // console.log(this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN));
                    url = d.URL + "/" + this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN).token;
                }
            }
            window.location.href = url;
        }
    }
    setLogin() {
        this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
        this.tenantfullname = this.userstoragedata ? this.userstoragedata.fullname : null;
    }

    subscribeUserSessionData() {
        this.storageservice.getUserSessionData().subscribe((userData) => {
            this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
            this.tenantfullname = this.userstoragedata ? this.userstoragedata.fullname : null;
        });
    }
}