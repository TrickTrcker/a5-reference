import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LocalStorageService } from '../../../../../shared/local-storage.service';
import { AppConstant } from '../../../../../../app/app.constant';
import { LedgerService } from '../../../services/ledger.service'
import { DropdownModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import * as _ from 'lodash';
import { MasterService } from '../../../../../services/master.service';
import { CommonService } from '../../../services/common.service';
import { Message } from 'primeng/primeng';
import { MessagesService } from '../../../../../shared/messages.service';
import { PrimengConstant } from '../../../../../../app/app.primeconfig';
import { UtilsService } from '../../../../../services/utils.service';
import { FeaturesService } from '../../../../../services/features.service';
import { DateformatPipe } from '../../../../../pipes/dateformat.pipe';
@Component({
  selector: 'app-addledger',
  templateUrl: './addledger.component.html',
  styleUrls: ['./addledger.component.scss']
})
export class AddledgerComponent implements OnInit {
  group: any;
  finyear: any;
  @Input() editovrlay: any;
  @Input() addovrlay: any;
  @Input() ledgerdtls: any;

  @Output() loadledgerlist: EventEmitter<any> = new EventEmitter();

  @Output() notifyNewEntry: EventEmitter<any> = new EventEmitter();
  @Input() openedfromothers: boolean = false;

  public max50 = AppConstant.API_CONFIG.MAXLENGTH.MAX50;
  public amtlength = AppConstant.API_CONFIG.AMOUNTFORMAT.MAXLENGTH;
  groups: any[];
  validation = 'true';
  validationmsg = '';
  selectedgroup: any[];
  msgs: Message[] = [];
  ledgerform: FormGroup;
  ledgerdetails: any = {};
  userdetails: any;
  selectedgroups: any;
  buttonText = 'Save';
  changestatus: any[] = [];
  Status: any = [];
  title: string = 'Add Ledger';
  crdr_opt = [
    {label: 'C', value: 'C'},
    {label: 'D', value: 'D'},
  ];

  formObj: any = {
    firstname: PrimengConstant.LEDGER.ADDEDITFORM.F_NAME,
    accheadname: PrimengConstant.LEDGER.ADDEDITFORM.ACC_HEAD_NAME,
    status: PrimengConstant.COMMON.STATUS,
    openingbalance: PrimengConstant.SUBLEDGER.ADDEDITFORM.OPEN_BAL,
    crdr: PrimengConstant.SUBLEDGER.ADDEDITFORM.CRDR
  };
  date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  constructor(public featureservice: FeaturesService,
    public dateFormatPipeFilter: DateformatPipe,
    public localstorageservice: LocalStorageService,
    private utilservice: UtilsService,
    private messageservice: MessagesService,
    private commonservice: CommonService,
    private ledgerservice: LedgerService,
    private fb: FormBuilder,
    private masterservice: MasterService) {
    this.finyear = this.localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR).finyear;

    this.ledgerform = fb.group({
      'firstname': [null, Validators.compose([Validators.required, this.utilservice.NoWhitespaceValidator, Validators.minLength(3), Validators.maxLength(50)])],
      'accheadname': [null, Validators.required],
      'openingbalance': [0, Validators.required],
      'status': [null],
      'crdr': ['C', Validators.required]
    })
    this.userdetails = localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
  }

  ngOnInit() {
    this.ledgergrp();
    this.buttonText = 'Save';
    this.title = 'Add Ledger';
  }
  ledgergrp() {
    this.groups = [];
    let data = {} as any;
    data = { type: 'Ledger', status: 'Active', notaccheadslist: PrimengConstant.COMMON.PARTIES };
    this.featureservice.BookofAccList(data)
      .then((res) => {
        if (res.status) {
          this.group = res.data;
          this.groups = this.masterservice.formatDataforDropdown('subaccheadname', res.data, PrimengConstant.COMMON.DROPDOWNS.SELCT_GRP);
        }
      });
  }
  ngOnChanges() {
    this.vieweditledger();
  }
  vieweditledger() {
    this.ClearForm();
    if (!_.isEmpty(this.ledgerdtls)) {
      this.buttonText = 'Update';
      this.title = 'Edit Ledger';
      this.ledgerform = new FormGroup({
        'firstname': new FormControl(this.ledgerdtls.subaccheadname,
          [Validators.required, this.utilservice.NoWhitespaceValidator, Validators.minLength(3), Validators.maxLength(50)]),
        'accheadname': new FormControl(null, Validators.required),
        'status': new FormControl(this.ledgerdtls.status, Validators.required),
        'openingbalance': new FormControl(this.ledgerdtls.openingbalance, Validators.required),
        'crdr': new FormControl(this.ledgerdtls.ledger.crdr, Validators.required),
      });
      let data =_.find(this.group, { subaccheadid: Number(this.ledgerdtls.accheadid) });
      if (data != undefined) {
        this.ledgerform.controls['accheadname'].setValue(data);
      }

    }
  }

  loadlist(ovrlay) {
    this.loadledgerlist.next(ovrlay)
  }
  ClearForm() {
    this.buttonText = 'Save';
    this.title = 'Add Ledger';
    this.ledgerform = new FormGroup({
      'firstname': new FormControl(null, Validators.compose([Validators.required, this.utilservice.NoWhitespaceValidator, Validators.minLength(3), Validators.maxLength(50)])),
      'accheadname': new FormControl(null, Validators.required),
      'openingbalance': new FormControl(0, Validators.required),
      'crdr': new FormControl('C', Validators.required),
      'status': new FormControl('Active', Validators.required),
    });
  }

  save(data) {

    if (this.ledgerform.status == 'INVALID') {
      var errorMessage = this.masterservice.getFormErrorMessage(this.ledgerform, this.formObj);
      this.messageservice.showMessage({ severity: 'error', summary: 'Error', detail: errorMessage });
      return false;
    }
    if (!_.isEmpty(this.ledgerdtls)) {
      var formdata =
        {
          'subaccheadid': this.ledgerdtls.subaccheadid,
          'accheadid': data.accheadname.subaccheadid,
          'accheadname': data.accheadname.subaccheadname,
          'crdr': data.accheadname.crdr,
          'subaccheadname': data.firstname,
          'lastupdatedby': this.userdetails.tenantname,
          'lastupdateddt': this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
          'tenantid': this.userdetails.tenantid,
          'tenantname': this.userdetails.tenantname,
          'openingbalance': data.openingbalance,
          'type': 'SubLedger',
          "ledger" : this.ledgerdtls.ledger,
          'status': data.status,
          'finyear': this.finyear,
          'ALIE': data.accheadname.ALIE,
          'opencrdr': data.crdr
        }
      this.ledgerservice.update(formdata)
        .then(res => {
          if (res.status == true) {
            this.callParent(res.data);
            this.ClearForm();
            this.messageservice.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
            this.loadlist(this.editovrlay);
          } else {
            this.messageservice.showMessage({ severity: 'error', summary: 'Error', detail: res.message });
            this.ClearForm();
          }
        });
    }
    else {
      var form =
        {
          'accheadid': data.accheadname.subaccheadid,
          'accheadname': data.accheadname.subaccheadname,
          'crdr': data.accheadname.crdr,
          'subaccheadname': data.firstname,
          'createdby': this.userdetails.tenantname,
          'createddt': this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
          'tenantid': this.userdetails.tenantid,
          'tenantname': this.userdetails.tenantname,
          'openingbalance': data.openingbalance,
          'type': 'SubLedger',
          'status': 'Active',
          'lastupdatedby': this.userdetails.loginname,
          'lastupdateddt': this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
          'finyear': this.finyear,
          'ALIE': data.accheadname.ALIE,
          'opencrdr': data.crdr
        }
      this.ledgerservice.create(form)
        .then(res => {
          if (res.status == true) {
            if(! this.openedfromothers)
            {
              this.messageservice.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
            }
            this.loadlist(this.addovrlay);
            this.notifyNewEntry.next(res.data);
            this.ClearForm();
          } else {
            this.messageservice.showMessage({ severity: 'error', summary: 'Error', detail: res.message });
            this.ClearForm();
          }
        });
    }
  }
  getcrdrLabel(item)
  {
    var label = "";
    if(item.label != undefined)
    {
      if(item.label == "C")
      {
        label = "Credit";
      }
      else  if(item.label == "D")
      {
        label = "Debit";
      }
    }
    return label;
  }
  callParent(data) {
    this.notifyNewEntry.next(data);
  }
  numberOnly(event) {
    this.utilservice.allowNumberOnly(event);
  }
}
