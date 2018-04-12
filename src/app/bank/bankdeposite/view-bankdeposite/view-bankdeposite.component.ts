import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { JournalsService } from '../../../accounts/service/journals.service';
import { AppConstant } from '../../../app.constant';
//To PDF
import { LocalStorageService } from '../../../shared/local-storage.service';
import { UtilsService } from '../../../services/utils.service'
import { FeaturesService } from '../../../services/features.service'
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { PrimengConstant } from '../../../app.primeconfig';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-view-bankdeposite',
  templateUrl: './view-bankdeposite.component.html',
  styleUrls: ['./view-bankdeposite.component.scss']
})
export class ViewBankdepositeComponent implements OnInit, OnDestroy {

  depositeheader: any;
  depositedetails: any;
  // pdf download
  userstoragedata: any;
  @Input() journalid: number;
  datafromat: string;
  public currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  hotkeyDownload: Hotkey | Hotkey[];
  hotkeyClose: Hotkey | Hotkey[];
  constructor(
    private JournalsService: JournalsService,
    // for pdf download
    private storageservice: LocalStorageService,
    private utilservice: UtilsService,
    private featureservice: FeaturesService,
    private _hotkeysService: HotkeysService,
    private router: Router
  ) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeyClose = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.CLOSE.KEY, (event: KeyboardEvent): boolean => {
      this.router.navigate(['banks/deposit']);
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
        this.depositeheader = res.data[0];
        this.depositedetails = res.data[0].ledgers
      }
    })

  }
  // PDF Download
  pdfdownload() {
    let data = {} as any;
    data = this.utilservice.getReportParams(AppConstant.REPORTS.BANK.DEPOSIT_REPORT_NAME, this.userstoragedata);
    data.reportparams = 'depositid:' + this.journalid;
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        console.log(data);
        this.utilservice.saveToFileSystem(data, 'application/pdf', 'deposit', '.pdf');
        return data;
      },
      error => {
        console.error(error);
        return error;

      }
      );
  }
}
