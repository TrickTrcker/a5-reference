import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BillListComponent } from './bill-list/bill-list.component';
import { BillEditComponent } from './bill-edit/bill-edit.component';
import { VendorAdvanceComponent } from './vendor-advance/vendoradvance-List/vendor-advance.component';
import { ViewBillComponent } from './view-bill/view-bill.component';
import { EditComponent } from './edit/edit.component';
import { VendoradvanceAddeditComponent } from './vendor-advance/vendoradvance-addedit/vendoradvance-addedit.component'
import {VendoradvanceUpdateComponent} from '../purchase/vendor-advance/vendoradvance-update/vendoradvance-update.component' 
import {ViewVendorAdvanceComponent} from './vendor-advance/view-vendor-advance/view-vendor-advance.component'
import { NgxPermissionsGuard } from 'ngx-permissions';
const routes: Routes = [
  {
    path: 'list',
    component: BillListComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All','Bills'],
        redirectTo: '/'
      },
      title: 'Bill List'
    }
  },
  {
    path: 'billedit',
    component: BillEditComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All','Bills'],
        redirectTo: '/'
      },
      title: 'Add/Edit Bill'
    }
  },
  {
    path: 'editbill/:billid',
    component: EditComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Bills'],
        redirectTo: '/'
      },
      title: 'Edit Bill'
    }
  },
  {
    path: 'viewbill/:bill/:billid',
    component: ViewBillComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All','Bills'],
        redirectTo: '/'
      },
      title: 'Bill View'
    }
  },
  {
    path: 'vendoradvance',
    component: VendorAdvanceComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Bills'],
        redirectTo: '/'
      },
      title: 'Vendar Advance List'
    }
  },
  {
    path: 'vendoradvanceaddedit',
    component: VendoradvanceAddeditComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Bills'],
        redirectTo: '/'
      },
      title: 'VendarAdvance-AddEdit '
    }
  },
  {
    path: 'vendoradvanceupdate/:pymtrectid',
    component: VendoradvanceUpdateComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Bills'],
        redirectTo: '/'
      },
    title: 'VendarAdvance-Edit'
    }
  },
  {
    path: 'vendoradvanceview/:pymtrectid',
    component: ViewVendorAdvanceComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Bills'],
        redirectTo: '/'
      },
      title: 'VendarAdvance View'
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
export class PurchaseRoutingModule { }
