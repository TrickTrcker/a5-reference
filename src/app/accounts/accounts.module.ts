import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AccountsRoutingModule } from './accounts-routing.module';
import { PanelModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import {ButtonModule} from 'primeng/primeng';
import {TabViewModule} from 'primeng/primeng';
import { JournalsComponent } from './journals/journals.component';
import { ChartofaccountsComponent } from './chartofaccounts/chartofaccounts.component';
import { CreditNoteComponent } from './credit-note/credit-note.component';
import { DebitNoteComponent } from './debit-note/debit-note.component';
import { AccountsService } from './service/accounts.service'
import {ChartModule} from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { DataTableModule, SharedModule   } from 'primeng/primeng';
import { ListJournalComponent } from './journals/list-journal/list-journal.component';
import { CreditNotelistComponent } from './credit-note/credit-notelist.component';
import { DebitNotelistComponent } from './debit-note/debit-notelist.component';
import {AutoCompleteModule} from 'primeng/primeng';
import { JournalsService } from './service/journals.service';
import {GrowlModule} from 'primeng/primeng';
import {SalesService} from '../services/sales/sales.service';
import { PurchasesService } from '../services/purchases/purchases.service';
import { NumberonlyDirective } from '../shared/numberonly.directive';
import {TreeTableModule,TreeNode } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { ContextMenuModule, ContextMenu, MenuItem, MenuModule } from 'primeng/primeng';
import {RadioButtonModule} from 'primeng/primeng';
// import { ViewCnoteComponent } from './credit-note/view-cnote/view-cnote.component';
// import { ViewDnoteComponent } from './debit-note/view-dnote/view-dnote.component';
// import { ViewJournalsComponent } from './journals/view-journals/view-journals.component';
import { DataGridModule } from 'primeng/primeng';
import { UtilsService } from './../services/utils.service';
import { FeaturesService } from './../services/features.service';
import { MasterService } from './../services/master.service';
import { SplitButtonModule} from 'primeng/primeng';
import { NgxPermissionsModule } from 'ngx-permissions';
import { GnrlPaymentComponent } from './gnrl-payment/gnrl-payment.component';
import { SliderModule } from 'primeng/primeng';
import { MultiSelectModule } from 'primeng/primeng';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { NewCreditNoteComponent } from './credit-note/new-credit-note/new-credit-note.component';
import { SettingsModule } from '../pages/settings/settings.module';
import { NewDebitNoteComponent } from './debit-note/new-debit-note/new-debit-note.component';
import { GnrlReceiptComponent } from './gnrl-receipt/gnrl-receipt.component';
// import { ViewtransactionsComponent } from './viewtransactions/viewtransactions.component';
import { vAdvanceComponent } from './v-advance/v-advance.component';
@NgModule({
  imports: [    
    CommonModule,
    AccountsRoutingModule,
    NgxPermissionsModule.forChild(),
    PanelModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    DataTableModule,
    SharedModule,
    RouterModule,
    ChartModule,
    ButtonModule,
    TabViewModule,
    AutoCompleteModule,
    GrowlModule,
    TreeTableModule,
    MenuModule,
    SplitButtonModule,
    SliderModule,
    MultiSelectModule,
    SharedModuleModule,
    DataGridModule,
    DialogModule,
    CheckboxModule,
    ContextMenuModule,
    SettingsModule,
    RadioButtonModule,
  ],
  declarations: [
    JournalsComponent,
    ListJournalComponent,
    ChartofaccountsComponent,
    CreditNoteComponent,
    DebitNoteComponent,
    CreditNotelistComponent,
    DebitNotelistComponent,
    NumberonlyDirective,
    // ViewCnoteComponent,
    // ViewDnoteComponent,
    // ViewJournalsComponent,
    GnrlPaymentComponent,
    NewCreditNoteComponent,
    NewDebitNoteComponent,
    GnrlReceiptComponent,
    vAdvanceComponent
    // ViewtransactionsComponent
  ],
  providers: [
    AccountsService,
    JournalsService,
    SalesService,
    PurchasesService,
    UtilsService,
    MasterService,
    FeaturesService
  ],
})

export class AccountsModule {
  constructor() {
    // alert("accounts module");
  }
}
