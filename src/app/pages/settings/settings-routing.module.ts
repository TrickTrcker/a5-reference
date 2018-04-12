import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SettingsComponent } from './settings.component';
import { PartiesComponent } from './parties/parties.component';
import { LedgerComponent } from './ledger/ledger.component';
// import { BankComponent } from './bank/bank.component';
import { BrandComponent } from './brand/brand.component';
import { CategoryComponent } from './category/category.component'
import { AppsettingComponent } from './appsetting/appsetting.component';
import { SequencesettingsComponent } from './sequencesettings/sequencesettings.component';
import { AddsequencesettingsComponent } from './sequencesettings/addsequencesettings/addsequencesettings.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { BookofaccountComponent } from './bookofaccount/bookofaccount.component'

const routes: Routes = [

  {
    path: 'settingslist',
    component: SettingsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['All', 'Master'],
        redirectTo: '/'
      },
      title: 'Settings'
    }
  },
  {
    path: 'parties', component: PartiesComponent, canActivate: [NgxPermissionsGuard], data: {
      permissions: {
        only: ['All', 'Master'],
        redirectTo: '/'
      },
      title: 'Parties'
    }
  },
  {
    path: 'seqsettings', component: SequencesettingsComponent, canActivate: [NgxPermissionsGuard], data: {
      permissions: {
        only: ['All', 'Master'],
        redirectTo: '/'
      },
      title: 'seqsettings'
    }
  },

  {
    path: 'ledger', component: LedgerComponent, canActivate: [NgxPermissionsGuard], data: {
      permissions: {
        only: ['All', 'Master'],
        redirectTo: '/'
      },
      title: 'Ledger'
    }
  },
  // {
  //   path: 'bank', component: BankComponent, canActivate: [NgxPermissionsGuard], data: {
  //     permissions: {
  //       only: ['All', 'Master'],
  //       redirectTo: '/'
  //     },
  //     title: 'Bank'
  //   }
  // },
  {
    path: 'brand', component: BrandComponent, canActivate: [NgxPermissionsGuard], data: {
      permissions: {
        only: ['All', 'Master'],
        redirectTo: '/'
      },
      title: 'Brand'
    }
  },
  {
    path: 'category', component: CategoryComponent, canActivate: [NgxPermissionsGuard], data: {
      permissions: {
        only: ['All', 'Master'],
        redirectTo: '/'
      },
      title: 'Category'
    }
  },
  {
    path: 'appsetting', component: AppsettingComponent, canActivate: [NgxPermissionsGuard], data: {
      permissions: {
        only: ['All', 'Master'],
        redirectTo: '/'
      },
      title: 'AppSetting'
    }
  },
  {
    path: 'bookofaccounts', component: BookofaccountComponent, canActivate: [NgxPermissionsGuard], data: {
      permissions: {
        only: ['All', 'Master'],
        redirectTo: '/'
      },
      title: 'Book Of Accounts'
    }
  },
  // children: [


  // ]
  //  component: CompanyComponent,



];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    // SettingsComponent,
    // //RolesComponent,
    // OrganizationSettingsComponent,
    // ProfileSettingsComponent
  ]

})
export class SettingsRoutingModule { }