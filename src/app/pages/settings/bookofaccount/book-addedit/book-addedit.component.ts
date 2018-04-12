import { Component, OnInit, OnDestroy, OnChanges, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AppConstant } from '../../../../app.constant';
import { LocalStorageService } from '../../../../shared/local-storage.service';
import { MessagesService } from '../../../../shared/messages.service';
import { MasterService } from '../../../../services/master.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { PrimengConstant } from '../../../../app.primeconfig';
import { UtilsService } from '../../../../services/utils.service';
import { CommonService } from '../../services/common.service';
import { LedgerService } from '../../services/ledger.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Message } from 'primeng/primeng';
import * as _ from 'lodash';
import { FeaturesService } from '../../../../services/features.service';
import { DateformatPipe } from '../../../../pipes/dateformat.pipe';
@Component({
  selector: 'app-book-addedit',
  templateUrl: './book-addedit.component.html',
  styleUrls: ['./book-addedit.component.scss']
})
export class BookAddeditComponent implements OnInit, OnDestroy, OnChanges {
  selectedgroups: any;
  groups: any[];
  @Input() editovrlay: any;
  @Input() addovrlay: any;
  @Input() subLedgerdtls: any;
  @Output() loadSubLedgerlist: EventEmitter<any> = new EventEmitter();

  @Output() notifyNewEntry: EventEmitter<any> = new EventEmitter();
  @Input() openedfromothers: boolean = false;

