import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { Message } from 'primeng/primeng';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FeaturesService } from './../services/features.service';
import { ProductallService } from './productall.service';
import { LocalStorageService } from '../shared/local-storage.service';
import { AppConstant } from '../app.constant';
import { AutoCompleteModule } from 'primeng/primeng';
import { UtilsService } from '../services/utils.service';
import { MessagesService } from '../../app/shared/messages.service';
import { MasterService } from '../../app/services/master.service'
import * as _ from 'lodash';
import { PrimengConstant } from '../app.primeconfig';
import { AddbrandComponent } from '../pages/settings/brand/addbrand/addbrand/addbrand.component';
import { AddcategoryComponent } from '../pages/settings/category/addcategory/addcategory/addcategory.component';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { DateformatPipe } from './../pipes/dateformat.pipe';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnChanges, OnDestroy {
  public amtlength = AppConstant.API_CONFIG.AMOUNTFORMAT.MAXLENGTH;
  public productlength = AppConstant.API_CONFIG.MAXLENGTH.MAX50;
  date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  uom: SelectItem[];
  brand: SelectItem[];
  category: SelectItem[];
  selecteduomdetails: any;
  hsndescription: any;
  hsntax: any;
  selectedbrandetails: any;
  selectedcatdetails: any;
  selectedbrandname: any[];
  selectedcatname: any[];
  selectedUOMdesc: any;
  selectedhsncode: any;
  selecteduom: any[];
  validation = 'true';
  validationmsg = '';
  formdata = {};
  userdetails: any;
  alluoms: any[];
  allbrands: any[];
  allcategories: any[];
  catgdetails: any = {};
  allhsncode: any[];
  hsncode: any;
  msgs: Message[] = [];
  filteredbrand: any[];
  filtereduoms: any[];
  filteredcat: any[];
  Indate: any;
  addbrand_display: boolean = false;
  addcategory_display: boolean = false;

  @Input() prodtls: any;
  @Output() notifyNewProduct: EventEmitter<any> = new EventEmitter();
  @Input() openedfromothers: boolean = false;


  pro: FormGroup;
  productname: FormControl;
  productmrp: FormControl;
  post: any;
  changestatus: any[] = [];
  status: any = [];
  public autocomplete_emptymessage = PrimengConstant.AUTOCOMPLETE.EMPTYMESSAGE;
  hotkeySave: Hotkey | Hotkey[];
  hotkeyBrand: Hotkey | Hotkey[];
  hotkeyCategory: Hotkey | Hotkey[];
  formObj: any = {
    productname: PrimengConstant.PRODUCT.ADDEDITFORM.PROD_NAME,
    productmrp: PrimengConstant.PRODUCT.ADDEDITFORM.PROD_MRP,
    productcode: PrimengConstant.PRODUCT.ADDEDITFORM.PROD_CODE,
    hsncode: PrimengConstant.PRODUCT.ADDEDITFORM.HSN_CODE,
    uomdesc: PrimengConstant.PRODUCT.ADDEDITFORM.UOM,
    brandname: PrimengConstant.PRODUCT.ADDEDITFORM.BRAND,
    categoryname: PrimengConstant.PRODUCT.ADDEDITFORM.CATEGORY,
    status: PrimengConstant.COMMON.STATUS
  }
  constructor(private masterservice: MasterService, private messageservice: MessagesService,
    private fb: FormBuilder, private ProductallService: ProductallService,
    private LocalStorageService: LocalStorageService,
    private featureservice: FeaturesService,
    private UtilsService: UtilsService,
    private _hotkeysService: HotkeysService,
    public dateFormatPipeFilter: DateformatPipe,
  ) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeySave = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.SAVE.KEY, (event: KeyboardEvent): boolean => {
      this.createpro(this.pro.value)
      return false;
    }, [], shrtkeys.COMMON.SAVE.TXT));
    this.hotkeyBrand = this._hotkeysService.add(new Hotkey(shrtkeys.TRANSACTION.BRAND.KEY, (event: KeyboardEvent): boolean => {
      this.addbrand_display = true;
      return false;
    }, [], shrtkeys.TRANSACTION.BRAND.TXT));
    this.hotkeyCategory = this._hotkeysService.add(new Hotkey(shrtkeys.TRANSACTION.CATEGORY.KEY, (event: KeyboardEvent): boolean => {
      this.addcategory_display = true;
      return false;
    }, [], shrtkeys.TRANSACTION.PRODUCT.TXT));
    this.clearForm();
    this.userdetails = LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.status = AppConstant.API_CONFIG.status;
    for (var i = 0; i < this.status.length; i++) {
      this.changestatus.push({
        label: this.status[i].stat, value: this.status[i].stat
      });
    }
  }
  clearForm() {
    this.pro = new FormGroup({
      'productname': new FormControl(null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])),
      'productmrp': new FormControl(0, Validators.required),
      'productcode': new FormControl(null, Validators.required),
      'uomdesc': new FormControl(null, Validators.required),
      'hsncode': new FormControl(null, Validators.required),
      'brandname': new FormControl(null),
      'categoryname': new FormControl(null),
      'status': new FormControl('Active'),
    });
  }
  callParent(message) {
    this.notifyNewProduct.next(message);
  }
  numberOnly(event) {
    this.UtilsService.allowNumberOnly(event);
  }
  loadbrandlist() {
    this.ProductallService.brandGetAll({ tenantid: this.userdetails.tenantid, status: 'Active', })
      .then((res) => {
        if (res.data) {
          var brandlist = res.data;
          this.allbrands = this.masterservice.formatDataforDropdown('brandname', brandlist, 'Select Brand');
          // if (!_.isNull(refreshdata)) {
          //   let data = _.find(brandlist, { 'brandid': Number(refreshdata.brandid) });
          //   if (!_.isNull(data) && !_.isUndefined(data)) {
          //     this.pro.controls['brandname'].setValue(data);
          //   }
          // }
        } else {
          this.allbrands = this.masterservice.formatDataforDropdown('brandname', [], 'Select Brand');
        }
      });
  }

  loadCategory() {
    this.ProductallService.categoryGetAll({ tenantid: this.userdetails.tenantid, status: 'Active', })
      .then((res) => {
        if (res.data) {
          var categorylist = res.data;
          this.allcategories = this.masterservice.formatDataforDropdown('categoryname', categorylist, 'Select Category');
          // if (!_.isNull(refreshdata)) {
          //   let data = _.find(categorylist, { categoryid: Number(refreshdata.categoryid) });
          //   if (!_.isNull(data) && !_.isUndefined(data)) {
          //     this.pro.controls['categoryname'].setValue(data);
          //     console.log(this.pro);
          //   }
          // }
        } else {
          this.allcategories = this.masterservice.formatDataforDropdown('categoryname', [], 'Select Category');
        }
      });
  }
  ngOnInit() {
    this.clearForm();
    this.ProductallService.getAll({})
      .then((res) => {
        if (res.data) {
          var uomlist = res.data;
          this.alluoms = this.masterservice.formatDataforDropdown('uomdesc', uomlist, 'Select UOM');
          console.log('uomlist', this.alluoms)
        }
      });

    this.loadbrandlist();
    this.loadCategory();

    this.featureservice.hsnGetAll({})
      .then((res) => {
        if (res.status) {
          var allhsncode = res.data;
          this.hsncode = this.masterservice.productHsnCodeDropdown('hsncode', 'description', allhsncode, 'Select HSN Code');
          console.log('this.hsncode', this.hsncode)
          this.viewproduct();
        }
        else {
          this.viewproduct();
        }

      });
    setTimeout(() => {
      // this.viewproduct()
    }, 1000);


    var dateS = [];
    var today = new Date().toISOString()
    this.Indate = formatDate(today);
    function formatDate(date) {
      if (date) {
        dateS = date.split('-');
        var d = new Date();
        d.setMonth(dateS[1]);
        d.setFullYear(dateS[0]);
        d.setDate(parseInt(dateS[2]));
        var
          month = '' + (d.getMonth()),
          day = '' + d.getDate(),
          year = d.getFullYear();
        if (month.length < 2)
          month = '0' + month;
        if (day.length < 2)
          day = '0' + day;
        return [year, month, day].join('-');
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('cheatsheet changes: ', changes);
    if (changes.openedfromothers) {
      if (changes.openedfromothers.currentValue == true) {

      }
      console.log('openfrom changes: ', changes);
    }
    setTimeout(() => {
      this.viewproduct()
    }, 1000);
  }
  clearform() {
    this.pro.reset();
    this.pro.controls['productmrp'].setValue(0);
    this.selectedhsncode = null;
  }

  viewproduct() {
    if (!_.isEmpty(this.prodtls)) {
      var self = this;
      this.selecteduomdetails = _.find(this.alluoms, { value: { uomid: this.prodtls.uomid } });
      this.selectedbrandetails = _.find(this.allbrands, { value: { brandid: this.prodtls.brandid } });
      this.selectedcatdetails = _.find(this.allcategories, { value: { categoryid: this.prodtls.categoryid } });
      let selectedhsn: any = _.find(this.hsncode, { value: { hsncode: this.prodtls.hsncode } });
      console.log('dec', this.selectedhsncode);
      if (selectedhsn != undefined) {
        this.selectedhsncode = selectedhsn.value;
      }
      this.pro = new FormGroup({
        'productname': new FormControl(this.prodtls.prodname, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])),
        'productmrp': new FormControl(this.prodtls.mrp, Validators.required),
        'productcode': new FormControl(this.prodtls.productcode, Validators.required),
        'uomdesc': new FormControl(  _.isEmpty(this.selecteduomdetails) ? null : this.selecteduomdetails.value, Validators.required),
        'hsncode': new FormControl(this.selectedhsncode, Validators.required),
        'brandname': new FormControl( _.isEmpty(this.selectedbrandetails) ? null : this.selectedbrandetails.value ),
        'categoryname': new FormControl( _.isEmpty(this.selectedcatdetails) ? null : this.selectedcatdetails.value ),
        'status': new FormControl(this.prodtls.status),
      })
    }
  }

  setSelectedHsn(item) {
    console.log('item', item)
    this.selectedhsncode = item.value;
  }
  createpro(data) {

    if (this.pro.status == 'INVALID') {
      var errorMessage = this.masterservice.getFormErrorMessage(this.pro, this.formObj);
      this.messageservice.showMessage({ severity: 'error', summary: 'Error', detail: errorMessage });
      return false;
    }

    if (this.prodtls) {
      this.formdata = {
        'prodid': this.prodtls.prodid,
        'tenantid': this.userdetails.tenantid,
        'tenantname': this.userdetails.tenantname,
        'prodname': _.trim(data.productname),
        'mrp': data.productmrp,
        'productcode': _.trim(data.productcode),
        'hsncode': data.hsncode.hsncode,
        'hsndesc': data.hsncode.description,
        'hsnsactaxpercent': data.hsncode.gstpercent,
        'uomid': data.uomdesc.uomid,
        'uomdesc': data.uomdesc.uomdesc,
        'brandid': _.isEmpty(data.brandname) ? null : data.brandname.brandid,
        'brandname': _.isEmpty(data.brandname) ? null : _.trim(data.brandname.brandname),
        'categoryid': _.isEmpty(data.categoryname) ? null : data.categoryname.categoryid,
        'categoryname':_.isEmpty(data.categoryname) ? null : _.trim(data.categoryname.categoryname),
        'status': data.status,
        // 'createdby': this.userdetails.loginname,
       // 'createddt': this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
        'lastupdatedby': this.userdetails.loginname,
        'lastupdateddt': this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
      }
      this.ProductallService.ProductUpdate(this.formdata)
        .then((res) => {
          if (res.status == true) {
            this.msgs = [];
            this.messageservice.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
            this.callParent(res.message);
            this.clearform();
          }
          else if (res.status == false) {
            this.messageservice.showMessage({ severity: 'error', summary: 'Error', detail: res.message });
          }
        });
    }
    else {
      this.formdata = {
        'tenantid': this.userdetails.tenantid,
        'tenantname': this.userdetails.tenantname,
        'prodname': _.trim(data.productname),
        'mrp': data.productmrp,
        'productcode': _.trim(data.productcode),
        'hsncode': data.hsncode.hsncode,
        'hsndesc': data.hsncode.description,
        'hsnsactaxpercent': data.hsncode.gstpercent,
        'uomid': data.uomdesc.uomid,
        'uomdesc': data.uomdesc.uomdesc,
        'brandid': _.isEmpty(data.brandname) ? null : data.brandname.brandid,
        'brandname': _.isEmpty(data.brandname) ? null : _.trim(data.brandname.brandname),
        'categoryid': _.isEmpty(data.categoryname) ? null : data.categoryname.categoryid,
        'categoryname':_.isEmpty(data.categoryname) ? null : _.trim(data.categoryname.categoryname),
        'createdby': this.userdetails.loginname,
        'createddt': this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
        'lastupdatedby': this.userdetails.loginname,
        'lastupdateddt': this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
      }
      this.ProductallService.ProductCreate(this.formdata)
        .then((res) => {
          if (res.status == true) {
            if(! this.openedfromothers)
            {
              this.messageservice.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
            }
            this.callParent(res.data);
            this.clearform();
          }
          else if (res.status == false) {
            this.messageservice.showMessage({ severity: 'error', summary: 'Error', detail: res.message });
          }
        });
    }

  }
  onhideBrandpopup(data) {
    this.addbrand_display = false;
  }
  addBrandDetection(data) {

    var newbr = {
      label: data.brandname,
      value: data
    };
    if (!_.isUndefined(this.allbrands)) {
      this.allbrands.push(newbr);

    } else {
      this.allbrands = [];
      this.allbrands[0] = newbr;
    }
    let pulled_data = _.find(this.allbrands, { value: { brandid: Number(data.brandid) } });
    this.pro.controls['brandname'].setValue(pulled_data.value);
    this.addbrand_display = false;
  }
  onhideCategorypopup(data) {
    this.addcategory_display = false;
  }
  addCategoryDetection(data) {

    var newbr = {
      label: data.categoryname,
      value: data
    };
    if (!_.isUndefined(this.allcategories)) {
      this.allcategories.push(newbr);

    } else {
      this.allcategories = [];
      this.allcategories[0] = newbr;
    }
    let pulled_data = _.find(this.allcategories, { value: { categoryid: Number(data.categoryid) } });
    this.pro.controls['categoryname'].setValue(pulled_data.value);
    this.addcategory_display = false;
  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyCategory);
    this._hotkeysService.remove(this.hotkeyBrand);
    this._hotkeysService.remove(this.hotkeySave);
  }
}
