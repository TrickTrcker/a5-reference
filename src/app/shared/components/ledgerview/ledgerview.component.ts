import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../../services/reports/reports.service';
import { LocalStorageService } from '../../../shared/local-storage.service';
import { FeaturesService } from '../../../services/features.service';
import { AppConstant } from '../../../app.constant';
import { Message } from 'primeng/primeng';
import { MessagesService } from '../../../shared/messages.service';
import { DateformatPipe } from '../../../pipes/dateformat.pipe';
import * as moment from 'moment';
import * as _ from "lodash";

@Component({
  selector: 'app-ledgerview',
  templateUrl: './ledgerview.component.html',
  styleUrls: ['./ledgerview.component.scss']
})
export class LedgerviewComponent implements OnInit {
  @Input()
  externaltxnid: any;
  @Input()
  externalfeature: any;
  subcription: any;
  txnid: any;
  userstoragedata: any;
  finyear: any;
  ledgerdata: any;
  dataFormat: any;
  currency_Symbol: string;
  ledgerheader: any = {
    feature: "",
    featureno: "",
    featuredate: "",
    companyname : ""
  };
  crtotal = 0.00;
  drtotal = 0.00;


  ledger_feature: string = "";
  public date_dformat = AppConstant.API_CONFIG.DATE.displayFormat;
  constructor(private route: ActivatedRoute, private router: Router, private localstorageservice: LocalStorageService,
    private dateFormatPipeFilter: DateformatPipe, private messageService: MessagesService, private featureservice: FeaturesService, ) {
    this.userstoragedata = this.localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.localstorageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
    this.dataFormat = AppConstant.API_CONFIG.DATE.displayFormat;
    this.currency_Symbol = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!_.isEmpty(params)) {
        this.txnid = params.txnid;
        console.log("url params", params);
        // this.loadledgerlist(this.txnid);
      }
    });
    if (this.externalfeature != null && this.externaltxnid != null) {
      var reqdata = {
        tenantid: this.userstoragedata.tenantid,
        txnid: this.externaltxnid,
        feature: this.externalfeature
      };
      this.loadledgerlist(reqdata);
    }
  }
  loadledgerlist(reqdata) {

    this.featureservice.getledgerList(reqdata).then((res) => {
      console.log("ledger list: " + res);
      if (res.status) {
        this.ledgerdata = _.filter(res.data, (d) => {
          return (+d.cramount > 0 || +d.dramount > 0);
        });
        if (! _.isEmpty(this.ledgerdata)) {
          
          this.ledgerheader.feature = this.ledgerdata[0].feature;
          this.ledgerheader.featureno = this.ledgerdata[0].txnrefno;
          this.ledgerheader.featuredate = this.ledgerdata[0].ledgerdate;
          if(this.ledgerdata[0].companyname != null && this.ledgerdata[0].companyname !="" )
          {
            this.ledgerheader.companyname = this.ledgerdata[0].companyname
          }

          _.forEach(this.ledgerdata, (d) => {
            if (parseFloat(d.cramount) != NaN) {
              this.crtotal = this.crtotal + parseFloat(d.cramount);
            }
            if (parseFloat(d.dramount) != NaN) {
              this.drtotal = this.drtotal + parseFloat(d.dramount);
            }
          });

        }
      }
    });

  }
}
