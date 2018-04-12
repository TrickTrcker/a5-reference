import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PaymentComponent } from './addedit-Payment/payment.component';
import { PaymentlistComponent } from './paymentlist/paymentlist.component';
import { ViewPaymentComponent } from './view-payment/view-payment.component';
import { PaymentupdateComponent } from './paymentupdate/paymentupdate.component';
import { BillUnmatchedComponent } from './bill-unmatched/bill-unmatched.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { GeneralPaymentComponent } from './general-payment/general-payment.component';
const routes: Routes = [
  {
    path: 'list',
    component: PaymentlistComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Payment'],
        redirectTo: '/'
      },
      title: 'Payment List'
    }
  },
  {
    path: 'editpayment/:pymtrectid',
    component: PaymentupdateComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All','Payment'],
        redirectTo: '/'
      },
      title: 'Edit Payment'
    }
  },
  {
    path: 'paymentaddedit',
    component: PaymentComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All','Payment'],
        redirectTo: '/'
      },
      title: 'Add/Edit Payment'
    }
  },
  // {
  //   path: 'generalpayment',
  //   component: GeneralPaymentComponent,
  //   canActivate: [NgxPermissionsGuard],
  //   data: {
  //     permissions: {
  //       only: 'Payment',
  //       redirectTo: '/'
  //     },
  //     title: 'Add/Edit General Payment'
  //   }
  // },
  {
    path: 'viewpayment/:payment/:pymtrectid',
    component: ViewPaymentComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All','Payment'],
        redirectTo: '/'
      },
      title: 'Payment View'
    }
  },
  {
    path:'billmatch/:pymtrectid',
    component:BillUnmatchedComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Payment'],
        redirectTo: '/'
      },
      title: 'Bill Matching'
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class PaymentsRoutingModule { }
