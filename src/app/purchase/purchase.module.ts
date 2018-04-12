import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PurchasesService } from '../services/purchases/purchases.service';
import { ProductallService } from '../products/productall.service';
import { FeaturesService } from '../services/features.service';
import { MasterService } from '../services/master.service';
import { JournalsService } from './../accounts/service/journals.service';
import { UtilsService } from '../services/utils.service';
import { BlockUIModule } from 'primeng/primeng';
import { BillListComponent } from './bill-list/bill-list.component';
import { BillEditComponent } from './bill-edit/bill-edit.component';
import { VendorAdvanceComponent } from './vendor-advance/vendoradvance-List/vendor-advance.component';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { AutoCompleteModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { ChartModule } from 'primeng/primeng';
import { DataListModule } from 'primeng/primeng';
import { DataTableModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { InputTextareaModule } from 'primeng/primeng';
import { MenuModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';
import { SplitButtonModule } from 'primeng/primeng';
import { TabMenuModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import {PanelModule} from 'primeng/primeng';
import {RadioButtonModule} from 'primeng/primeng';
import { EditComponent } from './edit/edit.component';
import { VendoradvanceAddeditComponent } from './vendor-advance/vendoradvance-addedit/vendoradvance-addedit.component';
import { PaymentService } from '../payment/payment.service';
import { VendoradvanceUpdateComponent } from './vendor-advance/vendoradvance-update/vendoradvance-update.component';
import { ViewVendorAdvanceComponent } from './vendor-advance/view-vendor-advance/view-vendor-advance.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import {DataGridModule} from 'primeng/primeng';
import { NgxPermissionsModule } from 'ngx-permissions';
import { HotkeyModule } from "angular2-hotkeys";
import {DialogModule} from 'primeng/primeng';
@NgModule({
  imports: [
    PurchaseRoutingModule,
    CommonModule,
    NgxPermissionsModule.forChild(),
    FormsModule,
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    ChartModule,
    DataListModule,
    DataTableModule,
    DropdownModule,
    GrowlModule,
    InputTextModule,
    InputTextareaModule,
    MenuModule,
    PaginatorModule,
    SplitButtonModule,
    TabMenuModule,
    TabViewModule,
    TooltipModule,
    PanelModule,
    RadioButtonModule,
    SharedModuleModule,
    BlockUIModule,
    DataGridModule,
    HotkeyModule,
    DialogModule
  ],
  declarations: [
    BillListComponent,
    BillEditComponent,
    VendorAdvanceComponent,
    EditComponent,
    VendoradvanceAddeditComponent,
    VendoradvanceUpdateComponent,
    ViewVendorAdvanceComponent],
  providers: [
    PurchasesService,
    MasterService,
    JournalsService,
    FeaturesService,
    ProductallService,
    PaymentService,
    UtilsService
  ],
})
export class PurchaseModule {
  constructor() {

  }
}

