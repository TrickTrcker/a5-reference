import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { AppConstant } from '../../app.constant';
import { BanksService } from '../../bank/service/banks.service';
import { MasterService } from './../../services/master.service';
import { DateformatPipe } from '../../pipes/dateformat.pipe';
import { LocalStorageService } from '../../shared/local-storage.service';
import { MessagesService } from '../../shared/messages.service';
import { UtilsService } from './../../services/utils.service'
import * as _ from "lodash";
import { PrimengConstant } from '../../app.primeconfig';
import * as moment from "moment";
import { FeaturesService } from '../../services/features.service';

@Component({
  selector: 'app-brs-report',
  templateUrl: './brs-report.component.html',
  styleUrls: ['./brs-report.component.scss']
})
export class BrsReportComponent implements OnInit {
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  private date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  public paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES;
  cities: SelectItem[];
  show: boolean = false;
  value: Date;
  selectedCity: string;
  brsreqData: any;
  startdate: Date;
  enddate: Date;
  sendstartdatefilter: Date;
  sendendatefilter: Date;
  currentDate: Date;
  userdetails: any
  validation: boolean = false;
  validationMsg: string
  brslist: any = []
  BankList: SelectItem[];
  selectedbank: any = {};
  fromtodate: any = [];
  closingbalancesign : any = "";
  closingbalanceamount : any=0;
  debitTotal : any = 0;
  creditTotal : any = 0;
  constructor(private BanksService: BanksService,
    private DateformatPipe: DateformatPipe,
    private LocalStorageService: LocalStorageService,
    private messageService: MessagesService,
    private UtilsService: UtilsService,
    private dateFormatPipeFilter: DateformatPipe,
    private masterService: MasterService,
    private featureservice: FeaturesService
  ) {
    this.userdetails = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.getAllBankList();
    this.fromtodate.push(new Date());
    this.fromtodate.push(new Date());
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.startdate = this.currentDate;
    this.enddate = this.currentDate;
    // this.getbrsListAll(this.startdate, this.enddate)
  }
  getAllBankList() {
    var self = this;
    this.BanksService.getAllBanks({ tenantid: this.userdetails.tenantid, limit: 1000, offset: 0 })
      .then(res => {
        if (res.status) {

          self.BankList = self.masterService.formatDataforDropdown("bankname", res.data, "Select Bank");
        }
        else {
          console.log("no bank found");
        }
      });
  }
  getbrsListAll(strdate, enddate) {
    this.validation = true;
    this.validationMsg = ""
    if (_.isEmpty(this.selectedbank)) {
      this.validation = false;
      this.validationMsg = PrimengConstant.COMMONREG.FROMDATE
    }
    if (this.validation) {
      var stmtfromdt = this.dateFormatPipeFilter.transform(this.fromtodate[0], this.date_apiformat);
    var stmttodt = this.dateFormatPipeFilter.transform(this.fromtodate[1], this.date_apiformat);
      var req = {
        "accheadid": this.selectedbank.bankcode,
        "startdate": stmtfromdt,
        "enddate": stmttodt
      };
      this.closingbalancesign = "";
      this.BanksService.brsReport(req)
        .then(res => {
          if (res.status == true) {
            this.brslist = res.data;
            console.log(" this.brslist", this.brslist);
            var camount=0,damount=0;
            _.forEach(this.brslist,function(d){
              camount += parseInt(d.cramount);
              damount += parseInt(d.dramount);
            });
            this.debitTotal = damount;
            this.creditTotal = camount;
            if( (camount - damount) > 0)
            {
              this.closingbalancesign = "C";
              this.closingbalanceamount = (camount - damount);
              this.debitTotal += this.closingbalanceamount;
            }
            else if( (damount - camount ) > 0)
            {
              this.closingbalancesign = "D";
              this.closingbalanceamount = (damount - camount );
              this.creditTotal += this.closingbalanceamount;
            }
            // this.messageService.showSuccessMessage({
            //   severity: 'success', summary: 'success',
            //   detail: res.message
            // });
          } else if (res.status == false) {
            // this.messageService.showMessage({
            //   severity: 'error', summary: 'error',
            //   detail: res.message
            // });
          }
        });
    }
    else {
      this.messageService.showMessage({
        severity: 'warn', summary: 'warning',
        detail: this.validationMsg
      });
    }


  }
  showhidefilter(datatable, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(datatable, this.show, btnid);
  }
  pdfdownload(selectedbank) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.BRS.REPORT_NAME, this.userdetails);
    var stmtfromdt = this.dateFormatPipeFilter.transform(this.fromtodate[0], this.date_apiformat);
    var stmttodt = this.dateFormatPipeFilter.transform(this.fromtodate[1], this.date_apiformat);
    data.reportparams = this.UtilsService.prepareReportParams({
      'accheadid': selectedbank ? selectedbank.bankcode : 'All',
      'startdate': this.dateFormatPipeFilter.transform(stmtfromdt, this.date_apiformat),
      'enddate': this.dateFormatPipeFilter.transform(stmttodt, this.date_apiformat)
    });
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        this.UtilsService.saveToFileSystem(data, 'application/pdf', AppConstant.REPORTS.BRS.PREFIX_NAME, '.pdf');
        return data;
      },
      error => {
        return error;
      }
      );
  }
}
