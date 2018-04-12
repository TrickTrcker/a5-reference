import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { GetstartedComponent } from './pages/getstarted/getstarted.component';
import { ProductlistComponent } from './products/productlist.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AuthGuard } from './shared/auth-guard.service';
import { ReportsComponent } from './reports/reports.component';
import { ReceiptRegisterComponent } from './reports/receipt-register/receipt-register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IndexComponent } from './index/index.component';
import { LogOutComponent } from './log-out/log-out.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import {TaxsummaryComponent}from './gstfiling/taxsummary/taxsummary.component';
import { TenantSwitchingComponent } from './tenant-switching/tenant-switching.component';
// import { LedgerviewComponent } from './shared/components/ledgerview/ledgerview.component';
// import { ViewInvoiceComponent } from './sales/view-invoice/view-invoice.component'
// import { SettingsComponent } from './pages/settings/settings.component';
// import { UsersComponent } from './pages/settings/users/users.component';
// import { RolesComponent } from './pages/settings/roles/roles.component';
// import { OrganizationSettingsComponent } from './pages/settings/organization-settings/organization-settings.component';

// import {SampleDemo} from './demo/view/sampledemo';
// import {FormsDemo} from './demo/view/formsdemo';
// import {DataDemo} from './demo/view/datademo';
// import {PanelsDemo} from './demo/view/panelsdemo';
// import {OverlaysDemo} from './demo/view/overlaysdemo';
// import {MenusDemo} from './demo/view/menusdemo';
// import {MessagesDemo} from './demo/view/messagesdemo';
// import {MiscDemo} from './demo/view/miscdemo';
// import {EmptyDemo} from './demo/view/emptydemo';
// import {ChartsDemo} from './demo/view/chartsdemo';
// import {FileDemo} from './demo/view/filedemo';
// import {UtilsDemo} from './demo/view/utilsdemo';
// import {Documentation} from './demo/view/documentation';
// import {LandingPageComponent } from './pages/landing-page.component'

export const routes: Routes = [
    { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'logout', component: LogOutComponent },
    {
        path: 'getstarted', component: GetstartedComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['All', 'master'],
                redirectTo: '/'
            }
        }
    },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
    { path: 'products', component: ProductlistComponent, canActivate: [AuthGuard,NgxPermissionsGuard],     data: {
        permissions: {
            only: ['All', 'Products'],
            redirectTo: '/'
        }
    } },

    { path: ':sessionrefkey', component: IndexComponent },
    {
        path: 'sales',
        loadChildren: './sales/sales.module#SalesModule',
        canActivate: [AuthGuard,NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['All', 'Sales'],
                redirectTo: '/'
            }
        } 
    },
    {
        path: 'receipts',
        loadChildren: './receipts/receipts.module#ReceiptsModule',
        canActivate: [AuthGuard,NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['All', 'Receipt'],
                redirectTo: '/'
            }
        } 
    },
    {
        path: 'payment',
        loadChildren: './payment/payment.module#PaymentModule',
        canActivate: [AuthGuard,NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['All', 'Payment'],
                redirectTo: '/'
            }
        } 
    },
    {
        path: 'accounts',
        loadChildren: './accounts/accounts.module#AccountsModule',
        canActivate: [AuthGuard,NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['All', 'Accounts'],
                redirectTo: '/'
            }
        } 
    },
    {
        path: 'banks',
        loadChildren: './bank/bank.module#BankModule',
        canActivate: [AuthGuard,NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['All', 'Bank'],
                redirectTo: '/'
            }
        } 
    },
    {
        path: 'purchase',
        loadChildren: './purchase/purchase.module#PurchaseModule',
        canActivate: [AuthGuard,NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['All', 'Bills'],
                redirectTo: '/'
            }
        } 
    },
    {
        path: 'reports',
        loadChildren: './reports/reports.module#ReportsModule',
        canActivate: [AuthGuard,NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['All', 'Reports'],
                redirectTo: '/'
            }
        } 
    },
    
    {
        path: 'taxsummary',
        component: TaxsummaryComponent, canActivate: [AuthGuard,NgxPermissionsGuard],
        data: {
            permissions: {
                only: ['All','Reports'],
                redirectTo: '/'
            }
        }  
        
    },
    {
        path: 'switching/:clientid/:consultantid',
        component: TenantSwitchingComponent, canActivate: [AuthGuard,NgxPermissionsGuard]
    },
    // {
    //     path: 'ledgerview/:txnkey/:txnrefno',
    //     component: LedgerviewComponent, canActivate: [AuthGuard,NgxPermissionsGuard],
    //     data: {
    //         permissions: {
    //             only: ['All','Reports'],
    //             redirectTo: '/'
    //         }
    //     }  
        
    // }
    // {
    //     path: 'viewinvoice/:invoiceid',
    //     component: ViewInvoiceComponent
    // },

];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
