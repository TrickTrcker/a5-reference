import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InvoiceDataTable } from '../invoice-data-table.interface';
import { SalesService } from '../../services/sales/sales.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import {AppConstant  } from '../../app.constant';
import { ViewInvoiceComponent } from '../view-invoice/view-invoice.component';
import {MenuModule,MenuItem} from 'primeng/primeng';
import { Router, NavigationExtras } from '@angular/router';
import { CurrencyPipe } from "@angular/common";
@Component({
  selector: 'app-proforma-invoicelist',
  templateUrl: './proforma-invoicelist.component.html',
  styleUrls: ['./proforma-invoicelist.component.scss']
})
export class proformaInvoicelistComponent implements OnInit {
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  public invoicelistmenuitem: MenuItem[];
  public invoicelistmainmenu :  MenuItem[];
  barData: any;
  lineData: any;
  invoicelist: any = [];
  userstoragedata: any;
  finyear: any;
  selectedinvoice: any = [];
  activeTab: String = "-";
  currencyFilter:CurrencyPipe;
  constructor(private salesService: SalesService, private storageservice: LocalStorageService,
    private router: Router) {
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.currencyFilter = new CurrencyPipe("en-in");
  }

  ngOnInit() {
    this.invoicelistmainmenu = [
      {
        label: 'New',
        icon: 'fa-eye',
        command: (event) => {
          //event.originalEvent: Browser event
          //event.item: menuitem metadata
          this.router.navigate(['sales/proformaaddedit']);
        }
      },
    ];
    this.invoicelistmenuitem = [
      {
        label: 'View',
        icon: 'fa-eye',
        command: (event) => {
          //event.originalEvent: Browser event
          //event.item: menuitem metadata
         }
      },
      {
        label: 'Edit',
        icon: 'fa-edit',
      }
    ];
    var self = this;
    this.lineData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#3984b8'
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: '#3eb839'
        }
      ]
    };
    this.barData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          backgroundColor: '#59c429',
          borderColor: '#3984b8',
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          backgroundColor: '#6ec5ff',
          borderColor: '#f6ac2b',
          data: [28, 48, 40, 19, 86, 27, 90]
        }
      ]
    }
    var data = {
      tenantid: this.userstoragedata.tenantid,
      finyear: this.finyear.finyear
    };
    this.salesService.getAll(data)
      .then(function (res) {
        self.invoicelist = res.data;
        console.log(self.invoicelist);
      });
  }
  addTabViewinvoice(item) {
    this.activeTab = "-";
    if (this.selectedinvoice.length > 0) {
      this.selectedinvoice.unshift(item);
    }
    else {
      this.selectedinvoice.push(item);
    }
    console.log(this.selectedinvoice);
    this.activeTab = item.invoiceno;
  }
  handletabClose(e) {
    // alert(e);
    e.close();

  }
  handleTabChange(e,menu)
  {
console.log(e);
  }
  onContextSelect(event) {
    console.log(event);
  }

}
