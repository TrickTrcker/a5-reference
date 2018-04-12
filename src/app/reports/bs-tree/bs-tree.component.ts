import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import * as _ from "lodash";
import * as moment from 'moment';
import { FeaturesService } from '../../services/features.service';
import { MasterService } from '../../services/master.service';
import { TreeTableModule, TreeNode, SharedModule } from 'primeng/primeng';
import { DateformatPipe } from '../../pipes/dateformat.pipe';
import { Router, NavigationExtras } from '@angular/router';
import { ContextMenuModule, MenuItem } from 'primeng/primeng';
import { MessagesService } from '../../shared/messages.service';
import { UtilsService } from '../../services/utils.service';
import { ReportService } from '../../services/reports/reports.service';
import { LedgerComponent } from '../ledger/ledger.component';
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { PrimengConstant } from "../../app.primeconfig";

@Component({
  selector: 'app-trail-balance',
  templateUrl: './bs-tree.component.html',
  styleUrls: ['./bs-tree.component.scss']
})
export class BSComponent implements OnInit, OnDestroy {
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  TBtreeData: TreeNode[];
  finyearlist: any = [];
  selectedfinyear: any = [];
  TBopeningTotal: any;
  TBclodingTotal: any;
  TBcTotal: any;
  TBdTotal: any;
  GrandcTotal : any;
  GrandDTotal : any;
  selectedAccount: TreeNode;
  cmenu_items: MenuItem[];
  userstoragedata: any;
  finyear: any;
  allheads: any;
  tbreportList: any;
  allbookaccs: any;
  activetabindex: number = 0;
  tabbedledgers: any = [];
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];

  prevyear = 2016;
  currentyear = 2017;
  plreportList: any;
  bs_assetsList: any = [];
  bs_liabsList: any = [];
  assets_total: number = 0.00;
  liabs_total: number = 0.00;
  f_assets_total: number = 0.00;
  f_liabs_total: number = 0.00;
  net_profitorloss_key: string = "";
  net_profitloss_value: number = 0;
  constructor(private masterservice: MasterService, private featureservice: FeaturesService, private storageservice: LocalStorageService,
    private dateFormatPipeFilter: DateformatPipe, private router: Router,
    private messageservice: MessagesService, private utilservice: UtilsService,
    private reportservice: ReportService,
    private _hotkeysService: HotkeysService) {
    // Back to list form
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeyClose = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['reports/list']);
      return false;
    }));
    // Download
    this.hotkeyDownload = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.DOWNLOAD.KEY, (event: KeyboardEvent): boolean => {
      this.pdfdownload();
      return false;
    }));
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.finyearlist = this.masterservice.formatDataforDropdown("finyear", AppConstant.API_CONFIG.FINYEARS, "");
    this.selectedfinyear = AppConstant.API_CONFIG.FINYEARS[2];
    this.findfinyear();
  }
  findfinyear() {
    var currentyear = moment(this.selectedfinyear.YearStartsFrom, "MM-DD-YYYY").toDate();
    this.currentyear = currentyear.getFullYear();
    this.prevyear = this.currentyear - 1;
    // let myDate:Date = moment(this.selectedfinyear).format("DD/MM/YYYY");
  }
  getHeadsList() {
    var self = this;
    var data = {
      "accgroup": "BALANCE SHEET"
    };
    self.allheads = [];
    this.featureservice.AccHeadList(data)
      .then(function (res) {
        if (res.status) {
          self.allheads = res.data;
          console.log("heads", self.allheads);
          self.loadBookofAcc();
        }
        else {
          self.allheads = [];
        }
      });
  }
  loadBookofAcc() {
    var self = this;
    var data = {
      tenantid: [this.userstoragedata.tenantid, 0],
      isTB: "Y"
    };
    self.allbookaccs = [];
    this.masterservice.BookGetAll(data)
      .then(function (res) {
        if (res.status) {
          self.allbookaccs = res.data;
          self.getBSList();
        }
        else {
          self.allbookaccs = [];
        }
      });
  }
  onFinyearSelect(event) {
    this.selectedfinyear = event.value;
    this.getBSList();
  }
  getBSList() {
    var self = this;
    var data = {
      tenantid: this.userstoragedata.tenantid,
      finyear: this.finyear.finyear,
    };
    self.tbreportList = [];
    self.plreportList = [];
    this.PSsetInitvalues();
    this.reportservice.getBalanceSheetreport(data)
      .then(function (res) {
        if (res.status) {
          self.tbreportList = res.data;
          console.log("report", self.tbreportList);
          self.formattreestructure(self.allheads, self.allbookaccs, self.tbreportList);
          // self.loadBookofAccList();
        }
        else {
          self.formattreestructure(self.allheads, self.allbookaccs, []);
        }
      });
  }
  
  ngOnInit() {
    this.getHeadsList();
    // this.TBtreeData = this.getTBformatedData().data;
    this.cmenu_items = [
      { label: 'View Leger', icon: 'fa-search', command: (event) => this.viewNode(this.selectedAccount) },
      // { label: 'Expand', icon: 'fa-expand', command: (event) => this.expandNode(this.selectedAccount) },
      // { label: 'Collapse', icon: 'fa-compress', command: (event) => this.collapseNode(this.selectedAccount) }
    ];
  }
  viewNode(node: TreeNode) {
    // this.msgs = [];
    //this.messageservice.showMessage({severity: 'info', summary: 'Node Selected', detail: node.data.name});
  }
  collapseNode(node: TreeNode) {
    // this.msgs = [];
    //this.messageservice.showMessage({severity: 'info', summary: 'Node Selected', detail: node.data.name});
  }
  expandNode(node: TreeNode) {
    // node.parent.children = node.parent.children.filter( n => n.data !== node.data);
    // this.msgs = [];
    //this.messageservice.showMessage({severity: 'info', summary: 'Node Deleted', detail: node.data.name});
  }
  expandNodeAll(event) {
    console.log(event);
  }
  formattreestructure(head, level1, level2) {
    var assets_head = _.filter(head, function (h: any) {
      return (h.ALIE === "A")
    });
    var liabs_head = _.filter(head, function (h: any) {
      return (h.ALIE === "L")
    });
    var assetdata: any = this.utilservice.tbtree_formater(assets_head, level1, level2, true, { feature: "PL", "prevyear": true });
    this.bs_assetsList = assetdata.flatedArray;
    var liabsdata: any = this.utilservice.tbtree_formater(liabs_head, level1, level2, true, { feature: "PL", "prevyear": true });
    this.bs_liabsList = liabsdata.flatedArray;


    this.assets_total = +(assetdata.dtotal - assetdata.ctotal);
    this.liabs_total = +(liabsdata.ctotal - liabsdata.dtotal);
    this.f_assets_total = this.assets_total;
    this.f_liabs_total = this.liabs_total;
    if (this.assets_total > this.liabs_total) {
      this.net_profitorloss_key = "Loss";
      this.net_profitloss_value = this.assets_total - this.liabs_total;
      this.f_liabs_total += this.net_profitloss_value;
    }
    else if (this.assets_total < this.liabs_total) {
      this.net_profitorloss_key = "Profit";
      this.net_profitloss_value = this.liabs_total - this.assets_total;
      this.f_assets_total += this.net_profitloss_value;
    }
    // var treedata: any = this.utilservice.tbtree_formater(head, level1, level2, true, { feature: "TB" });
    // this.TBtreeData = treedata.data;
    // this.TBopeningTotal = treedata.openingtoal;
    // this.TBclodingTotal = treedata.closingtotal;
    // this.TBcTotal = treedata.ctotal;
    // this.TBdTotal = treedata.dtotal;
    // this.GrandDTotal = this.TBdTotal;
    // this.GrandcTotal = this.TBcTotal;
    // if((this.TBcTotal - this.TBdTotal) > 0 )
    // {
    //   this.GrandDTotal += (this.TBcTotal - this.TBdTotal)
    // }
    // else if((this.TBdTotal - this.TBcTotal ) > 0)
    // {
    //   this.GrandcTotal += (this.TBdTotal - this.TBcTotal );
    // }
    // console.log("treedata", treedata);
  }
  addTabViewledger(item, addTabViewinvoice) {
    var level = item.data.level;
    if(_.isEmpty(item.children))
    {
      this.utilservice.activate_multitab(this.tabbedledgers, item.data, addTabViewinvoice, "accountname");
    }
    // else return false;
   
    // if (item.data.level == 2) {
    //   this.utilservice.activate_multitab(this.tabbedledgers, item.data, addTabViewinvoice, "accountname");
    // }
    // else return false;
  }
  addTabViewledger1(ledgeraccount, addTabViewledger, index) {
    var self = this;
    console.log(addTabViewledger);
    if (this.tabbedledgers.length > 0) {
      this.tabbedledgers.unshift(ledgeraccount);
    }
    else {
      this.tabbedledgers.push(ledgeraccount);
    }
    setTimeout(function () {
      // alert("hi");
      self.activetabindex = 1;
      addTabViewledger.activeIndex = 1;
      addTabViewledger.tabs = _.map(addTabViewledger.tabs, function (data: any) {
        data.selected = false;
        return data;
      });
      addTabViewledger.tabs[1].selected = true;
      // addTabViewledger = [...addTabViewledger];
    }, 0);
  }
  onnodeSelect(event) {

  }
  handleTabClose(event, tbtabview) {
    this.utilservice.deactivate_multitab(this.tabbedledgers, event, tbtabview, "invoiceno");
  }

  PSsetInitvalues() {
    this.bs_liabsList = [];
    this.bs_assetsList = [];
    this.assets_total = 0;
    this.liabs_total = 0;
    this.net_profitloss_value = 0;
    this.net_profitloss_value = 0;
    this.net_profitorloss_key = "";
  }
  calculateGroupTotal(accounts) {
    console.log("accounts table", accounts);
    return 1000;
  }
  // PDF Download
  pdfdownload() {
    let data = {} as any,params : any = {};
    data = this.utilservice.getReportParams(AppConstant.REPORTS.BALANCE_SHEET.REPORT_NAME, this.userstoragedata);
    params = {
      'tenantid': this.userstoragedata.tenantid,
      'finyear': this.finyear.finyear
    }
    // if(! _.isEmpty(this.ExtraDownloadparams))
    // {
    //   params = this.ExtraDownloadparams;
    // }
    // else
    // {
    //   params = {
    //     'tenantid': this.userstoragedata.tenantid,
    //     'finyear': this.finyear.finyear
    //   }
    // }
    // params = {
    //   'tenantid': this.userstoragedata.tenantid,
    //   'finyear': this.finyear.finyear
    // }
    data.reportparams = this.utilservice.prepareReportParams(params);
    // data.extra = this.ExtraDownloadparams;
    // 'pl_acount' : this.ExtraDownloadparams
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        this.utilservice.saveToFileSystem(data, 'application/pdf', AppConstant.REPORTS.BALANCE_SHEET.PREFIX_NAME, '.pdf');
        return data;
      },
      error => {
        return error;

      }
      );
  }

  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyDownload);
    this._hotkeysService.remove(this.hotkeyClose);
  }
}
