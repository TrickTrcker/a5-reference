import { Component, OnInit, Renderer2, ElementRef, Input, Output, ViewChild } from '@angular/core';
import { BanksService } from './../../service/banks.service';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { AppConstant } from '../../../app.constant';
import { JournalsService } from '../../../accounts/service/journals.service';
import { UtilsService } from '../../../services/utils.service'
import * as _ from "lodash";
import { FeaturesService } from '../../../services/features.service'
import { ConfirmationService, ConfirmDialog } from 'primeng/primeng';
import { PrimengConstant } from '../../../app.primeconfig';
import { MessagesService } from '../../../shared/messages.service';

@Component({
  selector: 'app-bankdepositelist',
  templateUrl: './bankdepositelist.component.html',
  styleUrls: ['./bankdepositelist.component.scss']
})
export class BankdepositelistComponent implements OnInit {
  @ViewChild('confirmdialog') confirmdialog: ConfirmDialog;
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  data: any;
  userdetails: any
  allbankdeposit: any[] = [];
  adddeposit: boolean = false;
  addnew: boolean = false;
  list: boolean = true;
  editdeposit: boolean = false;
  editpro: any;
  activeTab = "-";
  depositls: Array<any> = [];
  selecteddeps: Array<any> = [];
  finyear: any;
  datafromat: string;
  activetabindex: number = 0;
  currency_Symbol: string;
  show: boolean = false;
  public displaydtime = AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  constructor(private BanksService: BanksService, private LocalStorageService: LocalStorageService,
    private JournalsService: JournalsService, private UtilsService: UtilsService,
    private confirmationService: ConfirmationService,
    private messageService: MessagesService,
    private featureservice: FeaturesService
  ) {
    this.userdetails = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.datafromat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
    this.data = {
      "query": {
        "tenantid": this.userdetails.tenantid,
        "type": "BANKDEPOSIT",
        "finyear": this.finyear.finyear,
      }
    }
  }

  ngOnInit() {

    // "limit":10,
    // "offset":11

    this.getBankDepositeList(this.data);
  }
  showhidefilter(datatable, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(datatable, this.show, btnid);
  }
  getBankDepositeList(data) {
    console.log("DATA", data)
    this.JournalsService.getAllJournals(data).then((res) => {
      if (res.status == true) {
        this.allbankdeposit = res.data;
        console.log("Deposite", this.allbankdeposit)
      }
    });
  };

  addTabViewdeposite(item, addTabViewdeposite) {
    this.adddeposit = false;
    this.editdeposit = false;
    this.addnew = false;
    this.editpro = false;
    this.list = false;
    this.UtilsService.activate_multitab(this.selecteddeps, item, addTabViewdeposite, "journalno");
  }


  notifyNewBankDeposit(even) {
    this.getBankDepositeList(this.data);
    this.adddeposit = false;
    this.editdeposit = false;
    this.addnew = false;
    this.editpro = false;
    this.list = true;
  };

  AddDeposite(bdtabview) {
    this.selecteddeps = [];
    this.adddeposit = true;
    this.editdeposit = false;
    this.addnew = true;
    this.editpro = false;
    this.list = false;
    this.depositls = [];
    //  this.UtilsService.active_addAndeditTab(bdtabview,"Add deposit")
    bdtabview.activeIndex = 1;
  };

  handleClose(e, closetab) {
    this.adddeposit = false;
    this.editdeposit = false;
    this.adddeposit = false;
    this.editdeposit = false;
    this.list = true;
    this.UtilsService.deactivate_multitab(this.selecteddeps, event, closetab, "journalno");
  };

  viewDeposite(depositls, bdtabview) {
    this.selecteddeps = [];
    this.list = false;
    this.adddeposit = false;
    this.editdeposit = true;
    this.addnew = false;
    this.editpro = true;
    this.depositls = depositls;
    //  this.UtilsService.active_addAndeditTab(bdtabview,"Edit deposit")
    bdtabview.activeIndex = 1;
  };
  // PDF Download
  pdfdownload(id, refno) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.BANK.DEPOSIT_REPORT_NAME, this.userdetails);
    data.reportparams = 'depositid:' + id;
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
  // Delete record
  deleteRecord(data) {
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
        data.status = PrimengConstant.COMMON.TRANS_STATUS.DELETED;
        // data.ledgers = res.data;
        this.BanksService.delete(data).then(res => {
          if (res.status) {
            this.messageService.showMessage({
              severity: 'success', summary: 'Success',
              detail: PrimengConstant.JOURNALS.DELETESUCCESS
            });
            this.getBankDepositeList(this.data);
          } else {
            this.messageService.showMessage({
              severity: 'error', summary: 'Error',
              detail: PrimengConstant.JOURNALS.DELETEFAILED
            });
          }
        });
        //   }
        // });
      }
    });
  }
}
