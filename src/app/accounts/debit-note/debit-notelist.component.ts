import { Component, OnInit } from '@angular/core';
import { AccountsService } from './../service/accounts.service';
import { AppConstant } from './../../app.constant';
import { LocalStorageService } from '../../shared/local-storage.service';
import { UtilsService } from '../../services/utils.service';
import * as _ from 'lodash';
import { FeaturesService } from '../../services/features.service';
import { PrimengConstant } from '../../app.primeconfig';
import { ConfirmationService, ConfirmDialog } from 'primeng/primeng';
import { MessagesService } from '../../shared/messages.service';

@Component({
  selector: 'app-debit-notelist',
  templateUrl: './debit-notelist.component.html',
  styleUrls: ['./debit-notelist.component.scss']
})
export class DebitNotelistComponent implements OnInit {
  public paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES;
  userdetails: any;
  alldebit: any;
  addproduct: boolean = false;
  addnew: boolean = false;
  list: boolean = true;
  finyear: any;
  dataFormat: string;
  currency_Symbol: string;
  activeTab_edit: boolean = false;
  showEdit: boolean = false;
  debitidlist: any;
  selectedviewdebit: Array<any> = [];
  activetabindex: number = 0;
  show: boolean = false
  public displaydtime = AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  constructor(private AccountsService: AccountsService,
    private LocalStorageService: LocalStorageService,
    private UtilsService: UtilsService,
    private featureservice: FeaturesService,
    private messageService: MessagesService,
    private confirmationService: ConfirmationService

  ) {
    this.userdetails = LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.dataFormat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT
  }
  ngOnInit() {
    this.crdrgetall();
  }
  showhidefilter(datatable, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(datatable, this.show, btnid);
  }
  crdrgetall() {
    const data = {
      'offset': 0,
      'limit': 10,
      'startdate': '',
      'enddate': '',
      'startCreatedDt': '',
      'endCreatedDt': '',
      'gtAmount': '',
      'ltAmount': '',
      'amountKey': '',
      'finyear': this.finyear.finyear,
      'query': {
        'tenantid': this.userdetails.tenantid,
        'type': 'DRNOTE'
      }
    }
    var callback = this;
    this.AccountsService.FindAllAccounts(data).then(function (res) {
      if (res.status) {
        callback.alldebit = res.data;
        console.log('res.data', res.data)
      }
    })
  }
  notifyNewDebitNote(even) {
    this.crdrgetall();
    this.addproduct = false;
    this.addnew = false;
    this.list = true;
    this.activeTab_edit = false
    this.showEdit = false;
  }
  Addproducts(debitview) {
    this.addproduct = true;
    this.addnew = true;
    this.list = false;
    this.activeTab_edit = false
    this.showEdit = false;
    this.selectedviewdebit = [];
    debitview.activeIndex = 1
    this.UtilsService.active_addAndeditTab(debitview, 'Add Debit Note');
  }
  handleClose(event, closetab) {
    this.addproduct = false;
    this.showEdit = false;
    this.list = true;
    this.UtilsService.deactivate_multitab(this.selectedviewdebit, event, closetab, 'transno');
  }
  editDeposit(debitidlist, editDeposit) {
    this.addproduct = false;
    this.addnew = false;
    this.list = false;
    this.activeTab_edit = true;
    this.showEdit = true;
    this.selectedviewdebit = [];
    this.debitidlist = debitidlist;
    editDeposit.activeIndex = 1
    // this.UtilsService.active_addAndeditTab(editDeposit,'Edit Debit Note')
  }
  addTabviewdebit(item, addTabviewdebit) {
    this.addproduct = false;
    this.addnew = false;
    this.list = false;
    this.activeTab_edit = false;
    this.showEdit = false;
    this.UtilsService.activate_multitab(this.selectedviewdebit, item, addTabviewdebit, 'transno');
  }
  // PDF Download
  pdfdownload(id, refno) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.ACCOUNTS.DEBIT_REPORT_NAME, this.userdetails);
    data.reportparams = 'debitid:' + id;
    var res = this.featureservice.reportDownload(data)
      .subscribe(
      data => {
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

    const confirmobject = {
      message: PrimengConstant.GLOBAL_ERROR.DELETE_CONFIRM_MSG,
      acceptLabel: 'Yes',
      accept: () => {
        formdata = {
          txnid: data.crdrid,
          tenantid: this.userdetails.Tenant.tenantid,
          txnrefno: data.transno,
          finyear: data.finyear
        }
        // Actual logic to perform a confirmation
        // this.featureservice.getledgerList(formdata).then(res => {
        //   if (res.status) {
        // Actual logic to perform a confirmation
        data.status = PrimengConstant.COMMON.TRANS_STATUS.DELETED;
        //   data.ledgers = res.data;
        this.AccountsService.deleteJournal(data).then(res => {
          if (res.status) {
            this.messageService.showMessage({
              severity: 'success', summary: 'Success',
              detail: PrimengConstant.JOURNALS.DELETESUCCESS
            });
          } else {
            this.messageService.showMessage({
              severity: 'error', summary: 'Error',
              detail: PrimengConstant.JOURNALS.DELETEFAILED
            });
          }
          this.crdrgetall();
        });
        // }
        // });
      }
    };
    this.confirmationService.confirm(confirmobject);
  }
}

