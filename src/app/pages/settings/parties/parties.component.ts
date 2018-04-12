import { Component, OnInit, OnDestroy, Renderer2, ElementRef, Input, Output, ViewChild, OnChanges } from '@angular/core';
import { PartiesService } from '../services/parties.service';
import { DataTableModule, SharedModule, SelectItem } from 'primeng/primeng';
import { AppConstant } from '../../../app.constant';
import { LocalStorageService } from '../../../../app/shared/local-storage.service';
import { AddpartiesComponent } from '../parties/addparties/addparties.component';
import { UtilsService } from '../../../services/utils.service';
import { PrimengConstant } from '../../../app.primeconfig';
import { MenuItem } from 'primeng/primeng';
import { Router, NavigationExtras } from '@angular/router';
import * as _ from 'lodash';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

@Component({
  selector: 'app-parties',
  templateUrl: './parties.component.html',
  styleUrls: ['./parties.component.scss']
})
export class PartiesComponent implements OnInit, OnChanges, OnDestroy {
  public paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES;
  public empty_message = PrimengConstant.EmptyMessage.URL;

  partieslist: any[] = [];
  partiesdetails: any = {};
  editpar: any;
  addparties: boolean = false;
  editparties: boolean = false;
  addnew: boolean = false;
  list: boolean = true;
  show: boolean = false;
  name: string;
  customerlist: boolean = false;
  datafromat: string;
  status: any;
  isLoadData: boolean = false;
  changestatus: SelectItem[];
  menuItems: MenuItem[];
  customers: any[] = [];
  hotkeyClose: Hotkey | Hotkey[];
  hotkeyAdd: Hotkey | Hotkey[];
  CustomerorVendor: any = PrimengConstant.COMMON.VENDOR;
  CustomerorVendorTemp: any = PrimengConstant.COMMON.VENDOR;
  public display_dtime = AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  constructor(private partiesservice: PartiesService, private localStorageService: LocalStorageService,
    private UtilsService: UtilsService, private router: Router, private _hotkeysService: HotkeysService,
  ) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeyClose = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['getstarted']);
      return false;
    }));
    this.hotkeyAdd = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.ADD.KEY, (event: KeyboardEvent): boolean => {
      this.Addproducts({});
      return false;
    }));
    this.datafromat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.status = AppConstant.API_CONFIG.status;
    this.changestatus = [];
    this.changestatus.push({ label: 'All', value: null });
    for (var i = 0; i < this.status.length; i++) {
      this.changestatus.push({
        label: this.status[i].stat, value: this.status[i].stat
      });
    }
  }

  @ViewChild('wrapper') wrapper: ElementRef;
  ngOnChanges() {

  }
  ngOnInit() {
    this.getallparties();
    this.menuItems = [
      {
        label: 'Add', icon: 'fa-plus', command: (event) => {
          this.Addproducts('partiesView')
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
  onTabChange(event,partiesView) {
    console.log(event);
    if(event.index == 0)
    {
      this.CustomerorVendorTemp = PrimengConstant.COMMON.VENDOR;
    }
    else if(event.index == 1)
    {
      this.CustomerorVendorTemp = PrimengConstant.COMMON.CUSTOMER;
    }
  }
  getallparties() {
    var partiesdetails: any = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.isLoadData = false
    this.partiesservice.getAll({ tenantid: partiesdetails.tenantid })
      .then(res => {
        if (res.status) {
          // this.partieslist = res.data;
          console.log('resdata', res.data);
          this.partieslist = _.filter(res.data, (value: any) => {
            return value.contactype == 'Vendor';
          });
          this.customers = _.filter(res.data, (value: any) => {
            return value.contactype == 'Customer';
          });
          this.isLoadData = true
        }
        else {
          this.isLoadData = true
        }
      });
  }

  showhidefilter(ledgerlisttable, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(ledgerlisttable, this.show, btnid);
  }
  notifyNewProduct(event) {
    this.getallparties();
    this.addparties = false;
    this.editparties = false;
    this.addnew = false;
    this.editpar = false;
    this.list = true;
    this.customerlist = false;
  }

  Addproducts(partiesView) {

    this.editparties = false;
    this.editpar = false;
    this.list = false;
    this.addnew = true;
    this.addparties = true;
    this.partiesdetails = null;
    this.customerlist = false;
    this.CustomerorVendor = _.clone(this.CustomerorVendorTemp);
    _.map(partiesView.tabs, function (ch: any) {
      return ch.selected = false;
    });
    if (partiesView.tabs[2]) {
      partiesView.tabs[2].selected = true;
      partiesView.activeIndex = 2;
    } else {
      partiesView.activeIndex = 2;
    }


    // this.wrapper.nativeElement.click()
  }

  handleClose(e) {
    this.addparties = false;
    this.editparties = false;
    this.customerlist = false;
    this.list = true;
  }
  viewproduct(partiesdetails, partiesView) {
    this.list = false;
    this.addparties = false;
    this.editparties = true;
    this.addnew = false;
    this.editpar = true;
    this.customerlist = false;
    this.CustomerorVendor = partiesdetails.contactype;
    _.map(partiesView.tabs, function (ch: any) {
      return ch.selected = false;
    });
    if (partiesView.tabs[2]) {
      partiesView.tabs[2].selected = true;
      partiesView.activeIndex = 2;
    } else {
      partiesView.activeIndex = 2;
    }
    this.partiesdetails = partiesdetails;
  }
}
