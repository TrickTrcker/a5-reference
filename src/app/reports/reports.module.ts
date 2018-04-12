import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MasterService } from '../services/master.service';
import { UtilsService } from '../services/utils.service';
import { FeaturesService } from '../services/features.service';
import { ReportService } from './../services/reports/reports.service';
import { ReportsComponent } from './reports.component';
import { gstfilingComponent } from './gstfiling.component';
import { ReceiptRegisterComponent } from './receipt-register/receipt-register.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { AccordionModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';
import { BreadcrumbModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { CarouselModule } from 'primeng/primeng';
import { ChartModule } from 'primeng/primeng';
import { ColorPickerModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { ChipsModule } from 'primeng/primeng';
import { CodeHighlighterModule } from 'primeng/primeng';
import { ConfirmDialogModule } from 'primeng/primeng';
import { ContextMenuModule } from 'primeng/primeng';
import { DataGridModule } from 'primeng/primeng';
import { DataListModule } from 'primeng/primeng';
import { DataScrollerModule } from 'primeng/primeng';
import { DataTableModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { DragDropModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { EditorModule } from 'primeng/primeng';
import { FieldsetModule } from 'primeng/primeng';
import { FileUploadModule } from 'primeng/primeng';
import { GalleriaModule } from 'primeng/primeng';
import { GMapModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { InputMaskModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { InputTextareaModule } from 'primeng/primeng';
import { LightboxModule } from 'primeng/primeng';
import { ListboxModule } from 'primeng/primeng';
import { MegaMenuModule } from 'primeng/primeng';
import { MenuModule } from 'primeng/primeng';
import { MenubarModule } from 'primeng/primeng';
import { MessagesModule } from 'primeng/primeng';
import { MultiSelectModule } from 'primeng/primeng';
import { OrderListModule } from 'primeng/primeng';
import { OrganizationChartModule } from 'primeng/primeng';
import { OverlayPanelModule } from 'primeng/primeng';
import { PaginatorModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { PanelMenuModule } from 'primeng/primeng';
import { PasswordModule } from 'primeng/primeng';
import { PickListModule } from 'primeng/primeng';
import { ProgressBarModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
import { RatingModule } from 'primeng/primeng';
import { ScheduleModule } from 'primeng/primeng';
import { SelectButtonModule } from 'primeng/primeng';
import { SlideMenuModule } from 'primeng/primeng';
import { SliderModule } from 'primeng/primeng';
import { SpinnerModule } from 'primeng/primeng';
import { SplitButtonModule } from 'primeng/primeng';
// import {ScrollPanelModule} from 'primeng/primeng';
import { StepsModule } from 'primeng/primeng';
import { TabMenuModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { TerminalModule } from 'primeng/primeng';
import { TieredMenuModule } from 'primeng/primeng';
import { ToggleButtonModule } from 'primeng/primeng';
import { ToolbarModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { TreeModule } from 'primeng/primeng';
import { TreeTableModule } from 'primeng/primeng';
import { LedgerComponent } from './ledger/ledger.component';
import { TrailBalanceComponent } from './trail-balance/trail-balance.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { PandLComponent } from './pl-tree/pl-tree.component';
import { BSComponent } from './bs-tree/bs-tree.component';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { InvoiceRegisterComponent } from './invoice-register/invoice-register.component';
import { BillRegisterComponent } from './bill-register/bill-register.component';
import { PaymentRegisterComponent } from './payment-register/payment-register.component';
import { BrsReportComponent } from './brs-report/brs-report.component';
import { SalesService } from '../services/sales/sales.service';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { PurchasesService } from '../services/purchases/purchases.service';
import { ReceiptService } from '../receipts/receipt.service';
import { PaymentService } from '../payment/payment.service';
import { BanksService } from '../bank/service/banks.service';
import { JournalsService } from '../accounts/service/journals.service';
import { AccountsService } from '../accounts/service/accounts.service';
import { CommonService } from '../services/common.service';
import { OrganizationSettingsService } from '../services/organization-settings.service';
import { LedgerTrialBalanceComponent } from './ledger-trial-balance/ledger-trial-balance.component'
import { LedgerviewComponent } from '../shared/components/ledgerview/ledgerview.component';
import { HotkeyModule } from "angular2-hotkeys";
import { DayBookComponent } from './day-book/day-book.component';
import { OutstandingInvoicesComponent } from './outstanding-invoices/outstanding-invoices.component';
import { BillTaxationComponent } from './bill-taxation/bill-taxation.component';
import { InvoiceTaxationComponent } from './invoice-taxation/invoice-taxation.component';
import { TaxSummaryComponent } from './tax-summary/tax-summary.component';
import { OutstandingPaymentsComponent } from './outstanding-payments/outstanding-payments.component';
import { CreditnoteRegisterComponent } from './creditnote-register/creditnote-register.component';
import { DebitnoteRegisterComponent } from './debitnote-register/debitnote-register.component';
import { JournalRegisterComponent } from './journal-register/journal-register.component';
//efiling
import { AtComponent } from './efiling/at/at.component';
import { AtadjComponent } from './efiling/atadj/atadj.component';
import { B2bComponent } from './efiling/b2b/b2b.component';
import { B2burComponent } from './efiling/b2bur/b2bur.component';
import { CdnrComponent } from './efiling/cdnr/cdnr.component';
import { CdnurComponent } from './efiling/cdnur/cdnur.component';
import { ExempComponent } from './efiling/exemp/exemp.component';
import { HsnsumComponent } from './efiling/hsnsum/hsnsum.component';
import { ImpgComponent } from './efiling/impg/impg.component';
import { ImpsComponent } from './efiling/imps/imps.component';
import { ItcrComponent } from './efiling/itcr/itcr.component';
import { Gstr3BSummaryComponent } from './gstr3-b-summary/gstr3-b-summary.component';
import { Gstr1SummaryComponent } from './gstr1-summary/gstr1-summary.component';
import { Gstr2SummaryComponent } from './gstr2-summary/gstr2-summary.component';
import { B2clComponent } from './efiling/b2cl/b2cl.component';
import { B2csComponent } from './efiling/b2cs/b2cs.component';
import { ExpComponent } from './efiling/exp/exp.component';
@NgModule({
  imports: [
    SharedModuleModule,
    ReportsRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CarouselModule,
    ChartModule,
    ColorPickerModule,
    CheckboxModule,
    ChipsModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DataTableModule,
    DialogModule,
    DragDropModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    GMapModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    ScheduleModule,
    SelectButtonModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    // ScrollPanelModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    HotkeyModule
  ],
  declarations: [
    ReportsComponent,
    gstfilingComponent,
    ReceiptRegisterComponent,
    LedgerComponent,
    TrailBalanceComponent,
    ProfitLossComponent,
    PandLComponent,
    BSComponent,
    BalanceSheetComponent,
    InvoiceRegisterComponent,
    BillRegisterComponent,
    PaymentRegisterComponent,
    BrsReportComponent,
    LedgerTrialBalanceComponent,
    LedgerviewComponent,
    DayBookComponent,
    OutstandingInvoicesComponent,
    BillTaxationComponent,
    InvoiceTaxationComponent,
    TaxSummaryComponent,
    OutstandingPaymentsComponent,
    CreditnoteRegisterComponent,
    DebitnoteRegisterComponent,
    JournalRegisterComponent,
    AtComponent,
    AtadjComponent,
    B2bComponent,
    B2burComponent,
    CdnrComponent,
    CdnurComponent,
    ExempComponent,
    HsnsumComponent,
    ImpgComponent,
    ImpsComponent,
    ItcrComponent,
    Gstr3BSummaryComponent,
    Gstr1SummaryComponent,
    Gstr2SummaryComponent,
    B2clComponent,
    B2csComponent,
    ExpComponent,
  ],
  providers: [
    FeaturesService,
    MasterService,
    UtilsService,
    ReportService,
    SalesService,
    PurchasesService,
    ReceiptService,
    PaymentService,
    BanksService,
    JournalsService,
    AccountsService,
    CommonService,
    OrganizationSettingsService
  ],
  exports: [
    LedgerviewComponent
  ]
})
export class ReportsModule { }
