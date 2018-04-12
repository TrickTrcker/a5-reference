import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { JournalsService } from '../../../accounts/service/journals.service';
import { AppConstant } from '../../../app.constant';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { UtilsService } from '../../../services/utils.service'
import { FeaturesService } from '../../../services/features.service'
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { PrimengConstant } from '../../../app.primeconfig';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-view-bankwithdraw',
  templateUrl: './view-bankwithdraw.component.html',
  styleUrls: ['./view-bankwithdraw.component.scss']
})
export class ViewBankwithdrawComponent implements OnInit, OnDestroy {

  withdrawheader: any;
  withdrawdetails: any
  @Input() journalid: number;
  datafromat: string;
  public currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  // pdf download
  userstoragedata: any;
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];
  constructor(private JournalsService: JournalsService,
    // for pdf download
    private storageservice: LocalStorageService,
    private utilservice: UtilsService,
    private featureservice: FeaturesService,
    private _hotkeysService: HotkeysService,
    private router: Router) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.datafromat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.hotkeyClose = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['banks/transfer']);
      return false;
    }));
    // Download
    this.hotkeyDownload = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.DOWNLOAD.KEY, (event: KeyboardEvent): boolean => {
      this.pdfdownload();
      return false;
    }));
  }

  ngOnInit() {
    // pdf download
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.getjournalView();
  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeyDownload);
    this._hotkeysService.remove(this.hotkeyClose);
  }
  getjournalView() {
    this.JournalsService.getJournalDetails(this.journalid).then((res) => {
      if (res.status) {
        this.withdrawheader = res.data[0];
        this.withdrawdetails = res.data[0].ledgers
      }
    })
  }

  // PDF Download
  pdfdownload() {
    let data = {} as any;
    data = this.utilservice.getReportParams(AppConstant.REPORTS.BANK.WITHDRAW_REPORT_NAME, this.userstoragedata);
    data.reportparams = 'withdrawid:' + this.journalid;
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        console.log(data);
        this.utilservice.saveToFileSystem(data, 'application/pdf', this.withdrawheader.journalno, '.pdf');
        return data;
      },
      error => {
        console.error(error);
        return error;

      }
      );
  }
}
