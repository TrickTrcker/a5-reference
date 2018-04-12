import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { AddEditInvoiceComponent } from './add-edit-invoice/add-edit-invoice.component';
import { CustomeradvanceListComponent } from '../sales/customer-advance/customeradvance-list/customeradvance-list.component';
import { proformaInvoicelistComponent } from './proforma-invoice/proforma-invoicelist.component';
import { proformaInvoiceAddeditComponent } from './proforma-invoice/addedit/proforma-invoice-addedit.component';
import { CustomeradvanceAddeditComponent } from './customer-advance/customeradvance-addedit/customeradvance-addedit.component';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { EditComponent } from './proforma-invoice/edit/edit.component';
import{CustomerAdvanceComponent} from './customer-advance/customer-advance/customer-advance.component'
import { CustomerAdvanceUpdateComponent } from './customer-advance/customer-advance-update/customer-advance-update.component'
import { ViewCustomerAdvanceComponent } from './customer-advance/view-customer-advance/view-customer-advance.component'
import { ViewInvoiceComponent } from '../sales/view-invoice/view-invoice.component'
import { NgxPermissionsGuard } from 'ngx-permissions';
import {MaliciousInvoiceComponent}from '../../app/sales/malicious-invoice/malicious-invoice.component';
import{MiscellaneousinvoiceComponent}from'../sales/malicious-invoice/miscellaneousinvoice/miscellaneousinvoice.component';
import {ViewMiscellaneousinvoiceComponent}from '../sales/malicious-invoice/view-miscellaneousinvoice/view-miscellaneousinvoice.component';
import { ConvertProInvoiceComponent } from './convert-pro-invoice/convert-pro-invoice.component';
const routes: Routes = [
  {
    path: 'list',
    component: InvoiceListComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Invoice'],
        redirectTo: '/'
      },
      title: 'Invoice List'
    }
  },
  {
    path: 'addedit',
    component: AddEditInvoiceComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All','Invoice'],
        redirectTo: '/'
      },
      title: 'Add/Edit Invoice'
    }
  },
  {
    path: 'editinvoice/:invoiceid',
    component: EditInvoiceComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All','Invoice'],
        redirectTo: '/'
      },
      title: 'Edit Invoice'
    }
  },

  {
    path: 'customeradvance',
    component: CustomeradvanceListComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Customer Advance'],
        redirectTo: '/'
      },
      title: 'Customer Advance'
    }
   
  },
  {
    path: 'customeradvanceaddedit',
    component: CustomeradvanceAddeditComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Customer Advance'],
        redirectTo: '/'
      },
      title: 'Customer Advance Add/Edit'
    }
    },
  {
    path: 'customeradvanceupdate/:pymtrectid',
    component: CustomerAdvanceUpdateComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Customer Advance'],
        redirectTo: '/'
      },
      title: 'Customer Advance Add/Edit'
    }
    
  },
  //new customer advance
  {
    path: 'Addcustomeradvance',
    component: CustomerAdvanceComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Customer Advance'],
        redirectTo: '/'
      },
      title: 'Customer Advance'
    }
  },
  {
    path: 'convertproforma',
    component: ConvertProInvoiceComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Invoice'],
        redirectTo: '/'
      },
      title: 'Convert Proforma Invoice'
    }
  },
  {
    path: 'proformainvoice',
    component: proformaInvoicelistComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Invoice'],
        redirectTo: '/'
      },
      title: 'proforma Invoice'
    }
  },
  {
    path: 'maliciousinvoice',
    component: MaliciousInvoiceComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Invoice'],
        redirectTo: '/'
      },
      title: 'Melicious Invoice'
    }
  },
  {
    path: 'proformaadd',
    component: proformaInvoiceAddeditComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All','Invoice'],
        redirectTo: '/'
      },
      title: 'proforma Invoice'
    }
  },
  {
    path: 'editproformainvoice/:invoiceid',
    component: EditComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All','Invoice'],
        redirectTo: '/'
      },
      title: 'Edit Pro-Forma Invoice'
    }
  },
  {
    path: 'editmiscellaneousinvoice/:invoiceid',
    component: MiscellaneousinvoiceComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All','Invoice'],
        redirectTo: '/'
      },
      title: 'Edit Miscellaneous Invoice'
    }
  },
  {
    path: 'viewcustomeradvance/:pymtrectid',
    component: ViewCustomerAdvanceComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All','Customer Advance'],
        redirectTo: '/'
      },
      title: 'View Customer Advance'
    }
  },
  {
    path: 'viewinvoice/:invtype/:invoiceid',
    component: ViewInvoiceComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Invoice'],
        redirectTo: '/'
      },
      title: 'View Invoice'
    }
  },
  {
    path: 'viewmiscellaneousinvoice/:invtype/:invoiceid',
    component: ViewMiscellaneousinvoiceComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Invoice'],
        redirectTo: '/'
      },
      title: 'View Miscellaneous Invoice'
    }
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [],
})
export class SalesRoutingModule { }
