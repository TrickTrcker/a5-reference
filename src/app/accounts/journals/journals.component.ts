import { Component, OnInit, SimpleChanges, EventEmitter, Input, Output } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { MenuItem } from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { JournalsService } from '../service/journals.service';
import { MasterService } from '../../services/master.service';
import { FeaturesService } from '../../services/features.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import * as moment from 'moment';
import { Message } from 'primeng/primeng';
import * as _ from "lodash";
import { AppConstant } from '../../app.constant';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { MessagesService } from '../../shared/messages.service';
import { DateformatPipe } from '../../pipes/dateformat.pipe';
import { PrimengConstant } from '../../app.primeconfig';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { CommonService } from '../../pages/settings/services/common.service';


@Component({
  selector: 'app-journals',
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.scss']
})
export class JournalsComponent implements OnInit {
  tempselectedproductPrp: { selectedproduct: any; ridx: any; productTable: any; };
  @Input() ledgerdtls: any;
  @Output() loadledgerlist: EventEmitter<any> = new EventEmitter();
  @Input() openedfromothers: boolean = false;

  journalno: any;
  autogenyn = 'Y';
  public amtlength = AppConstant.API_CONFIG.AMOUNTFORMAT.MAXLENGTH;
  private date_apiTSformat = AppConstant.API_CONFIG.ANG_DATE.apiTSFormat;
  journalForm: FormGroup;
  ctotal: any;
  dtotal: any;
  display: boolean = false;
  ledgerdisplay: boolean = false;
  ledgerlist: any[] = [];
  ledgerdetails: any = {};
  // ledgerdtls: any = {};
  // ledgerdtls: any[];
  allledger: any[];
  ctotaldiff: any;
  dtotaldiff: any;
  tenantInfo: any;
  selectedledgerdetails: any;
  finyear: any;
  treestructuredBooks: any;
  journalfeat: SelectItem[] = [];
  menuItems: MenuItem[];
  newMenuItems: MenuItem[];
  updateMenuItems: MenuItem[];
  journalSequenceObj: any;
  journalDetails: any = {};
  apiDateFormat: string;
  apiDateFormatAng: string;
  isNewEntry: boolean = true;
  updateJournalDetails: any;
  existingJournalDetails: any;
  paramDetails: any;
  msgs: Message[] = [];
  currency_Symbol: string;
  controls: AbstractControl;
  formObj = {} as any;
  addledgerdisplay: boolean = false;
  selectedFormGroup: any;
  pro: FormGroup;

