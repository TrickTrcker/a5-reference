import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/primeng';
import { FileUploadModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { MultiSelectModule } from 'primeng/primeng';
import { OverlayPanelModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { Routes, RouterModule } from '@angular/router';
import { SettingsRoutingModule } from './settings-routing.module';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { PasswordModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
import { BlockUIModule } from 'primeng/primeng';
import { SplitButtonModule } from 'primeng/primeng';
import {KeyFilterModule} from 'primeng/keyfilter';
import { MenuItem } from 'primeng/primeng';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SettingsComponent } from './settings.component';
import { PartiesComponent } from './parties/parties.component';
import { LedgerComponent } from './ledger/ledger.component';
// import { BankComponent } from './bank/bank.component';
import { BrandComponent } from './brand/brand.component';
import { CategoryComponent } from './category/category.component';
// import { AddbrandComponent } from './brand/addbrand/addbrand/addbrand.component';
// import { AddcategoryComponent } from './category/addcategory/addcategory/addcategory.component';
// import { AddbankComponent } from './bank/addbank.component';
// import { AddledgerComponent } from './ledger/addledger/addledger/addledger.component';
// import { AddpartiesComponent } from './parties/addparties/addparties.component';
import { MasterService } from '../../services/master.service';
import { OrganizationSettingsService } from '../settings/services/organization-settings.service';
import { ProfileService } from '../settings/services/profile.service';
import { RoleService } from '../../../app/services/role/role.service';
import { BrandService } from '../settings/services/brand.service';
import { CategoryService } from '../settings/services/category.service';
import { LedgerService } from '../settings/services/ledger.service';
import { PartiesService } from '../settings/services/parties.service';
import { BankService } from '../settings/services/bank.service';
import { CommonService } from '../settings/services/common.service';
import { UsersService } from './services/users.service';
import { UtilsService } from '../../services/utils.service';
import { AppsettingComponent } from './appsetting/appsetting.component';
import { InputTextareaModule } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { HotkeyModule } from 'angular2-hotkeys';
import { SequencesettingsComponent } from './sequencesettings/sequencesettings.component';
import { AddsequencesettingsComponent } from './sequencesettings/addsequencesettings/addsequencesettings.component';
import { SharedModuleModule } from '../../shared-module/shared-module.module';
import { BookAddeditComponent } from './bookofaccount/book-addedit/book-addedit.component';
import { BookofaccountComponent } from './bookofaccount/bookofaccount.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SettingsRoutingModule,
    NgxPermissionsModule.forChild(),
    HotkeyModule.forRoot(),
    OverlayPanelModule,
    DialogModule,
    ButtonModule,
    MultiSelectModule,
    DataTableModule,
    FormsModule,
    ReactiveFormsModule,
    SplitButtonModule,
    KeyFilterModule,
    DragDropModule,
    DropdownModule,
    GrowlModule,
    AutoCompleteModule,
    TabViewModule,
    PasswordModule,
    CheckboxModule,
    RadioButtonModule,
    BlockUIModule,
    InputTextareaModule,
    SharedModuleModule,
    TooltipModule

  ],
  declarations: [
    SettingsComponent, PartiesComponent, LedgerComponent, BrandComponent, CategoryComponent,
    SequencesettingsComponent, AppsettingComponent, AddsequencesettingsComponent, BookAddeditComponent, BookofaccountComponent
  ],
  providers: [
    RoleService, BrandService, CategoryService, LedgerService, PartiesService, BankService,
    MasterService, OrganizationSettingsService, ProfileService, CommonService, UsersService, UtilsService
  ],
  exports: [
    //  AddledgerComponent
  ]
})
export class SettingsModule { }