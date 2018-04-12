import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { BrandService } from '../services/brand.service';
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
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit, OnDestroy {
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public display_dtime = AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  private date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  public empty_message = PrimengConstant.EmptyMessage.URL;
  public paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES;
  @Output() updatebrand = new EventEmitter();
  display: boolean = false;
  edit_display: boolean= false;
  closable: boolean = true;
  brandlist: any[] = [];
  branddetails: any = {};
  branddtls: any[];
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
  constructor(private brandservice: BrandService, private localStorageService: LocalStorageService,
    private UtilsService: UtilsService, private router: Router,
    private _hotkeysService: HotkeysService,
  ) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;

    this.hotkeyClose = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['getstarted']);
      return false;
    }));
    this.hotkeyAdd = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.ADD.KEY, (event: KeyboardEvent): boolean => {
      this.addbrand('', {});
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
    this.loadbrand();
    this.menuItems = [
      {
        label: 'Add', icon: 'fa-plus', command: (event) => {
          this.addbrand('event', 'overlaypanel: DialogModule')
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
  loadbrand() {
    var branddetails: any = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.isLoadData = false;
    this.brandservice.getAll({ tenantid: branddetails.tenantid })
      .then(res => {
        if (res.status) {
          this.brandlist = res.data;
          console.log('list', this.brandlist)
          this.isLoadData = true;
        }
        else {
          console.log('no brand');
          this.isLoadData = true;
        }
      });
  }
  loadbrandlist() {
    this.loadbrand();
    this.display = false;
    this.edit_display = false;
  }
  addbrand(event, overlaypanel: DialogModule) {
    this.addovrlay = overlaypanel;
    this.display = true;
    this.branddtls = [];
    this.closable = true;
  }

  update(event, branddtls, overlaypanel: DialogModule) {
    this.editovrlay = overlaypanel;
    // this.display = true;
    this.edit_display = true;
    this.branddtls = { ...branddtls };
  }
  
  showhidefilter(brandlisttable, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(brandlisttable, this.show, btnid);
  }
}
