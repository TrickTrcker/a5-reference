import { Component, OnInit, OnDestroy, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LocalStorageService } from '../../../../../shared/local-storage.service';
import { AppConstant } from '../../../../../../app/app.constant';
import { CategoryService } from '../../../services/category.service'
import { CategoryComponent } from '../../category.component';
import * as _ from 'lodash';
import { OverlayPanel, Message } from 'primeng/primeng';
import { MasterService } from '../../../../../services/master.service';
import { MessagesService } from '../../../../../shared/messages.service';
import { PrimengConstant } from '../../../../../../app/app.primeconfig';
import { UtilsService } from '../../../../../services/utils.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { DateformatPipe } from '../../../../../pipes/dateformat.pipe';
@Component({
  selector: 'app-addcategory',
  templateUrl: './addcategory.component.html',
  styleUrls: ['./addcategory.component.scss']
})
export class AddcategoryComponent implements OnInit, OnDestroy {
  @Input() editovrlay: any;
  @Input() addovrlay: any;
  @Input() catgdetails: any;
  @Output() loadcategorylist: EventEmitter<any> = new EventEmitter();
  @Output() notifyNewEntry: EventEmitter<any> = new EventEmitter();
  @Input() openedfromothers: boolean = false;  
  date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  categoryform: FormGroup;
  categoryname: FormControl;
  userdetails: any;
  validation = 'true';
  validationmsg = '';
  msgs: Message[] = [];
  buttonText = 'Save';
  changestatus: any[] = [];
  status: any = [];
  categoryName = AppConstant.API_CONFIG.MAXLENGTH.GST;
  private child: CategoryComponent;
  title: string = 'Add Category';
  hotkeySave: Hotkey | Hotkey[];
  constructor(private fb: FormBuilder, private utilservice: UtilsService,
    private messageService: MessagesService, public localstorageservice: LocalStorageService,
    private categoryservice: CategoryService, private masterservice: MasterService,
    private dateFormatPipeFilter: DateformatPipe,
    private _hotkeysService: HotkeysService, ) {
    this.userdetails = localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.categoryform = fb.group({
      'categoryname': [null, Validators.compose([Validators.required,
      this.utilservice.NoWhitespaceValidator, Validators.minLength(3), Validators.maxLength(15)])],
      'status': [null, Validators.required]
    });
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this.hotkeySave = this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.SAVE.KEY, (event: KeyboardEvent): boolean => {
      this.save(this.categoryform.value);
      return false;
    }, [], shrtkeys.COMMON.SAVE.TXT));
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
    this.title = 'Add Category'
    // this.CreateFormControls();
    // this.CreateForm();
  }
  ngOnChanges() {
    this.vieweditcategory();
  }
  ngOnDestroy() {
    this._hotkeysService.remove(this.hotkeySave);
  }
  loadlist(ovrlay) {
    this.loadcategorylist.next(ovrlay)
  }
  vieweditcategory() {
    this.ClearForm();
    if (!_.isEmpty(this.catgdetails)) {
      this.buttonText = 'Update';
      this.title = 'Edit Category'
      this.categoryform = new FormGroup({
        'categoryname': new FormControl(this.catgdetails.categoryname,
          [Validators.required, this.utilservice.NoWhitespaceValidator, Validators.minLength(3), Validators.maxLength(15)]),
        'status': new FormControl(this.catgdetails.status),
      })
    }
    else {
      this.ClearForm();
    }
  }
  ClearForm() {
    this.buttonText = 'Save';
    this.title = 'Add Category'
    this.categoryform = new FormGroup({
      'categoryname': new FormControl(null, Validators.compose([Validators.required,
      this.utilservice.NoWhitespaceValidator, Validators.minLength(3), Validators.maxLength(15)]))
    });
    this.msgs = [];
  }
  CreateFormControls() {
    this.categoryname = new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)]))
  }
  CreateForm() {
    this.categoryform = new FormGroup({
      categoryname: this.categoryname
    });
  }

  formObj: any = {
    categoryname: PrimengConstant.CATEGORY.ADDEDITFORM.CATEGORY_NAME,
    status: PrimengConstant.COMMON.STATUS
  }
  save(data) {

    if (this.categoryform.status == 'INVALID') {
      var errorMessage = this.masterservice.getFormErrorMessage(this.categoryform, this.formObj);
      this.messageService.showMessage({ severity: 'error', summary: 'Error', detail: errorMessage });
      return false;
    }

    if (typeof this.catgdetails.categoryid == 'number') {
      var formdata =
        {
          'categoryid': this.catgdetails.categoryid,
          'categoryname': data.categoryname,
          'lastupdatedby': this.userdetails.tenantname,
          'lastupdateddt': this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
          'tenantid': this.userdetails.tenantid,
          'tenantname': this.userdetails.tenantname,
          'status': data.status
        }
      this.categoryservice.update(formdata)
        .then(res => {
          if (res.status == true) {
            this.ClearForm();
            this.messageService.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
            this.loadlist(this.editovrlay);
          } else {
            this.messageService.showMessage({ severity: 'error', summary: 'Error ', detail: res.message });
          }
        });
    }
    else {
      var saveformdata =
        {
          'categoryname': data.categoryname,
          'createdby': this.userdetails.tenantname,
          'createddt': this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
          'lastupdatedby': this.userdetails.tenantname,
          'lastupdateddt': this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat),
          'tenantid': this.userdetails.tenantid,
          'tenantname': this.userdetails.tenantname
        }

      this.categoryservice.create(saveformdata)
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
