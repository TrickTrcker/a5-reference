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
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { PrimengConstant } from "../../app.primeconfig";


@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.scss']
})
export class ProfitLossComponent implements OnInit, OnDestroy {
  featuresservice: any;
  UtilsService: any;
  localstorageDetails: any;


  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  finyearlist: any = [];
  selectedfinyear: any = [];
  cmenu_items: MenuItem[];
  userstoragedata: any;
  finyear: any;
  allheads: any;
  plreportList: any;
  bl_expansesList: any = [];
  bl_lossesList: any = [];
  allbookaccs: any;
  expanse_total: number = 0.00;
  income_total: number = 0.00;
  net_profitorloss_key: string = "";
  net_profitloss_value: number = 0;
  prevyear = 2016;
  currentyear = 2017;
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];
  constructor(private masterservice: MasterService,
    private featureservice: FeaturesService,
    private storageservice: LocalStorageService,
    private dateFormatPipeFilter: DateformatPipe,
    private router: Router,
    private messageservice: MessagesService,
    private utilservice: UtilsService,
    private reportservice: ReportService,
    private _hotkeysService: HotkeysService) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    // Back to list form
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
  onFinyearSelect(event) {
    this.selectedfinyear = event.value;
    this.getPLList();
  }
  getHeadsList() {
    var self = this;
    var data = {
      "accgroup": "PROFIT & LOSS"
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
          self.getPLList();
        }
        else {
          self.allbookaccs = [];
        }
      });
  }
  getPLList() {
    var self = this;
    var data = {
      "tenantid": this.userstoragedata.tenantid,
      "finyear": this.selectedfinyear.finyear,
      "prvfinyear": this.selectedfinyear.prevfinyear,
      // "startdt":"2017-10-01",
      // "enddt":"2017-10-23"
    };
    self.plreportList = [];
    this.PSsetInitvalues();
    this.reportservice.getProfitandLossreport(data)
      .then(function (res) {
        if (res.status) {
          self.plreportList = res.data;
          console.log("report", self.plreportList);
          self.formatBStructure(self.allheads, self.allbookaccs, self.plreportList);
          // self.loadBookofAccList();
        }
        else {
          self.formatBStructure(self.allheads, self.allbookaccs, []);
        }
      });
  }
  ngOnInit() {
    this.getHeadsList();
    // this.TBtreeData = this.getTBformatedData().data;
    this.cmenu_items = [
      { label: 'View Leger', icon: 'fa-search' },
      // { label: 'View Leger', icon: 'fa-search', command: (event) => this.viewNode(this.selectedAccount) },
      // { label: 'Expand', icon: 'fa-expand', command: (event) => this.expandNode(this.selectedAccount) },
      // { label: 'Collapse', icon: 'fa-compress', command: (event) => this.collapseNode(this.selectedAccount) }
    ];
  }

  formatBStructure(head, level1, level2) {
    var expanses_head = _.filter(head, function (h: any) {
      return (h.ALIE === "E")
    });
    var losses_head = _.filter(head, function (h: any) {
      return (h.ALIE === "I")
    });
    var expensedata: any = this.utilservice.tbtree_formater(expanses_head, level1, level2, true, { feature: "PL", "prevyear": true });
    this.bl_expansesList = expensedata.flatedArray;
    var incomedata: any = this.utilservice.tbtree_formater(losses_head, level1, level2, true, { feature: "PL", "prevyear": true });
    this.bl_lossesList = incomedata.flatedArray;
    this.expanse_total = +(expensedata.dtotal - expensedata.ctotal);
    this.income_total = +(incomedata.ctotal - incomedata.dtotal);
    if (this.expanse_total > this.income_total) {
      this.net_profitorloss_key = "Loss";
      this.net_profitloss_value = this.expanse_total - this.income_total;
    }
    else if (this.expanse_total < this.income_total) {
      this.net_profitorloss_key = "Profit";
      this.net_profitloss_value = this.income_total - this.expanse_total;
    }
    console.log("Expense data", expensedata);
    console.log("Income data", incomedata);
  }
  PSsetInitvalues() {
    this.bl_lossesList = [];
    this.bl_expansesList = [];
    this.expanse_total = 0;
    this.income_total = 0;
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
    let data = {} as any;
    data = this.utilservice.getReportParams(AppConstant.REPORTS.PROFIT_LOSS.REPORT_NAME, this.userstoragedata);
    data.reportparams = this.utilservice.prepareReportParams({
      'tenantid': this.userstoragedata.tenantid,
      'finyear': this.finyear.finyear,
      'previousyear': this.selectedfinyear.prevfinyear,
      'currentyear': this.finyear.finyear,
    });
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        console.log(data);
        this.utilservice.saveToFileSystem(data, "application/pdf", AppConstant.REPORTS.PROFIT_LOSS.PREFIX_NAME, ".pdf");
        return data;
      },
      error => {
        console.error(error);
        return error;

      }
      );
  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyDownload);
    this._hotkeysService.remove(this.hotkeyClose);
  }

}

