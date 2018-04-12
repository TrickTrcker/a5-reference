import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { JournalsService } from '../../../accounts/service/journals.service';
import { AppConstant } from '../../../app.constant';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { UtilsService } from '../../../services/utils.service'
import { FeaturesService } from '../../../services/features.service'
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { PrimengConstant } from '../../../app.primeconfig';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-view-banktransfer',
  templateUrl: './view-banktransfer.component.html',
  styleUrls: ['./view-banktransfer.component.scss']
})
export class ViewBanktransferComponent implements OnInit, OnDestroy {


  transferheader: any;
  transferdetails: any
  @Input() journalid: number;
  datafromat: string;
  public currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  userstoragedata: any;
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];
  constructor(
    private JournalsService: JournalsService,
    // for pdf download
    private storageservice: LocalStorageService,
    private utilservice: UtilsService,
    private featureservice: FeaturesService,
    private _hotkeysService: HotkeysService,
    private router: Router) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeyClose = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['banks/transfer']);
      return false;
    }));
    // Download
    this.hotkeyDownload = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.DOWNLOAD.KEY, (event: KeyboardEvent): boolean => {
      this.pdfdownload();
      return false;
    }));
    this.datafromat = AppConstant.API_CONFIG.DATE.displayFormat;
  }

  ngOnInit() {
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.getjournalView();
  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyDownload);
    this._hotkeysService.remove(this.hotkeyClose);
  }
  getjournalView() {
    var data =this.journalid + '/null/Contra';
    this.JournalsService.getJournalDetails(data).then((res) => {
      if (res.status) {
        this.transferheader = res.data[0];
        this.transferdetails = res.data[0].ledgers
        console.log(' this.transferdetails', this.transferdetails)
      }
    })
  }
  // PDF Download
  pdfdownload() {
    let data = {} as any;
    data = this.utilservice.getReportParams(AppConstant.REPORTS.BANK.TRANSFER_REPORT_NAME, this.userstoragedata);
    data.reportparams = 'transferid:' + this.journalid;
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        console.log(data);
        this.utilservice.saveToFileSystem(data, 'application/pdf', this.transferheader.journalno, '.pdf');
        return data;
      },
      error => {
        console.error(error);
        return error;

      }
      );
  }
}

