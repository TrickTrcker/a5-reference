import { Component, OnInit, Output, EventEmitter, Input, ViewChild, OnChanges } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { MessagesService } from '../../../../shared/messages.service';
import { LocalStorageService } from '../../../../shared/local-storage.service';
import { AppConstant } from '../../../../app.constant';
import { DateformatPipe } from '../../../../pipes/dateformat.pipe';
import { UtilsService } from '../../../../services/utils.service'
import { PrimengConstant } from '../../../../app.primeconfig';
@Component({
  selector: 'app-addsequencesettings',
  templateUrl: './addsequencesettings.component.html',
  styleUrls: ['./addsequencesettings.component.scss']
})
export class AddsequencesettingsComponent implements OnInit, OnChanges {
  @Input() editovrlay: any;
  @Input() seqdtls: any;
  @Output() loadbrandlist: EventEmitter<any> = new EventEmitter();
  public currseqno: any;
  public seqsetting: any;
  private userdetails: any;
  public max5 = "5";
  public max1 = "1";
  public olddata: any;
  private date_apiformat = AppConstant.API_CONFIG.ANG_DATE.apiFormat;
  public disable: boolean = false;
  constructor(private CommonService: CommonService,
    private MessagesService: MessagesService,
    private LocalStorageService: LocalStorageService,
    private DateformatPipe: DateformatPipe,
    private UtilsService: UtilsService) {
    console.log("Edit data", this.seqdtls);
    this.userdetails = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
  }

  ngOnInit() {
    this.seqsetting = this.seqdtls;
    console.log("", this.seqsetting)
    this.olddata = this.seqdtls.currseqno

  }
  ngOnChanges() {
    this.seqsetting = this.seqdtls;
  }
  ClearForm() {
    this.seqsetting.reset();
  }
  callparent() {
    this.loadbrandlist.next();
  }
  update() {
    var crdata = this.DateformatPipe.transform(new Date(), this.date_apiformat);
    this.seqsetting.lastupdatedby = this.userdetails.loginname;
    this.seqsetting.lastupdateddt = crdata
    var updatedata = this.seqsetting;

    if (updatedata.currseqno >= this.olddata) {
      this.CommonService.updateSequenceSettings(updatedata).then((res) => {
        if (res.status) {
          this.callparent();
          this.MessagesService.showMessage({ severity: 'success', summary: 'Success', detail: res.message })
        }
      })
    } else {
      this.MessagesService.showMessage({ severity: 'error', summary: 'Error', detail:PrimengConstant.SEQ_ERROR });

    }

  }
  numberOnly(event: any) {
    this.UtilsService.allowNumberOnly(event);
  }
  seqdisable(seqsetting) {
    if (seqsetting.autogenyn == 'N') {
      this.disable = false;
    }
    else
      this.disable = true;
  }
}
