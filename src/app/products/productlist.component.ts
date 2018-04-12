import { Component, OnInit, Renderer2, ElementRef, Input, Output, ViewChild } from '@angular/core';
import { ProductallService } from './productall.service';
import { LocalStorageService } from '../shared/local-storage.service';
import { AppConstant } from '../app.constant';
import { UtilsService } from '../services/utils.service';
import { DialogModule, SelectItem} from 'primeng/primeng';
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { PrimengConstant } from '../app.primeconfig';
import { FeaturesService } from '../services/features.service';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss']
})
export class ProductlistComponent implements OnInit {
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  private date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  public paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES;
public dateformat=AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  userdetails: any
  allproducts: any;
  editpro: any;
  addproduct: boolean = false;
  editproduct: boolean = false;
  addnew: boolean = false;
  list: boolean = true;
  prodtls: any[];
  name: string;
  show: boolean = false;
  selectedpro:any[]=[];
  product:any;
  status:any;
  changestatus: SelectItem[];
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];
  constructor(private ProductallService: ProductallService, private LocalStorageService: LocalStorageService,
  private UtilsService:UtilsService,private _hotkeysService: HotkeysService,private featuresservice: FeaturesService) {
    this.userdetails = LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.status = AppConstant.API_CONFIG.status;
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;    
    this.changestatus = [];
    this.changestatus.push({label: "All", value: null});
  for (var i = 0; i < this.status.length; i++) {
    this.changestatus.push({
      label: this.status[i].stat, value: this.status[i].stat
    });
  } 
    // Download
    this.hotkeyDownload = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.DOWNLOAD.KEY, (event: KeyboardEvent): boolean => {
      this.pdfdownload();
      return false;
    }));
  }

  @ViewChild('wrapper') wrapper: ElementRef;

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.ProductallService.ProductGetAll({ tenantid: this.userdetails.tenantid })
      .then((res) => {
        this.allproducts = res.data;
        console.log("Product List",this.allproducts)
      });
  }
  notifyNewProduct(event) {
    this.getAllProducts();
    this.addproduct = false;
    this.editproduct = false;
    this.addnew = false;
    this.editpro = false;
    this.list = true;
  }
  Addproducts(protabview) {
    this.addproduct = true;
    this.editproduct = false;
    this.addnew = true;
    this.editpro = false;
    this.list = false;
    this.prodtls = null;
    this.selectedpro=[];
    protabview.activeIndex = 1;
    // this.wrapper.nativeElement.click()
  }

  handleClose(event,protabview) {
    this.addproduct = false;
    this.editproduct = false;
    this.list = true;
    this.UtilsService.deactivate_multitab(this.selectedpro,event,protabview,"prodid");

  }

  Editproduct(prodtls, protabview) {
    this.list = false;
    this.addproduct = false;
    this.editproduct = true;
    this.addnew = false;
    this.editpro = true;
    this.prodtls = prodtls;
    this.selectedpro=[];
    protabview.activeIndex = 1;
  }
  viewproduct(items,protabview){
    this.list = false;
    this.addproduct = false;
    this.editproduct = false;
    this.addnew = false;
    this.editpro = false;
  this.product=items;
  this.UtilsService.activate_multitab(this.selectedpro, items, protabview,"prodid");
  }
  
  showhidefilter(allproducts,btnid) {
    this.show=this.UtilsService.resetdatatableFilter(allproducts,this.show,btnid);
    // this.showdet=this.UtilsService.resetdatatableFilter(brandlisttable,this.showdet,btnid);
  }
    // PDF Download
    pdfdownload() {
      let data = {} as any;
      data = this.UtilsService.getReportParams(AppConstant.REPORTS.PRODUCT_LIST.REPORT_NAME, this.userdetails);
      data.reportparams = this.UtilsService.prepareReportParams({
        'categoryid': 'All',
        'brandid': 'All'
      });
      var res = this.featuresservice.reportDownload(data)
        .subscribe(
        data => {
          this.UtilsService.saveToFileSystem(data, "application/pdf", AppConstant.REPORTS.PRODUCT_LIST.PREFIX_NAME, ".pdf");
          return data;
        },
        error => {
          console.error(error);
          return error;
  
        }
        );
    }
}
