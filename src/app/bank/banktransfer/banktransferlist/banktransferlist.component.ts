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
  selector: 'app-banktransferlist',
  templateUrl: './banktransferlist.component.html',
  styleUrls: ['./banktransferlist.component.scss']
})
export class BanktransferlistComponent implements OnInit {
  @ViewChild('confirmdialog') confirmdialog: ConfirmDialog;
  data: any;
  userdetails: any
  allbanktransfer: any[] = [];
  addtrf: boolean = false;
  addnew: boolean = false;
  list: boolean = true;
  edittrf: boolean = false;
  editpro: any;
  tranfls: Array<any> = []
  activeTab: string = '-'
  selectedtrf: Array<any> = [];
  finyear: any;
  datafromat: string;
  activetabindex: number = 0
  currency_Symbol: string;
  show: boolean = false;
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public displaydtime = AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  constructor(private BanksService: BanksService, private LocalStorageService: LocalStorageService,
    private confirmationService: ConfirmationService,
    private messageService: MessagesService,
    private JournalsService: JournalsService, private UtilsService: UtilsService,
    private featureservice: FeaturesService) {
    this.userdetails = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.datafromat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  }

  ngOnInit() {
    var callback = this;
    this.data = {
      "query": {
        "tenantid": this.userdetails.tenantid,
        "type": "BANKTRANSFER",
        "finyear": this.finyear.finyear,
      }
      // "limit":10,
      // "offset":11
    }
    this.getBankTransferList(this.data)
  }
  showhidefilter(datatable, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(datatable, this.show, btnid);
  }
  getBankTransferList(data) {
    this.JournalsService.getAllJournals(data).then((res) => {
      if (res.status == true) {
        this.allbanktransfer = res.data;
        console.log("this.allbanktransfer", this.allbanktransfer);
      }
    });
  };

  addTabViewtransfer(item, addTabViewtransfer) {
    this.addtrf = false;
    this.edittrf = false;
    this.addnew = false;
    this.editpro = false;
    this.list = false;
    this.UtilsService.activate_multitab(this.selectedtrf, item, addTabViewtransfer, "journalno");
  }

  notifyNewBankTransfer(even) {
    this.getBankTransferList(this.data);
    this.addtrf = false;
    this.edittrf = false;
    this.addnew = false;
    this.editpro = false;
    this.list = true;
  };

  AddTransfer(btview) {
    this.addtrf = true;
    this.edittrf = false;
    this.addnew = true;
    this.editpro = false;
    this.list = false;
    this.tranfls = [];
    this.selectedtrf = [];
    btview.activeIndex = 1;
    // this.UtilsService.active_addAndeditTab(btview,"Add transfer");
  };

  handleClose(event, closetab) {
    this.addtrf = false;
    this.edittrf = false;
    this.list = true;
    this.UtilsService.deactivate_multitab(this.selectedtrf, event, closetab, "journalno");
  };
  viewtransfer(tranfls, btview) {
    this.list = false;
    this.addtrf = false;
    this.edittrf = true;
    this.addnew = false;
    this.editpro = true;
    this.tranfls = tranfls;
    this.selectedtrf = [];
    btview.activeIndex = 1;
    // this.UtilsService.active_addAndeditTab(btview,"Edit transfer");
  };
  // PDF Download
  pdfdownload(id, refno) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.BANK.TRANSFER_REPORT_NAME, this.userdetails);
    data.reportparams = 'transferid:' + id;
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
        // Actual logic to perform a confirmation
        data.status = PrimengConstant.COMMON.TRANS_STATUS.DELETED;
        // data.ledgers = res.data;
        this.BanksService.delete(data).then(res => {
          if (res.status) {
            this.messageService.showMessage({
              severity: 'success', summary: 'Success',
              detail: PrimengConstant.JOURNALS.DELETESUCCESS
            });
            this.getBankTransferList(this.data)
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
