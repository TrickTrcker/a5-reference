import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { CommonService } from '../services/common.service';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { AppConstant } from '../../../app.constant';
import { LocalStorageService } from '../../../../app/shared/local-storage.service';
import { OverlayPanel } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
import { DialogModule, SelectItem } from 'primeng/primeng';
import { UtilsService } from '../../../services/utils.service';
import { PrimengConstant } from '../../../app.primeconfig';
import { MenuItem } from 'primeng/primeng';
import { Router, NavigationExtras } from '@angular/router';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

@Component({
  selector: 'app-sequencesettings',
  templateUrl: './sequencesettings.component.html',
  styleUrls: ['./sequencesettings.component.scss']
})
export class SequencesettingsComponent implements OnInit, OnDestroy {
  //   @Output() updatebrand = new EventEmitter();
  //  @Input() seqdtls:any;
  //  @Input() se
  isLoadData: boolean;
  settingslist: any[] = [];
  menuItems: MenuItem[];
  display: boolean = false;
  addovrlay: any;
  show: boolean = false;
  closable: boolean = true;
  editovrlay: any;
  seqdtls: any[];
  status: any;
  dialogvisable: boolean = false;
  changestatus: SelectItem[];
  hotkeyClose: Hotkey | Hotkey[];
  public display_dtime = AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  constructor(private brandservice: CommonService, private localStorageService: LocalStorageService,
    private UtilsService: UtilsService, private router: Router, private _hotkeysService: HotkeysService,
  ) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeyClose = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['getstarted']);
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
    this.loadSettings();

  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyClose);
  }
  loadbrandlist() {
    // this.loadbrand();
    this.display = false;
    this.loadSettings();
  }
  loadSettings() {
    var userdetails: any = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.isLoadData = false;
    this.brandservice.getSequenceSettings({})
      .then(res => {
        if (res.status) {
          this.settingslist = res.data;
          console.log('list', this.settingslist)
          this.isLoadData = true;
        }
        else {
          console.log('no brand');
          this.isLoadData = true;
        }
      });
  }

  update(event, seqdtls, overlaypanel: DialogModule) {
    this.seqdtls = [];
    this.editovrlay = overlaypanel;
    this.display = true;
    this.seqdtls = { ...seqdtls };
    this.dialogvisable = true;

  }
  showhidefilter(brandlisttable, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(brandlisttable, this.show, btnid);
  }
}
