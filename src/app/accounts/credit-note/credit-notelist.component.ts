import { Component, OnInit } from '@angular/core';
import { AccountsService } from './../service/accounts.service';
import { AppConstant } from './../../app.constant';
import { LocalStorageService } from '../../shared/local-storage.service';
import { UtilsService } from '../../services/utils.service'
import * as _ from "lodash";
import { FeaturesService } from "../../services/features.service";
import { PrimengConstant } from "../../app.primeconfig";
import { MessagesService } from '../../shared/messages.service';
import { ConfirmationService, ConfirmDialog } from 'primeng/primeng';

@Component({
  selector: 'app-credit-notelist',
  templateUrl: './credit-notelist.component.html',
  styleUrls: ['./credit-notelist.component.scss']
})
export class CreditNotelistComponent implements OnInit {
  public paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES;
  userdetails: any
  allcredit: any[] = [];
  addproduct: boolean = false;
  activeTab_addCredit: boolean = false;
  list: boolean = true;
  finyear: any;
  dataFormat: string;
  currency_Symbol: string;
  activeTab_editcredit: boolean = false;
  showEdit: boolean = false;
  creditls: any;
  indextabview: number = 0;
  activeTab_viewcredit: boolean = false;
  selectedcredit: Array<any> = [];
  view: boolean = false;
  show: boolean = false;
  public displaydtime = AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  constructor(private AccountsService: AccountsService,
    private LocalStorageService: LocalStorageService,
    private UtilsService: UtilsService,
    private featureservice: FeaturesService,
    private messageService: MessagesService,
    private confirmationService: ConfirmationService
  ) {
    this.userdetails = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.dataFormat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;

  }


  ngOnInit() {
    this.crdrgetall();
  }
  showhidefilter(datatable, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(datatable, this.show, btnid);
  }

  crdrgetall() {
    const data = {
      "offset": 0,
      "limit": 10,
      "startdate": "",
      "enddate": "",
      "startCreatedDt": "",
      "endCreatedDt": "",
      "gtAmount": "",
      "ltAmount": "",
      "amountKey": "",
      "finyear": this.finyear.finyear,
      "query": {
        "tenantid": this.userdetails.tenantid,
        "type": "CRNOTE"
      }

    }
    this.AccountsService.FindAllAccounts(data).then((res) => {
      if (res.status) {
        this.allcredit = res.data;
      }

    })
  }
  notifyNewCreditNote(even) {
    this.crdrgetall();
    this.addproduct = false;
    this.list = true;
    this.showEdit = false;
    this.activeTab_addCredit = false;
    this.activeTab_editcredit = false;
    this.activeTab_viewcredit = false;

  }
  Addproducts(addTab) {
    this.addproduct = true;
    this.list = false;
    this.showEdit = false;
    this.activeTab_addCredit = true;
    this.activeTab_editcredit = false;
    this.activeTab_viewcredit = false;
    this.selectedcredit = [];
    addTab.activeIndex = 1;
  }
  handleClose(event, addTab, ) {
    this.showEdit = false;
    this.addproduct = false;
    this.showEdit = false;
    this.list = true;
    this.UtilsService.deactivate_multitab(this.selectedcredit, event, addTab, "transno");
  }
  EditClickcredit(creditls, addTab) {
    this.creditls = creditls;
    this.addproduct = false;
    this.list = false;
    this.showEdit = true;
    this.activeTab_addCredit = false;
    this.activeTab_editcredit = true;
    this.activeTab_viewcredit = false;
    this.selectedcredit = [];
    addTab.activeIndex = 1;
  }
  addTabviewcreditnote(item, addTab) {
    this.addproduct = false;
    this.activeTab_addCredit = false;
    this.list = false;
    this.activeTab_editcredit = false;
    this.showEdit = false;
    this.UtilsService.activate_multitab(this.selectedcredit, item, addTab, "transno");

  }
  // PDF Download
  pdfdownload(id, refno) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.ACCOUNTS.CREDIT_REPORT_NAME, this.userdetails);
    data.reportparams = 'creditid:' + id;
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
    const confirmobject = {
      message: PrimengConstant.GLOBAL_ERROR.DELETE_CONFIRM_MSG,
      acceptLabel: 'Yes',
      rejectLabel: 'Cancel',
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
        // data.ledgers = res.data;
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
        //   }
        // });
      }
    };
    this.confirmationService.confirm(confirmobject);
  }
}
