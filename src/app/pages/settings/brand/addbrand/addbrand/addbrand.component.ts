import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LocalStorageService } from '../../../../../shared/local-storage.service';
import { AppConstant } from '../../../../../../app/app.constant';
import { BrandService } from '../../../services/brand.service';
import { BrandComponent } from '../../brand.component';
import * as _ from 'lodash';
import { Message } from 'primeng/primeng';
import { MasterService } from '../../../../../services/master.service';
import { MessagesService } from '../../../../../shared/messages.service';
import { CommonService } from '../../../services/common.service';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { PrimengConstant } from '../../../../../../app/app.primeconfig';
import { UtilsService } from '../../../../../services/utils.service'
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { DateformatPipe } from '../../../../../pipes/dateformat.pipe';
@Component({
  selector: 'app-addbrand',
  templateUrl: './addbrand.component.html',
  styleUrls: ['./addbrand.component.scss']
})
export class AddbrandComponent implements OnInit, OnDestroy, OnChanges {
  @Input() editovrlay: any;
  @Input() addovrlay: any;
  @Input() branddtls: any;
  @Output() loadbrandlist: EventEmitter<any> = new EventEmitter();

  @Output() notifyNewEntry: EventEmitter<any> = new EventEmitter();
  @Input() openedfromothers: boolean = false;

  brandform: FormGroup;
  brandname: FormControl;
  closable: boolean = true;
  branddetails: any = {};
  userdetails: any;
  validation = 'true';
  validationmsg = '';
  msgs: Message[] = [];
  buttonText = 'Save';
  changestatus: any[] = [];
  status: any = [];
  title: string = 'Add Brand';
  hotkeySave: Hotkey | Hotkey[];
  formObj: any = {
    brandname: PrimengConstant.BRAND.ADDEDITFORM.BRAND_NAME,
    status: PrimengConstant.COMMON.STATUS,
  }
  currentDateStr: any;
  date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  constructor(private commonservice: CommonService, private utilservice: UtilsService,
    private messageService: MessagesService, private fb: FormBuilder,
    private localstorageservice: LocalStorageService, private brandservice: BrandService,
    private masterservice: MasterService, private _hotkeysService: HotkeysService,private dateFormatPipeFilter: DateformatPipe ) {
    this.currentDateStr= this.dateFormatPipeFilter.transform(new Date(), AppConstant.API_CONFIG.ANG_DATE.apiTSFormat);
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeySave = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.SAVE.KEY, (event: KeyboardEvent): boolean => {
      this.save(this.brandform.value)
      return false;
    }, [], shrtkeys.COMMON.SAVE.TXT));
    this.userdetails = localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.brandform = fb.group({
      'brandname': [null, Validators.compose([Validators.required,
      this.utilservice.NoWhitespaceValidator, Validators.minLength(2), Validators.maxLength(15)])],
      'status': ["Active"]
    })
    this.status = AppConstant.API_CONFIG.status;
    for (var i = 0; i < this.status.length; i++) {
      this.changestatus.push({
        label: this.status[i].stat, value: this.status[i].stat
      });
    }
  }
  ngOnInit() {
    this.msgs = [];
    this.buttonText = 'Save';
    this.title = 'Add Brand'
  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeySave);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.openedfromothers) {
      if (changes.openedfromothers.currentValue == true) {

      }
      console.log("openfrom changes: ", changes);
    }
    else {
      this.update();
    }
  }
  loadlist(ovrlay) {
    this.loadbrandlist.next(ovrlay)
  }
  update() {
    this.ClearForm();
    if (!_.isEmpty(this.branddtls)) {
      this.buttonText = 'Update';
      this.title = 'Edit Brand'
      this.brandform = new FormGroup({
        'brandname': new FormControl(this.branddtls.brandname, [Validators.required, this.utilservice.NoWhitespaceValidator]),
        'status': new FormControl(this.branddtls.status),
      })
    }
  }
  ClearForm() {
    this.buttonText = 'Save';
    this.title = 'Add Brand'
    this.brandform = new FormGroup({
      'brandname': new FormControl(null, [Validators.required, this.utilservice.NoWhitespaceValidator])
    });
    this.msgs = [];
  }
  save(data) {
    if (this.brandform.status == 'INVALID') {
      var errorMessage = this.masterservice.getFormErrorMessage(this.brandform, this.formObj);
      this.messageService.showMessage({ severity: 'error', summary: 'Error', detail: errorMessage });
      return false;
    }

    if (!_.isEmpty(this.branddtls)) {
      var formdata =
        {
          'brandid': this.branddtls.brandid,
          'brandname': data.brandname,
          'lastupdatedby': this.userdetails.tenantname,
          'lastupdateddt': this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
          'tenantid': this.userdetails.tenantid,
          'tenantname': this.userdetails.tenantname,
          'status': data.status,
        }
      this.brandservice.update(formdata).then(res => {
        if (res.status == true) {
          this.ClearForm();
          this.messageService.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
          this.loadlist(this.editovrlay);
        } else {
          this.messageService.showMessage({ severity: 'error', summary: 'Error', detail: res.message });
        }
      });
    }
    else {

      var saveformdata =
        {
          'brandname': data.brandname,
          'createdby': this.userdetails.tenantname,
          'createddt': this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
          'tenantid': this.userdetails.tenantid,
          'tenantname': this.userdetails.tenantname,
          'lastupdatedby': this.userdetails.tenantname,
          'lastupdateddt': this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
          // 'status': 'Active'
        }

      this.brandservice.create(saveformdata)
        .then(res => {
          if (res.status == true) {
            if(! this.openedfromothers)
            {
              this.messageService.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
            }
            this.loadlist(this.addovrlay);
            this.notifyNewEntry.next(res.data);
            this.ClearForm();
          } else {
            this.messageService.showMessage({ severity: 'error', summary: 'Error ', detail: res.message });
          }
        });
    }
  }
}
