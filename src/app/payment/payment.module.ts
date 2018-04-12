import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SalesService } from '../services/sales/sales.service';
import { MasterService } from '../services/master.service';
import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentlistComponent } from './paymentlist/paymentlist.component';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { ChartModule } from 'primeng/primeng';
import { DataTableModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { InputTextareaModule } from 'primeng/primeng';
import { MenuModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';
import { SplitButtonModule } from 'primeng/primeng';
import { TabMenuModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { PaymentComponent } from './addedit-Payment/payment.component';
import { PaymentService } from '../payment/payment.service';
import { PurchasesService } from '../services/purchases/purchases.service';
import { PaymentupdateComponent } from './paymentupdate/paymentupdate.component'
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { BillUnmatchedComponent } from './bill-unmatched/bill-unmatched.component';
import { BlockUIModule } from 'primeng/primeng';
import { OverlayPanelModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import {DialogModule} from 'primeng/primeng';
import { PanelMenuModule } from 'primeng/primeng';
import { MultiSelectModule } from 'primeng/primeng';
import { NgxPermissionsModule } from 'ngx-permissions';
import { GeneralPaymentComponent } from './general-payment/general-payment.component';
import { JournalsService } from './../accounts/service/journals.service';
@NgModule({
  imports: [
    PaymentsRoutingModule,
    CommonModule,
    ButtonModule,
    DataTableModule,
    NgxPermissionsModule.forChild(),
    ChartModule,
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    ChartModule,
    DataTableModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    MenuModule,
    MessagesModule,
    PaginatorModule,
    SplitButtonModule,
    TabMenuModule,
    TabViewModule,
    TooltipModule,
    SharedModuleModule,
    BlockUIModule,
    PanelModule,
    DialogModule,
    PanelMenuModule,
    MultiSelectModule
  ],
  declarations:
  [
    PaymentlistComponent,
    PaymentComponent,
    PaymentupdateComponent,
    BillUnmatchedComponent,
    GeneralPaymentComponent
  ],
  providers: [
    SalesService,
    MasterService,
    PaymentService,
    PurchasesService,
    JournalsService
  ],
})
export class PaymentModule {
  constructor() {

  }
}
