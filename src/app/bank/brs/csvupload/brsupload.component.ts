import { Component, OnInit, Directive, ViewChild,EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, ValidatorFn, AbstractControl }
  from '@angular/forms';
import { BanksService } from '../../service/banks.service';
import { MasterService } from '../../../services/master.service';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { AppConstant } from '../../../app.constant';
import { SelectItem } from 'primeng/primeng';
import { Http, Response } from '@angular/http';
import { PapaParseService } from 'ngx-papaparse';
import { UtilsService } from "../../../services/utils.service";
import { Message } from 'primeng/primeng';
import * as _ from "lodash";
import { MessagesService } from '../../../shared/messages.service';
import * as moment from "moment";
import { DateformatPipe } from '../../../pipes/dateformat.pipe';
import { FileUploadModule, FileUpload } from 'primeng/primeng';
import {PrimengConstant}from '../../../app.primeconfig';
import { Router, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-brsupload',
  templateUrl: './brsupload.component.html',
  styleUrls: ['./brs.component.scss']
})

export class BRSUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput: FileUpload;
  @Output() updatebrslist = new EventEmitter();
  private currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  private date_dformat = AppConstant.API_CONFIG.ANG_DATE.displayFormat;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  data_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  private validationMSg = [];
  public uploadurl = "";
  uploadForm: FormGroup;
  userdetails: any;
  fileuploader: any;
  BankList: SelectItem[];
  fromtodate: Date[] = [];
  uploadedFiles: Array<any> = [];
  csvReadDatas: any;
  csv_header: any;
  newData: any[] = [];
  msgs: Message[];
  selectedbank: any = {};
  remarks: string = "";
  finyear: any;
  defaultBankColumns: any = ["Tranx_no", "Tranx_date", "Description", "Credit", "Debit", "Availbalance"];
  defaultformatedcsvdata = [{
    "tranx_no": "",
    "tranx_date": "", "description": "", "credit": 0, "debit": 0, "availbalance": 0
  }];
  viewfile = false;
  formatedcsvdata: any;
  currentdate: any;
  selectedfile: any;
  uploadinginprogress : boolean =  false;
  constructor(private BanksService: BanksService,
    private LocalStorageService: LocalStorageService,
    private masterService: MasterService,
    private router: Router,
    private PapaParseService: PapaParseService, private http: Http, private utilservice: UtilsService,
    private messageservice: MessagesService, private dateFormatPipeFilter: DateformatPipe) {
    this.userdetails = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.csv_header = this.defaultBankColumns;
    this.currentdate = this.dateFormatPipeFilter.transform(new Date(), this.date_apiformat)
    var fromdate = new Date();
    var todate = new Date();
    this.fromtodate = [
      fromdate,
      todate
    ];
    this.uploadurl = AppConstant.API_ENDPOINT + AppConstant.API_CONFIG.API_URL.BRS.CREATE;
  }
  ngOnInit() {
    this.getAllBankList();

  }
  openpage(path)
  {
    this.router.navigate([path]);
    return false;
  }
  getAllBankList() {
    var self = this;
    this.BanksService.getAllBanks({ tenantid: this.userdetails.tenantid })
      .then(res => {
        if (res.status) {
          self.BankList = self.masterService.formatDataforDropdown("bankname", res.data, "Select Bank");
        }
        else {
          console.log("no bank found");
        }
      });
  }
  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

   this.messageservice.showMessage({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  readcsvcontent(contents, event) {
    this.viewfile = true;
    var csvData = contents;
    this.PapaParseService.parse(csvData, {
      complete: (results, file) => {
        var csvloadeddata: any = results.data;
        this.csv_header = csvloadeddata[0];
        csvloadeddata.splice(0, 1);
        this.csvReadDatas = results.data;
        this.csvReadDatas = _.map(csvloadeddata, (value: any) => {
          if (value && value != "")
            return value;
        });
        if (this.utilservice.idEqualSingleArray(this.defaultBankColumns, this.csv_header)) {
          this.formatedcsvdata = this.utilservice.formatobjectArray(this.csv_header, this.csvReadDatas);
        }
        else {
          event.files = [];
          this.csv_header = [];
          this.csvReadDatas = [];
          this.uploadedFiles = [];
          this.messageservice.showMessage({
            severity: 'error',
            summary: 'Error', detail:PrimengConstant.BRSUPLOAD.INVALIDUPLOAD
          }, true);
        }

      }
    });
  }
  // Journalsconfig() {
  //   var data =
  //     {
  //       "tenantid": this.userdetails.tenantid
  //     }
  //   var callback: any = this;
  //   callback.BankList = [];
  //   this.BanksService.bankListAll(data).then(function (res) {
  //     var fdata = res.data;
  //     console.log("fdata:", fdata);
  //     callback.BankList = callback.masterService.formatDataforDropdown("bankname", fdata, "Select Type");
  //     console.log("callback:", callback.BankList);
  //   })

  // }
  csvUploader(event, fileuploader) {
    var filecontent = event.files[0];
    this.selectedfile = filecontent;
    if (filecontent) {
      var Reader = new FileReader();
      Reader.onload = (e: any) => {
        var contents = e.currentTarget.result;
        this.readcsvcontent(contents, fileuploader);
      }
      Reader.readAsText(filecontent);
    } else {
      this.messageservice.showMessage({
        severity: 'error',
        summary: 'Error', detail: PrimengConstant.BRSUPLOAD.FAILEDUPLOAD
      }, true);
      this.uploadedFiles = [];
    }
  }
  getformatedcsvdata(data) {
    var formateddata = [];
    var self = this;
    _.forEach(data, function (value: any, key) {
      var txndate = self.dateFormatPipeFilter.transform(moment(value.tranx_date, "MM/DD/YYYY").toDate(), self.date_apiformat);
      if (txndate != "" && value.tranx_no != "" && (value.credit != "" || value.debit != "")) {
        formateddata.push({
          "txnno": value.tranx_no,
          "txndate": txndate,
          "description": value.description,
          "openingbal": 0,
          "credit": parseFloat(value.credit),
          "debit": parseFloat(value.debit),
          "closeingbal": parseFloat(value.availbalance),
          "createdby": self.userdetails.loginname,
          "reconstatus": "U",
          "recondate": self.currentdate,
          "remarks": "",
          "createddt":this.dateFormatPipeFilter.transform(new Date(), this.data_apiTSformat),
          "lastupdatedby": self.userdetails.loginname,
          "lastupdateddt": this.dateFormatPipeFilter.transform(new Date(), this.data_apiTSformat),
        });
      }

    });
    return formateddata;
  }
  onBeforeSend(event) {
    var token = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN);
    event.xhr.setRequestHeader("x-access-token", token.token);
 }
  prepRequest(ev) {
    console.log(ev);
    if (this.checkFormValid()) {
      var stmtfromdt = this.dateFormatPipeFilter.transform(this.fromtodate[0], this.date_apiformat);
      var stmttodt = this.dateFormatPipeFilter.transform(this.fromtodate[1], this.date_apiformat);
      var formatcsvdata: any = this.getformatedcsvdata(this.formatedcsvdata);
      if (formatcsvdata.length > 0) {
        var header: any = {
          "tenantid": this.userdetails.tenantid,
          "bankid": this.selectedbank.bankid,
          "finyear": this.finyear.finyear,
          "accheadid": this.selectedbank.bankcode,
          "reconstatus" : "U",
          "stmtfromdt": stmtfromdt,
          "stmttodt": stmttodt,
          "remarks": this.remarks,
          "status": "Active",
          "createdby": this.userdetails.loginname,
          "lastupdatedby": this.userdetails.loginname,
          "lastupdateddt": this.dateFormatPipeFilter.transform(new Date(), this.data_apiTSformat),
        }
        // var formdata = {
        //   "header": header,
        //   "details": formatcsvdata
        // };
        var self = this;
        ev.formData.append('header', JSON.stringify(header));
        ev.formData.append('details', JSON.stringify(formatcsvdata));
        ev.xhr.withCredentials = true;
        this.uploadinginprogress = true;
      }
      else{
        self.messageservice.showMessage({ severity: 'error', summary: 'Error ', detail: "Invalid upload csv format." });
        window.event.preventDefault();
      }

    }
    else
    {
      window.event.preventDefault();
    }
    return false;
  }
  onUploadSuccess(event)
  {
    this.uploadinginprogress = false;
    this.updatebrslist.emit("updated");   
    this.messageservice.showMessage({
      severity: 'success',
      summary: 'Success', detail:PrimengConstant.BRSUPLOAD.SUCCESSUPLOAD
    }, true);
    var response = JSON.parse(event.xhr.response).data;
    var fdate = moment(new Date(response.header.stmtfromdt)).format( 'YYYY-MM-DD');
    var tdate = moment(new Date(response.header.stmttodt)).format( 'YYYY-MM-DD');
    this.router.navigate(['banks/brsmatching'], 
    {
       queryParams: { "finyear": response.header.finyear, "accheadid" : response.header.accheadid,
      "stmtfromdt" : fdate,"stmttodt" : tdate ,
      "bankstmtid" : response.header.bankstmtid
      }
   });
    this.resetform();
   
  }
  onUploadError(event)
  {
    this.uploadinginprogress = false;
    var response = JSON.parse(event.xhr.response);
    this.messageservice.showMessage({
      severity: 'error',
      summary: 'Error', detail: response.message
    }, true);
  }
  uploadBankStatement() {
    if (this.checkFormValid()) {
      this.fileInput.upload();
    }
  }
  checkFormValid() {
    var self = this;
    var valid = true;
    var errors = "";


    if (typeof this.csvReadDatas == "undefined") {
      errors = "Please upload valid csv file"
      // errors.push({
      //   severity: 'error',
      //   summary: 'Error', detail: "Please upload valid csv file."
      // });
      valid = false;
    }
    if (this.remarks == "") {
      errors = "Please enter remarks"
      // errors.push({
      //   severity: 'error',
      //   summary: 'Error', detail: "Please enter remarks"
      // });
      valid = false;
    }
    if ((typeof this.selectedbank.bankid) == "undefined") {
      errors = "Please select a bank"
      // errors.push({
      //   severity: 'error',
      //   summary: 'Error', detail: "Please select a bank"
      // });
      valid = false;
    }
    else {
      var v: boolean = true;
      v = this.utilservice.idEqualSingleArray(self.defaultBankColumns, this.csv_header);
      if (!v) {
        errors = "Invalid csv upload"
        // errors.push({
        //   severity: 'error',
        //   summary: 'Error', detail: "Invalid csv upload"
        // });
        valid = false;
      }
    }
    if (errors) {
      this.uploadinginprogress = false;
      self.messageservice.showMessage({ severity: 'error', summary: 'Error ', detail: errors });
    }
    return valid;
  }
  clearcsv(event)
  {
    this.formatedcsvdata = [];
    this.formatedcsvdata = [..._.clone(this.formatedcsvdata)];
  }
  resetform() {
    this.selectedbank = null;
    var fromdate = new Date();
    var todate = new Date();
    this.fromtodate = [
      fromdate,
      todate
    ];
    this.remarks = "";
    this.uploadedFiles = [];
    this.formatedcsvdata=[];
    this.formatedcsvdata = [..._.clone(this.formatedcsvdata)];
  }
}