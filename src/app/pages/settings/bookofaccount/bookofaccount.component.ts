import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { LedgerService } from '../services/ledger.service';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { AppConstant } from '../../../app.constant';
import { OverlayPanel } from 'primeng/primeng';
import { LocalStorageService } from '../../../../app/shared/local-storage.service';
import { RadioButtonModule } from 'primeng/primeng';
import { DialogModule, SelectItem } from 'primeng/primeng';
import { UtilsService } from '../../../services/utils.service';
import { PrimengConstant } from '../../../app.primeconfig';
import { MenuItem } from 'primeng/primeng';
import { Router, NavigationExtras } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ConfirmationService, ConfirmDialog } from 'primeng/primeng';
import { MessagesService } from '../../../shared/messages.service';
import { DateformatPipe } from '../../../pipes/dateformat.pipe';
import * as _ from "lodash";

@Component({
  selector: 'app-bookofaccount',
  templateUrl: './bookofaccount.component.html',
  styleUrls: ['./bookofaccount.component.scss']
})
export class BookofaccountComponent implements OnInit, OnDestroy {
  actualdata: any;
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public display_dtime = AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  private date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  public empty_message = PrimengConstant.EmptyMessage.URL;
  public paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES;
  userdetails: any;
  @Output() updateSubLedger = new EventEmitter();
  display: boolean = false;
  edit_display: boolean = false;
  closable: boolean = true;
  subLedgerlist: any[] = [];
  subLedgerdetails: any = {};
  subLedgerdtls: any[];
  editovrlay: any;
  addovrlay: any;
  status: any;
  changestatus: SelectItem[];
  show: boolean = false;
  showdet: boolean = false;
  isLoadData: boolean = false;
  menuItems: MenuItem[];
  hotkeyClose: Hotkey | Hotkey[];
  hotkeyAdd: Hotkey | Hotkey[];
  isedit = false;
  crdr_opt = [
    {label: 'N', value: 'N'},
    {label: 'C', value: 'C'},
    {label: 'D', value: 'D'},
  ];
  finyear: any;
  constructor(private subLedgerservice: LedgerService,
    private localStorageService: LocalStorageService,
    private utilsService: UtilsService, private router: Router,
    private _hotkeysService: HotkeysService,
    private confirmationService: ConfirmationService,
    private messageService: MessagesService,
    private dateFormatPipeFilter: DateformatPipe,
  ) {
    this.userdetails = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;

    this.hotkeyClose = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['getstarted']);
      return false;
    }));
    this.hotkeyAdd = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.ADD.KEY, (event: KeyboardEvent): boolean => {
      this.addSubLedger('', {});
      return false;
    }));
    this.finyear = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.status = AppConstant.API_CONFIG.status;
    this.changestatus = [];
    this.changestatus.push({ label: 'All', value: null });
    for (var i = 0; i < this.status.length; i++) {
      this.changestatus.push({
        label: this.status[i].stat, value: this.status[i].stat
      });
    }
  }
  getcrdrLabel(item)
  {
    var label = "";
    if(item.label != undefined)
    {
      if(item.label == "C")
      {
        label = "Credit";
      }
      else  if(item.label == "D")
      {
        label = "Debit";
      }
      if(item.label == "N")
      {
        label = "Cr/Dr";
      }
    }
    return label;
  }
  ngOnInit() {
    this.isedit = false;
    this.loadSubLedger();
    this.menuItems = [
      {
        label: 'Add', icon: 'fa-plus', command: (event) => {
          this.addSubLedger('event', 'overlaypanel: DialogModule')
        }
      },

      {
        label: 'Quit', icon: 'fa-close', command: (event) => {
          this.router.navigate(['/getstarted']);
        }
      }
    ];

  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyClose);
    this._hotkeysService.remove(this.hotkeyAdd);
  }
  loadSubLedger() {
    this.isLoadData = false;
    this.subLedgerservice.getAll({ type: 'Ledger' })
      .then(res => {
        if (res.status) {
          this.actualdata = res.data;
          this.subLedgerlist = res.data;
          this.isLoadData = true;
        } else {
          this.isLoadData = true;
        }
      });
  }
  loadSubLedgerlist() {
    this.loadSubLedger();
    this.display = false;
    this.edit_display = false;
  }
  addSubLedger(event, overlaypanel: DialogModule) {
    this.addovrlay = overlaypanel;
    this.display = true;
    this.subLedgerdtls = [];
    this.closable = true;
  }

  update(event, SubLedgerdtls, overlaypanel: DialogModule) {
    this.editovrlay = overlaypanel;
    this.subLedgerdtls = { ...SubLedgerdtls };
    setTimeout(() => {
      this.edit_display = true;
    }, 100);
  }
  showhidefilter(SubLedgerlisttable, btnid) {
    this.show = this.utilsService.resetdatatableFilter(SubLedgerlisttable, this.show, btnid);
  }
  saveOpenBalance(data : any)
  {
    let formdata = {} as any;
    console.log(data);
    formdata = data;
    formdata.opencrdr = data.crdr;

    if (_.isNull(data.createddt)) {
      formdata.createddt = this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat);
    }
    formdata.finyear = this.finyear.finyear;
    this.subLedgerservice.update(formdata).then(res => {
      if (res.status === true) {
        this.loadSubLedgerlist();
        this.isedit = false;
        this.messageService.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
      } else {
        this.messageService.showMessage({ severity: 'error', summary: 'Error', detail: res.message });
      }
    });
    //   }
    // });
  }
  onOpenBalChange(event) {
    let formdata = {} as any;
    this.confirmationService.confirm({
      message: PrimengConstant.GLOBAL_ERROR.EDIT_CONFIRM_MSG,
      accept: () => {
        formdata = event.data;
        if (!_.isNull(event.data.ledger)) {
          formdata.opencrdr = event.data.ledger.crdr;
        }
        this.subLedgerservice.update(formdata).then(res => {
          if (res.status === true) {
            this.loadSubLedgerlist();
            this.isedit = false;
            this.messageService.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
          } else {
            this.messageService.showMessage({ severity: 'error', summary: 'Error', detail: res.message });
          }
        });
        //   }
        // });
      },
      reject: () => {
        this.isedit = false;
      }
    });
  }
  numberOnly(event) {
    this.utilsService.allowNumberOnly(event);
  }
}

