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
import { HotkeysService, Hotkey, } from 'angular2-hotkeys';
@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit, OnDestroy {
  // public display_dtime = AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  // public paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES;
  // public empty_message = PrimengConstant.EmptyMessage.URL;
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public display_dtime = AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  private date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  public empty_message = PrimengConstant.EmptyMessage.URL;
  public paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES;
  @Output() updatecategory = new EventEmitter();
  display: boolean = false;
  ledgerdisplay: boolean = false;
  ledgerlist: any[] = [];
  ledgerdetails: any = {};
  ledgerdtls: any[];
  allledger: any[];
  closable: boolean = true;
  editovrlay: any;
  addovrlay: any;
  show: boolean = false;
  adddialog_display: boolean = false
  list: boolean = true;
  status: any;
  changestatus: SelectItem[];
  showdet: boolean = false;
  dataload: boolean = false;
  menuItems: MenuItem[];
  hotkeyClose: Hotkey | Hotkey[];
  hotkeyAdd: Hotkey | Hotkey[];
  constructor(private ledgerservice: LedgerService, private localStorageService: LocalStorageService,
    private utilservice: UtilsService, private router: Router, private _hotkeysService: HotkeysService,
  ) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeyClose = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['getstarted']);
      return false;
    }));
    this.hotkeyAdd = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.ADD.KEY, (event: KeyboardEvent): boolean => {
      this.addledger('', {});
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
    this.loadledger();
    this.menuItems = [
      {
        label: 'Add', icon: 'fa-plus', command: (event) => {
          this.addledger('event', 'overlaypanel: DialogModule')
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
  loadledger() {
    var ledgerdetails: any = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.dataload = false;
    this.ledgerservice.getAll({ tenantid: ledgerdetails.tenantid, type: 'SubLedger' })
      .then(res => {
        if (res.status) {
          this.ledgerlist = res.data;
          console.log('list', this.ledgerlist)
          this.dataload = true;
        }
        else {
          console.log('no brand');
          this.dataload = true;
        }
      });
  }
  showhidefilter(ledgerlisttable, btnid) {
    this.show = this.utilservice.resetdatatableFilter(ledgerlisttable, this.show, btnid);
    this.showdet = this.utilservice.resetdatatableFilter(ledgerlisttable, this.showdet, btnid);
  }
  loadledgerlist() {
    // ovrlay.hide();
    this.loadledger();
    this.display = false;
    this.ledgerdisplay = false;
  }
  addledger(event, overlaypanel: DialogModule) {
    this.addovrlay = overlaypanel
    // overlaypanel.toggle(event);
    this.display = true;
    this.ledgerdtls = [];
    this.closable = true;
  }
  update(event, ledgerdtls, overlaypanel: DialogModule) {
    this.editovrlay = overlaypanel;
    // this.display = true;
    this.ledgerdisplay = true;
    this.ledgerdtls = { ...ledgerdtls }
    // overlaypanel.toggle(event);
  }
}