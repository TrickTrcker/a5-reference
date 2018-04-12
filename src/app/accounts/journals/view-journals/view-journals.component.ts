import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../../shared/local-storage.service';
import * as _ from 'lodash';
import { MasterService } from '../../../services/master.service';
import { AccountsService } from '../../service/accounts.service';
import { JournalsService } from '../../service/journals.service'
import { AppConstant } from '../../../app.constant'
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { UtilsService } from '../../../services/utils.service';
import { FeaturesService } from '../../../services/features.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { PrimengConstant } from '../../../app.primeconfig';


@Component({
  selector: 'app-view-journals',
  templateUrl: './view-journals.component.html',
  styleUrls: ['./view-journals.component.scss']
})
export class ViewJournalsComponent implements OnInit, OnDestroy {
  @Input() journalid: any;
  @Input() journalno: any;
  journaldatalist: any;
  userstoragedata: any = {};
  resources: any = {};
  reqdata: any = {};
  finyear: any = {};
  journalData: any;
  journaldatas: Array<any> = [];
  journaltaxs: Array<any> = [];
  journal_feature: string = 'Journals';
  journalList: any;
  dataFormat: string;
  currency_Symbol: string;
  journalTotal: any;
  flag: string;
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];
  constructor(private masterservice: MasterService,
    private storageservice: LocalStorageService,
    private location: Location,
    private route: ActivatedRoute,
    private journalservice: JournalsService,
    private router: Router,
    private utilservice: UtilsService,
    private featureservice: FeaturesService,
    private _hotkeysService: HotkeysService
  ) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeyClose = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['accounts/journals/list']);
      return false;
    }));
    // Download
    this.hotkeyDownload = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.DOWNLOAD.KEY, (event: KeyboardEvent): boolean => {
      this.pdfdownload();
      return false;
    }));
    this.route.params.subscribe(params => {
      if (!_.isEmpty(params)) {
        this.journalid = params.journalid;
        this.journalno = params.journalno;
        this.flag = params.journal;
      }
    });
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.resources = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.RESOURCE);
    this.finyear = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.dataFormat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  }

  ngOnInit() {
    this.reqdata = {
      'journalid': this.journalid
    };
    if (this.journalid && this.journalid != undefined) {
      this.loadjournalDetails();
    }
  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyDownload);
    this._hotkeysService.remove(this.hotkeyClose);
  }
  redirecttoprev() {
    this.router.navigate(['/accounts/journals/list']);
    // if (this.flag == 'fromledger') {
    //   this.router.navigate(['/reports/trailbalance']);
    // }
    // else if (this.flag == 'journal') {
    //   this.router.navigate(['/accounts/journals/list']);
    // }
    // this.location.back();
  }
  loadjournalDetails() {
    this.journalData = [];
    this.journalservice.getJournalDetails(this.journalid)
      .then((res) => {

        if (res.status) {
          this.journalData = res.data[0];
          this.journaldatas = res.data[0].ledgers;
          this.journalTotal = this.journalData.journaltotal;
        }
      });

  }
  // PDF Download
  pdfdownload() {
    let data = {} as any;
    data = this.utilservice.getReportParams(AppConstant.REPORTS.ACCOUNTS.JOURNALS_REPORT_NAME, this.userstoragedata);
    data.reportparams = 'journalid:' + this.journalid;
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        console.log(data);
        this.utilservice.saveToFileSystem(data, 'application/pdf', this.journalData.journaltotal, '.pdf');
        return data;
      },
      error => {
        console.error(error);
        return error;
      }
      );
  }


}
