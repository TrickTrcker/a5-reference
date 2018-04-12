import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { TooltipModule} from 'primeng/primeng';
import {SplitButtonModule} from 'primeng/primeng';
import {KeyFilterModule} from 'primeng/keyfilter';
import { CalendarModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { DataTableModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';

import { ViewInvoiceComponent } from '../sales/view-invoice/view-invoice.component';
import { ViewBillComponent } from '../purchase/view-bill/view-bill.component';
import { ReceiptViewComponent } from '../receipts/receipt-view/receipt-view.component'
import { ViewPaymentComponent } from '../payment/view-payment/view-payment.component'
import { ViewJournalsComponent } from '../accounts/journals/view-journals/view-journals.component';
import { ViewtransactionsComponent } from '../accounts/viewtransactions/viewtransactions.component';
import { ViewCnoteComponent }from '../accounts/credit-note/view-cnote/view-cnote.component';
import { ViewDnoteComponent }from '../accounts/debit-note/view-dnote/view-dnote.component';
import{ViewBanktransferComponent}from '../bank/banktransfer/view-banktransfer/view-banktransfer.component';
import { AddpartiesComponent } from '../pages/settings/parties/addparties/addparties.component';
import { ProductsComponent } from '../products/products.component';
import { AddbrandComponent } from '../pages/settings/brand/addbrand/addbrand/addbrand.component';
import { AddcategoryComponent} from '../pages/settings/category/addcategory/addcategory/addcategory.component';
import { AddledgerComponent } from '../pages/settings/ledger/addledger/addledger/addledger.component';
// bank
import { BankComponent } from '../pages/settings/bank/bank.component';
import { AddbankComponent} from '../pages/settings/bank/addbank.component';
import { BankwithdrawComponent } from '../bank/bankwithdraw/bankwithdraw.component';
import { BankdepositeComponent } from '../bank/bankdeposite/bankdeposite.component';
import { BanktransferComponent  } from '../bank/banktransfer/banktransfer.component';
// bank
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsModule } from 'ngx-permissions';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DropdownModule,
    CheckboxModule,
    RadioButtonModule,
    ButtonModule,
    DialogModule,
    TooltipModule,
    SplitButtonModule,
    KeyFilterModule,
    CalendarModule,
    TabViewModule,
    DataTableModule,
    PanelModule,
    AutoCompleteModule
  ],
  declarations: [
    ViewInvoiceComponent,
    ViewBillComponent,
    ReceiptViewComponent,
    ViewPaymentComponent,
    ViewJournalsComponent,
    ViewtransactionsComponent,
    ViewCnoteComponent,
    ViewDnoteComponent,
    ViewBanktransferComponent,
    AddpartiesComponent,
    ProductsComponent,
    AddbrandComponent,
    AddcategoryComponent,
    AddledgerComponent,
    BankComponent,
    AddbankComponent,
    BankwithdrawComponent,
    BankdepositeComponent,
    BanktransferComponent
  ],
  exports:
  [
    ViewInvoiceComponent,
    ViewBillComponent,
    ReceiptViewComponent,
    ViewPaymentComponent,
    NgxPermissionsModule,
    ViewJournalsComponent,
    ViewtransactionsComponent,
    ViewCnoteComponent,
    ViewDnoteComponent,
    ViewBanktransferComponent,
    AddpartiesComponent,
    ProductsComponent,
    AddbrandComponent,
    AddcategoryComponent,
    AddledgerComponent,
    BankComponent,
    AddbankComponent,
    BankwithdrawComponent,
    BankdepositeComponent,
    BanktransferComponent
  ]
})
export class SharedModuleModule { }
