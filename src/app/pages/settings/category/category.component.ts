import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { AppConstant } from '../../../app.constant';
import { LocalStorageService } from '../../../../app/shared/local-storage.service';
import { AddcategoryComponent } from './addcategory/addcategory/addcategory.component';
import { OverlayPanel } from 'primeng/primeng';
import { DialogModule, SelectItem } from 'primeng/primeng';
import { RadioButtonModule } from 'primeng/primeng';
import { UtilsService } from '../../../services/utils.service';
import { PrimengConstant } from '../../../app.primeconfig';
import { MenuItem } from 'primeng/primeng';
import { Router, NavigationExtras } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {
  public paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES;
  public display_dtime = AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  public empty_message = PrimengConstant.EmptyMessage.URL;
  display: boolean = false;
  adddialog_display = false;
  show: boolean = false;
  catglist: any[] = [];
  catgdetails: any = {};
  editovrlay: any;
  addovrlay: any;
  msgs: any;
  status: any;
  changestatus: SelectItem[];
  showdet: boolean = false;
  isLoadData: boolean = false;
  menuItems: MenuItem[];
  hotkeyClose: Hotkey | Hotkey[];
  hotkeyAdd: Hotkey | Hotkey[];
  constructor(private categoryservice: CategoryService, private localStorageService: LocalStorageService,
    private UtilsService: UtilsService, private router: Router, private _hotkeysService: HotkeysService,
  ) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeyClose = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['getstarted']);
      return false;
    }));
    this.hotkeyAdd = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.ADD.KEY, (event: KeyboardEvent): boolean => {
      this.addcategory('', {});
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
    this.loadcategory();
    this.menuItems = [
      {
        label: 'Add', icon: 'fa-plus', command: (event) => {
          this.addcategory('event', 'overlaypanel: DialogModule')
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
  loadcategory() {
    var catgdetails: any = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.isLoadData = false
    this.categoryservice.getAll({ tenantid: catgdetails.tenantid })
      .then(res => {
        if (res.status) {
          this.catglist = res.data;
          this.isLoadData = true
        } else {
          this.isLoadData = true
        }
      });
  }
  loadcategorylist() {
    this.display = false;
    this.adddialog_display = false;
    this.loadcategory();
  }
  addcategory(event, overlaypanel: DialogModule) {
    this.addovrlay = overlaypanel
    this.adddialog_display = true;
    // overlaypanel.toggle(event);
    this.catgdetails = [];
  }
  update(event, catgdetails, overlaypanel: DialogModule) {
    this.catgdetails = { ...catgdetails }
    this.display = true;
    this.editovrlay = overlaypanel;
    // overlaypanel.toggle(event);
  }
  showhidefilter(categorydatalist, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(categorydatalist, this.show, btnid);
    // this.showdet=this.UtilsService.resetdatatableFilter(categorydatalist,this.showdet,btnid);
  }
}
