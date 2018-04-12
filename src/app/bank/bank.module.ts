import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';
import { FileUploadModule } from 'primeng/primeng';
import { PapaParseModule } from 'ngx-papaparse';
import { TooltipModule } from 'primeng/primeng';
import { BlockUIModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import {DialogModule} from 'primeng/primeng';

// import { BankdepositeComponent } from './bankdeposite/bankdeposite.component';
// import { BankwithdrawComponent } from './bankwithdraw/bankwithdraw.component';
// import { BanktransferComponent } from './banktransfer/banktransfer.component';
import { BankdepositelistComponent } from './bankdeposite/bankdepositelist/bankdepositelist.component';
import { BankwithdrawlistComponent } from './bankwithdraw/bankwithdrawlist/bankwithdrawlist.component';
import { BanktransferlistComponent } from './banktransfer/banktransferlist/banktransferlist.component';
import { ViewBankdepositeComponent } from './bankdeposite/view-bankdeposite/view-bankdeposite.component';
// import { ViewBanktransferComponent } from './banktransfer/view-banktransfer/view-banktransfer.component';
import { ViewBankwithdrawComponent } from './bankwithdraw/view-bankwithdraw/view-bankwithdraw.component';
import { BankRouterModule } from './bank-router.module';
import { JournalsService } from './../accounts/service/journals.service';
import { GrowlModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BanksService } from './service/banks.service';
import { UtilsService } from "../services/utils.service";
import { BRSComponent } from './brs/brs.component';
import { BRSUploadComponent } from './brs/csvupload/brsupload.component';
import { BRSMatchingComponent } from './brs/brsmatching/brsmatching.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { from } from 'rxjs/observable/from';
@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    BankRouterModule,
    NgxPermissionsModule.forChild(),
    GrowlModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TabViewModule,
    DataTableModule,
    SharedModule,
    CalendarModule,
    AutoCompleteModule,
    FileUploadModule,
    PapaParseModule,
    TooltipModule,
    BlockUIModule,
    PanelModule,
    DialogModule,
    SharedModuleModule,
  ],
  declarations: [
    // BankdepositeComponent,
    // BankwithdrawComponent,
    // BanktransferComponent,
    BankdepositelistComponent,
    BankwithdrawlistComponent,
    BanktransferlistComponent,
    ViewBankdepositeComponent,
    // ViewBanktransferComponent,
    ViewBankwithdrawComponent,
    BRSComponent,
    BRSUploadComponent,
    BRSMatchingComponent
  ],
  providers: [
    BanksService,
    JournalsService,
    UtilsService
  ]
})
export class BankModule { }
