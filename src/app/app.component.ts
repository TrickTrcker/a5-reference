import { Component, AfterViewInit, ElementRef, Renderer, ViewChild, OnInit } from '@angular/core';
import { LocalStorageService } from './shared/local-storage.service';
import { MessagesService } from './shared/messages.service';
import { AppConstant } from './app.constant'
import { FeaturesService } from './services/features.service';
import { Message } from 'primeng/primeng';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { AuthCheckService } from './shared/auth-check.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { HelpDocComponent } from './help-doc/help-doc.component';
import { PrimengConstant } from './app.primeconfig';
enum MenuMode {
    STATIC,
    OVERLAY,
    SLIM
};

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {

    userLoggedIn = false;

    menu: MenuMode = MenuMode.STATIC;

    layout: string = 'default';

    darkMenu: boolean;

    documentClickListener: Function;

    staticMenuInactive: boolean;

    overlayMenuActive: boolean;

    mobileMenuActive: boolean;

    menuClick: boolean;

    menuButtonClick: boolean;

    topbarMenuButtonClick: boolean;

    AppsMenuButtonClick: boolean;

    topbarMenuClick: boolean;

    AppsMenuClick: boolean;

    topbarMenuActive: boolean;

    AppsMenuActive: boolean;

    activeTopbarItem: Element;

    resetSlim: boolean;

    messages: Message[] = [];

    successMessage: Message[] = [];

    clearSuccessMsg: any;
    helpdoc_display: boolean = false;
    cheatsheet: any;
    constructor(
        public Renderer2: Renderer,
        public localStorage: LocalStorageService,
        public messageService: MessagesService,
        private featureservice: FeaturesService,
        private authcheckservice: AuthCheckService,
        private permissionsService: NgxPermissionsService, private router: Router,
        private _hotkeysService: HotkeysService) {

        const shrtkeys = PrimengConstant.SHORTCUTKEYS;
        // Shortcut Key - for help document
        var self = this;
        this._hotkeysService.add(new Hotkey(shrtkeys.HELP.KEY, (event: KeyboardEvent): boolean => {
            this.cheatsheet = this._hotkeysService.hotkeys;
            this.helpdoc_display = true;
            return false;
        }, [], shrtkeys.HELP.TXT));
        // Add Invoice
        this._hotkeysService.add(new Hotkey(shrtkeys.ADD.INVOICE.KEY, (event: KeyboardEvent): boolean => {

            this.router.navigate(['sales/addedit']);
            return false;
        }, [], shrtkeys.ADD.INVOICE.TXT));
        // Add Bill
        this._hotkeysService.add(new Hotkey(shrtkeys.ADD.BILL.KEY, (event: KeyboardEvent): boolean => {

            this.router.navigate(['purchase/billedit']);
            return false;
        }, [], shrtkeys.ADD.BILL.TXT));
        // View Getstarted Page
        this._hotkeysService.add(new Hotkey(shrtkeys.GETSTARTED.VIEW.KEY, (event: KeyboardEvent): boolean => {

            this.router.navigate(['getstarted']);
            return false;
        }, [], shrtkeys.GETSTARTED.VIEW.TXT));
        this._hotkeysService.add(new Hotkey(shrtkeys.ADD.PRODUCT.KEY, (event: KeyboardEvent): boolean => {
            this.router.navigate(['products']);
            return false;
        }, [], shrtkeys.ADD.PRODUCT.TXT));
        // Shortcut Key - View Report Page
        this._hotkeysService.add(new Hotkey(shrtkeys.REPORT.VIEW.KEY, (event: KeyboardEvent): boolean => {
            this.router.navigate(['reports/list']);
            return false;
        }, [],shrtkeys.REPORT.VIEW.TXT));
        // Shortcut Key - Add Payment
        this._hotkeysService.add(new Hotkey(shrtkeys.ADD.PAYMENT.KEY, (event: KeyboardEvent): boolean => {
            this.router.navigate(['payment/paymentaddedit']);
            return false;
        }, [], shrtkeys.ADD.PAYMENT.TXT));
        // Shortcut Key - Add Receipt
        this._hotkeysService.add(new Hotkey(shrtkeys.ADD.RECEIPT.KEY, (event: KeyboardEvent): boolean => {
            this.router.navigate(['receipts/receiptedit']);
            return false;
        }, [],  shrtkeys.ADD.RECEIPT.TXT));
        // Shortcut Key - Add Journal
        this._hotkeysService.add(new Hotkey(shrtkeys.ADD.JOURNALS.KEY, (event: KeyboardEvent): boolean => {
            this.router.navigate(['accounts/journals']);
            return false;
        }, [], shrtkeys.ADD.JOURNALS.TXT));
        // Shortcut Key - Add Vendor Advance
        this._hotkeysService.add(new Hotkey(shrtkeys.ADD.VENDOR_ADV.KEY, (event: KeyboardEvent): boolean => {
            this.router.navigate(['purchase/vendoradvanceaddedit']);
            return false;
        }, [], shrtkeys.ADD.VENDOR_ADV.TXT));
        // Shortcut Key - Add Customer Advance
        this._hotkeysService.add(new Hotkey(shrtkeys.ADD.CUSTOMER_ADV.KEY, (event: KeyboardEvent): boolean => {
            this.router.navigate(['sales/Addcustomeradvance']);
            return false;
        }, [], shrtkeys.ADD.CUSTOMER_ADV.TXT));
        // this.featureservice.featurescreen_list().then(res => {
        //        this.permissionsService.loadPermissions(res);
        //     console.log('screens: ',res);
        // //    this.permissionsService.loadPermissions(res,(permissionName, permissionStore) => {
        // //     return !!permissionStore[permissionName];
        // // });
        // });
        if (!_.isEmpty(this.localStorage.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER))
            && !this.localStorage.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.STR_PREFIX + AppConstant.API_CONFIG.LOCALSTORAGE.STR_AUTHSUCCESS)) {
            let user: any = this.localStorage.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
            console.log('userdata from app comp', user.roleid);
            this.featureservice.featurescreen_list(user.roleid).then((res: any) => {
                console.log('screens: ', res);
                if (res.status) {
                    this.permissionsService.loadPermissions(res.data.features);
                }
            });
        }
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                console.log('navigation started', event.url);

            }
            if (event instanceof NavigationEnd) {
                console.log('navigation end.', event.url);
                this.helpdoc_display = false;
            }
        });

    }

    ngOnInit() {
        this.subscribeMessages();
        this.subscribeSuccessMessage();
    };

    checkSessionToken() {
        let tkn: any = this.localStorage.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN);
        let url = AppConstant.ACCOUNT.BASE_URL + AppConstant.ACCOUNT.API.SESSION_INFO + tkn.token;
        this.authcheckservice.checkSession(url).then((response: any) => {
            if (response) {
                if (response.status) {
                    this.localStorage.clearAllItem();
                    window.location.href = AppConstant.ACCOUNT.ACC_URL + 'login';
                }
                //   this.userData = response.data;
                //   this.initSession();
            }
            else {
                this.localStorage.clearAllItem();
                window.location.href = AppConstant.ACCOUNT.ACC_URL + 'login';
            }
        });
    }

    ngAfterViewInit() {
        // this.documentClickListener = this.Renderer2.listenGlobal('window', 'focus', (event) => {
        //     console.log('window focused.');
        //     this.checkSessionToken();
        // });
        this.documentClickListener = this.Renderer2.listenGlobal('body', 'click', (event) => {
            if (!this.menuClick && !this.menuButtonClick) {
                this.mobileMenuActive = false;
                this.overlayMenuActive = false;
                this.resetSlim = true;
            }

            if (!this.topbarMenuClick && !this.topbarMenuButtonClick) {
                this.topbarMenuActive = false;
            }
            if (!this.AppsMenuClick && !this.AppsMenuButtonClick) {
                this.AppsMenuActive = false;
            }
            this.menuClick = false;
            this.menuButtonClick = false;
            this.topbarMenuClick = false;
            this.AppsMenuClick = false;
            this.topbarMenuButtonClick = false;
            this.AppsMenuButtonClick = false;

        });
    }


    subscribeMessages() {
        this.messageService.getMessages().subscribe((message) => {
            if (!message) {
                // clear alerts when an empty alert is received
                this.messages = [];
                return;
            }
            this.messages.push(message);
        });
    }

    subscribeSuccessMessage() {
        this.messageService.getSuccessMessage().subscribe((message) => {
            this.successMessage = [];
            this.successMessage.push(message);
            if (this.clearSuccessMsg) {
                clearTimeout(this.clearSuccessMsg);
            }

            this.clearSuccessMsg = setTimeout(() => {
                this.successMessage = [];
            }, 2500)
        });
    }

    onMenuButtonClick(event: Event) {
        this.menuButtonClick = true;

        if (this.isMobile()) {
            this.mobileMenuActive = !this.mobileMenuActive;
        }
        else {
            if (this.staticMenu)
                this.staticMenuInactive = !this.staticMenuInactive;
            else if (this.overlayMenu)
                this.overlayMenuActive = !this.overlayMenuActive;
        }

        event.preventDefault();
    }

    onTopbarMenuButtonClick(event: Event) {
        this.topbarMenuButtonClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;
        event.preventDefault();
    }
    onAppsMenuButtonClick(event: Event) {
        this.AppsMenuButtonClick = true;
        this.AppsMenuActive = !this.AppsMenuActive;
        event.preventDefault();
    }

    onTopbarItemClick(event: Event, item: Element) {
        if (this.activeTopbarItem === item)
            this.activeTopbarItem = null;
        else
            this.activeTopbarItem = item;

        event.preventDefault();
    }

    onTopbarMenuClick(event: Event) {
        this.topbarMenuClick = true;
    }

    onAppsMenuClick(event: Event) {
        this.AppsMenuClick = true;
        if (this.AppsMenuActive == true) {
            this.AppsMenuActive = false;
        }
        else
            this.AppsMenuActive = true;
    }

    onMenuClick(event: Event) {
        this.menuClick = true;
        this.resetSlim = false;
    }

    get slimMenu(): boolean {
        return this.menu === MenuMode.SLIM;
    }

    get overlayMenu(): boolean {
        return this.menu === MenuMode.OVERLAY;
    }

    get staticMenu(): boolean {
        return this.menu === MenuMode.STATIC;
    }

    changeToSlimMenu() {
        this.menu = MenuMode.SLIM;
    }

    changeToOverlayMenu() {
        this.menu = MenuMode.OVERLAY;
    }

    changeToStaticMenu() {
        this.menu = MenuMode.STATIC;
    }

    isMobile() {
        return window.innerWidth < 640;
    }

    logout() {
        let token: any = this.localStorage.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN);
        if (!_.isEmpty(token)) {
            setTimeout(() => {
                this.featureservice.LogOut(token.token).then((res) => {
                    this.localStorage.clearAllItem();
                    window.location.href = AppConstant.ACCOUNT.ACC_URL + 'login';
                })
            });
        }
        else {
            this.localStorage.clearAllItem();
            window.location.href = AppConstant.ACCOUNT.ACC_URL + 'login';
        }

    }
}