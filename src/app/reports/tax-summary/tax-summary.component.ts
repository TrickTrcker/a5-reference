import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/reports/reports.service'
import { UtilsService } from '../../services/utils.service';
import { AppConstant } from '../../app.constant';
import { FeaturesService } from '../../services/features.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { CurrencyPipe } from "@angular/common";

@Component({
  selector: 'app-tax-summary',
  templateUrl: './tax-summary.component.html',
  styleUrls: ['./tax-summary.component.scss']
})
export class TaxSummaryComponent implements OnInit {
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  taxsummar: any[];
  tax: any[];
  total: any;
  inwardTotal: any;
  outwardTotal: any;
  userstoragedata: any;
  finyear: any;
  currencyFilter: CurrencyPipe;
  activetabindex: number = 0;

  constructor(private reportService: ReportService, private utilservice: UtilsService,
    private featureservice: FeaturesService, private storageservice: LocalStorageService,



  ) {
    this.getTaxSummary();
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.currencyFilter = new CurrencyPipe("en-in");
  }

  ngOnInit() {
  }

  getTaxSummary() {
    this.total = 0;
    this.inwardTotal = 0;
    this.outwardTotal = 0;
    var formdata = {
      'type': 'taxsummary'
    }
    var self = this;
    this.reportService.getTaxSumreport(formdata).then((res) => {
      if (res.status) {
        this.taxsummar = res.data;
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].Taxflow == 'Tax Outward') {
            this.outwardTotal += parseFloat(res.data[i].Amount);

          }
          if (res.data[i].Taxflow == 'Tax Inward') {
            this.inwardTotal += parseFloat(res.data[i].Amount);
          }
          this.total = this.inwardTotal - this.outwardTotal;
        }
      }
    })
  }
  // PDF Download
  pdfdownload() {
    let data = {} as any;
    data = this.utilservice.getReportParams(AppConstant.REPORTS.TAX_SUMMARY.REPORT_NAME, this.userstoragedata);
    data.reportparams = 'journalid:' + 'All';
    console.log("Log",data)
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        this.utilservice.saveToFileSystem(data, "application/pdf", AppConstant.REPORTS.TAX_SUMMARY.PREFIX_NAME, ".pdf");
        return data;
      },
      error => {
        console.error(error);
        return error;

      }
      );
  }

}
