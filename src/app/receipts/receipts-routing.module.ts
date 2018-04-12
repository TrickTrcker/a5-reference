import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReceiptsListComponent } from './receipts-list/receipts-list.component';
import { ReceipteditComponent } from './receiptedit/receiptedit.component';
import { ReceiptViewComponent } from './receipt-view/receipt-view.component';
import { ReceiptupdateComponent } from './receiptupdate/receiptupdate.component'
import { InvmatchingComponent } from './invmatching/invmatching.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
const routes: Routes = [
  {
    path: 'list',
    component: ReceiptsListComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Receipt'],
        redirectTo: '/'
      },
      title: 'Receipts List'
    }
  },
  {
    path: 'receiptedit',
    component: ReceipteditComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Receipt'],
        redirectTo: '/'
      },
      title: 'Add/Edit Payment'
    }
  },
  {
    path: 'viewreceipt/:receipt/:pymtrectid',
    component: ReceiptViewComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Receipt'],
        redirectTo: '/'
      },
      title: 'Receipt View'
    }
  },
  {
    path: 'invmatching/:pymtrectid',
    component: InvmatchingComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Receipt'],
        redirectTo: '/'
      },
      title: 'Invoice Matching'
    }
  },
  {
    path: 'editreceipt/:pymtrectid',
    component: ReceiptupdateComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Receipt'],
        redirectTo: '/'
      },
      title: 'Edit Receipt'
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
export class ReceiptsRoutingModule { }
