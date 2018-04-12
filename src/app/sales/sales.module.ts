import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SalesRoutingModule } from './sales-routing.module';
import { SalesService } from '../services/sales/sales.service';
import { ConvertProformaToInvoiceService } from '../services/sales/convert-proforma-to-invoice.service';
import { ProductallService } from '../products/productall.service';
import { MasterService } from '../services/master.service';
import { FeaturesService } from '../services/features.service';
import { UtilsService } from '../services/utils.service';
import { OrganizationSettingsService } from '../pages/settings/services/organization-settings.service';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { AddEditInvoiceComponent } from './add-edit-invoice/add-edit-invoice.component';
import { CustomeradvanceListComponent } from './customer-advance/customeradvance-list/customeradvance-list.component';
import { CustomeradvanceAddeditComponent } from './customer-advance/customeradvance-addedit/customeradvance-addedit.component';
import { CustomerAdvanceUpdateComponent } from './customer-advance/customer-advance-update/customer-advance-update.component';
import {HotkeyModule} from 'angular2-hotkeys';
import { AutoCompleteModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { ChartModule } from 'primeng/primeng';
//import { DataListModule } from 'primeng/primeng';
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
import {PanelModule} from 'primeng/primeng';
import {RadioButtonModule} from 'primeng/primeng';
import {ContextMenuModule} from 'primeng/primeng';
import { proformaInvoicelistComponent } from './proforma-invoice/proforma-invoicelist.component';
import { proformaInvoiceAddeditComponent } from './proforma-invoice/addedit/proforma-invoice-addedit.component';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { AccountsService } from '../accounts/service/accounts.service';
import { ReceiptService } from '../receipts/receipt.service'
import { BlockUIModule } from 'primeng/primeng';
import { EditComponent } from './proforma-invoice/edit/edit.component';
import { ViewCustomerAdvanceComponent } from './customer-advance/view-customer-advance/view-customer-advance.component';
import {SharedModuleModule} from '../shared-module/shared-module.module'
import { NgxPermissionsModule } from 'ngx-permissions';
import { MaliciousInvoiceComponent } from './malicious-invoice/malicious-invoice.component';
import { MiscellaneousinvoiceComponent } from './malicious-invoice/miscellaneousinvoice/miscellaneousinvoice.component';
import { ViewMiscellaneousinvoiceComponent } from './malicious-invoice/view-miscellaneousinvoice/view-miscellaneousinvoice.component';
import { CustomerAdvanceComponent } from './customer-advance/customer-advance/customer-advance.component';
import {DataGridModule} from 'primeng/primeng';
import { ConvertProInvoiceComponent } from './convert-pro-invoice/convert-pro-invoice.component';
import {DialogModule} from 'primeng/primeng';
@NgModule({
  imports: [
    NgxPermissionsModule.forChild(),
    HotkeyModule,
    SharedModuleModule,
    CommonModule,
    FormsModule,
    SalesRoutingModule,
   AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    ChartModule,
    ContextMenuModule,
    //DataListModule,
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
    PanelModule,
    RadioButtonModule,
    BlockUIModule,
    DataGridModule,
    DialogModule
  ],
  declarations: [
    InvoiceListComponent,
    AddEditInvoiceComponent,
    proformaInvoicelistComponent,
    proformaInvoiceAddeditComponent,
    CustomeradvanceListComponent,
    ViewCustomerAdvanceComponent,
    CustomeradvanceAddeditComponent,
    EditInvoiceComponent,
    CustomerAdvanceUpdateComponent,
    EditComponent,
    MaliciousInvoiceComponent,
    MiscellaneousinvoiceComponent,
    ViewMiscellaneousinvoiceComponent,
    CustomerAdvanceComponent,
    ConvertProInvoiceComponent
  ],
  providers: [
    SalesService,
    ConvertProformaToInvoiceService,
    FeaturesService,
    MasterService,
    ProductallService,
    AccountsService,
    ReceiptService,
    UtilsService,
    OrganizationSettingsService
  ],
})
export class SalesModule {
  constructor() {

  }
}
