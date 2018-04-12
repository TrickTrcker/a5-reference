import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { gstfilingComponent } from './gstfiling.component';
import { ReceiptRegisterComponent } from './receipt-register/receipt-register.component';
import { LedgerComponent } from './ledger/ledger.component';
import { TrailBalanceComponent } from './trail-balance/trail-balance.component';
import { LedgerTrialBalanceComponent } from './ledger-trial-balance/ledger-trial-balance.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { PandLComponent } from './pl-tree/pl-tree.component';
import { BSComponent } from './bs-tree/bs-tree.component';
import { BalanceSheetComponent } from './balance-sheet/balance-sheet.component';
import { InvoiceRegisterComponent } from './invoice-register/invoice-register.component';
import { BillRegisterComponent } from './bill-register/bill-register.component';
import { PaymentRegisterComponent } from './payment-register/payment-register.component';
import { BrsReportComponent } from './brs-report/brs-report.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
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
import { B2clComponent } from './efiling/b2cl/b2cl.component';
import { B2csComponent } from './efiling/b2cs/b2cs.component';
import { ExpComponent } from './efiling/exp/exp.component';
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
const routes: Routes = [

  {
    path: 'list',
    component: ReportsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Receipt Register'
    }
  },
  {
    path: 'ledger',
    component: LedgerComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Ledger'
    }
  },
  {
    path: 'trailbalance',
    component: TrailBalanceComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Trail Balance'
    }
  },
  {
    path: 'detailedtrialbalance',
    component: LedgerTrialBalanceComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Ledger - Trail Balance'
    }
  },
  {
    path: 'profitloss',
    component: PandLComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Profit Loss'
    }
  },
  {
    path: 'pandl',
    component: ProfitLossComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Profit Loss'
    }
  },
  {
    path: 'bs',
    component: BalanceSheetComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Balance Sheet'
    }
  },
  {
    path: 'balancesheet',
    component: BSComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Balance Sheet'
    }
  },
  {
    path: 'invoiceregister',
    component: InvoiceRegisterComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Invoice Register'
    }
  },
  {
    path: 'billregister',
    component: BillRegisterComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Bill Register'
    }
  },
  {
    path: 'receipt-register',
    component: ReceiptRegisterComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Receipt Register'
    }
  },
  {
    path: 'paymentregister',
    component: PaymentRegisterComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Payment Register'
    }
  },
  {
    path: 'brsreport',
    component: BrsReportComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Brs Report'
    }
  },
  //Day Book report added on 07/01/2018
  {
    path: 'daybook',
    component: DayBookComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Day Book'
    }
  },
  //outstanding-invoices report added on 08/02/2018
  {
    path: 'outstandinginvoices',
    component: OutstandingInvoicesComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Outstanding Invoices'
    }
  },
  //Bill Taxation report added on 09/01/2018
  {
    path: 'billtaxation',
    component: BillTaxationComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Bill Taxation'
    }
  },
  //Invoice Taxation report added on 09/01/2018
  {
    path: 'invoicetaxation',
    component: InvoiceTaxationComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Invoice Taxation'
    }
  },
  //Tax Summary report added on 14/02/2018
  {
    path: 'taxsummary',
    component: TaxSummaryComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Tax Summary'
    }
  },
  //Outstanding payments added on 15/02/2018
  {
    path: 'outstandingpayments',
    component: OutstandingPaymentsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Outstanding Payments'
    }
  },
  //Credit Note added on 15/02/2018
  {
    path: 'creditnoteregister',
    component: CreditnoteRegisterComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Credit Note Register'
    }
  },
  //Debit Note added on 15/02/2018
  {
    path: 'debitnoteregister',
    component: DebitnoteRegisterComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Debit Note Register'
    }
  },
  //Journal Register added on 17/02/2018
  {
    path: 'journalregister',
    component: JournalRegisterComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'Journal Register'
    }
  },
  {
    path: 'gstfiling',
    component: gstfilingComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/gstfiling'
      },
      title: 'GST Filing'
    }
  },
  {
    path: 'gstr3B',
    component: Gstr3BSummaryComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'GSTR-3B Summary'
    }
  },
  {
    path: 'gstr1',
    component: Gstr1SummaryComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'GSTR-1 Summary'
    }
  },
  {
    path: 'gstr2',
    component: Gstr2SummaryComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Reports'],
        redirectTo: '/'
      },
      title: 'GSTR-1 Summary'
    }
  },
  { path: 'gstr1/GSTR1_EXP', component: ExpComponent },
  { path: 'gstr1/GSTR1_B2CS', component: B2csComponent },
  { path: 'gstr1/GSTR1_B2CL', component: B2clComponent },
  { path: 'gstr1/GSTR1_CDNR', component: CdnrComponent },
  { path: 'gstr1/GSTR1_B2B', component: B2bComponent },  
  { path: 'gstr1/GSTR1_CDNUR', component: CdnurComponent },
  { path: 'gstr1/GSTR1_AT', component: AtComponent },  
  { path: 'gstr1/GSTR1_ATADJ', component: AtadjComponent },
  { path: 'gstr1/GSTR1_EXEMP', component: ExempComponent },
  { path: 'gstr1/GSTR1_HSN', component: HsnsumComponent },  
  { path: 'gstr2/GSTR2_B2B', component: B2bComponent },
  { path: 'gstr2/GSTR2_B2BUR', component: B2burComponent },
  { path: 'gstr2/GSTR2_IMPS', component: ImpsComponent },
  { path: 'gstr2/GSTR2_IMPG', component: ImpgComponent },
  { path: 'gstr2/GSTR2_CDNR', component: CdnrComponent },
  { path: 'gstr2/GSTR2_AT', component: AtComponent },
  { path: 'gstr2/GSTR2_ATADJ', component: AtadjComponent },
  { path: 'gstr2/GSTR2_EXEMPT', component: ExempComponent },  
  { path: 'gstr2/GSTR2_ITCR', component: ItcrComponent },
  { path: 'gstr2/GSTR2_HSNSUM', component: HsnsumComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
