import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HotkeyModule} from 'angular2-hotkeys';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { CurrencyformatPipe } from './pipes/currencyformat.pipe';
import 'rxjs/add/operator/toPromise';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { AppRoutes } from './app.routes';
import { IndexComponent } from './index/index.component';

// import { AccordionModule } from 'primeng/primeng';
//import { AutoCompleteModule } from 'primeng/primeng';
//import { BreadcrumbModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
//import { CalendarModule } from 'primeng/primeng';
// import { CarouselModule } from 'primeng/primeng';
import { ChartModule } from 'primeng/primeng';
// import { ColorPickerModule } from 'primeng/primeng';
// import { CheckboxModule } from 'primeng/primeng';
// import { ChipsModule } from 'primeng/primeng';
// import { CodeHighlighterModule } from 'primeng/primeng';
import { ConfirmDialogModule,ConfirmationService } from 'primeng/primeng';
import { SharedModule } from 'primeng/primeng';
// import { ContextMenuModule } from 'primeng/primeng';
// import { DataGridModule } from 'primeng/primeng';
import { DataListModule } from 'primeng/primeng';
// import { DataScrollerModule } from 'primeng/primeng';
import { DataTableModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
// import { DragDropModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
// import { EditorModule } from 'primeng/primeng';
// import { FieldsetModule } from 'primeng/primeng';
//import { FileUploadModule } from 'primeng/primeng';
// import { GalleriaModule } from 'primeng/primeng';
// import { GMapModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
// import { InputMaskModule } from 'primeng/primeng';
// import { InputSwitchModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { InputTextareaModule } from 'primeng/primeng';
//import { LightboxModule } from 'primeng/primeng';
// import { ListboxModule } from 'primeng/primeng';
// import { MegaMenuModule } from 'primeng/primeng';
import { MenuModule } from 'primeng/primeng';
//import { MenubarModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
//import { MultiSelectModule } from 'primeng/primeng';
//import { OrderListModule } from 'primeng/primeng';
// import { OrganizationChartModule } from 'primeng/primeng';
//import { OverlayPanelModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { PanelMenuModule } from 'primeng/primeng';
//import { PasswordModule } from 'primeng/primeng';
//import { PickListModule } from 'primeng/primeng';
// import { ProgressBarModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
// import { RatingModule } from 'primeng/primeng';
// import { ScheduleModule } from 'primeng/primeng';
import { SelectButtonModule } from 'primeng/primeng';
// import { SlideMenuModule } from 'primeng/primeng';
// import { SliderModule } from 'primeng/primeng';
// import { SpinnerModule } from 'primeng/primeng';
// import { SplitButtonModule } from 'primeng/primeng';
// import { StepsModule } from 'primeng/primeng';
import { TabMenuModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
// import { TerminalModule } from 'primeng/primeng';
// import { TieredMenuModule } from 'primeng/primeng';
import { ToggleButtonModule } from 'primeng/primeng';
import { ToolbarModule } from 'primeng/primeng';
import {KeyFilterModule} from 'primeng/keyfilter';
// import { TooltipModule } from 'primeng/primeng';
//import { TreeModule } from 'primeng/primeng';
//import { TreeTableModule } from 'primeng/primeng';
// import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';.
import { HttpLoaderModule } from './http-loader/http-loader.module';
import { AppComponent } from './app.component';
import { AppMenuComponent, AppSubMenu } from './app.menu.component';
import { AppTopBar } from './app.topbar.component';
import { AppFooter } from './app.footer.component';
// import { CarService } from './demo/service/carservice';
// import { CountryService } from './demo/service/countryservice';
// import { EventService } from './demo/service/eventservice';
// import { NodeService } from './demo/service/nodeservice';
import { ProductallService } from './products/productall.service';
import { UserService } from './services/user.service';
import { AppConstant } from './app.constant';
import { PrimengConstant } from './app.primeconfig';
import { GetstartedComponent } from './pages/getstarted/getstarted.component';
import { SettingsModule } from './pages/settings/settings.module';
// import { ProductsComponent } from './products/products.component';
import { LocalStorageService } from './shared/local-storage.service';
import { AuthCheckService } from './shared/auth-check.service';
import { AuthGuard } from './shared/auth-guard.service';
import { JWTTokenInterceptorService } from './shared/jwttoken-interceptor.service';
import { CommonHttpService } from './shared/common-http.service';
import { ProductlistComponent } from './products/productlist.component';
import { BankModule } from './bank/bank.module';
import { MasterService } from './services/master.service';
import { ProfileService } from './services/profile.service';
import { FeaturesService } from './services/features.service';
import { DateformatPipe } from './pipes/dateformat.pipe';
import { NotificationsComponent } from './shared/notifications/notifications.component';
import { NotificationsService } from './shared/notifications.service';
import { MessagesService } from './shared/messages.service';
import { DashboardService } from './services/dashboard.service';
import { RemovelettersPipe } from './pipes/removeletters.pipe';
import { AuthGuardDirective } from './shared/directives/auth-guard.directive';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { BlockUIModule } from 'primeng/primeng';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SalesService } from './services/sales/sales.service';
import { AmountsToWordsService } from './services/amounts-to-words.service';
import { IbNumberOnlyDirective } from './directives/ib-number-only.directive';
import { ViewProductsComponent } from './products/view-products/view-products.component';
import { LogOutComponent } from './log-out/log-out.component';
//permission module
import { NgxPermissionsModule } from 'ngx-permissions';
import {TaxsummaryComponent}from'./gstfiling/taxsummary/taxsummary.component';
import { TenantSwitchingComponent } from './tenant-switching/tenant-switching.component';
import { HelpDocComponent } from './help-doc/help-doc.component';
// import { LedgerviewComponent } from './shared/components/ledgerview/ledgerview.component';
import { SharedModuleModule } from './shared-module/shared-module.module';
@NgModule({

    imports: [
        BrowserModule,
        NgxPermissionsModule.forRoot(),
        HotkeyModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        AppRoutes,
        HttpModule,
        HttpClientModule,
        BrowserAnimationsModule,
        // AccordionModule,
     //   AutoCompleteModule,
     //   BreadcrumbModule,
        ButtonModule,
     //   CalendarModule,
        // CarouselModule,
        ChartModule,
        // ColorPickerModule,
        // CheckboxModule,
        // ChipsModule,
        // CodeHighlighterModule,
        ConfirmDialogModule,
        SharedModule,
       // ContextMenuModule,
        // DataGridModule,
       DataListModule,
        // DataScrollerModule,
        DataTableModule,
        DialogModule,
        // DragDropModule,
        DropdownModule,
        // EditorModule,
        // FieldsetModule,
    //    FileUploadModule,
        // GalleriaModule,
        // GMapModule,
        GrowlModule,
        // InputMaskModule,
        // InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
    //    LightboxModule,
        // ListboxModule,
        // MegaMenuModule,
  //      MenuModule,
  //      MenubarModule,
        MessagesModule,
//        MultiSelectModule,
///        OrderListModule,
        // OrganizationChartModule,
  //      OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
  //      PasswordModule,
//        PickListModule,
        // ProgressBarModule,
        RadioButtonModule,
        // RatingModule,
        // ScheduleModule,
        SelectButtonModule,
        // SlideMenuModule,
        // SliderModule,
        // SpinnerModule,
        // SplitButtonModule,
        // StepsModule,
        TabMenuModule,
        TabViewModule,
        // TerminalModule,
        // TieredMenuModule,
        ToggleButtonModule,
        ToolbarModule,
        KeyFilterModule,
        // TooltipModule,
  //      TreeModule,
  //      TreeTableModule,
        SettingsModule,
        // NgHttpLoaderModule,
        HttpLoaderModule,
        BlockUIModule,
        SharedModuleModule
    ],
    declarations: [
        AppComponent,
        AppMenuComponent,
        AppSubMenu,
        AppTopBar,
        AppFooter,
        GetstartedComponent,
        // ProductsComponent,
        ProductlistComponent,
        DateformatPipe,
        NotificationsComponent,
        CurrencyformatPipe,
        RemovelettersPipe,
        AuthGuardDirective,
        OnlyNumberDirective,
        DashboardComponent,
        IbNumberOnlyDirective,
        IndexComponent,
        ViewProductsComponent,
        LogOutComponent,
        TaxsummaryComponent,
        TenantSwitchingComponent,
        HelpDocComponent,
        // LedgerviewComponent
        // ViewInvoiceComponent
        // SettingsComponent,
        // UsersComponent,
        // RolesComponent,
        // OrganizationSettingsComponent,
        // ProfileSettingsComponent,
        // SampleDemo,
        // FormsDemo,
        // DataDemo,
        // PanelsDemo,
        // OverlaysDemo,
        // MenusDemo,
        // MessagesDemo,
        // MessagesDemo,
        // MiscDemo,
        // ChartsDemo,
        // EmptyDemo,
        // FileDemo,
        // UtilsDemo,
        // Documentation,
        // LoginDemo,
        // LandingPageComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JWTTokenInterceptorService,
            multi: true,
        },
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        MasterService, ProfileService, LocalStorageService, AuthCheckService, AuthGuard,
        CommonHttpService, ProductallService, UserService, NotificationsService, DateformatPipe,
        MessagesService, FeaturesService, DashboardService, SalesService, AmountsToWordsService,ConfirmationService

    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {

    constructor(router: Router, private authService: AuthCheckService, private storageservice: LocalStorageService) {
        // if (_.isEmpty(this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER))
        //     || this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.STR_PREFIX + AppConstant.API_CONFIG.LOCALSTORAGE.STR_AUTHSUCCESS)) {
        //     this.storageservice.clearAllItem();
        //     window.location.href = "./assets/access.html";
        // }
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if ($("#spinner").prop("id") != undefined) {
                    // $("#spinner").html("");
                    // $("#spinner").prop("id","");

                }
                
                if(event.url == "/")
                {
                    $("#logo_image").attr("src","assets/layout/images/infobooks-logo.png");
                }
                else if($("#logo_image").attr("src") == "assets/layout/images/infobooks-logo.png" ){
                    $("#logo_image").attr("src","assets/layout/images/efinance-logo.png");
                }
                if (event.url.indexOf("ibacus") < 0) {
                    if (!authService.checkTenantExists() || _.isEmpty(this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER))
                        || this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.STR_PREFIX + AppConstant.API_CONFIG.LOCALSTORAGE.STR_AUTHSUCCESS)) {
                        this.storageservice.clearAllItem();
                        window.location.href = AppConstant.ACCOUNT.ACC_URL + "login";
                    }
                }


            }
        });
    }
}
