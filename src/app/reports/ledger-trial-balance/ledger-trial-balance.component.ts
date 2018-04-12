import { Component, OnInit,OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import * as _ from 'lodash';
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
import * as moment from 'moment';
import { PrimengConstant } from '../../app.primeconfig';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
@Component({
  selector: 'app-ledger-trial-balance',
  templateUrl: './ledger-trial-balance.component.html',
  styleUrls: ['./ledger-trial-balance.component.scss']
})
export class LedgerTrialBalanceComponent implements OnInit,OnDestroy {
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  TBtreeData: TreeNode[];
  TBopeningTotal: any;
  TBclodingTotal: any;
  TBcTotal: any;
  TBdTotal: any;
  selectedAccount: TreeNode;
  cmenu_items: MenuItem[];
  userstoragedata: any;
  finyear: any;
  allheads: any;
  tbreportList: any;
  allbookaccs: any;
  activetabindex: number = 0;
  tabbedledgers: any = [];
  ledgerTbData: any = [];
  ledgerTbOBalance: any = 0;
  ledgerTbCBalance: any = 0;
  ledgerTbDebit: any = 0;
  ledgerTbCredit: any = 0;
  selectedLedger: any;
  invoiceLedgerdata: any[] = [];
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];
  public date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  constructor(private masterservice: MasterService, private featureservice: FeaturesService, private storageservice: LocalStorageService,
    private dateFormatPipeFilter: DateformatPipe, private router: Router,
    private messageservice: MessagesService, private utilservice: UtilsService, 
    private reportservice: ReportService,private _hotkeysService: HotkeysService) {
      const shrtkeys = PrimengConstant.SHORTCUTKEYS;
      this.hotkeyClose = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
        this.router.navigate(['reports/list']);
        return false;
      }));
      // Download
      this.hotkeyDownload =  this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.DOWNLOAD.KEY, (event: KeyboardEvent): boolean => {
        this.pdfdownload();
        return false;
      }));
      this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
  }
  // getHeadsList() {
  //   var self = this;
  //   var data = {
  //   };
  //   self.allheads = [];
  //   this.featureservice.AccHeadList(data)
  //     .then(function (res) {
  //       if (res.status) {
  //         self.allheads = res.data;
  //         console.log('heads', self.allheads);
  //         self.loadBookofAcc();
  //       }
  //       else{
  //          self.allheads = [];
  //        }
  //     });
  // }
  DisplayTransaction(event, dtable, account: any) {
    console.log(account);
    dtable.toggleRow(account);
    if (event.target.className.indexOf('fa-angle-down') > -1) {
      $(event.target).addClass('fa-angle-up').removeClass('fa-angle-down');
    }
    else {
      $(event.target).addClass('fa-angle-down').removeClass('fa-angle-up');
    }
    // $(event.children[0])
    if (account.transactionloaded == false) {
      // var formdata = {
      //   'tenantid': this.userstoragedata.tenantid,
      //   'finyear': this.finyear.finyear,
      //   'prvfinyear': this.finyear.prvfinyear,
      //   'accheadid' : account.accountid
      // }
      var formdata = {
        'tenantid': this.userstoragedata.tenantid,
        'finyear': this.finyear.finyear,
        'accheadid':account.accountid,
        'startdt': moment(this.finyear.YearStartsFrom, 'DD-MM-YYYY').toDate(),
        'enddt': moment(this.finyear.YearEndsOn, 'DD-MM-YYYY').toDate(),
      }
      this.reportservice.getFilteredLedgerlist(formdata).then((res) => {
        console.log('table data', res);
        if (res.status == true) {
          var transactions = res.data;
          account.transactionloaded = true;
          account.transactions = _.filter(transactions, function (d) {
            return (d.debit > 0 || d.credit > 0)
          });
          console.log('transaction:',account.transactions);
          // dtable.toggleRow(account);
        }
      });
    }

  }
  loadBookofAcc() {
    var self = this;
    var data = {
      tenantid: [this.userstoragedata.tenantid, 0],
      isTB : 'Y'
    };
    self.allbookaccs = [];
    this.masterservice.BookGetAll(data)
      .then(function (res) {
        if (res.status) {
          self.allbookaccs = res.data;
          self.getTbList();
        }
        else {
          self.allbookaccs = [];
        }
      });
  }
  getTbList() {
    var self = this;
    var data = {
      tenantid: this.userstoragedata.tenantid,
      finyear: this.finyear.finyear,
      'prvfinyear': this.finyear.prevfinyear,
    };
    self.tbreportList = [];
    this.reportservice.getTBreport(data)
      .then(function (res) {
        if (res.status) {
          self.tbreportList = res.data;
          console.log('report', self.tbreportList);
          self.formattreestructure(self.allbookaccs, self.tbreportList);
          // self.loadBookofAccList();
        }
        else {
          self.formattreestructure(self.allbookaccs, []);
        }
      });
  }
  ngOnInit() {
    this.loadBookofAcc();
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
  formattreestructure(level1, level2) {
    var treedata: any = this.utilservice.ledger_formater(level1, level2);
    this.ledgerTbData = treedata.data;
    this.ledgerTbOBalance = treedata.openingbalance;
    this.ledgerTbCBalance = treedata.closingbalance;
    this.ledgerTbDebit = treedata.debit;
    this.ledgerTbCredit = treedata.credit;
    console.log('treedata', treedata);
  }
  addTabViewledger(item, addTabViewinvoice) {
    if (item.data.level == 2) {
      this.utilservice.activate_multitab(this.tabbedledgers, item.data, addTabViewinvoice, 'accountname');
    }
    else return false;
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
      // alert('hi');
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
    this.utilservice.deactivate_multitab(this.tabbedledgers, event, tbtabview, 'invoiceno');
  }
  handleClose(event, addTab, ) {
    this.utilservice.deactivate_multitab(this.invoiceLedgerdata, event, addTab, 'transno');
  }
  viewfeatures(item, addTab) {
    console.log('item',item)
    this.utilservice.activate_multitab(this.invoiceLedgerdata, item, addTab, 'txnrefno');

  }

  // PDF Download
  pdfdownload() {
    let data = {} as any;
    data = this.utilservice.getReportParams(AppConstant.REPORTS.TRAIL_BALANCE_LEDGERS.REPORT_NAME, this.userstoragedata);
    data.reportparams = this.utilservice.prepareReportParams({
      'tenantid': this.userstoragedata.tenantid,
      'finyear': this.finyear.finyear,
      'prvfinyear': this.finyear.prvfinyear,
    });
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        console.log(data);
        this.utilservice.saveToFileSystem(data, 'application/pdf', AppConstant.REPORTS.TRAIL_BALANCE_LEDGERS.PREFIX_NAME, '.pdf');
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