  constructor(private fb: FormBuilder,
    private journalService: JournalsService,
    private masterService: MasterService,
    private featuresService: FeaturesService,
    private localStorageServcie: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessagesService,
    private dateFormatPipeFilter: DateformatPipe,
    private _hotkeysService: HotkeysService,
    private sequenceService: CommonService) {
    const shrtkeys = PrimengConstant.SHORTCUTKEYS;
    this._hotkeysService.add(new Hotkey(shrtkeys.COMMON.SAVE.KEY, (event: KeyboardEvent): boolean => {
      this.generateJournal('create');
      return false;
    }, [], shrtkeys.COMMON.SAVE.TXT));

    this.formObj = {
      journaldt: {
        required: "Please select date",
      },
      type: {
        required: "Please select journal type"
      }
    }

    this.tenantInfo = localStorageServcie.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = localStorageServcie.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.apiDateFormat = AppConstant.API_CONFIG.DATE.apiFormat;
    this.apiDateFormatAng = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
    this.getSequence();
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        let journalId: string;
        let journalNo: string;
        try {
          if (params) {
            // Prepare For Edit
            journalId = params.get("journalid")
            journalNo = params.get("journalno")
            if (journalId && journalNo) {
              this.paramDetails = { journalId: journalId, journalNo: journalNo };
              this.isNewEntry = false;
            }
          }

        } catch (error) {
          console.log(error)
        }
        // Below Function Calls are common for both add & edit
        this.initMenuItems();
        let codeMaster = this.getAllCodeMasterFeatures();
        let ledgerNames = this.getAllLedgerNames();

        if (this.isNewEntry) {
          // Add New Journal Entry
          this.createNewForm();

        }
        else {
          // Initialize Update Obj
          // {  delete:[],update:[],insert:[]  }
          this.updateJournalDetails = {
            delete: [],
            update: [],
            insert: []
          };


          let queryParams: any = {};
          queryParams.journalid = journalId;
          queryParams.tenantid = this.tenantInfo.tenantid;
          queryParams.finyear = this.finyear.finyear;
          queryParams.txnrefno = journalNo;

          this.createJournalHeaderForm();
          Promise.all([codeMaster, ledgerNames]).then(() => {
            this.switchToEditMode(queryParams);
          })


        }
      });


  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("cheatsheet changes: ", changes);
    if (changes.openedfromothers) {
      if (changes.openedfromothers.currentValue == true) {

      }
      console.log("openfrom changes: ", changes);
    }
    setTimeout(() => {
      this.ledgerdetails()
    }, 1000);
  }
  clearform() {
    this.pro.reset();
  }

  initMenuItems() {
    this.newMenuItems = [
      // label: 'Save',
      // items: [
      // {
      //   label: 'Save ',icon: 'fa-check', command: (event) => {
      //     this.generateJournal('view');
      //   }
      // },
      {
        label: 'Save & Add New', icon: 'fa-plus', command: (event) => {
          this.generateJournal('create');
        }
      },
      {
        label: 'Save & View', icon: 'fa-eye', command: (event) => {
          this.generateJournal('view');
        }
      },
      // {
      //   label: 'Save & print', icon: 'fa-print', command: (event) => {
      //   }
      // },
      {
        label: 'Cancel', icon: 'fa-close', command: (event) => {
          this.router.navigate(['/accounts/journals/list']);
        }
      }
      // ]
      // }]
    ];
    this.updateMenuItems = [
      // label: 'Update',
      // items: [
      {
        label: 'Update & Add New', icon: 'fa-plus', command: (event) => {
          this.updateJournal('create');
        }
      },
      {
        label: 'Update & View', icon: 'fa-eye', command: (event) => {
          this.updateJournal('view');
        }
      },
      {
        label: 'Cancel', icon: 'fa-close', command: (event) => {
          this.router.navigate(['/accounts/journals/list']);
        }
      }
    ]
    // }];
    if (this.isNewEntry === true)
      this.menuItems = this.newMenuItems;
    else
      this.menuItems = this.updateMenuItems;

  }
  getAllCodeMasterFeatures() {
    let params: any = {};
    //params.tenantid = this.tenantInfo.tenantid;
    params.type = "JOURNAL";

    let allCodeMasters = this.featuresService.getcodemasterList(params);
    allCodeMasters.then(res => {
      if (res.status) {
        this.journalfeat = this.masterService.formatDataforDropdown("name", res.data, "Select Type");
        var generaltype = _.find(this.journalfeat, (data) => {
          if (data.value != undefined) {
            return (data.value.name == 'General');
          }
        });
        if (!_.isEmpty(generaltype)) {
          this.journalForm.controls.type.setValue(generaltype.value);
        }
      }
    });
    return allCodeMasters;
  };
  getAllLedgerNames() {
    let params: any = {};
    params.tenantid = this.tenantInfo.tenantid;
    params.finyear = this.finyear.finyear;
    params.status = "Active";
    params.contact = "Y";
    var reqdata = {
      "tenantid": [0, this.tenantInfo.tenantid],
      isJV: "Y"
    };
    let allLedgerNames = this.journalService.getAllLedgerNames(reqdata);
    allLedgerNames.then(res => {
      if (res.status) {
        this.treestructuredBooks = this.masterService.formatDataforDropdown("subaccheadname", res.data);
      }
    });
    return allLedgerNames;
  }

  switchToEditMode(queryParams) {
    this.journalService.getJournalDetails(queryParams.journalid)
      .then(response => {
        if (response) {
          this.existingJournalDetails = response.data[0];
          this.assignToEditFormObj(this.existingJournalDetails);
        }
      }, error => {
        console.log(error);
      })
  }
  getJournalArray(): FormArray {
    return this.journalForm.get('journalsArray') as FormArray;
  }
  assignToEditFormObj(formData: any) {

    let journalType: any = _.find(this.journalfeat, { value: { name: formData.type } });

    let editJournalObj: any = {};
    editJournalObj.type = journalType.value;
    editJournalObj.journaldt = moment(formData.journaldt, "YYYY-MM-DD'T'HH:mm:ss.SSS'Z'").toDate();
    editJournalObj.journalno = formData.journalno;
    editJournalObj.remarks = formData.remarks;
    editJournalObj.reference = formData.attchment
    editJournalObj.journalsArray = this.fb.array([]);
    this.journalForm = this.fb.group(editJournalObj);

    let journalsArray = this.getJournalArray();

    _.forEach(formData.ledgers, (journalEntry: any, index) => {

      let journal: any = journalEntry;
      let selectedAccountType: any = _.find(this.treestructuredBooks, { value: { subaccheadname: journalEntry.accheadname } });

      if (journalEntry.crdr = "D")
        journal.debit = journalEntry.dramount;
      else
        journal.credit = 0;

      if (journalEntry.crdr = "C")
        journal.credit = journalEntry.cramount;
      else
        journal.debit = 0;

      // below two formgroup is used to control update values   
      journal.newEntry = false;
      journal.FGIndex = index;

      // remove keys
      _.omit(journal, ['dramount', 'cramount']);
      journal.account = selectedAccountType.value;
      journalsArray.push(this.fb.group(journal));
    });
    this.calcCrDrBalancing();
  }


  onSelectByTo($event, index, selectedFormGroup) {

    /**
     * 1. Get FormGroup Details from FormArray based on index
     * 2. Get the dropdown byTo value
     * 3. If value is null then disable accounts and remaining formcontrols
     * 4. If value is not null then enable accounts 
     */
    // let journalsArray= this.journalForm.get('journalsArray') as FormArray;

    // let selectedFormGroup:any = journalsArray.controls[index] as FormGroup;
    let value = selectedFormGroup.controls.byTo.value;
    if (value != null) {
      // enable
      selectedFormGroup.controls.account.enable();
      this.calcCrDrBalancing();
    }
    else {
      // disable 
      for (let controls in selectedFormGroup.controls) {
        if (controls != "byTo") {
          selectedFormGroup.controls[controls].reset();
          selectedFormGroup.controls[controls].disable();
        }
      }
      this.calcCrDrBalancing();
    }
  }

  onSelectAccountTypes(event, index, selectedFormGroup) {

    let journal = this.getJournalArray();
    let currentFG = journal.controls[index] as FormGroup;
    let currentAccountValue: string = currentFG.controls["account"].value;
    let isAlreadyExists: boolean = journal.controls.some((control: FormGroup, ind) => {
      if (index == ind)
        return false;
      else {
        if (control.controls['account'].value == currentAccountValue) {
          return true
        }
        return false;
      }
    });
    if (isAlreadyExists) {
      this.messageService.showMessage({ severity: 'error', summary: 'Error ', detail: PrimengConstant.JOURNALS.ALREADYEXIST });
      currentFG.controls["account"].reset();
      return false;
    }
    selectedFormGroup.controls.credit.setValue(0);
    selectedFormGroup.controls.debit.setValue(0);
    selectedFormGroup.controls.credit.enable();
    selectedFormGroup.controls.debit.enable();
    this.calcCrDrBalancing();
  }

  onResetAmountType(event, selectedFormGroup, resetType) {
    if (selectedFormGroup.controls[resetType].value) {
      selectedFormGroup.controls[resetType].setValue(0);
    }
    this.calcCrDrBalancing();
  }

  calcCrDrBalancing() {
    let journal: any = this.journalForm.get('journalsArray');
    let ctotal = 0;
    let dtotal = 0;
    journal.controls.forEach((first) => {
      var value = parseFloat(first.controls.credit.value);
      if (value) {
        ctotal = ctotal + parseFloat(first.controls.credit.value);
      }

      value = parseFloat(first.controls.debit.value);
      if (value) {
        dtotal = dtotal + parseFloat(first.controls.debit.value);
      }

    }
    );

    this.ctotal = 0;
    this.dtotal = 0;
    this.ctotaldiff = 0;
    this.dtotaldiff = 0;
    if (ctotal) {
      this.ctotal = ctotal;
    }

    if (dtotal) {
      this.dtotal = dtotal;
    }

    this.ctotaldiff = this.ctotal - this.dtotal;
    this.dtotaldiff = this.dtotal - this.ctotal;
  }
  buttonupdateorcreate() {
    var createmode = true;
    if (this.existingJournalDetails != undefined) {
      if (this.existingJournalDetails.journalid != undefined) {
        createmode = false;
      }
    }
    else {
      createmode = true;
    }
    if (createmode) {
      this.generateJournal('create');
    }
    else {
      this.updateJournal('view');
    }
  }
  generateJournal(action) {
    if (this.journalForm.status == "INVALID") {
      var errorMessage = this.masterService.getFormErrorMessage(this.journalForm, this.formObj);
      this.msgs = [];
      this.messageService.showMessage({ severity: 'error', summary: 'Error', detail: errorMessage });
      return false;
    }
    let validateStatus = this.validateJournalDetails();
    if (validateStatus) {
      this.prepareJournalHeaderDetails();
      this.prepareJournalDetails();
      this.appendStaticData();
      let journalObj: any = {};
      journalObj.header = this.journalDetails;
      journalObj.journaldetails = this.journalDetails.journaldetails;
      journalObj.ledgers = this.journalDetails.journaldetails;
      delete this.journalDetails.journaldetails;
      // if(this.journalDetails)       
      // {
      //   return false;
      // }

      console.log("from data", JSON.stringify(journalObj));
      this.journalService.saveJournal(journalObj)
        .then(res => {
          if (res.status == true) {
            if(! this.openedfromothers)
            {
              this.messageService.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
            }
            if (action == 'view') {
              let data = res.data;
              let journalId = data.header.journalid;
              let journalNo = data.header.journalno;
              this.router.navigate(['accounts/viewjournal/journal/', journalId, journalNo]);
            }
            else if (action == 'create') {
              this.createNewForm();
            }
          } else if (res.status == false) {
            this.messageService.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
          }
        }, error => {
          console.log("Error Happend");

        })

    }
  }

  updateJournal(action) {
    let validateStatus = this.validateJournalDetails();
    if (validateStatus) {
      this.prepareJournalHeaderDetails();
      this.prepareJournalDetails();
      this.appendStaticData();


      let updateDetails: any = {};
      updateDetails.header = this.journalDetails;
      updateDetails.detailsForUpdate = this.prepareUpdateJournalArray();
      delete this.journalDetails.journaldetails;

      this.journalService.updateJournal(updateDetails)
        .then(res => {
          if (res.status) {
            console.log("res.data", res.data)
            this.messageService.showMessage({ severity: 'success', summary: 'Success', detail: res.message });
            if (action == 'view') {
              this.router.navigate(['accounts/viewjournal/journal/', this.paramDetails.journalId, this.paramDetails.journalNo]);
            }
            else if (action == 'create') {
              this.router.navigate(['/accounts/journals']);
            }

          }
        }, error => {
          console.log("Error Happend");

        })

    }
  }


  validateJournalDetails() {

    let journalsEntry = this.getJournalArray();
    //  let isAccountExists = _.some(journalsEntry.controls,(control:FormGroup)=>{
    //                             return !_.has(control.controls["account"].value,'value');                  
    //                       });
    let isAccountExists = false;
    let isAmountEntered = false;
    _.forEach(journalsEntry.controls, (control: FormGroup) => {

      if (isAccountExists && isAmountEntered)
        return;

      if (!isAccountExists && !_.has(control.controls["account"].value, 'value')) {
        isAccountExists = true;
      }

      let creditAmount: any = control.controls["credit"].value;
      let debitAmount: any = control.controls["debit"].value;
      if (!isAmountEntered && (creditAmount && creditAmount > 0) || (debitAmount && debitAmount > 0)) {
        isAmountEntered = true;
      }

    });

    if (!isAccountExists) {
      this.messageService.showMessage({ severity: 'error', summary: 'Error ', detail: PrimengConstant.JOURNALS.CHOOSEACC });
      return false;
    }

    if (!isAmountEntered) {
      this.messageService.showMessage({ severity: 'error', summary: 'Error ', detail: PrimengConstant.JOURNALS.ENTER_AMT });
      return false;
    }

    this.calcCrDrBalancing();

    if (this.ctotal == 0 || this.dtotal == 0) {
      this.messageService.showMessage({ severity: 'error', summary: 'Error ', detail: PrimengConstant.JOURNALS.SAMETOTAL });
      return false;
    }

    if (this.ctotal != this.dtotal) {
      this.messageService.showMessage({ severity: 'error', summary: 'Error ', detail: PrimengConstant.JOURNALS.TALLYAMOUNT });
      console.error("Please tally credit and debit amount");
      return false;
    }
    return true;
  }

  prepareJournalHeaderDetails() {

    let currentDateStr: string = this.dateFormatPipeFilter.transform(new Date(), this.date_apiTSformat);;
    let journalDateObj: moment.Moment = moment(this.journalForm.controls["journaldt"].value, "YYYY-MM-DD'T'HH:mm:ss.SSS'Z'");

    this.journalDetails.refkey = "JRV";

    this.journalDetails.type = this.journalForm.controls["type"].value.name;
    this.journalDetails.journaldt = journalDateObj.format(this.apiDateFormat);

    this.journalDetails.remarks = this.journalForm.controls["remarks"].value;
    this.journalDetails.attchment = this.journalForm.controls["reference"].value
    this.journalDetails.finyear = this.finyear.finyear;
    this.journalDetails.tenantid = this.tenantInfo.tenantid;
    this.journalDetails.tenantname = this.tenantInfo.tenantname;
    this.journalDetails.feature = "Journal";

    // dtotal and ctotal must be tally. 
    // So we use either dtotal or ctotal for below total related fields
    this.journalDetails.subtotal = this.dtotal;
    this.journalDetails.journaltotal = this.dtotal;
    this.journalDetails.balamount = this.dtotal;
    if (!_.isEmpty(this.journalForm.controls["journalno"])) {
      this.journalDetails.journalno = this.journalForm.controls["journalno"].value
    }
    // Capture only for new entry
    if (this.isNewEntry) {
      // this.journalDetails.seqid = this.journalSequenceObj.seqid;         
      this.journalDetails.createdby = this.tenantInfo.loginname;
      this.journalDetails.createddt = currentDateStr;
    }
    else {
      this.journalDetails.journalid = this.existingJournalDetails.journalid;
    }

    this.journalDetails.lastupdatedby = this.tenantInfo.loginname;
    this.journalDetails.lastupdateddt = currentDateStr;

    // appendstatic data
    this.appendStaticData();
  }
  prepareJournalDetails() {
    this.journalDetails.journaldetails = [];

    let journalsEntry = this.getJournalArray();
    _.forEach(journalsEntry.controls, (control: FormGroup) => {
      if (!_.has(control.controls["account"].value, "value")) {
        let accountdetails: any = control.controls["account"].value;
        let creditAmount: any = control.controls["credit"].value
        let debitAmount: any = control.controls["debit"].value

        if (!creditAmount && !debitAmount)
          return;

        let journaldetails: any = {};
        _.extend(journaldetails, control.getRawValue());

        journaldetails.accheadid = accountdetails.subaccheadid;
        journaldetails.accheadname = accountdetails.subaccheadname;
        journaldetails.parentaccheadid = accountdetails.accheadid;
        journaldetails.parentaccheadname = accountdetails.accheadname;
        journaldetails.leadaccheadid = accountdetails.accheadid;
        journaldetails.leadaccheadname = accountdetails.accheadname;
        journaldetails.dramount = 0;
        journaldetails.cramount = 0;
        if (debitAmount) {
          journaldetails.crdr = "D";
          journaldetails.dramount = debitAmount;
        }

        if (creditAmount) {
          journaldetails.crdr = "C";
          journaldetails.cramount = creditAmount;
        }
        journaldetails.feature = "Journal";

        // append only for edit obj
        if (!this.isNewEntry) {

          this.removeKey(journaldetails, ['account', 'credit', 'debit', 'journaldetails']);

          journaldetails.FGIndex = control.controls["FGIndex"].value;
        }


        this.journalDetails.journaldetails.push(journaldetails);
      }
    })
  }

  prepareUpdateJournalArray() {
    // Exclude insert ( this.updateJournalDetails.insert) array details from journaldetails array to get update array object
    // this.updateJournalDetails.update

    let updateDetails = {
      update: [],
      insert: [],
      delete: []
    };
    _.forEach(this.journalDetails.journaldetails, (mergedJournal: any) => {
      // mergedJournal is raw object = insert object + update object
      // this.updateJournalDetails.insert = This is an array of formGroup object

      let isNewJournalDetails = _.some(this.updateJournalDetails.insert, (value: any) => {
        return mergedJournal.FGIndex == value.getRawValue().FGIndex;
      });

      // Remove Unwanted keys
      delete mergedJournal.FGIndex;
      delete mergedJournal.newEntry;

      if (isNewJournalDetails) {
        updateDetails.insert.push(mergedJournal);
      }
      else {
        updateDetails.update.push(mergedJournal);
      }
    });

    updateDetails.delete = this.updateJournalDetails.delete;
    return updateDetails;
  };
  appendStaticData() {
    let staticDetails = {
      "ccyid": "1",
      "ccyname": "INR",
      "duedate": this.dateFormatPipeFilter.transform(new Date(), this.apiDateFormatAng),
      "emailyn": "Y",
      "pymntamount": "0",
      "pymtlink": "http://link.in",
      "roundoff": "0",
      "status": "Active",
      "taxtotal": "0",
      "templtid": "1",
      "templtname": "HTL",
    }
    _.extend(this.journalDetails, staticDetails);
  }
  removeKey(source, keys: string[]) {
    keys.forEach(function (key) {
      delete (source[key]);
    });
  }
  createNewForm() {
    var currentDate = new Date();
    let formControlObj = {} as any;
    formControlObj = {
      // journalno: [null, Validators.required],
      journaldt: [new Date(), Validators.required],
      type: [null, Validators.required],
      remarks: [null],
      reference: [null],
      journalsArray: this.fb.array([
        this.fb.group({ account: [{ value: '' }], credit: [{ value: null, disabled: true }], debit: [{ value: null, disabled: true }] }),
        this.fb.group({ account: [{ value: '' }], credit: [{ value: null, disabled: true }], debit: [{ value: null, disabled: true }] })
      ]),
    };
    if (this.autogenyn == 'N') {
      formControlObj.journalno = [null, Validators.required]
    }
    this.journalForm = this.fb.group(formControlObj);
    this.ctotal = 0, this.dtotal = 0, this.ctotaldiff = 0, this.dtotaldiff = 0;
    // var ddd:any = this.journalForm.controls["journalsArray"];
    // ddd.controls[0].controls.credit.valueChanges.forEach(
    // (value: string) => {this.calcCrDrBalancing(); console.log(value)});
  }

  createJournalHeaderForm() {
    var currentDate = new Date();
    this.journalForm = this.fb.group({
      // journalno: [null],
      journaldt: [new Date(), Validators.required],
      type: [null, Validators.required],
      remarks: [null],
      reference: [null],
      journalsArray: this.fb.array([])
    });
    // var ddd:any = this.journalForm.controls["journalsArray"];
    // ddd.controls[0].controls.credit.valueChanges.forEach(
    // (value: string) => {this.calcCrDrBalancing(); console.log(value)});
  }


  get journalsArray(): FormArray {
    return this.getJournalArray();
  };

  addJournalEntry() {
    let journalsArray = this.getJournalArray();
    let formGroupObj: any = { account: [{ value: '' }], credit: [{ value: null, disabled: true }], debit: [{ value: null, disabled: true }] };

    if (!this.isNewEntry) {
      formGroupObj.newEntry = true;
      // Keep formgroup index
      formGroupObj.FGIndex = journalsArray.length;
      formGroupObj.txnid = this.existingJournalDetails.journalid;
      formGroupObj.txnrefno = this.existingJournalDetails.journalno;
    }
    journalsArray.push(this.fb.group(formGroupObj));

    if (!this.isNewEntry) {
      let newFormObj: any = journalsArray.at(journalsArray.length - 1);
      this.updateJournalDetails.insert.push(newFormObj);
    }

  }
  removeJournalEntry(index) {
    let journalsArray = this.getJournalArray();
    let FormObj: any = journalsArray.at(index);
    let rawValue = FormObj.getRawValue();

    if (rawValue && _.has(rawValue, "newEntry")) {
      if (rawValue.newEntry === false) {
        let existingObj = this.existingJournalDetails.ledgers[index];
        this.updateJournalDetails.delete.push(existingObj);
      }
      else if (rawValue.newEntry === true) {
        _.remove(this.updateJournalDetails.insert, (v: any) => { return index == v.getRawValue().FGIndex; });

      }
    }
    journalsArray.removeAt(index);
    this.calcCrDrBalancing();
  }
  splitbtn_save(event) {
    if (event.target.className.indexOf("fa-caret-down") < 0) {
      if (this.paramDetails) {
        this.updateJournal('view');
      } else {
        this.generateJournal('view');
      }

    }
  };

  getSequence() {
    const data = {
      refkey: 'JRV',
      status: 'Active',
      autogenyn: 'Y'
    }
    this.sequenceService.getSequenceSettings(data).then(res => {
      if (res.status) {
        this.autogenyn = 'Y';
      } else {
        this.autogenyn = 'N';
        this.formObj.journalno = { required: "Please enter journal number" };
        this.createNewForm();
      }
    });
  }
  displayaddLedger(selectedproduct, ridx, productTable) {
    this.addledgerdisplay = true;
    this.tempselectedproductPrp = {
      selectedproduct: selectedproduct,
      ridx: ridx,
      productTable: productTable
    }
  }
  // addLedgerDetection(data) {
  //   console.log(data);
  //   this.tempselectedproductPrp.selectedproduct = data;
  //   var pro = {
  //     value: data
  //   }
  //   this.onProductSelect(pro, this.tempselectedproductPrp.selectedproduct, this.tempselectedproductPrp.ridx, this.tempselectedproductPrp.productTable);
  //   this.addledgerdisplay = false;
  // }
  onhideLedgerpopup(data) {
    this.addledgerdisplay = false;
    this.tempselectedproductPrp = null;
  }
  addLedgerDetection(data) {
    //   console.log("newly add ledger",data);
    //   // this.tempselectedproductPrp.selectedproduct = data;
    //   var pro = {
    //     label : data.ledgername,
    //     value : data
    //   };
    //   this.allledger.push(pro);
    //   this.ledgerdetails = pro;
    //   console.log(this.tempselectedproductPrp);
    //   console.log(this.tempselectedproductPrp.ridx)
    // // onSelectAccountTypes(event, index, selectedFormGroup) {
    //   this.onSelectAccountTypes('', this.tempselectedproductPrp.ridx, this.selectedFormGroup);
    // this.pro.controls.ledgername = new FormControl(this.selectedledgerdetails.value,Validators.required);
    this.getAllLedgerNames();
    this.addledgerdisplay = false;
  }
}
