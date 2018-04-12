import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPermissionsGuard } from 'ngx-permissions';

import { JournalsComponent } from './journals/journals.component';
import { ChartofaccountsComponent } from './chartofaccounts/chartofaccounts.component';
import { CreditNoteComponent } from './credit-note/credit-note.component';
import { CreditNotelistComponent } from './credit-note/credit-notelist.component';
import {ListJournalComponent} from './journals/list-journal/list-journal.component';
import { DebitNoteComponent } from './debit-note/debit-note.component';
import { DebitNotelistComponent } from './debit-note/debit-notelist.component';
import {ViewCnoteComponent} from './credit-note/view-cnote/view-cnote.component';
import {ViewDnoteComponent}from './debit-note/view-dnote/view-dnote.component';
import {ViewJournalsComponent} from './journals/view-journals/view-journals.component';
import { GnrlPaymentComponent } from './gnrl-payment/gnrl-payment.component';
import { GnrlReceiptComponent } from './gnrl-receipt/gnrl-receipt.component';
import { ViewtransactionsComponent } from './viewtransactions/viewtransactions.component';
import { vAdvanceComponent } from './v-advance/v-advance.component';
const routes: Routes = [
  {
    path: 'chartofaccounts',
    component: ChartofaccountsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All','Chart of Accounts'],
        redirectTo: '/'
      },
      title: 'Chart of Accounts'
    }
  },
  {
    path: 'generalpayment',
    // component: GnrlPaymentComponent,
    // canActivate: [NgxPermissionsGuard],
    data: {
     permissions: {
       only: ['All','Payment'],
       redirectTo: '/'
     },
     title: 'General Payment'
   },
   children:[ 
    {	 
      path: '',	 
     component: GnrlPaymentComponent,
    canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only:['All', 'Journals'],
          redirectTo: '/'
        },
        title: 'General Payment'
      }
    },
    {
       path: ':journalid/:journalno',
       component: GnrlPaymentComponent,
    canActivate: [NgxPermissionsGuard],
       data: {
        permissions: {
          only: ['All','Journals'],
          redirectTo: '/'
        },
        title: 'General Payment'
      }
	  } 
   ]
 },
 {
  path: 'generalreceipt',
  data: {
   permissions: {
     only: ['All','Receipt'],
     redirectTo: '/'
   },
   title: 'General Receipt'
 },
 children:[ 
  {	 
    path: '',	 
    component: GnrlReceiptComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Receipt'],
        redirectTo: '/'
      },
      title: 'General Receipt'
    }
  },
  {
     path: ':journalid/:journalno',
     component: GnrlReceiptComponent,
     canActivate: [NgxPermissionsGuard],
     data: {
      permissions: {
        only: ['All','Receipt'],
        redirectTo: '/'
      },
      title: 'General Receipt'
    }
  } 
 ]
},
{
  path: 'vendoradvance',
  data: {
   permissions: {
     only: ['All','Receipt'],
     redirectTo: '/'
   },
   title: 'General Receipt'
 },
 children:[ 
  {	 
    path: '',	 
    component: vAdvanceComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Payment'],
        redirectTo: '/'
      },
      title: 'Vendor Advance'
    }
  },
  {
     path: ':journalid/:journalno',
     component: vAdvanceComponent,
     canActivate: [NgxPermissionsGuard],
     data: {
      permissions: {
        only: ['All','Payment'],
        redirectTo: '/'
      },
      title: 'Vendor Advance'
    }
  } 
 ]
},
  {
    path: 'journals',
    data: {
      permissions: {
        only: ['All','Journals'],
        redirectTo: '/'
      },
      title: 'Journals'
    },
    children:[ 
    {	 
      path: '',	 
      component: JournalsComponent,	 
      canActivate: [NgxPermissionsGuard],
      data: {
        permissions: {
          only:['All', 'Journals'],
          redirectTo: '/'
        },
        title: 'Add/Edit Journals'
      }
    },
    {
       path: 'list',
       component: ListJournalComponent,
       canActivate: [NgxPermissionsGuard],
       data: {
        permissions: {
          only:['All', 'Journals'],
          redirectTo: '/'
        },
        title: 'Journals List'
      }
    },
    {
       path: ':journalid/:journalno',
       component: JournalsComponent,
       canActivate: [NgxPermissionsGuard],
       data: {
        permissions: {
          only: ['All','Journals'],
          redirectTo: '/'
        },
        title: 'Journals'
      }
	  } 
   ]
  },
  {
    path: 'creditnote',
    data: {
      permissions: {
        only: ['All','Credit Note'],
        redirectTo: '/'
      },
      title: 'Credit Note'
    },
 
     children:[
      {
        path:'',
        component: CreditNotelistComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only:['All', 'Credit Note'],
            redirectTo: '/'
          },
          title: 'Credit Note List'
        }
      },
      {
        path:'addnote',
        component: CreditNoteComponent,
         canActivate: [NgxPermissionsGuard],
         data: {
          permissions: {
            only: ['All','Credit Note'],
            redirectTo: '/'
          },
          title: 'Add/Edit Credit Note'
        }
      }
    ]
  },
  {
    path: 'debitnote',
    data: {
      permissions: {
        only: ['All','Debit Note'],
        redirectTo: '/'
      },
      title: 'Debit Note'
    },
      children:[
      {
        path:'',
        component: DebitNotelistComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
         permissions: {
           only: ['All','Debit Note'],
           redirectTo: '/'
         },
         title: 'Debit Note List'
       }
      },
      {
        path:'adddebitnote',
        component: DebitNoteComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
         permissions: {
           only: ['All','Debit Note'],
           redirectTo: '/'
         },
         title: 'Add/Edit Debit Note'
       }
      }
    ]
  },
  //  {
  //   path: 'viewcreditnote/:crdrid',
  //   component: ViewCnoteComponent
  // },
  //  {
  //   path: 'viewdebitnote/:crdrid',
  //   component: ViewDnoteComponent
  // },
   {
    path: 'viewjournal/:journal/:journalid/:journalno',
    component: ViewJournalsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
     permissions: {
       only: ['All','Journals'],
       redirectTo: '/'
     },
     title: 'Journal View'
   }
  },
  {
    path: 'viewtransactions/:journalid/:journalno/:feature/:viewfrom',
    component: ViewtransactionsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
     permissions: {
       only: ['All','Journals',"Payment","Receipt"],
       redirectTo: '/'
     },
     title: 'Transaction View'
   }
  },
  
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class AccountsRoutingModule { }