  subLedgerform: FormGroup;
  subLedgername: FormControl;
  closable: boolean = true;
  subLedgerdetails: any = {};
  userdetails: any;
  validation = 'true';
  validationmsg = '';
  msgs: Message[] = [];
  buttonText = 'Save';
  changestatus: any[] = [];
  status: any = [];
  title: string = 'Add Book Of Account';
  hotkeySave: Hotkey | Hotkey[];
  finyear: string;
  formObj: any = {
    subaccheadname: PrimengConstant.SUBLEDGER.ADDEDITFORM.SUBLEDGER_NAME,
    accheadname: PrimengConstant.SUBLEDGER.ADDEDITFORM.ACC_NAME,
    status: PrimengConstant.COMMON.STATUS,
    openingbalance: PrimengConstant.SUBLEDGER.ADDEDITFORM.OPEN_BAL,
    crdr: PrimengConstant.SUBLEDGER.ADDEDITFORM.CRDR,
  };
  crdr_opt = [
    {label: 'C', value: 'C'},
    {label: 'D', value: 'D'},
  ];
  currentDateStr: any;
  data_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  public amtlength = AppConstant.API_CONFIG.AMOUNTFORMAT.MAXLENGTH;
  constructor(private commonservice: CommonService,
    private utilservice: UtilsService,
    private messageService: MessagesService,
    private fb: FormBuilder,
    private localstorageservice: LocalStorageService,
    private subLedgerservice: LedgerService,
    private masterservice: MasterService,
    private _hotkeysService: HotkeysService,
    public featureservice: FeaturesService,
    private dateFormatPipeFilter: DateformatPipe) {
    this.finyear = this.localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR).finyear;
    this.currentDateStr= this.dateFormatPipeFilter.transform(new Date(), AppConstant.API_CONFIG.ANG_DATE.apiTSFormat);
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeySave = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.SAVE.KEY, (event: KeyboardEvent): boolean => {
      this.save(this.subLedgerform.value)
      return false;
    }, [], shrtkeys.COMMON.SAVE.TXT));
    this.userdetails = localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.subLedgerform = fb.group({
      'subaccheadname': [null, Validators.compose([Validators.required,
      this.utilservice.NoWhitespaceValidator, Validators.minLength(5), Validators.maxLength(15)])],
      'status': ['Active'],
      'accheadname': new FormControl(null, Validators.required),
      'openingbalance': new FormControl(0, Validators.required),
      'crdr': new FormControl('C', Validators.required),
    })
    this.status = AppConstant.API_CONFIG.status;
    for (var i = 0; i < this.status.length; i++) {
      this.changestatus.push({
        label: this.status[i].stat, value: this.status[i].stat
      });
    }
  }
  ledgergrp() {
    this.groups = [];
    var data = { notaccheadslist: ['BANK BALANCES'] };
    this.featureservice.AccHeadList(data)
      .then((res) => {
        if (res.status) {
          this.groups = this.masterservice.formatDataforDropdown('accheadname', res.data, PrimengConstant.COMMON.DROPDOWNS.SELCT_GRP);
        }
      });
  }
  ngOnInit() {
    this.ledgergrp();
    this.msgs = [];
    this.buttonText = 'Save';
    this.title = 'Add Book Of Account';
  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeySave);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.openedfromothers) {
      if (changes.openedfromothers.currentValue == true) {
      }
    } else {
      this.update();
    }
  }
  loadlist(ovrlay) {
    this.loadSubLedgerlist.next(ovrlay)
  }
  update() {
    this.ClearForm();
    if (!_.isEmpty(this.subLedgerdtls)) {
      this.buttonText = 'Update';
      this.title = 'Edit Book Of Account';
      let selectedgroup = _.find(this.groups, { value: { accheadid: this.subLedgerdtls.accheadid } });
      if (selectedgroup != undefined) {
        this.selectedgroups = selectedgroup.value;
      }
      this.subLedgerform = new FormGroup({
        'subaccheadname': new FormControl(this.subLedgerdtls.subaccheadname, [Validators.required, this.utilservice.NoWhitespaceValidator]),
        'status': new FormControl(this.subLedgerdtls.status),
        'accheadname': new FormControl(this.selectedgroups, Validators.required),
        'openingbalance': new FormControl(this.subLedgerdtls.openingbalance, Validators.required),
        'crdr': new FormControl(this.subLedgerdtls.ledger.crdr, Validators.required),
      })
    }
  }
  ClearForm() {
    this.buttonText = 'Save';
    this.title = 'Add Book of Account';
    this.subLedgerform = new FormGroup({
      'subaccheadname': new FormControl(null, [Validators.required, this.utilservice.NoWhitespaceValidator]),
      'accheadname': new FormControl(null, Validators.required),
      'openingbalance': new FormControl(0, Validators.required),
      'crdr': new FormControl('C', Validators.required),
    });
    this.msgs = [];
  }
  save(data) {
    console.log(this.subLedgerform);
    if (this.subLedgerform.status === 'INVALID') {
      const errorMessage = this.masterservice.getFormErrorMessage(this.subLedgerform, this.formObj);
      this.messageService.showMessage({ severity: 'error', summary: 'Error', detail: errorMessage });
      return false;
    }
    let formData = {} as any;
    formData = {
      'accheadid': data.accheadname.accheadid,
      'accheadname': data.accheadname.accheadname,
      'crdr': data.accheadname.crdr,
      'subaccheadname': data.subaccheadname,
      'lastupdatedby': this.userdetails.tenantname,
      'lastupdateddt': this.dateFormatPipeFilter.transform(new Date(), this.data_apiTSformat),
      'tenantid': this.userdetails.tenantid,
      'tenantname': this.userdetails.tenantname,
      'openingbalance': data.openingbalance,
      'type': 'Ledger',
      'status': data.status,
      'finyear': this.finyear,
      'ALIE': data.accheadname.ALIE,
      'opencrdr': data.crdr
    }
    if (!_.isEmpty(this.subLedgerdtls)) {
      formData.subaccheadid = this.subLedgerdtls.subaccheadid;
      this.subLedgerservice.update(formData).then(res => {
        if (res.status === true) {
          if(! this.openedfromothers)
            {
              this.messageService.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
            }
          this.loadlist(this.editovrlay);
          this.notifyNewEntry.next(res.data);
          this.ClearForm();
        } else {
          this.messageService.showMessage({ severity: 'error', summary: 'Error', detail: res.message });
        }
      });
    } else {
      formData.createddt = this.dateFormatPipeFilter.transform(new Date(), this.data_apiTSformat);
      formData.createdby = this.userdetails.tenantname;
      this.subLedgerservice.create(formData)
        .then(res => {
          if (res.status == true) {
            this.loadlist(this.addovrlay);
            this.notifyNewEntry.next(res.data);
            this.messageService.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
            this.ClearForm();
          } else {
            this.messageService.showMessage({ severity: 'error', summary: 'Error ', detail: res.message });
          }
        });
    }
  }
  callParent(data) {
    this.notifyNewEntry.next(data);
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
  numberOnly(event) {
    this.utilservice.allowNumberOnly(event);
  }
}

