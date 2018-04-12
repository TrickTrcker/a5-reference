import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import { PrimengConstant } from '../../app.primeconfig';
import * as _ from "lodash";
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

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss']
})
export class BalanceSheetComponent implements OnInit, OnDestroy {
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  private date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  cmenu_items: MenuItem[];
  userstoragedata: any;
  UtilsService: any;
  finyear: any;
  tenantid: any;
  allheads: any;
  bsreportList: any;
  bs_assetsList: any = [];
  bs_liabsList: any = [];
  bs_assetsData: any = [];
  bs_liabsData: any = [];
  surplusheadamount = 0;
  bs_assetTotal = 0;
  bs_liabsTotal = 0;
  allbookaccs: any;
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];
  ExtraDownloadparams: any = {};
  constructor(
    private masterservice: MasterService,
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
  getBSList() {
    var self = this;
    var data = {
      tenantid: this.userstoragedata.tenantid,
      finyear: this.finyear.finyear,
    };
    self.bsreportList = [];
    this.reportservice.getBalanceSheetreport(data)
      .then(function (res) {
        if (res.status) {
          self.bsreportList = res.data;
          self.formatBStructure(self.allheads, self.allbookaccs, self.bsreportList);
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
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyDownload);
    this._hotkeysService.remove(this.hotkeyClose);
  }
  formatBStructure(head, level1, level2) {
    var assets_head = _.filter(head, function (h: any) {
      return (h.ALIE === "A")
    });
    var liabs_head = _.filter(head, function (h: any) {
      return (h.ALIE === "L")
    });
    // var updated_level2 = this.updatePorL(level1, level2);
    var assetdata: any = this.utilservice.tbtree_formater(assets_head, level1, level2, true, { feature: "BS", "prevyear": false });
    this.bs_assetsList = assetdata.flatedArray;
    this.bs_assetsData = assetdata;
    var liasdata: any = this.utilservice.tbtree_formater(liabs_head, level1, level2, true, { feature: "BS", "prevyear": false });
    this.bs_liabsList = liasdata.flatedArray;
    this.bs_liabsData = liasdata;
    var assetstotal = (assetdata.dtotal - assetdata.ctotal);
    var liabsstotal = (liasdata.ctotal - liasdata.dtotal);
    // this.updateBalanceSheet(assetstotal,liabsstotal,assetdata.flatedArray,liasdata.flatedArray);
    this.calcluateTotalDisplays();

    console.log("asset data:", assetdata);
    console.log("liabs data:", liasdata);
  }
  updatePorL(level1, level2) {
    var gp: any = _.groupBy(level2, function (h) {
      return h.accheadname;
    });
    if (gp['CURRENT ASSETS'] != undefined || gp['INVESTMENTS'] != undefined || gp['NON CURRENT ASSETS'] != undefined ||
      gp['LOAN AND ADVANCE'] != undefined || gp['RESERVES AND SURPLUS'] != undefined || gp['LONG TERM LIABILITIES'] != undefined
      || gp['CURRENT LIABILITIES'] != undefined) {
      // assets sums start
      var ass_cTotal = 0, ass_dTotal = 0, lias_cTotal = 0, lias_dTotal = 0;
      ass_cTotal = _.sumBy(gp['CURRENT ASSETS'], (o: any) => {
        return parseInt(o.credit);
      });
      ass_dTotal = _.sumBy(gp['CURRENT ASSETS'], (o: any) => {
        return parseInt(o.debit);
      });
      ass_cTotal += _.sumBy(gp['INVESTMENTS'], (o: any) => {
        return parseInt(o.credit);
      });
      ass_dTotal += _.sumBy(gp['INVESTMENTS'], (o: any) => {
        return parseInt(o.debit);
      });
      ass_cTotal += _.sumBy(gp['NON CURRENT ASSETS'], (o: any) => {
        return parseInt(o.credit);
      });
      ass_dTotal += _.sumBy(gp['NON CURRENT ASSETS'], (o: any) => {
        return parseInt(o.debit);
      });

      ass_cTotal += _.sumBy(gp['LOAN AND ADVANCE'], (o: any) => {
        return parseInt(o.credit);
      });
      ass_dTotal += _.sumBy(gp['LOAN AND ADVANCE'], (o: any) => {
        return parseInt(o.debit);
      });

      ass_cTotal += _.sumBy(gp['RESERVES AND SURPLUS'], (o: any) => {
        return parseInt(o.credit);
      });
      ass_dTotal += _.sumBy(gp['RESERVES AND SURPLUS'], (o: any) => {
        return parseInt(o.debit);
      });

      // assets sums end
      lias_cTotal = _.sumBy(gp['CURRENT LIABILITIES'], (o: any) => {
        return parseInt(o.credit);
      });
      lias_dTotal = _.sumBy(gp['CURRENT LIABILITIES'], (o: any) => {
        return parseInt(o.debit);
      });
      lias_cTotal = _.sumBy(gp['LONG TERM LIABILITIES'], (o: any) => {
        return parseInt(o.credit);
      });
      lias_dTotal = _.sumBy(gp['LONG TERM LIABILITIES'], (o: any) => {
        return parseInt(o.debit);
      });

      var ass_total = ass_dTotal - ass_cTotal;
      var lias_total = lias_cTotal - lias_dTotal;
      if ((ass_total - lias_total) > 0) {
        var lias_acc: any = _.find(level2, (data: any) => {
          return (_.upperCase(_.trim(data.accountname)) == "PROFIT OR LOSS");
        })
        var differ = ass_total - lias_total;
        if (!_.isEmpty(lias_acc)) {
          lias_acc.credit = parseInt(lias_acc.credit) + differ;
          this.ExtraDownloadparams = {
            'tenantid': this.userstoragedata.tenantid,
            'finyear': this.finyear.finyear,
            "accheadname": lias_acc.parentaccountname,
            "subaccheadname": lias_acc.accountname,
            "lossside": "liabs",
            "amount": differ,
           
          };
        }
        else {
          var d = _.find(level1, (data) => {
            return (_.upperCase(_.trim(data.subaccheadname)) == "PROFIT OR LOSS");
          });
          var data = {
            "accheadname": "LONG TERM LIABILITIES",
            "parentaccountname": d.accheadname,
            "accountname": d.subaccheadname,
            "accheadid": d.accheadid,
            "crdr": "C",
            "opening": "0.00",
            "debit": "0.00",
            "credit": differ,
            "closing": "0.00"
          };
          level2.push(data);
          this.ExtraDownloadparams = {
            'tenantid': this.userstoragedata.tenantid,
            'finyear': this.finyear.finyear,
            "accheadname": d.accheadname,
            "subaccheadname": d.subaccheadname,
            "lossside": "liabs",
            "amount": differ,
            
          };
        }
      }
      else if ((lias_total - ass_total) > 0) {

        var ass_acc: any = _.find(level2, (data: any) => {
          return (_.upperCase(_.trim(data.accountname)) == "PROFIT OR LOSS ACCOUNT");
        })
        var differ = lias_total - ass_total;
        if (!_.isEmpty(ass_acc)) {
          ass_acc.debit = parseInt(ass_acc.debit) + differ;
          this.ExtraDownloadparams = {
            'tenantid': this.userstoragedata.tenantid,
            'finyear': this.finyear.finyear,
            "accheadname": lias_acc.parentaccountname,
            "subaccheadname": lias_acc.accountname,
            "lossside": "assets",
            "amount": differ,
           
          };
        }
        else {
          var d = _.find(level1, (data) => {
            return (_.upperCase(_.trim(data.subaccheadname)) == "PROFIT OR LOSS ACCOUNT");
          });
          var data = {
            "accheadname": "RESERVES AND SURPLUS",
            "parentaccountname": d.accheadname,
            "accountname": d.subaccheadname,
            "accheadid": d.accheadid,
            "crdr": "C",
            "opening": "0.00",
            "debit": "0.00",
            "credit": differ,
            "closing": "0.00"
          };
          level2.push(data);
          this.ExtraDownloadparams = {
            'tenantid': this.userstoragedata.tenantid,
            'finyear': this.finyear.finyear,
            "accheadname": d.accheadname,
            "subaccheadname": d.subaccheadname,
            "lossside": "assets",
            "amount": differ,
            
          };
        }
      }
    }
    return level2;
  }
  updateBalanceSheet(assetstotal, liabsstotal, assetdata, liasdata) {
    var surplusaccount = _.find(assetdata, { "accheadname": "RESERVES" });
    if (!_.isEmpty(surplusaccount)) {
      var surplusindex = _.findIndex(assetdata, { "accheadname": "RESERVES" });
      if ((assetstotal - liabsstotal) > 0) {
        var differ = (assetstotal - liabsstotal);
        var acc = _.cloneDeep(surplusaccount);
        acc.data.credit = differ;
        this.surplusheadamount = differ;
        liasdata.push(acc);
        // delete assetdata[surplusindex];
        assetdata.splice(surplusindex, 1);

      }
      else if ((assetstotal - liabsstotal) < 0) {
        differ = (liabsstotal - assetstotal) + surplusaccount.data.debit;
        surplusaccount.data.debit = differ;
        this.surplusheadamount = differ;
      }
    }
    this.bs_assetsList = [...assetdata];
    this.bs_liabsList = [...liasdata];
  }
  calcluateTotalDisplays() {
    this.bs_assetTotal = (this.bs_assetsData.dtotal - this.bs_assetsData.ctotal);
    this.bs_liabsTotal = (this.bs_liabsData.ctotal - this.bs_liabsData.dtotal);
    if ((this.bs_assetTotal - this.bs_liabsTotal) > 0) {
      this.bs_liabsTotal += (this.bs_assetTotal - this.bs_liabsTotal);
    }
    if ((this.bs_liabsTotal - this.bs_assetTotal) > 0) {
      this.bs_assetTotal += (this.bs_liabsTotal - this.bs_assetTotal);
    }
  }
  calculateGroupTotal(accounts) {
    return 1000;
  }
  displayrowdata(rowData, mode) {
    var amount1 = 0, amount2 = 0;
    if (rowData != undefined) {
      if (mode == 'assets') {
        var v: any = _.find(this.bs_assetsData.data, function (d) { return (d.data.accountname == rowData.prntaccheadname) });
        if (!_.isEmpty(v)) {
          var surplusamount = 0;
          if (rowData.prntaccheadname == 'RESERVES AND SURPLUS') {
            surplusamount = this.surplusheadamount;
          }
          amount1 = v.data.debit + surplusamount;
          amount2 = v.data.credit;
        }
        // this.bs_assetTotal += (amount1 - amount2)
      }
      else if (mode == 'liabs') {
        if (rowData.prntaccheadname == 'RESERVES AND SURPLUS') {
          var v: any = _.find(this.bs_assetsData.data, function (d) { return (d.data.accountname == 'RESERVES AND SURPLUS') });
          if (!_.isEmpty(v)) {
            amount1 = v.data.credit + this.surplusheadamount;
            amount2 = v.data.debit;
          }
        }
        else {
          var v: any = _.find(this.bs_liabsData.data, function (d) { return (d.data.accountname == rowData.prntaccheadname) });
          if (!_.isEmpty(v)) {
            amount1 = v.data.credit;
            amount2 = v.data.debit;
          }
        }
        // this.bs_assetTotal += (amount1 - amount2)
      }
    }
    return (amount1 - amount2)
  }
  // PDF Download
  pdfdownload() {
    let data = {} as any,params : any = {};
    data = this.utilservice.getReportParams(AppConstant.REPORTS.BALANCE_SHEET.REPORT_NAME, this.userstoragedata);
    if(! _.isEmpty(this.ExtraDownloadparams))
    {
      params = this.ExtraDownloadparams;
    }
    else
    {
      params = {
        'tenantid': this.userstoragedata.tenantid,
        'finyear': this.finyear.finyear
      }
    }
    // params = {
    //   'tenantid': this.userstoragedata.tenantid,
    //   'finyear': this.finyear.finyear
    // }
    data.reportparams = this.utilservice.prepareReportParams(params);
    data.extra = this.ExtraDownloadparams;
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

}



