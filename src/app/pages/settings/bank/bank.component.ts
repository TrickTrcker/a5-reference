import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { BankService } from '../services/bank.service';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { AppConstant } from '../../../app.constant';
import * as _ from 'lodash';
import { BankwithdrawComponent } from '../../../bank/bankwithdraw/bankwithdraw.component';
import { BankdepositeComponent } from '../../../bank/bankdeposite/bankdeposite.component';
import { BanktransferComponent } from '../../../bank/banktransfer/banktransfer.component';

import { LocalStorageService } from '../../../../app/shared/local-storage.service';
import { AddbankComponent } from '../bank/addbank.component';
import { OverlayPanel, LazyLoadEvent } from 'primeng/primeng';
import { UtilsService } from '../../../services/utils.service';
import { PrimengConstant } from '../../../app.primeconfig';
import { MenuItem } from 'primeng/primeng';
import { Router, NavigationExtras } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { MessagesService } from '../../../../app/shared/messages.service';
@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit, OnDestroy {
  finyear: any;
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES;
  public display_dtime = AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  public empty_message = PrimengConstant.EmptyMessage.URL;
  banklist: any[] = [];
  allbanks: any[] = [];
  localStorageDetails: any = {};
  addbankDetails: boolean = false;
  editbankDetails: boolean = false;
  allproducts: any;
  editbank: any;
  addbank: boolean = false;
  addnew: boolean = false;
  selectedbankwithdraw: boolean = false;
  selectedbankdeposit: boolean = false;
  selectedbanktransfer: boolean = false;
  activebankwithdraw: boolean = false;
  activebankdeposit: boolean = false;
  activebanktransfer: boolean = false;
  list: boolean = true;
  show: boolean = false;
  name: string;
  totalRecords: number = 0;
  perPage: number = 10;
  page: number = 0;
  status: any;
  changestatus: any[];
  isLoadData: boolean = false;
  menuItems: MenuItem[];
  activetabindex: number = 0
  @ViewChild('wrapper') wrapper: ElementRef;
  hotkeyClose: Hotkey | Hotkey[];
  hotkeyAdd: Hotkey | Hotkey[];
  selectedbank: any;
  bankwithdrawfrom: boolean = false;
  bankdepositfrom: boolean = false;
  banktransferfrom: boolean = false;
  constructor(private bankservice: BankService, private localStorageService: LocalStorageService,
    private UtilsService: UtilsService, private router: Router,
    private _hotkeysService: HotkeysService,private messageservice: MessagesService,
  ) {
    this.finyear = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR).finyear;
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeyClose = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['getstarted']);
      return false;
    }));
    this.hotkeyAdd = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.ADD.KEY, (event: KeyboardEvent): boolean => {
      this.addBank({});
      return false;
    }));
    this.status = AppConstant.API_CONFIG.status;
    this.changestatus = [];
    this.changestatus.push({ label: 'All', value: null });
    for (var i = 0; i < this.status.length; i++) {
      this.changestatus.push({
        label: this.status[i].stat, value: this.status[i].stat
      });
    }
  }

  ngOnInit() {
    this.getAll();
    this.menuItems = [
      {
        label: 'Add', icon: 'fa-plus', command: (event) => {
          this.bankTransaction('add')
        }
      },
      {
        label: 'Edit', icon: 'fa-plus', command: (event) => {
          this.bankTransaction('edit')
        }
      },
      {
        label: 'Deposit', icon: 'fa-plus', command: (event) => {
          this.bankTransaction('deposit')
        }
      },
      {
        label: 'Widthdraw', icon: 'fa-plus', command: (event) => {
          this.bankTransaction('withdraw')
        }
      },
      {
        label: 'Bank Transfer', icon: 'fa-plus', command: (event) => {
          this.bankTransaction('transfer')
        }
      },
    ];
  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyClose);
    this._hotkeysService.remove(this.hotkeyAdd);
  }
  getAll() {
    this.localStorageDetails = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.isLoadData = false;
    this.bankservice.getAll({ tenantid: this.localStorageDetails.tenantid })
      .then(res => {
        if (res.status) {
          this.allbanks = res.data;
          console.log(' this.allbanks', this.allbanks)
          this.isLoadData = true;
          //this.totalRecords = 
        }
        else {
          console.log('no bank found');
          this.isLoadData = true;
        }
      });
  }
  loadBankLazy(event: LazyLoadEvent) {
    this.page = (event.first / this.perPage)
    this.bankservice.getAll({ tenantid: this.localStorageDetails.tenantid, limit: 10, offset: this.page * 10 })
      .then(res => {
        if (res.status) {
          this.allbanks = res.data;
          //this.totalRecords = res.count;
        }
        else {
          console.log('no bank found');
        }
      });
  }
  onRowSelectBank($event) {
    this.selectedbank = $event.data;
    console.log($event);
  }
  bankTransaction(action) {
   if (action == "add") {
      this.addBank('bankview')
      return;
    }
    if (!_.isEmpty(this.selectedbank)) {
      switch (action) {
        case "deposit": {
          this.selectedbankdeposit = true;
          this.activebankdeposit = true;
          this.bankdepositfrom = true;
          break;
        }
        case "withdraw": {
          this.selectedbankwithdraw = true;
          this.activebankwithdraw = true;
          this.bankwithdrawfrom = true;
          break;
        }
        case "transfer": {
          this.selectedbanktransfer = true;
          this.activebanktransfer = true;
          this.banktransferfrom = true;
          break;
        }
        case "edit": {
          this.update(this.selectedbank);
          break;
        }
        default: {
          this.list = true;
          break;
        }
      }
    }
    else {
      this.messageservice.showMessage({ severity: 'error', summary: 'Error', detail: "Please select a bank." });
      // alert("select bank.");
    }
  }
  notifyNewBank(event) {
    this.getAll();
    this.addbankDetails = false;
    this.editbankDetails = false;
    this.addnew = false;
    this.editbank = false;
    this.list = true;
  }
  notifyNewBankWithDraw(event) {
    this.selectedbankwithdraw = false;
    this.bankwithdrawfrom = false;
    this.activebankwithdraw = false;
    console.log(event);
    this.getAll();
    this.handleClose(null,null);
  }
  hidebankwithdraw($event)
  {
    this.selectedbankwithdraw = false;
    this.bankwithdrawfrom = false;
    this.activebankwithdraw = false;
  }
  notifyNewBankDeposit(event) {
    this.selectedbankdeposit = false;
    this.bankdepositfrom = false;
    this.activebankdeposit = false;
    this.getAll();
    this.handleClose(null,null);
  }
  hidebankdeposit(event)
  {
    this.selectedbankdeposit = false;
    this.bankdepositfrom = false;
    this.activebankdeposit = false;
  }
  notifyNewBankTransfer(event) {
    this.selectedbanktransfer = false;
    this.banktransferfrom = false;
    this.activebanktransfer = false;
    this.getAll();
    this.handleClose(null,null);
  }
  hidebanktransfer($event)
  {
    this.selectedbanktransfer = false;
    this.banktransferfrom = false;
    this.activebanktransfer = false;
  }
  addBank(bankview) {
    //console.log(bankview)
    this.addbankDetails = true;
    this.editbankDetails = false;
    this.banklist = [];
    this.addnew = true;
    this.editbank = false;
    this.list = false;
    this.selectedbankwithdraw = false;
    this.selectedbankdeposit = false;
    this.selectedbanktransfer = false;
    // bankview.activeIndex = 1;
    // this.wrapper.nativeElement.click()

  }

  handleClose(e, bankviewtab) {
    this.addbankDetails = false;
    this.editbankDetails = false;
    this.list = true;
  }

  update(banklist) {
    this.bankservice.getByID(banklist.bankid)
      .then(res => {
        if (res.status) {
          this.banklist = res.data;
          // console.log('tab', bankview);
          this.list = false;
          this.addbankDetails = false;
          this.editbankDetails = true;
          this.editbank = true;
          this.addnew = false;
          this.list = false;
          this.selectedbankwithdraw = false;
          this.selectedbankdeposit = false;
          this.selectedbanktransfer = false;
          // bankview.activeIndex = 1
        } else {
          console.log('no bank found');
        }
      });
  }
  showhidefilter(bankdatalist, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(bankdatalist, this.show, btnid);
  }

}
