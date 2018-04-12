import { Component, OnInit, Renderer2, ElementRef, Input, Output, ViewChild } from '@angular/core';
import { BanksService } from './../../service/banks.service';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { AppConstant } from '../../../app.constant';
import { JournalsService } from '../../../accounts/service/journals.service';
import { UtilsService } from '../../../services/utils.service';
import * as _ from "lodash";
import { FeaturesService } from '../../../services/features.service'
import { ConfirmationService, ConfirmDialog } from 'primeng/primeng';
import { PrimengConstant } from '../../../app.primeconfig';
import { MessagesService } from '../../../shared/messages.service';

@Component({
  selector: 'app-bankwithdrawlist',
  templateUrl: './bankwithdrawlist.component.html',
  styleUrls: ['./bankwithdrawlist.component.scss']
})
export class BankwithdrawlistComponent implements OnInit {
  @ViewChild('confirmdialog') confirmdialog: ConfirmDialog;
  data: any;
  userdetails: any
  allbankwithdraw: any[] = [];
  adddeposit: boolean = false;
  addnew: boolean = false;
  list: boolean = true;
  editdeposit: boolean = false;
  editpro: any;
  withdrawls: Array<any> = []
  selecteddeps: Array<any> = [];
  activeTab: String = "-";
  viewdeposit: boolean = false;
  finyear: any;
  datafromat: string;
  activetabIndex: number = 0;
  currency_Symbol: string;
  show: boolean = false;


  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public displaydtime = AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  constructor(private BanksService: BanksService,
    private LocalStorageService: LocalStorageService,
    private JournalsService: JournalsService,
    private confirmationService: ConfirmationService,
    private messageService: MessagesService,
    private UtilsService: UtilsService, private featureservice: FeaturesService) {
    this.userdetails = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.datafromat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  }

  ngOnInit() {

    this.getBankWithdrawList();
  }
  showhidefilter(datatable, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(datatable, this.show, btnid);
  }
  getBankWithdrawList() {
    let data = {
      "query": {
        "tenantid": this.userdetails.tenantid,
        "type": "BANKWITHDRAW",
        "finyear": this.finyear.finyear,
      }
      // "limit":100,
      // "offset":11
    }
    this.JournalsService.getAllJournals(data).then((res) => {
      if (res.status == true) {
        this.allbankwithdraw = res.data;
      }
    });
  };

  addTabViewwithdraw(item, addTabViewwithdraw) {
    this.adddeposit = false;
    this.editdeposit = false;
    this.addnew = false;
    this.editpro = false;
    this.viewdeposit = false;
    this.list = false;
    this.UtilsService.activate_multitab(this.selecteddeps, item, addTabViewwithdraw, "journalno");
  }
  notifyNewBankWithDraw(even) {
    this.getBankWithdrawList();
    this.adddeposit = false;
    this.editdeposit = false;
    this.addnew = false;
    this.editpro = false;
    this.viewdeposit = false;
    this.list = true;
  };

  AddDeposite(bwviewtab) {
    this.adddeposit = true;
    this.editdeposit = false;
    this.addnew = true;
    this.editpro = false;
    this.list = false;
    this.viewdeposit = false;
    this.withdrawls = [];
    this.selecteddeps = [];
    bwviewtab.activeIndex = 1;
    // this.UtilsService.active_addAndeditTab(bwviewtab,"Add Withdraw");
  };

  handleClose(event, closetab) {
    this.adddeposit = false;
    this.editdeposit = false;
    this.list = true;
    this.UtilsService.deactivate_multitab(this.selecteddeps, event, closetab, "journalno");
  };

  viewDeposite(withdrawls, bwviewtab) {
    this.list = false;
    this.adddeposit = false;
    this.editdeposit = true;
    this.addnew = false;
    this.editpro = true;
    this.withdrawls = withdrawls;
    this.viewdeposit = false;
    this.selecteddeps = [];
    bwviewtab.activeIndex = 1;
    // this.UtilsService.active_addAndeditTab(bwviewtab,"Edit Withdraw");
  };
  // PDF Download
  pdfdownload(id, refno) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.BANK.WITHDRAW_REPORT_NAME, this.userdetails);
    data.reportparams = 'withdrawid:' + id;
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
        console.log(data);
        this.UtilsService.saveToFileSystem(data, 'application/pdf', refno, '.pdf');
        return data;
      },
      error => {
        console.error(error);
        return error;

      }
      );
  }

  //Delete row
  deleteRecord(data) {
    console.log("Fprmdata", data)
    let formdata = {};
    this.confirmationService.confirm({
      message: PrimengConstant.GLOBAL_ERROR.DELETE_CONFIRM_MSG,
      accept: () => {
        formdata = {
          txnid: data.journalid,
          tenantid: this.userdetails.Tenant.tenantid,
          txnrefno: data.journalno,
          finyear: data.finyear
        }
        // Actual logic to perform a confirmation
        // this.featureservice.getledgerList(formdata).then(res => {
        //   if (res.status) {
        // Actual logic to perform a confirmation
        data.status = PrimengConstant.COMMON.TRANS_STATUS.DELETED;
        // data.ledgers = res.data;
        this.BanksService.delete(data).then(res => {
          if (res.status) {
            this.messageService.showMessage({
              severity: 'success', summary: 'Success',
              detail: PrimengConstant.JOURNALS.DELETESUCCESS
            });
            this.getBankWithdrawList();
          } else {
            this.messageService.showMessage({
              severity: 'error', summary: 'Error',
              detail: PrimengConstant.JOURNALS.DELETEFAILED
            });
          }
        });
        // }
        // });
      }
    });

  }
}
