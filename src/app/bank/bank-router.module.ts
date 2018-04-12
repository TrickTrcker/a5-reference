import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { BankComponent } from '../pages/settings/bank/bank.component';
import { BankdepositeComponent } from './bankdeposite/bankdeposite.component';
import { BankwithdrawComponent } from './bankwithdraw/bankwithdraw.component';
import { BanktransferComponent } from './banktransfer/banktransfer.component';
import { BankdepositelistComponent } from './bankdeposite/bankdepositelist/bankdepositelist.component';
import { BankwithdrawlistComponent } from './bankwithdraw/bankwithdrawlist/bankwithdrawlist.component';
import { BanktransferlistComponent } from './banktransfer/banktransferlist/banktransferlist.component';
import{BRSComponent} from './brs/brs.component';
import { BRSUploadComponent } from './brs/csvupload/brsupload.component' ;
import { BRSMatchingComponent } from './brs/brsmatching/brsmatching.component';
const routes: Routes = [
  {
    path: 'list', 
    component: BankComponent,  
    canActivate: [NgxPermissionsGuard], 
    data: {
      permissions: {
        only: ['All'],
        redirectTo: '/'
      },
      title: 'Bank List'
    },
  },
  {
    path: 'deposit', 
    component: BankdepositelistComponent,  
    canActivate: [NgxPermissionsGuard], 
    data: {
      permissions: {
        only: ['All','Bank Deposit'],
        redirectTo: '/'
      },
      title: 'Bank Deposit'
    },
  },
  {
    path: 'withdraw',
    component: BankwithdrawlistComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Bank Withdraw'],
        redirectTo: '/'
      },
      title: 'Bank WithDraw'
    },
  },
  {
    path: 'transfer',
    component: BanktransferlistComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'Bank Transfer'],
        redirectTo: '/'
      },
      title: 'Bank Transfer'
    },
  },
  {
    path: 'brslist',
    component: BRSComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All','BRS'],
        redirectTo: '/'
      },
      title: 'BRS'
    },
  },
  {
    path: 'brsupload',
    component: BRSUploadComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'BRS'],
        redirectTo: '/'
      },
      title: 'BRS Upload'
    },
  },
  {
    path: 'brsmatching',
    component: BRSMatchingComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only:['All', 'BRS'],
        redirectTo: '/'
      },
      title: 'BRS Matching'
    },
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class BankRouterModule { }
