import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { JournalsService } from '../../service/journals.service';
import { FeaturesService } from '../../../services/features.service';
import { MasterService } from '../../../services/master.service';
import { LocalStorageService } from '../../../shared/local-storage.service';
import * as moment from 'moment';
import * as _ from "lodash";
import { AppConstant } from '../../../app.constant';
import { UtilsService } from '../../../services/utils.service';
import { ConfirmationService, ConfirmDialog } from 'primeng/primeng';
import { PrimengConstant } from '../../../app.primeconfig';
import { MessagesService } from '../../../shared/messages.service';

@Component({
  selector: 'app-list-journal',
  templateUrl: './list-journal.component.html',
  styleUrls: ['./list-journal.component.scss']
})
export class ListJournalComponent implements OnInit {
  @ViewChild('confirmdialog') confirmdialog: ConfirmDialog;
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  public paginator = AppConstant.API_CONFIG.PAGINATOR.REPORTPAGES;
  public displaydtime = AppConstant.API_CONFIG.ANG_DATE.displaydtime;
  tenantInfo: any;
  finyear: any;
  apiDateFormat: string;
  journalfeat: SelectItem[];
  journalType: any;
  alljournals: any[] = [];
  dispDateFormat: string;
  show: boolean = false;
  filterjournalno: SelectItem[];
  yearFilter: any;
  yearTimeout: any;
  submax: string;
  submin: string;
  userstoragedata: any;
  constructor(private fb: FormBuilder,
    private journalService: JournalsService,
    private featureService: FeaturesService,
    private masterService: MasterService,
    private confirmationService: ConfirmationService,
    private localStorageServcie: LocalStorageService,
    private UtilsService: UtilsService,
    private messageService: MessagesService
  ) {
    this.tenantInfo = localStorageServcie.getItem("user");
    this.finyear = localStorageServcie.getItem("finyear");
    this.apiDateFormat = AppConstant.API_CONFIG.DATE.apiFormat;
    this.dispDateFormat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.userstoragedata = this.localStorageServcie.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
  }

  ngOnInit() {
    this.getAllJournals();
    this.getAllCodeMasterFeatures();
  }

  showhidefilter(datatable, btnid) {
    this.show = this.UtilsService.resetdatatableFilter(datatable, this.show, btnid);
  }

  getAllJournals(type?) {
    // let queryParams: any = {};
    let queryParams = {
      // "offset": 1,
      // "limit": 10,
      "query": {
        "tenantid": this.tenantInfo.tenantid,
        "finyear": this.finyear.finyear,
        "feature": "Journal"
      }
    }

    // queryParams.tenantid = this.tenantInfo.tenantid;
    // queryParams.finyear = this.finyear.finyear;
    // //  queryParams.limit = 10;
    //  queryParams.feature ="Journal";

    this.journalService.getAllJournals(queryParams).then(response => {
      if (response.status) {
        this.alljournals = response.data;
        this.getjournalno();
        console.log("this.alljournals", this.alljournals);
      }
      else {
        this.alljournals = [];
      }
    })
  }
  getAllCodeMasterFeatures() {
    let params: any = {};
    params.type = "JOURNAL";

    this.featureService.getcodemasterList(params).then(res => {
      if (res.status) {
        this.journalfeat = this.masterService.filterformatDataforDropdown("name", res.data);
        this.journalType = this.journalfeat[0].value;
      }
    });
  };

  filterJournals() {
    this.getAllJournals(this.journalType.name);
  }
  getjournalno() {
    this.filterjournalno = [];
    this.filterjournalno = this.masterService.filterformatDataforDropdown("journalno", this.alljournals);
    console.log("journalno", this.filterjournalno)
  }

  //   amountrang(){
  //   var subtotalamount=_.map(this.alljournals,function(value:any){
  //       return value.subtotal
  //     });
  //     // var uniq = subtotalamount.reduce(function(a,b){
  //     //   if (a.indexOf(b) < 0 ) a.push(b);
  //     //   return a;
  //     // },[]);
  //     var uniq= _.uniq(subtotalamount)
  //  this.yearFilter=uniq
  //   console.log(uniq, subtotalamount) 
  //   var max=Math.max(...uniq);
  //   var min=Math.min(...uniq);
  //   this.submax=parseFloat( max)
  //   console.log("max",  this.submax);
  //   console.log("min",  this.submin);
  //   }
  // onYearChange(event, dt, col) {
  //   return   dt.filter(event.value, col.field, col.filterMatchMode);
  // if(this.yearTimeout) {
  //     clearTimeout(this.yearTimeout);
  // }

  // this.yearTimeout = setTimeout(() => {
  //  return   dt.filter(event.value, col.field, col.filterMatchMode);
  // },0);
  // }

  pdfdownload(id, refno) {
    let data = {} as any;
    data = this.UtilsService.getReportParams(AppConstant.REPORTS.ACCOUNTS.JOURNALS_REPORT_NAME, this.userstoragedata);
    data.reportparams = 'journalid:' + id;
    var res = this.featureService.reportDownload(data)
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
          tenantid: this.userstoragedata.Tenant.tenantid,
          txnrefno: data.journalno,
          finyear: data.finyear
        }
        // Actual logic to perform a confirmation
        // this.featureService.getledgerList(formdata).then(res => {
        //   if (res.status) {
        // Actual logic to perform a confirmation
        data.status = PrimengConstant.COMMON.TRANS_STATUS.DELETED;
        //   data.ledgers = res.data;
        this.journalService.deleteJournal(data).then(res => {
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
          this.getAllJournals();
        });
        //   }
        // });
      }
    });
  }
}
