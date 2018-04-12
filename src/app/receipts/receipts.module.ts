import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SalesService } from '../services/sales/sales.service';
import { ProductallService } from '../products/productall.service';
import { JournalsService } from './../accounts/service/journals.service';
import { MasterService } from '../services/master.service';
import { ReceiptsRoutingModule } from './receipts-routing.module';
import { ReceiptsListComponent } from './receipts-list/receipts-list.component';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { ChartModule } from 'primeng/primeng';
import { DataTableModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { InputTextareaModule } from 'primeng/primeng';
import { MenuModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';
import { SplitButtonModule } from 'primeng/primeng';
import { TabMenuModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { ReceipteditComponent } from './receiptedit/receiptedit.component';
import { ReceiptService } from '../receipts/receipt.service';
import { ReceiptupdateComponent } from './receiptupdate/receiptupdate.component'
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { InvmatchingComponent } from './invmatching/invmatching.component';
import { BlockUIModule } from 'primeng/primeng';
import { OverlayPanelModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { PanelMenuModule } from 'primeng/primeng';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MultiSelectModule } from 'primeng/primeng';
import { HotkeyModule } from "angular2-hotkeys";
import {DialogModule} from 'primeng/primeng';
@NgModule({
  imports: [
    CommonModule,
    ReceiptsRoutingModule,
    NgxPermissionsModule.forChild(),
    ButtonModule,
    DataTableModule,
    ChartModule,
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    ChartModule,
    DataTableModule,
    DropdownModule,
    GrowlModule,
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
    PanelMenuModule,
    MultiSelectModule,
    HotkeyModule,
    DialogModule
  ],
  declarations: [
    ReceiptsListComponent,
    ReceipteditComponent,
    ReceiptupdateComponent,
    InvmatchingComponent
  ],
  providers: [
    SalesService,
    MasterService,
    ProductallService,
    ReceiptService,
    JournalsService
  ],
})
export class ReceiptsModule {
  constructor() {

  }
}
